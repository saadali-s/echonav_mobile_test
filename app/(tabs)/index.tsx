import React from 'react';
import { FlatList, View } from 'react-native';
import { Venue, VenueCard } from '../../components/VenueCard';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppText } from '../../components/ui/AppText';
import { Spacing } from '../../constants/theme';

const MOCK_VENUES: Venue[] = [
  { id: '1', name: 'Rosebank Mall', campus: 'Rosebank, Johannesburg', nodes: 320, edges: 450 },
  { id: '2', name: 'Sandton City', campus: 'Sandton, Johannesburg', nodes: 512, edges: 768 },
  { id: '3', name: 'O.R. Tambo International', campus: 'Terminal A Departures', nodes: 210, edges: 305 },
  { id: '4', name: 'Gautrain Park Station', campus: 'Johannesburg CBD', nodes: 145, edges: 190 },
];

export default function PublicVenuesScreen() {
  const handleVenuePress = (venue: Venue) => {
    console.log(`Selected Venue: ${venue.name}`);
  };

  return (
    <AppScreen>
      <View style={{ marginBottom: Spacing.xxl }}>
        <AppText variant="displayMd">Select Destination</AppText>
        <AppText variant="bodySm" color="secondary">Choose a mapped venue to begin navigation.</AppText>
      </View>

      <FlatList
        data={MOCK_VENUES}
        scrollEnabled={false} // AppScreen handles scrolling
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VenueCard venue={item} onPress={() => handleVenuePress(item)} />
        )}
      />
    </AppScreen>
  );
}