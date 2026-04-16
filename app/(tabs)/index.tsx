import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Venue, VenueCard } from '../../components/VenueCard';

// Temporary Mock Data featuring real-world Johannesburg public venues
const MOCK_VENUES: Venue[] = [
  { id: '1', name: 'Rosebank Mall', campus: 'Rosebank, Johannesburg', nodes: 320, edges: 450 },
  { id: '2', name: 'Sandton City', campus: 'Sandton, Johannesburg', nodes: 512, edges: 768 },
  { id: '3', name: 'O.R. Tambo International', campus: 'Terminal A Departures', nodes: 210, edges: 305 },
  { id: '4', name: 'Gautrain Park Station', campus: 'Johannesburg CBD', nodes: 145, edges: 190 },
];

export default function PublicVenuesScreen() {
  const handleVenuePress = (venue: Venue) => {
    // In Phase E, this will trigger the Dijkstra route calculation
    console.log(`Selected Venue: ${venue.name}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_VENUES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Select Destination</Text>
            <Text style={styles.subtitle}>Choose a mapped venue to begin navigation.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <VenueCard venue={item} onPress={() => handleVenuePress(item)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#18181b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#71717a',
    marginTop: 4,
  },
});