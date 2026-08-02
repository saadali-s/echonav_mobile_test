import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { FloorPlanCard } from '../../../components/maps/FloorPlanCard';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { SearchInput } from '../../../components/ui/SearchInput';
import { useAppAlert } from '../../../core/context/AlertContext';
import { useAuth } from '../../../core/context/AuthContext';
import { MapStudioAPI } from '../../../core/services/MapStudioAPI';

export default function MapsScreen() {
  const router = useRouter();
  const { orgId } = useAuth();
  const { showAlert } = useAppAlert();
  const { colorScheme } = useColorScheme();
  
  const [search, setSearch] = useState('');
  const [maps, setMaps] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAllMaps = async () => {
    if (!orgId) return;
    try {
      const buildings = await MapStudioAPI.getBuildings(orgId);
      
      const floorPlanPromises = buildings.map(async (b: any) => {
        const plans = await MapStudioAPI.getFloorPlans(b.id);
        return plans.map((p: any) => ({
          id: String(p.id),
          title: p.name || 'Unnamed Floor',
          building: b.name || 'Unknown Building'
        }));
      });

      const results = await Promise.all(floorPlanPromises);
      setMaps(results.flat());
    } catch (error: any) {
      showAlert("NETWORK ERROR", error.message || "Failed to load map directory.", "error");
    }
  };

  useEffect(() => {
    const initLoad = async () => {
      setIsLoading(true);
      await fetchAllMaps();
      setIsLoading(false);
    };
    initLoad();
  }, [orgId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllMaps();
    setIsRefreshing(false);
  };

  const filteredMaps = maps.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) || 
    m.building.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppScreen padded={false} scrollable={false}>
      <View className="p-5 bg-white dark:bg-zinc-950 border-b-[3px] border-black dark:border-zinc-800">
        <AppText variant="displaySm" className="mb-3">Site Explorer</AppText>
        <SearchInput 
          value={search} 
          onChangeText={setSearch} 
          placeholder="Filter by building or level..." 
        />
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#10b981' : '#000'} />
          <AppText variant="caption" color="muted" className="mt-4">DOWNLOADING VECTORS...</AppText>
        </View>
      ) : (
        <FlatList
          data={filteredMaps}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingVertical: 20, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#10b981" colors={['#10b981']} />}
          renderItem={({ item }) => (
            <View style={{ width: '48%', marginBottom: 16 }}>
              <FloorPlanCard 
                title={item.title} 
                building={item.building} 
                onPress={() => router.push(`/staff/maps/${item.id}` as any)} 
              />
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="items-center mt-[60px]">
              <AppText variant="body" color="muted">No maps uploaded for this organization.</AppText>
            </View>
          )}
        />
      )}
    </AppScreen>
  );
}