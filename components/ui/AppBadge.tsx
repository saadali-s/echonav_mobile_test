import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';

export type BadgeVariant = 'success' | 'info' | 'warning' | 'danger' | 'default' | 'dark';

interface AppBadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: keyof typeof Feather.glyphMap;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, { container: string, text: 'success'|'info'|'warning'|'danger'|'secondary'|'inverse' }> = {
  success: { container: 'bg-emerald-100 border-emerald-700 dark:bg-emerald-950 dark:border-emerald-500', text: 'success' },
  info: { container: 'bg-blue-100 border-blue-700 dark:bg-blue-950 dark:border-blue-500', text: 'info' },
  warning: { container: 'bg-amber-100 border-amber-700 dark:bg-amber-950 dark:border-amber-500', text: 'warning' },
  danger: { container: 'bg-red-100 border-red-700 dark:bg-red-950 dark:border-red-500', text: 'danger' },
  default: { container: 'bg-zinc-100 border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700', text: 'secondary' },
  dark: { container: 'bg-black border-black dark:bg-zinc-800 dark:border-zinc-600', text: 'inverse' },
};

export function AppBadge({ label, variant = 'default', icon, className = '' }: AppBadgeProps) {
  const config = VARIANT_CLASSES[variant];

  return (
    <View className={`flex-row items-center px-3 py-1.5 rounded-lg border-2 self-start ${config.container} ${className}`}>
      {icon && <Feather name={icon} size={11} className={`mr-1 ${config.text === 'inverse' ? 'text-white' : 'text-current'}`} />}
      <AppText variant="caption" color={config.text}>{label}</AppText>
    </View>
  );
}