import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Brutalist, Colors, Spacing } from '../../constants/theme';
import { AppText } from '../ui/AppText';

export function StaffHeader({ name, onLogout }: { name: string; onLogout: () => void }) {
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <AppText variant="label" color="muted" style={styles.statusLabel}>SYSTEM_ONLINE</AppText>
          <AppText variant="displayMd" style={styles.stylishTitle}>EchoFleet</AppText>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => setShowNotifs(true)} style={styles.iconBtn}>
            <Feather name="bell" size={20} color={Colors.black} />
            <View style={styles.badge} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout} style={[styles.iconBtn, styles.powerBtn]}>
            <Feather name="log-out" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.operatorRow}>
        <Feather name="user" size={12} color={Colors.textSecondary} />
        <AppText variant="bodySm" color="secondary" style={{ marginLeft: 4 }}>
          OPERATOR: {name.toUpperCase()}
        </AppText>
      </View>

      {/* Modern Industrial Notification Modal */}
      <Modal visible={showNotifs} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowNotifs(false)}
        >
          <View style={[Brutalist.card, styles.notifCard]}>
            <AppText variant="titleMd">SYSTEM_ALERTS</AppText>
            <View style={styles.divider} />
            <View style={styles.notifItem}>
              <Feather name="alert-circle" size={16} color={Colors.dangerText} />
              <AppText variant="caption" style={{ marginLeft: 8 }}>BEACON #402: SIGNAL INTERFERENCE</AppText>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: Spacing.xl, 
    backgroundColor: Colors.white, 
    borderBottomWidth: 4, 
    borderBottomColor: Colors.black 
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  statusLabel: { letterSpacing: 2, marginBottom: -4 },
  stylishTitle: { fontWeight: '900', color: Colors.black, letterSpacing: -1 },
  operatorRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs },
  actions: { flexDirection: 'row', gap: Spacing.md },
  iconBtn: { 
    width: 46, height: 46, borderRadius: 14, 
    backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.black, 
    justifyContent: 'center', alignItems: 'center' 
  },
  powerBtn: { backgroundColor: Colors.black },
  badge: { 
    position: 'absolute', top: 10, right: 10, width: 10, height: 10, 
    borderRadius: 5, backgroundColor: Colors.dangerText, borderWidth: 1.5, borderColor: Colors.white 
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: Spacing.xl },
  notifCard: { padding: Spacing.xl, backgroundColor: Colors.white },
  divider: { height: 2, backgroundColor: Colors.black, marginVertical: Spacing.md },
  notifItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, backgroundColor: Colors.borderLight, borderRadius: 8 }
});