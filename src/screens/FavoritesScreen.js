// TELA 4 - FAVORITOS
// REQUISITO 1: JSX | REQUISITO 3: Tela | REQUISITO 5: Hooks (useContext)
import React, { useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../navigation/FavoritesContext';
import { getImageUrl } from '../services/api';
import { COLORS } from '../styles/theme';

const FavoritesScreen = ({ navigation }) => {
  const { favorites, toggleFavorite } = useFavorites();

  const goToDetail = useCallback((item) => {
    navigation.navigate('HomeTab', {
      screen: 'Details',
      params: { id: item.id, mediaType: item.media_type || 'movie' },
    });
  }, [navigation]);

  const renderItem = ({ item }) => {
    const img = getImageUrl(item.poster_path, 'w185');
    const year = (item.release_date || '').substring(0, 4);
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', backgroundColor: COLORS.bgCard, borderRadius: 8, marginBottom: 12, overflow: 'hidden' }}
        onPress={() => goToDetail(item)}
      >
        {img ? (
          <Image source={{ uri: img }} style={{ width: 85, height: 128 }} />
        ) : (
          <View style={{ width: 85, height: 128, backgroundColor: COLORS.bgInput, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="film-outline" size={28} color={COLORS.darkGray} />
          </View>
        )}
        <View style={{ flex: 1, padding: 12, justifyContent: 'center' }}>
          <Text style={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }} numberOfLines={2}>{item.title}</Text>
          <Text style={{ color: COLORS.darkGray, fontSize: 12, marginTop: 4 }}>
            {item.media_type === 'tv' ? '📺 Série' : '🎬 Filme'} {year ? `• ${year}` : ''}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 }}>
            <Ionicons name="star" size={12} color={COLORS.star} />
            <Text style={{ color: COLORS.star, fontSize: 12, fontWeight: 'bold' }}>{rating}</Text>
          </View>
        </View>
        <TouchableOpacity style={{ justifyContent: 'center', paddingHorizontal: 14 }} onPress={() => toggleFavorite(item)}>
          <Ionicons name="heart-dislike" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" />
      <View style={{ paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16 }}>
        <Text style={{ color: COLORS.white, fontSize: 28, fontWeight: 'bold' }}>❤️ Minha Lista</Text>
        <Text style={{ color: COLORS.darkGray, fontSize: 13, marginTop: 4 }}>
          {favorites.length} {favorites.length === 1 ? 'título salvo' : 'títulos salvos'}
        </Text>
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => `fav-${item.id}`}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="heart-outline" size={70} color={COLORS.darkGray} />
          <Text style={{ color: COLORS.darkGray, fontSize: 18, fontWeight: '600', marginTop: 16 }}>
            Sua lista está vazia
          </Text>
          <Text style={{ color: '#444', fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }}>
            Adicione filmes e séries para encontrá-los aqui
          </Text>
        </View>
      )}
    </View>
  );
};

export default FavoritesScreen;
