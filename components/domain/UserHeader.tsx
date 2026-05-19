import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { AppText } from '../ui/AppText';

export function UserHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <View style={styles.iconBox}>
          <Feather name="navigation" size={18} color={Colors.white} />
        </View>
        <AppText variant="titleLg" style={styles.title}>EchoNav</AppText>
      </View>

      <TouchableOpacity onPress={onLogout} style={styles.logoutBtn} activeOpacity={0.7}>
        <Feather name="log-out" size={16} color={Colors.black} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl + Spacing.sm, // Accounts for mobile status bar
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconBox: { 
    width: 32, 
    height: 32, 
    borderRadius: 8, 
    backgroundColor: Colors.black, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: { fontWeight: '900', letterSpacing: -0.5 },
  logoutBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: Colors.surface, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: Colors.borderStrong 
  }
});