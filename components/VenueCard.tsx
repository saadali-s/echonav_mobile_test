import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Venue {
  id: string;
  name: string;
  campus: string;
  nodes: number;
  edges: number;
}

interface VenueCardProps {
  venue: Venue;
  onPress: () => void;
}

export function VenueCard({ venue, onPress }: VenueCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      <View style={styles.iconContainer}>
        <Feather name="map" size={24} color="#18181b" />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{venue.name}</Text>
        <Text style={styles.campus}>{venue.campus}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBadge}>
            <Feather name="map-pin" size={12} color="#71717a" />
            <Text style={styles.statText}>{venue.nodes} Nodes</Text>
          </View>
          <View style={styles.statBadge}>
            <Feather name="git-commit" size={12} color="#71717a" />
            <Text style={styles.statText}>{venue.edges} Edges</Text>
          </View>
        </View>
      </View>

      <View style={styles.arrowContainer}>
        <Feather name="chevron-right" size={20} color="#a1a1aa" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#18181b',
    borderBottomWidth: 6,
    borderRightWidth: 4,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#f4f4f5',
    borderWidth: 2,
    borderColor: '#18181b',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#18181b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  campus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#71717a',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#52525b',
    textTransform: 'uppercase',
  },
  arrowContainer: {
    paddingLeft: 8,
  },
});