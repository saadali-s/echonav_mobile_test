import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { Colors, Radii, Spacing } from '../constants/theme';
import { AppCard } from './ui/AppCard';
import { AppText } from './ui/AppText';

export interface Venue {
  id: string;
  name: string;
  campus: string;
  nodes: number;
  edges: number;
}

export function VenueCard({ venue, onPress }: { venue: Venue; onPress: () => void }) {
  return (
    <AppCard onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ 
        width: 48, height: 48, backgroundColor: Colors.borderLight, 
        borderWidth: 2, borderColor: Colors.borderStrong, borderRadius: Radii.sm,
        alignItems: 'center', justifyContent: 'center', marginRight: Spacing.lg
      }}>
        <Feather name="map" size={24} color={Colors.black} />
      </View>

      <View style={{ flex: 1 }}>
        <AppText variant="titleLg">{venue.name}</AppText>
        <AppText variant="bodySm" color="secondary">{venue.campus}</AppText>
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
          <StatPill icon="map-pin" label={`${venue.nodes} Nodes`} />
          <StatPill icon="git-commit" label={`${venue.edges} Edges`} />
        </View>
      </View>

      <Feather name="chevron-right" size={20} color={Colors.textMuted} />
    </AppCard>
  );
}

function StatPill({ icon, label }: { icon: keyof typeof Feather.glyphMap; label: string }) {
  return (
    <View style={{ 
      flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.borderLight, 
      paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: 6, gap: Spacing.xs 
    }}>
      <Feather name={icon} size={11} color={Colors.textSecondary} />
      <AppText variant="caption" color="secondary">{label}</AppText>
    </View>
  );
}