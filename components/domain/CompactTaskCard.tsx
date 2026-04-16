import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { AppText } from '../ui/AppText';

export function CompactTaskCard({ title, location, status, onPress }: any) {
  const isPending = status === 'PENDING';
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: isPending ? Colors.warningText : Colors.infoText }]} />
      <View style={styles.content}>
        <AppText variant="titleSm" numberOfLines={1}>{title}</AppText>
        <View style={styles.row}>
          <Feather name="map-pin" size={10} color={Colors.textMuted} />
          <AppText variant="caption" color="muted">{location}</AppText>
        </View>
      </View>
      <Feather name="chevron-right" size={16} color={Colors.border} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: Colors.white, padding: Spacing.md, 
    borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border,
    marginBottom: Spacing.sm 
  },
  indicator: { width: 4, height: '100%', borderRadius: 2 },
  content: { flex: 1, marginLeft: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }
});