export const BEACON_CONFIG = {
  TARGET_UUIDS: [
    "1234abcd-5678-90ef-1234-567890abcdef", 
    "2234abcd-5678-90ef-1234-567890abcdef", 
    "3234abcd-5678-90ef-1234-567890abcdef", 
    "4234abcd-5678-90ef-1234-567890abcdef"  
  ],
  MAJOR: 1,
  MINOR: 1,
  DEVICE_NAME: "IndoorNav_Beacon",
};

const rawApiUrl = process.env.EXPO_PUBLIC_API_URL || "http://192.168.3.112:8080/api";
export const TTS_BASE_URL = rawApiUrl.replace(/\/api\/?$/, '');