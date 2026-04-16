import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';

interface AppScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  scrollable?: boolean;
  keyboardAvoiding?: boolean; // Added this property
  dark?: boolean;
  centered?: boolean;
}

export function AppScreen({
  children,
  style,
  padded = true,
  scrollable = true,
  keyboardAvoiding = false, // Default value
  dark = false,
  centered = false,
}: AppScreenProps) {
  const containerStyle = [
    styles.base,
    dark && styles.dark,
    centered && styles.centered,
    style,
  ];

  const content = scrollable ? (
    <ScrollView
      style={styles.base}
      contentContainerStyle={[
        styles.scrollContent,
        padded && styles.padded,
        dark && styles.dark,
        centered && styles.centered,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[containerStyle, padded && styles.padded]}>
      {children}
    </View>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={[styles.base, dark && styles.dark]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: Colors.background },
  dark: { backgroundColor: Colors.black },
  padded: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg },
  centered: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: { flexGrow: 1, paddingBottom: Spacing.section },
});