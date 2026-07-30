import React from "react";
import { Text, TextProps } from "react-native";

const VARIANT_CLASSES = {
  displayLg: "text-4xl font-black tracking-widest",
  displayMd: "text-2xl font-black tracking-wide",
  displaySm: "text-xl font-black",
  titleLg: "text-lg font-black uppercase",
  titleMd: "text-base font-black uppercase",
  titleSm: "text-sm font-extrabold uppercase tracking-widest",
  body: "text-base font-semibold",
  bodyMd: "text-sm font-semibold",
  bodySm: "text-xs font-semibold",
  label: "text-xs font-extrabold uppercase tracking-widest",
  caption: "text-[10px] font-extrabold uppercase",
  link: "text-sm font-bold underline",
};

const COLOR_CLASSES = {
  primary: "text-zinc-950 dark:text-white",
  secondary: "text-zinc-500 dark:text-zinc-400",
  muted: "text-zinc-400 dark:text-zinc-500",
  inverse: "text-white dark:text-zinc-950",
  link: "text-zinc-600 dark:text-blue-400",
  success: "text-emerald-700 dark:text-emerald-400",
  danger: "text-red-700 dark:text-red-400",
  warning: "text-amber-700 dark:text-amber-400",
  info: "text-blue-700 dark:text-blue-400",
};

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  variant?: keyof typeof VARIANT_CLASSES;
  color?: keyof typeof COLOR_CLASSES;
  center?: boolean;
  uppercase?: boolean;
  className?: string;
}

export function AppText({
  children,
  variant = "body",
  color = "primary",
  center,
  uppercase,
  className = "",
  ...props
}: AppTextProps) {
  const baseClass = VARIANT_CLASSES[variant];
  const colorClass = COLOR_CLASSES[color];
  const alignClass = center ? "text-center" : "";
  const transformClass = uppercase ? "uppercase" : "";

  return (
    <Text
      className={`${baseClass} ${colorClass} ${alignClass} ${transformClass} ${className}`}
      {...props}
    >
      {children}
    </Text>
  );
}
