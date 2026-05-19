import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { AppText } from '../ui/AppText';

export function CompletedTaskTag({ title }: { title: string }) {
  return (
    <View style={styles.tag}>
      <Feather name="check-circle" size={12} color={Colors.successText} />
      <AppText variant="caption" style={styles.text}>{title}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8, // Kanban-style slightly rounded corners, not full pills
    gap: 6,
  },
  text: {
    color: Colors.black,
    fontWeight: '700',
  }
});