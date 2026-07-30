import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { PairingModal } from "../components/auth/PairingModal";
import { RadarMap } from "../components/navigation/RadarMap";
import { AppButton } from "../components/ui/AppButton";
import { AppInput } from "../components/ui/AppInput";
import { AppScreen } from "../components/ui/AppScreen";
import { AppText } from "../components/ui/AppText";
import { BEACON_CONFIG } from "../core/constants/Config";
import { useAppAlert } from "../core/context/AlertContext";
import { useAuth } from "../core/context/AuthContext";
import { useScanner } from "../core/hooks/useScanner";
import { AuthAPI } from "../core/services/AuthAPI";
import { NavigationAPI } from "../core/services/NavigationAPI";

export default function RadarHomeScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { showAlert } = useAppAlert();

  const {
    startScanning,
    stopScanning,
    isScanning,
    distance,
    scannedDevicesList,
    bluetoothState,
  } = useScanner();

  const [showAccess, setShowAccess] = useState(false);
  const [showStaffLogin, setShowStaffLogin] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<{
    startNodeId: string;
    floorPlanId: string;
  } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isResolving = useRef(false);
  const scannedListRef = useRef<any[]>([]);

  useEffect(() => {
    scannedListRef.current = scannedDevicesList;
  }, [scannedDevicesList]);

  const handleActivateRadar = async () => {
    if (isResolving.current) return;
    isResolving.current = true;

    try {
      await startScanning();
    } catch (err: any) {
      showAlert("SCANNER OFFLINE", err.message, "error");
      isResolving.current = false;
      return;
    }

    setTimeout(async () => {
      stopScanning();

      const topDevices = scannedListRef.current;

      if (topDevices.length > 0) {
        const closestBeacon = topDevices[0];

        try {
          const response = await NavigationAPI.resolvePosition(
            closestBeacon.uuid,
            BEACON_CONFIG.MAJOR,
            BEACON_CONFIG.MINOR,
          );

          if (response.privacyLevel === "PRIVATE") {
            setPendingRoute({
              startNodeId: String(response.node.id),
              floorPlanId: String(response.floorPlanId),
            });
            setShowAccess(true);
          } else {
            router.push({
              pathname: "/navigate",
              params: {
                startNodeId: String(response.node.id),
                floorPlanId: String(response.floorPlanId),
              },
            });
          }
        } catch (error: any) {
          showAlert(
            "RESOLUTION FAILED",
            error.message || "Hardware signature not recognized by the server.",
            "error",
          );
        }
      } else {
        showAlert("SCAN COMPLETE", "No spatial anchors found nearby.", "info");
      }

      isResolving.current = false;
    }, 2500);
  };

  const handleStaffLogin = async () => {
    if (!email || !password) return;
    try {
      setIsLoading(true);
      const response = await AuthAPI.loginStaff(email, password);

      if (!response || typeof response.token !== "string") {
        throw new Error("Server returned an invalid authentication token.");
      }

      await login(response.token, response.userId);

      setShowStaffLogin(false);
      stopScanning();

      router.replace("/staff/(tabs)" as any);
    } catch (error: any) {
      showAlert(
        "AUTHENTICATION FAILED",
        error.message || "Invalid credentials.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppScreen padded={false} scrollable={false} centered>
      <View
        pointerEvents="box-none"
        className="absolute top-[60px] w-full px-6 flex-row justify-between items-center z-10"
      >
        <TouchableOpacity
          className="flex-row items-center bg-white dark:bg-zinc-900 px-4 py-2 rounded-full border-2 border-black dark:border-zinc-700 shadow-sm"
          onPress={() => setShowAccess(true)}
        >
          <Feather
            name="key"
            size={16}
            className="text-emerald-600 dark:text-emerald-500 mr-2"
          />
          <AppText variant="label" color="primary">
            Bind
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center bg-white dark:bg-zinc-900 px-4 py-2 rounded-full border-2 border-black dark:border-zinc-700 shadow-sm"
          onPress={() => setShowStaffLogin(true)}
        >
          <AppText variant="label" color="primary" className="mr-2">
            Staff
          </AppText>
          <Feather
            name="shield"
            size={16}
            className="text-blue-600 dark:text-blue-500"
          />
        </TouchableOpacity>
      </View>

      <View className="w-full items-center mt-10">
        <AppText variant="displaySm" color="primary" center className="mb-4">
          EchoNav
        </AppText>

        <View className="min-h-[56px] w-[85%] mb-8 justify-center">
          {bluetoothState === "PoweredOff" ? (
            <AppText variant="caption" color="danger" center>
              BLUETOOTH ANTENNA IS OFF
            </AppText>
          ) : isScanning ? (
            <AppText variant="caption" color="success" center>
              SEARCHING FOR SPATIAL ANCHORS...
            </AppText>
          ) : (
            <AppButton
              variant="primary"
              icon="radio"
              onPress={handleActivateRadar}
            >
              ACTIVATE SCANNER
            </AppButton>
          )}
        </View>

        <RadarMap isScanning={isScanning} distance={distance} heading={0} />
      </View>

      <PairingModal
        visible={showAccess}
        onClose={() => {
          setShowAccess(false);
          isResolving.current = false;
          setPendingRoute(null);
        }}
        onAuthenticate={async (accEmail, pin) => {
          try {
            const response = await AuthAPI.pairDevice(accEmail, pin);
            await login(response.token, response.userId);
            setShowAccess(false);

            if (pendingRoute) {
              router.replace({
                pathname: "/navigate",
                params: pendingRoute,
              } as any);
            } else {
              showAlert(
                "SUCCESS",
                "Device paired, but no anchor was scanned to route to.",
                "success",
              );
            }
          } catch (error: any) {
            showAlert(
              "PAIRING FAILED",
              error.message || "Invalid PIN or Email.",
              "error",
            );
          }
        }}
      />

      <Modal visible={showStaffLogin} transparent animationType="fade">
        <View className="flex-1 bg-black/70">
          {}
          <KeyboardAvoidingView behavior="padding" className="flex-1">
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                padding: 20,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border-2 border-black dark:border-zinc-800">
                <View className="flex-row justify-between items-center mb-5">
                  <AppText variant="titleMd">Staff Access</AppText>
                  <TouchableOpacity onPress={() => setShowStaffLogin(false)}>
                    <Feather
                      name="x"
                      size={24}
                      className="text-black dark:text-white"
                    />
                  </TouchableOpacity>
                </View>

                <AppInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <AppInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <AppButton
                  onPress={handleStaffLogin}
                  loading={isLoading}
                  className="mt-3"
                >
                  AUTHORIZE
                </AppButton>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </AppScreen>
  );
}
