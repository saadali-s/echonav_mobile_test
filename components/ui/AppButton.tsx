import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';

type AppButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface AppButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: AppButtonVariant;
  style?: ViewStyle;
  compact?: boolean;
  icon?: string;
  fullWidth?: boolean;
  testID?: string;
}

export function AppButton({
  children,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  compact = false,
  icon,
  fullWidth = true,
  testID,
}: AppButtonProps) {
  const mode =
    variant === 'primary' ? 'contained' :
    variant === 'secondary' ? 'outlined' :
    variant === 'danger' ? 'contained' :
    'text';

  const buttonStyle = [
    styles.base,
    fullWidth && styles.fullWidth,
    variant === 'danger' && styles.danger,
    variant === 'secondary' && styles.secondary,
    variant === 'ghost' && styles.ghost,
    style,
  ];

  const textColor =
    variant === 'primary' ? '#ffffff' :
    variant === 'danger' ? '#ffffff' :
    '#18181b';

  return (
    <Button
      testID={testID}
      mode={mode as any}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      compact={compact}
      icon={icon}
      style={buttonStyle}
      labelStyle={[styles.label, { color: textColor }]}
      contentStyle={styles.content}
      buttonColor={variant === 'primary' ? '#18181b' : variant === 'danger' ? '#b91c1c' : undefined}
      textColor={textColor}
    >
      {children}
    </Button>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    marginTop: 0,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    height: 54,
  },
  label: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  secondary: {
    borderWidth: 2,
    borderColor: '#18181b',
    backgroundColor: '#ffffff',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    borderWidth: 0,
  },
});