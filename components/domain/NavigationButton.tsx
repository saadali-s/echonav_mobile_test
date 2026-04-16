import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { AppText } from '../ui/AppText';

interface NavigationButtonProps {
  isActive: boolean;
  onPress: () => void;
}

export function NavigationButton({ isActive, onPress }: NavigationButtonProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.9}
      style={[styles.container, { backgroundColor: isActive ? Colors.activeGreenBg : Colors.black }]}
    >
      <View style={[styles.circle, { borderColor: isActive ? Colors.activeGreen : Colors.white }]} />
      <AppText variant="displayLg" color="inverse">
        {isActive ? 'NAVIGATING' : 'TAP TO START'}
      </AppText>
      <AppText variant="body" color="muted" style={styles.subtitle}>
        {isActive ? 'Follow audio and radar' : 'Ready for destination'}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  circle: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, marginBottom: Spacing.xl },
  subtitle: { marginTop: Spacing.sm }
});