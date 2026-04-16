import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { AppCard } from '../../../components/ui/AppCard';
import { AppScreen } from '../../../components/ui/AppScreen';
import { AppText } from '../../../components/ui/AppText';
import { Brutalist, Colors, Spacing } from '../../../constants/theme';

export default function SettingsScreen() {
  return (
    <AppScreen padded={false}>
      <View style={{ padding: Spacing.xl, borderBottomWidth: 3, borderBottomColor: Colors.black }}>
        <AppText variant="displaySm">Terminal Settings</AppText>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.xl, gap: Spacing.lg }}>
        <AppText variant="label" color="muted">Hardware & Local Data</AppText>
        <SettingItem icon="bluetooth" label="BLE Radio Calibration" value="Active (-65dBm)" />
        <SettingItem icon="database" label="Clear Offline Map Cache" value="14.2 MB" />
        <SettingItem icon="refresh-cw" label="Force Full Sync" />

        <View style={{ height: 2, backgroundColor: Colors.border, marginVertical: Spacing.md }} />

        <AppText variant="label" color="muted">Account Authority</AppText>
        <SettingItem icon="user" label="Operator Profile" value="Thabo Nkosi" />
        <SettingItem icon="shield" label="Administrative Key" value="**** 4022" />
        
        <TouchableOpacity style={{ marginTop: Spacing.xxl }}>
           <AppCard variant="danger" style={{ alignItems: 'center' }}>
              <AppText variant="titleMd" color="inverse">REVOKE LOCAL AUTHORIZATION</AppText>
           </AppCard>
        </TouchableOpacity>
      </ScrollView>
    </AppScreen>
  );
}

function SettingItem({ icon, label, value }: any) {
  return (
    <TouchableOpacity style={[Brutalist.card, { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 4 }]}>
      <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: Colors.borderLight, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.black }}>
        <Feather name={icon} size={18} color={Colors.black} />
      </View>
      <View style={{ flex: 1, marginLeft: Spacing.md }}>
        <AppText variant="titleSm">{label}</AppText>
        {value && <AppText variant="caption" color="secondary">{value}</AppText>}
      </View>
      <Feather name="chevron-right" size={20} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}