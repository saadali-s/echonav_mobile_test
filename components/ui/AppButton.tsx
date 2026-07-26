import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';

interface AppButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  compact?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  fullWidth?: boolean;
  className?: string;
}

export function AppButton({ children, onPress, loading, disabled, variant = 'primary', compact = false, icon, fullWidth = true, className = '' }: AppButtonProps) {
  const isGhost = variant === 'ghost';
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';

  const baseClasses = `flex-row items-center justify-center rounded-xl active:scale-95 transition-transform`;
  const sizeClasses = compact ? 'h-10 px-4' : 'h-14 px-6';
  const widthClasses = fullWidth ? 'w-full' : 'self-start';

  // Injecting Color and Brutalist borders to make Light Mode pop
  let bgClass = 'bg-emerald-500 dark:bg-emerald-600';
  let borderClass = 'border-2 border-b-[4px] border-emerald-700 dark:border-emerald-800';
  let textCol = 'inverse';

  if (isSecondary) {
    bgClass = 'bg-white dark:bg-zinc-900';
    borderClass = 'border-2 border-b-[4px] border-black dark:border-zinc-700';
    textCol = 'primary';
  } else if (isDanger) {
    bgClass = 'bg-red-500 dark:bg-red-700';
    borderClass = 'border-2 border-b-[4px] border-red-700 dark:border-red-900';
    textCol = 'inverse';
  } else if (isGhost) {
    bgClass = 'bg-transparent';
    borderClass = '';
    textCol = 'primary';
  }

  const opacity = disabled || loading ? 'opacity-50' : 'opacity-100';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses} ${widthClasses} ${bgClass} ${borderClass} ${opacity} ${className}`}
    >
      {loading ? (
         <ActivityIndicator color={isSecondary || isGhost ? '#888' : '#fff'} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {icon && <Feather name={icon} size={18} className={isSecondary || isGhost ? 'text-black dark:text-white' : 'text-white'} />}
          <AppText variant="label" color={textCol as any}>{children}</AppText>
        </View>
      )}
    </TouchableOpacity>
  );
}