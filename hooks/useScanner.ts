import { BEACON_CONFIG } from '@/constants/Config';
import * as Device from 'expo-device';
import { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { useFusionDistance } from './useFusionDistance';

export type BluetoothState = 'Unknown' | 'PoweredOn' | 'PoweredOff' | 'Unauthorized' | 'Unsupported' | 'MockMode';

// THE FIX: Global Singleton for BLE Manager prevents hardware race condition crashes
let globalBleManager: any = null;
const isRealDevice = Platform.OS !== 'web' && Device.isDevice;

if (isRealDevice) {
  try {
    const { BleManager } = require('react-native-ble-plx');
    globalBleManager = new BleManager();
  } catch (e) {
    console.warn("BLE Manager could not be initialized globally.", e);
  }
}

export const useScanner = () => {
  const [rawRssi, setRawRssi] = useState<number | null>(null);
  const [scannedDevice, setScannedDevice] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [bluetoothState, setBluetoothState] = useState<BluetoothState>('Unknown');
  
  const managerRef = useRef<any>(globalBleManager);
  const mockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { distance, metrics, resetFusion } = useFusionDistance(rawRssi);

  useEffect(() => {
    if (isRealDevice && managerRef.current) {
      console.log("[Hardware Layer] Hooking into global BLE Subsystem...");
      
      const subscription = managerRef.current.onStateChange((state: string) => {
        console.log(`[Hardware Layer] Antenna state: ${state}`);
        if (state === 'PoweredOn') setBluetoothState('PoweredOn');
        else if (state === 'PoweredOff') setBluetoothState('PoweredOff');
        else if (state === 'Unauthorized') setBluetoothState('Unauthorized');
        else setBluetoothState('Unknown');
      }, true);

      return () => {
        subscription.remove();
      };
    } else if (!isRealDevice) {
      setBluetoothState('MockMode');
    } else {
      setBluetoothState('Unsupported');
    }
  }, []);

  const requestBluetoothPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
               granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
               granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  };

  const startScanning = async () => {
    if (isScanning) return;

    if (isRealDevice && managerRef.current) {
      try {
        const hasPermission = await requestBluetoothPermissions();
        if (!hasPermission) return;

        const currentState = await managerRef.current.state();
        if (currentState !== 'PoweredOn') return;

        await managerRef.current.stopDeviceScan();

        setIsScanning(true);
        const targetUUID = BEACON_CONFIG.UUID.toLowerCase();

        managerRef.current.startDeviceScan(
          [targetUUID],
          { allowDuplicates: true },
          (error: any, device: any) => {
            if (error) {
              if (error.errorCode !== 2) {
                console.error("[Scanner] Native tracking failure:", error.message);
              }
              setIsScanning(false);
              return;
            }
            if (device && device.rssi) {
              setRawRssi(device.rssi);
              setScannedDevice(device);
            }
          }
        );
      } catch (err: any) {
        console.error("[Scanner] Initialization fault:", err.message);
        setIsScanning(false);
      }
    } 
    else {
      setIsScanning(true);
      let currentRssi = -85;
      mockIntervalRef.current = setInterval(() => {
        if (currentRssi < -50) currentRssi += 3;
        setRawRssi(currentRssi);
        setScannedDevice({
          id: 'MOCK_MAC_ADDRESS_01',
          name: BEACON_CONFIG.DEVICE_NAME,
          uuid: BEACON_CONFIG.UUID,
        });
      }, 1000);
    }
  };

  const stopScanning = () => {
    if (isRealDevice && managerRef.current) {
      managerRef.current.stopDeviceScan();
    } else if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
      mockIntervalRef.current = null;
    }
    setIsScanning(false);
  };

  const clearData = () => {
    stopScanning();
    setRawRssi(null);
    setScannedDevice(null);
    resetFusion();
  };

  return { 
    isScanning, 
    rssi: rawRssi, 
    scannedDevice, 
    distance, 
    metrics, 
    bluetoothState, 
    startScanning, 
    stopScanning, 
    clearData 
  };
};