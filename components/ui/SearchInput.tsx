import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Brutalist, Colors, Spacing } from '../../constants/theme';

export function SearchInput({ value, onChangeText, placeholder = "Search..." }: any) {
  return (
    <View style={[Brutalist.inner, styles.container]}>
      <Feather name="search" size={18} color={Colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, height: 50 },
  input: { flex: 1, marginLeft: Spacing.sm, fontWeight: '700', color: Colors.black }
});