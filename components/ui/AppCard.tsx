import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { CardBorder, Colors, Shadows, Spacing } from '../../constants/theme';

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  variant?: 'default' | 'success' | 'info' | 'warning' | 'danger' | 'dark';
  padded?: boolean;
  row?: boolean;
}

export function AppCard({
  children,
  onPress,
  style,
  disabled = false,
  variant = 'default',
  padded = true,
  row = false,
}: AppCardProps) {
  const variantStyle = variantStyles[variant];

  const containerStyle = [
    styles.base,
    variantStyle,
    padded && styles.padded,
    row && styles.row,
    disabled && styles.disabled,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled}
        style={containerStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    ...CardBorder, // This works now
    ...Shadows.md,
    marginBottom: Spacing.lg,
  },
  padded: { padding: Spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center' },
  disabled: { opacity: 0.5 },
});

const variantStyles = StyleSheet.create({
  default: { backgroundColor: Colors.surface, borderColor: Colors.borderStrong },
  success: { backgroundColor: Colors.successBg, borderColor: Colors.successBorder },
  info: { backgroundColor: Colors.infoBg, borderColor: Colors.infoBorder },
  warning: { backgroundColor: Colors.warningBg, borderColor: Colors.warningBorder },
  danger: { backgroundColor: Colors.dangerBg, borderColor: Colors.dangerBorder },
  dark: { backgroundColor: Colors.black, borderColor: Colors.black },
});