// REQUISITO 1: JSX | REQUISITO 2: Componente reutilizável
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import MovieCard from './MovieCard';
import { baseStyles } from '../styles/theme';

const Section = ({ title, data, onPressItem }) => {
  if (!data || data.length === 0) return null;
  return (
    <View>
      <Text style={baseStyles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <MovieCard item={item} onPress={onPressItem} />}
        keyExtractor={(item) => `${title}-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
};

export default React.memo(Section);
