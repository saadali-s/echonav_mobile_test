import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Brutalist, Colors, Radii, Spacing } from '../../constants/theme';
import { AppText } from '../ui/AppText';

export function StaffIdentityBar({ name, onLogout }: { name: string; onLogout: () => void }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <View style={[Brutalist.card, styles.container]}>
      <View style={styles.avatar}>
        <AppText variant="titleMd" color="inverse">{initials}</AppText>
      </View>
      <View style={styles.textWrap}>
        <AppText variant="caption" color="secondary">AUTHORIZED STAFF</AppText>
        <AppText variant="titleMd">{name}</AppText>
      </View>
      <TouchableOpacity onPress={onLogout} style={styles.logoutButton} activeOpacity={0.7}>
        <Feather name="log-out" size={16} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: Spacing.md, 
    marginBottom: Spacing.xl,
    backgroundColor: Colors.white 
  },
  avatar: { 
    width: 48, 
    height: 48, 
    borderRadius: Radii.md, 
    backgroundColor: Colors.black, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.white
  },
  textWrap: { flex: 1, marginLeft: Spacing.md },
  logoutButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: Colors.dangerText, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.black
  },
});