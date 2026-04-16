import { BEACON_CONFIG } from '@/constants/Config';
import { useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { useFusionDistance } from './useFusionDistance';

export const useScanner = () => {
  const [rawRssi, setRawRssi] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const managerRef = useRef<BleManager | null>(null);

  const { distance, metrics, resetFusion } = useFusionDistance(rawRssi);

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      // Android 12+ requires explicit scan/connect permissions
      if (Platform.Version >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Older Android just needs location
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  };

  const startScanning = async () => {
    console.log("DEBUG: Requesting permissions...");
    
    const hasPermission = await requestBluetoothPermissions();
    if (!hasPermission) {
      console.error("Bluetooth permissions denied by user.");
      return;
    }

    try {
      if (!managerRef.current) managerRef.current = new BleManager();
      setIsScanning(true);
      
      const targetUUID = BEACON_CONFIG.UUID.toLowerCase();

      managerRef.current.startDeviceScan(
        [targetUUID], 
        { allowDuplicates: true }, 
        (error, device) => {
          if (error) {
            console.error("Scan error:", error.message);
            setIsScanning(false);
            return;
          }
          if (device && device.rssi) {
            console.log(`TARGET BEACON PING! RSSI: ${device.rssi}`);
            setRawRssi(device.rssi);
          }
        }
      );
    } catch (err: any) {
      console.error("FATAL CRASH:", err);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    console.log("DEBUG: Navigation stopped.");
    if (managerRef.current) {
      managerRef.current.stopDeviceScan();
    }
    setIsScanning(false);
  };

  const clearData = () => {
    stopScanning();
    setRawRssi(null);
    resetFusion();
  };

  return { isScanning, rssi: rawRssi, distance, metrics, startScanning, stopScanning, clearData };
};