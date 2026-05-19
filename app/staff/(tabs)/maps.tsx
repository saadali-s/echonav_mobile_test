import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, View } from 'react-native';
import { FloorPlanCard } from '../../../components/domain/FloorPlanCard';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Colors, Spacing } from '../../../constants/theme';
import { useAuth } from '../../../context/AuthContext';
import { MapStudioAPI } from '../../../services/MapStudioAPI';

export default function MapsScreen() {
  const router = useRouter();
  const { orgId } = useAuth();
  
  const [search, setSearch] = useState('');
  const [maps, setMaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // THE FIX: Fetch buildings, then flatten all associated floor plans for the explorer view
  useEffect(() => {
    const fetchAllMaps = async () => {
      if (!orgId) return;
      try {
        setIsLoading(true);
        const buildings = await MapStudioAPI.getBuildings(orgId);
        
        let allFloorPlans: any[] = [];
        
        // Fetch floor plans for every building concurrently
        const floorPlanPromises = buildings.map(async (b: any) => {
          const plans = await MapStudioAPI.getFloorPlans(b.id);
          return plans.map((p: any) => ({
            id: String(p.id),
            title: p.name || 'Unnamed Floor',
            building: b.name || 'Unknown Building'
          }));
        });

        const results = await Promise.all(floorPlanPromises);
        allFloorPlans = results.flat();
        
        setMaps(allFloorPlans);
      } catch (error: any) {
        Alert.alert("Network Error", error.message || "Failed to load map directory.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMaps();
  }, [orgId]);

  const filteredMaps = maps.filter(m => 
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

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.black} />
          <AppText variant="caption" color="muted" style={{ marginTop: Spacing.md }}>DOWNLOADING VECTORS...</AppText>
        </View>
      ) : (
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
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <AppText variant="body" color="muted">No maps uploaded for this organization.</AppText>
            </View>
          )}
        />
      )}
    </AppScreen>
  );
}