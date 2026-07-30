import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

interface AppScreenProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  centered?: boolean;
}

export function AppScreen({
  children,
  className = "",
  padded = true,
  scrollable = true,
  keyboardAvoiding = false,
  centered = false,
}: AppScreenProps) {
  const bgClass = "bg-[#fafafa] dark:bg-black";
  const layoutClass = centered ? "justify-center items-center" : "";
  const padClass = padded ? "px-5 py-4" : "";

  const content = scrollable ? (
    <ScrollView
      className={`flex-1 ${bgClass}`}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className={`flex-1 ${padClass} ${layoutClass} ${className}`}>
        {children}
      </View>
    </ScrollView>
  ) : (
    <View
      className={`flex-1 ${bgClass} ${padClass} ${layoutClass} ${className}`}
    >
      {children}
    </View>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        className={`flex-1 ${bgClass}`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
}
