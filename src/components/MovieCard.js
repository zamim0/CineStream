// REQUISITO 1: JSX | REQUISITO 2: Componente reutilizável | REQUISITO 5: Hooks
import React, { useCallback } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '../services/api';
import { cardStyles as s } from '../styles/cardStyles';
import { COLORS } from '../styles/theme';

const MovieCard = ({ item, onPress }) => {
  const img = getImageUrl(item.poster_path, 'w342');
  const title = item.title || item.name || 'Sem título';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const year = (item.release_date || item.first_air_date || '').substring(0, 4);

  const handlePress = useCallback(() => onPress?.(item), [item, onPress]);

  return (
    <TouchableOpacity style={s.card} onPress={handlePress} activeOpacity={0.7}>
      {img ? (
        <Image source={{ uri: img }} style={s.image} />
      ) : (
        <View style={s.placeholder}>
          <Ionicons name="film-outline" size={30} color={COLORS.darkGray} />
        </View>
      )}
      <Text style={s.title} numberOfLines={2}>{title}</Text>
      <View style={s.ratingRow}>
        <Ionicons name="star" size={11} color={COLORS.star} />
        <Text style={s.ratingText}>{rating}</Text>
        {year ? <Text style={s.year}>{year}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(MovieCard);
