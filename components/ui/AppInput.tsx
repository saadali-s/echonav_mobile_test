import React from 'react';
import { StyleSheet, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { Colors, Radii, Spacing } from '../../constants/theme';
import { AppText } from './AppText';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  right?: React.ReactNode;
  left?: React.ReactNode;
}

export function AppInput({ 
  label, 
  error, 
  containerStyle, 
  inputStyle, 
  right, 
  left, 
  ...props 
}: AppInputProps) {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <AppText variant="label" color="secondary" style={styles.label}>{label}</AppText>}
      
      <View style={styles.inputContainer}>
        {left && <View style={styles.leftSlot}>{left}</View>}
        
        <TextInput
          style={[
            styles.input, 
            left ? { paddingLeft: 44 } : null, // Fixed conditional styling
            right ? { paddingRight: 44 } : null, // Fixed conditional styling
            error ? styles.inputError : null,
            inputStyle
          ]}
          placeholderTextColor={Colors.textMuted}
          {...props}
        />
        
        {right && <View style={styles.rightSlot}>{right}</View>}
      </View>

      {error && <AppText variant="caption" color="danger" style={styles.errorText}>{error}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: Spacing.md },
  label: { marginBottom: Spacing.xs, marginLeft: Spacing.xs },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
    borderBottomWidth: 5,
    borderRightWidth: 3, 
    borderRadius: Radii.md,
    padding: Spacing.lg,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  inputError: { borderColor: Colors.dangerBorder },
  leftSlot: { position: 'absolute', left: 14, zIndex: 10 },
  rightSlot: { position: 'absolute', right: 14, zIndex: 10 },
  errorText: { marginTop: Spacing.xs, marginLeft: Spacing.xs },
});