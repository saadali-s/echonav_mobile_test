import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

type TextVariant = keyof typeof Typography;
type TextColor = keyof typeof COLOR_MAP;

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  center?: boolean;
  uppercase?: boolean;
}

const COLOR_MAP = {
  primary: Colors.textPrimary,
  secondary: Colors.textSecondary,
  muted: Colors.textMuted,
  inverse: Colors.textInverse,
  link: Colors.textLink,
  success: Colors.successText,
  danger: Colors.dangerText,
  warning: Colors.warningText,
  info: Colors.infoText,
};

export function AppText({
  children,
  variant = 'body',
  color = 'primary',
  style,
  center,
  uppercase,
  ...props
}: AppTextProps) {
  // Safe indexing with a fallback to 'body' style
  const baseStyle = Typography[variant] || Typography.body;

  const resolvedStyle: TextStyle[] = [
    baseStyle as TextStyle,
    { color: COLOR_MAP[color] },
    center && { textAlign: 'center' },
    uppercase && { textTransform: 'uppercase' },
    style as TextStyle,
  ].filter(Boolean) as TextStyle[];

  return (
    <Text style={resolvedStyle} {...props}>
      {children}
    </Text>
  );
}