import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { AppText } from '../ui/AppText';

interface AccessModeToggleProps {
  activeMode: 'PUBLIC' | 'PRIVATE';
  onChange: (mode: 'PUBLIC' | 'PRIVATE') => void;
}

export function AccessModeToggle({ activeMode, onChange }: AccessModeToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.segment, activeMode === 'PUBLIC' && styles.activeSegment]}
        onPress={() => onChange('PUBLIC')}
        activeOpacity={0.8}
      >
        <AppText variant="caption" color={activeMode === 'PUBLIC' ? 'inverse' : 'muted'}>
          PUBLIC
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.segment, activeMode === 'PRIVATE' && styles.activeSegment]}
        onPress={() => onChange('PRIVATE')}
        activeOpacity={0.8}
      >
        <AppText variant="caption" color={activeMode === 'PRIVATE' ? 'inverse' : 'muted'}>
          PRIVATE
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: Colors.borderLight, borderRadius: 999, padding: 4, width: 200, alignSelf: 'flex-start', marginBottom: Spacing.lg },
  segment: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 999 },
  activeSegment: { backgroundColor: Colors.black, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }
});