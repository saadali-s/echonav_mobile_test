import { BEACON_CONFIG } from '@/core/constants/Config';
import * as Device from 'expo-device';
import { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { useFusionDistance } from './useFusionDistance';

export type BluetoothState = 'Unknown' | 'PoweredOn' | 'PoweredOff' | 'Unauthorized' | 'Unsupported' | 'MockMode';

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

export const useScanner = (
    targetBaseline: number = -65, 
    targetAudioUri: string | null = null, 
    targetManeuverCode: string | null = null,
    targetUuid: string | null = null,
    onDestinationReached?: () => void
) => {
  const [rawRssi, setRawRssi] = useState<number | null>(null);
  const [scannedDevice, setScannedDevice] = useState<any | null>(null);
  const [scannedDevicesList, setScannedDevicesList] = useState<any[]>([]); 
  const [isScanning, setIsScanning] = useState(false);
  const [bluetoothState, setBluetoothState] = useState<BluetoothState>('Unknown');
  
  const managerRef = useRef<any>(globalBleManager);
  const mockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const devicesMapRef = useRef<Map<string, any>>(new Map()); 

  const { 
    distance, metrics, resetFusion, steps, triggerAudio, 
    isSpinning, hasTurnedAround, clearTurnWarning 
  } = useFusionDistance(rawRssi, targetBaseline, targetAudioUri, targetManeuverCode, onDestinationReached);

  useEffect(() => {
    if (isRealDevice && managerRef.current) {
      const subscription = managerRef.current.onStateChange((state: string) => {
        if (state === 'PoweredOn') setBluetoothState('PoweredOn');
        else if (state === 'PoweredOff') setBluetoothState('PoweredOff');
        else if (state === 'Unauthorized') setBluetoothState('Unauthorized');
        else setBluetoothState('Unknown');
      }, true);
      return () => subscription.remove();
    } else if (!isRealDevice) {
      setBluetoothState('MockMode');
    } else {
      setBluetoothState('Unsupported');
    }
  }, []);

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
        const now = Date.now();
        const activeDevices: any[] = [];
        
        devicesMapRef.current.forEach((val, key) => {
            if (now - val.lastSeen < 3000) activeDevices.push(val);
            else devicesMapRef.current.delete(key);
        });
        
        activeDevices.sort((a, b) => b.rssi - a.rssi);
        setScannedDevicesList(activeDevices);
        setScannedDevice(activeDevices.length > 0 ? activeDevices[0] : null);
    }, 500); 
    
    return () => clearInterval(interval);
  }, [isScanning]);

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
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  };

  const startScanning = async () => {
    if (mockIntervalRef.current) {
        clearInterval(mockIntervalRef.current);
        mockIntervalRef.current = null;
    }
    if (isRealDevice && managerRef.current) await managerRef.current.stopDeviceScan();
    if (isScanning) return;
    
    devicesMapRef.current.clear(); 

    if (isRealDevice && managerRef.current) {
      try {
        const currentState = await managerRef.current.state();
        if (currentState !== 'PoweredOn') {
          throw new Error("Bluetooth is currently disabled. Please turn it on to scan.");
        }

        const hasPermission = await requestBluetoothPermissions();
        if (!hasPermission) {
          throw new Error("Bluetooth and Location permissions are strictly required for spatial scanning.");
        }

        setIsScanning(true);
        const targetUUIDs = BEACON_CONFIG.TARGET_UUIDS.map(id => id.toLowerCase());

        managerRef.current.startDeviceScan(targetUUIDs, { allowDuplicates: true }, (error: any, device: any) => {
            if (error) {
              setIsScanning(false);
              return;
            }
            if (device && device.rssi) {
                let extractedUuid = null;
                if (device.serviceUUIDs && device.serviceUUIDs.length > 0) extractedUuid = device.serviceUUIDs[0];
                else if (device.serviceData) {
                    const keys = Object.keys(device.serviceData);
                    if (keys.length > 0) extractedUuid = keys[0];
                }

                if (!extractedUuid) return; 
                const cleanUuid = extractedUuid.toLowerCase();
                if (targetUuid && cleanUuid !== targetUuid.toLowerCase()) return; 

                devicesMapRef.current.set(cleanUuid, {
                    id: device.id, uuid: cleanUuid, rssi: device.rssi, name: device.name || 'Beacon', lastSeen: Date.now()
                });
                setRawRssi(device.rssi);
            }
          }
        );
      } catch (err: any) {
        setIsScanning(false);
        throw err; // Re-throw to UI
      }
    } else {
      setIsScanning(true);
      let currentRssi = -85;
      mockIntervalRef.current = setInterval(() => {
        if (currentRssi < -50) currentRssi += 3;
        const mockUuid = BEACON_CONFIG.TARGET_UUIDS[0].toLowerCase();
        if (targetUuid && mockUuid !== targetUuid.toLowerCase()) return;
        
        devicesMapRef.current.set(mockUuid, {
            id: 'MOCK_MAC_ADDRESS_01', uuid: mockUuid, rssi: currentRssi, name: BEACON_CONFIG.DEVICE_NAME, lastSeen: Date.now()
        });
        setRawRssi(currentRssi);
      }, 1000);
    }
  };

  const stopScanning = () => {
    if (isRealDevice && managerRef.current) managerRef.current.stopDeviceScan();
    else if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
      mockIntervalRef.current = null;
    }
    setIsScanning(false);
  };

  const clearData = () => {
    stopScanning();
    setRawRssi(null);
    setScannedDevice(null);
    setScannedDevicesList([]);
    devicesMapRef.current.clear();
    resetFusion();
  };

  return { 
    isScanning, rssi: rawRssi, scannedDevice, scannedDevicesList, distance, metrics, 
    bluetoothState, startScanning, stopScanning, clearData, steps, triggerAudio,
    isSpinning, hasTurnedAround, clearTurnWarning 
  };
};