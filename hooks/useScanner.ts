import { BEACON_CONFIG } from '@/constants/Config';
import { useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { useFusionDistance } from './useFusionDistance';

export const useScanner = () => {
  const [rawRssi, setRawRssi] = useState<number | null>(null);
  const [scannedDevice, setScannedDevice] = useState<Device | null>(null); // <-- NEW: Captures full hardware profile
  const [isScanning, setIsScanning] = useState(false);
  const managerRef = useRef<BleManager | null>(null);

  const { distance, metrics, resetFusion } = useFusionDistance(rawRssi);

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED;
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
    const hasPermission = await requestBluetoothPermissions();
    if (!hasPermission) return;

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
            setRawRssi(device.rssi);
            setScannedDevice(device); // <-- NEW: Store the device so we can extract its MAC/UUID later
          }
        }
      );
    } catch (err: any) {
      console.error("FATAL CRASH:", err);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (managerRef.current) {
      managerRef.current.stopDeviceScan();
    }
    setIsScanning(false);
  };

  const clearData = () => {
    stopScanning();
    setRawRssi(null);
    setScannedDevice(null);
    resetFusion();
  };

  return { isScanning, rssi: rawRssi, scannedDevice, distance, metrics, startScanning, stopScanning, clearData };
};