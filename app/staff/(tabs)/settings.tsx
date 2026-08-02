import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Switch, View } from "react-native";
import { AppButton } from "../../../components/ui/AppButton";
import { AppInput } from "../../../components/ui/AppInput";
import { AppScreen } from "../../../components/ui/AppScreen";
import { AppText } from "../../../components/ui/AppText";
import { useAppAlert } from "../../../core/context/AlertContext";
import { AuthAPI } from "../../../core/services/AuthAPI";

export default function SettingsScreen() {
  const { showAlert } = useAppAlert();

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await AuthAPI.getProfile();
        setName(data.displayName);
        setEmail(data.email);
        setRole(data.role);
      } catch (error) {
        console.error("Failed to load profile data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = () => {
    showAlert(
      "PROFILE UPDATED",
      "Your changes have been saved successfully.",
      "success",
    );
  };

  if (isLoading) {
    return (
      <AppScreen centered>
        <ActivityIndicator
          size="large"
          color={colorScheme === "dark" ? "#fff" : "#000"}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen padded={false}>
      <View className="p-5 bg-white dark:bg-black border-b-4 border-black dark:border-zinc-800">
        <AppText variant="displaySm">Settings</AppText>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View className="gap-3 mb-2">
          <AppText variant="label" color="muted">
            Preferences
          </AppText>
          <View className="flex-row items-center justify-between bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 border-b-[5px] border-r-[3px] rounded-xl p-4">
            <AppText variant="bodyMd">Dark Mode</AppText>
            <Switch
              value={colorScheme === "dark"}
              onValueChange={toggleColorScheme}
              trackColor={{ false: "#e4e4e7", true: "#10b981" }}
              thumbColor={colorScheme === "dark" ? "#fff" : "#18181b"}
            />
          </View>
        </View>

        <AppText variant="label" color="muted">
          Profile Details
        </AppText>

        <View className="gap-3">
          <AppInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
          />
          <AppInput
            label="Email Address"
            value={email}
            editable={false}
            keyboardType="email-address"
            autoCapitalize="none"
            className="opacity-60"
          />
          <AppInput
            label="Authorization Role"
            value={role}
            editable={false}
            className="opacity-60"
          />

          <AppButton onPress={handleSave} className="mt-3">
            SAVE DETAILS
          </AppButton>
        </View>
      </ScrollView>
    </AppScreen>
  );
}
