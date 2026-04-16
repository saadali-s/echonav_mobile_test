import { BEACON_CONFIG } from '@/constants/Config';
import { useEffect, useRef, useState } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { useFusionDistance } from './useFusionDistance';

export const useScanner = () => {
  const [rawRssi, setRawRssi] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const managerRef = useRef<BleManager | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);

  const { distance, metrics, resetFusion } = useFusionDistance(rawRssi);

  // Attempt to initialize the native BLE manager safely
  useEffect(() => {
    try {
      managerRef.current = new BleManager();
    } catch (error) {
      console.warn("⚠️ Native BLE not available (Likely running in Expo Go). Falling back to Mock Mode.");
      setIsMockMode(true);
    }
    
    return () => {
      if (managerRef.current) {
        managerRef.current.destroy();
      }
    };
  }, []);

  const startScanning = () => {
    console.log("DEBUG: Start Navigation pressed.");
    setIsScanning(true);

    // --- MOCK MODE (For Expo Go testing) ---
    if (isMockMode) {
      console.log("⚠️ Simulating BLE Scan...");
      setTimeout(() => {
        if (isScanning) return; // Prevent state updates if stopped early
        console.log(`TARGET BEACON PING! (SIMULATED) RSSI: -65`);
        setRawRssi(-65);
      }, 2000); // Fakes a 2-second search
      return;
    }

    // --- REAL NATIVE MODE ---
    try {
      if (!managerRef.current) return;
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
      console.error("FATAL CRASH AVOIDED:", err);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    console.log("DEBUG: Navigation stopped.");
    if (managerRef.current && !isMockMode) {
      managerRef.current.stopDeviceScan();
    }
    setIsScanning(false);
  };

  const clearData = () => {
    console.log("🧹 DEBUG: Data cleared.");
    stopScanning();
    setRawRssi(null);
    resetFusion();
  };

  return { isScanning, rssi: rawRssi, distance, metrics, startScanning, stopScanning, clearData };
};