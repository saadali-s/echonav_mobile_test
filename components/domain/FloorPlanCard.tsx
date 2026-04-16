import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Brutalist, Colors, Spacing } from '../../constants/theme';
import { AppText } from '../ui/AppText';

export function FloorPlanCard({ title, building, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[Brutalist.card, styles.card]}>
      <View style={styles.imagePlaceholder}>
        <Feather name="layers" size={24} color={Colors.textMuted} />
      </View>
      <View style={styles.info}>
        <AppText variant="titleSm" numberOfLines={1}>{title}</AppText>
        <AppText variant="caption" color="muted">{building}</AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 160, padding: 0, overflow: 'hidden', marginRight: Spacing.lg },
  imagePlaceholder: { height: 100, backgroundColor: Colors.borderLight, justifyContent: 'center', alignItems: 'center' },
  info: { padding: Spacing.md }
});