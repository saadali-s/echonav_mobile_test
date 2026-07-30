import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { AppButton } from "../ui/AppButton";
import { AppInput } from "../ui/AppInput";
import { AppText } from "../ui/AppText";

interface PairingModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthenticate: (email: string, pin: string) => void;
}

export function PairingModal({
  visible,
  onClose,
  onAuthenticate,
}: PairingModalProps) {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/70">
        {}
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View className="bg-white dark:bg-zinc-950 p-6 pb-10 rounded-t-3xl border-2 border-black dark:border-zinc-800">
              <View className="flex-row justify-between items-center mb-2">
                <AppText variant="titleMd">Accessibility Setup</AppText>
                <TouchableOpacity onPress={onClose}>
                  <Feather
                    name="x"
                    size={24}
                    className="text-black dark:text-white"
                  />
                </TouchableOpacity>
              </View>

              <AppText variant="bodySm" color="secondary" className="mb-6">
                Enter your registered email and the 6-digit TTL PIN from the
                Institution Accessibility Desk.
              </AppText>

              <AppInput
                label="Registered Email"
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <AppInput
                label="Secure PIN"
                value={pin}
                onChangeText={setPin}
                placeholder="••••••"
                keyboardType="number-pad"
                maxLength={6}
                inputClassName="text-center text-2xl tracking-[10px] font-black"
              />

              <AppButton
                onPress={() => onAuthenticate(email, pin)}
                disabled={pin.length !== 6 || !email.includes("@")}
                className="mt-4"
              >
                AUTHENTICATE & BIND
              </AppButton>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
