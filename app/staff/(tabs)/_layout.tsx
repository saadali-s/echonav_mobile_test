import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";

export default function StaffTabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 100,
          borderTopWidth: 3,
          borderTopColor: isDark ? "#27272a" : "#18181b",
          paddingBottom: 40,
          paddingTop: 5,
          backgroundColor: isDark ? "#09090b" : "#ffffff",
        },
        tabBarActiveTintColor: isDark ? "#34d399" : "#10b981",
        tabBarInactiveTintColor: isDark ? "#52525b" : "#a1a1aa",
        tabBarLabelStyle: {
          fontWeight: "900",
          textTransform: "uppercase",
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => (
            <Feather name="list" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: "Maps",
          tabBarIcon: ({ color }) => (
            <Feather name="map" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
