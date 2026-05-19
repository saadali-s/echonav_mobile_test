import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, View } from 'react-native';
import { Venue, VenueCard } from '../../components/VenueCard';
import { AccessModeToggle } from '../../components/domain/AccessModeToggle';
import { UserHeader } from '../../components/domain/UserHeader';
import { AppScreen } from '../../components/ui/AppScreen';
import { AppText } from '../../components/ui/AppText';
import { Colors, Spacing } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { MapStudioAPI } from '../../services/MapStudioAPI';

export default function UserMainScreen() {
  const router = useRouter();
  const { orgId, logout, isLoggedIn } = useAuth(); 
  
  const [venues, setVenues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessMode, setAccessMode] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');

  useEffect(() => {
    const fetchBuildings = async () => {
      if (!isLoggedIn) return;

      try {
        setIsLoading(true);
        let data;

        if (accessMode === 'PUBLIC') {
          data = await MapStudioAPI.getPublicBuildings();
        } else {
          if (!orgId) {
             setVenues([]); 
             return;
          }
          data = await MapStudioAPI.getBuildings(orgId);
        }
        
        const mappedVenues = data.map((b: any) => ({
          id: String(b.id),
          name: b.name || "Unnamed Venue",
          campus: b.address || "Main Campus",
          nodes: 0, 
          edges: 0,
          privacyLevel: b.privacyLevel || 'PUBLIC'
        }));
        
        setVenues(mappedVenues);
      } catch (error: any) {
        Alert.alert("Network Error", error.message || "Failed to load directory.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuildings();
  }, [orgId, accessMode, isLoggedIn]);

  const handleVenuePress = (venue: Venue) => {
    router.push('/navigate' as any);
  };

  // THE FIX: Explicit route call added to force view teardown
  const handleLogout = async () => {
    try {
      await logout(); 
      router.replace('/'); 
    } catch (error) {
      Alert.alert("Error", "Failed to sign out securely.");
    }
  };

  return (
    <AppScreen padded={false} style={{ backgroundColor: Colors.background }}>
      <UserHeader onLogout={handleLogout} />

      <View style={{ padding: Spacing.xl }}>
        <AppText variant="displaySm" style={{ marginBottom: Spacing.xs }}>Where to?</AppText>
        <AppText variant="bodySm" color="secondary" style={{ marginBottom: Spacing.xl }}>
          Select a destination to load the spatial routing matrix.
        </AppText>

        <AccessModeToggle activeMode={accessMode} onChange={setAccessMode} />

        <AppText variant="label" color="muted" style={{ marginBottom: Spacing.md, marginTop: Spacing.sm }}>
          AVAILABLE {accessMode} SITES
        </AppText>

        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.black} style={{ marginTop: Spacing.xxl }} />
        ) : venues.length === 0 ? (
          <AppText variant="bodySm" color="muted" center style={{ marginTop: Spacing.xl }}>
            {accessMode === 'PRIVATE' 
              ? "No private venues found. Ensure your account is linked to an organization." 
              : "No public venues currently available in your region."}
          </AppText>
        ) : (
          <FlatList
            data={venues}
            scrollEnabled={false} 
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: Spacing.md }}
            renderItem={({ item }) => (
              <VenueCard venue={item} onPress={() => handleVenuePress(item)} />
            )}
          />
        )}
      </View>
    </AppScreen>
  );
}