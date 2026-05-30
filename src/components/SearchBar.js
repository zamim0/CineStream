// REQUISITO 1: JSX | REQUISITO 2: Componente reutilizável
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/theme';

const SearchBar = ({ value, onChangeText, onClear }) => (
  <View style={styles.bar}>
    <Ionicons name="search" size={20} color={COLORS.darkGray} style={{ marginRight: 10 }} />
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder="Buscar filmes e séries..."
      placeholderTextColor={COLORS.darkGray}
      selectionColor={COLORS.primary}
    />
    {value?.length > 0 && (
      <TouchableOpacity onPress={onClear}>
        <Ionicons name="close-circle" size={20} color={COLORS.darkGray} />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgInput, borderRadius: 8,
    marginHorizontal: 16, marginVertical: 12, paddingHorizontal: 14, height: 46,
  },
  input: { flex: 1, color: COLORS.white, fontSize: 15 },
});

export default React.memo(SearchBar);
