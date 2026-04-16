import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { FloorPlanCard } from '../../../components/domain/FloorPlanCard';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Colors, Spacing } from '../../../constants/theme';

const MOCK_MAPS = [
  { id: '1', title: 'Level 1: Main Concourse', building: 'Rosebank Mall' },
  { id: '2', title: 'Level 2: Retail North', building: 'Rosebank Mall' },
  { id: '3', title: 'Ground Floor', building: 'Sandton City' },
  { id: '4', title: 'Basement Parking', building: 'Sandton City' },
  { id: '5', title: 'Terminal A: Gate 1-10', building: 'O.R. Tambo' },
];

export default function MapsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredMaps = MOCK_MAPS.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) || 
    m.building.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppScreen padded={false} scrollable={false}>
      <View style={{ padding: Spacing.xl, backgroundColor: Colors.white, borderBottomWidth: 3, borderBottomColor: Colors.black }}>
        <AppText variant="displaySm" style={{ marginBottom: Spacing.md }}>Site Explorer</AppText>
        <SearchInput 
          value={search} 
          onChangeText={setSearch} 
          placeholder="Filter by building or level..." 
        />
      </View>

      <FlatList
        data={filteredMaps}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: Spacing.xl }}
        contentContainerStyle={{ paddingVertical: Spacing.xl, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={{ width: '48%', marginBottom: Spacing.lg }}>
            <FloorPlanCard 
              title={item.title} 
              building={item.building} 
              onPress={() => router.push(`/staff/maps/${item.id}` as any)} 
            />
          </View>
        )}
      />
    </AppScreen>
  );
}