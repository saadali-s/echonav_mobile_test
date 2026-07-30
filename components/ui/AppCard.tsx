import React from "react";
import { TouchableOpacity, View } from "react-native";

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "success" | "info" | "warning" | "danger" | "dark";
  padded?: boolean;
}

export function AppCard({
  children,
  onPress,
  className = "",
  disabled,
  variant = "default",
  padded = true,
}: AppCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-100 border-emerald-700 dark:bg-emerald-950 dark:border-emerald-500";
      case "info":
        return "bg-blue-100 border-blue-700 dark:bg-blue-950 dark:border-blue-500";
      case "warning":
        return "bg-amber-100 border-amber-700 dark:bg-amber-950 dark:border-amber-500";
      case "danger":
        return "bg-red-100 border-red-700 dark:bg-red-950 dark:border-red-500";
      case "dark":
        return "bg-black border-black dark:bg-zinc-900 dark:border-zinc-700";

      default:
        return "bg-white border-black dark:bg-zinc-950 dark:border-zinc-800";
    }
  };

  const baseClasses = `border-2 border-b-[6px] border-r-[4px] rounded-xl mb-4 shadow-sm dark:shadow-none ${getVariantClasses()} ${padded ? "p-5" : ""} ${disabled ? "opacity-50" : ""} ${className}`;

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled}
        className={baseClasses}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View className={baseClasses}>{children}</View>;
}
