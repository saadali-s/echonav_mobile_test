import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { AppText } from "../ui/AppText";

export function StaffHeader({
  name,
  onLogout,
}: {
  name: string;
  onLogout: () => void;
}) {
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <View className="p-5 bg-white dark:bg-zinc-950 border-b-4 border-black dark:border-zinc-800">
      <View className="flex-row justify-between items-start">
        <View>
          <AppText
            variant="displayMd"
            className="font-black tracking-tighter text-black dark:text-white"
          >
            EchoFleet
          </AppText>
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => setShowNotifs(true)}
            className="w-11 h-11 rounded-xl bg-white dark:bg-black border-2 border-black dark:border-zinc-700 justify-center items-center"
          >
            <Feather
              name="bell"
              size={20}
              className="text-black dark:text-white"
            />
            <View className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-white dark:border-black" />
          </TouchableOpacity>

          {}
          <TouchableOpacity
            onPress={onLogout}
            className="w-11 h-11 rounded-xl bg-red-500 dark:bg-red-600 border-2 border-red-700 dark:border-red-800 justify-center items-center"
          >
            <Feather name="log-out" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row items-center mt-1">
        <Feather name="user" size={12} className="text-zinc-500" />
        <AppText variant="bodySm" color="secondary" className="ml-1 uppercase">
          OPERATOR: {name}
        </AppText>
      </View>

      <Modal visible={showNotifs} transparent animationType="fade">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            padding: 20,
          }}
          activeOpacity={1}
          onPress={() => setShowNotifs(false)}
        >
          <View className="p-5 bg-white dark:bg-zinc-950 border-2 border-b-[6px] border-r-[4px] border-black dark:border-zinc-700 rounded-2xl">
            <AppText variant="titleMd">SYSTEM_ALERTS</AppText>
            <View className="h-0.5 bg-black dark:bg-zinc-800 my-3" />
            <View className="flex-row items-center p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
              <Feather name="alert-circle" size={16} className="text-red-600" />
              <AppText variant="caption" className="ml-2">
                BEACON #402: SIGNAL INTERFERENCE
              </AppText>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
