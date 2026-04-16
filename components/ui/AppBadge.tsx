import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors, Radii, Spacing, Typography } from '../../constants/theme';

export type BadgeVariant = 'success' | 'info' | 'warning' | 'danger' | 'default' | 'dark';

interface AppBadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: keyof typeof Feather.glyphMap;
  style?: ViewStyle;
}

const VARIANT_CONFIG: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  success: { bg: Colors.successBg, text: Colors.successText, border: Colors.successBorder },
  info: { bg: Colors.infoBg, text: Colors.infoText, border: Colors.infoBorder },
  warning: { bg: Colors.warningBg, text: Colors.warningText, border: Colors.warningBorder },
  danger: { bg: Colors.dangerBg, text: Colors.dangerText, border: Colors.dangerBorder },
  default: { bg: Colors.border, text: Colors.textSecondary, border: Colors.border },
  dark: { bg: Colors.black, text: Colors.white, border: Colors.black },
};

export function AppBadge({ label, variant = 'default', icon, style }: AppBadgeProps) {
  const config = VARIANT_CONFIG[variant];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.border }, style]}>
      {icon && <Feather name={icon} size={11} color={config.text} style={styles.icon} />}
      <Text style={[styles.label, { color: config.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radii.md,
    borderWidth: 2,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: Spacing.xs - 2,
  },
  label: {
    ...Typography.caption,
  },
});