// TELA 3 - DETALHES
// REQUISITO 1: JSX | REQUISITO 3: Tela | REQUISITO 5: Hooks | REQUISITO 7/8: API+Axios
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { useFavorites } from '../navigation/FavoritesContext';
import { getMovieDetails, getSeriesDetails, getImageUrl } from '../services/api';
import { detailStyles as s } from '../styles/cardStyles';
import { COLORS } from '../styles/theme';

const DetailsScreen = ({ route, navigation }) => {
  const { id, mediaType } = route.params;
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = mediaType === 'tv' ? await getSeriesDetails(id) : await getMovieDetails(id);
        setDetail(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [id, mediaType]);

  const handleFav = useCallback(() => {
    if (!detail) return;
    toggleFavorite({
      id: detail.id, title: detail.title || detail.name,
      poster_path: detail.poster_path, vote_average: detail.vote_average,
      release_date: detail.release_date || detail.first_air_date, media_type: mediaType,
    });
  }, [detail, toggleFavorite, mediaType]);

  const goToRelated = useCallback((item) => {
    navigation.push('Details', { id: item.id, mediaType });
  }, [navigation, mediaType]);

  if (loading) return <Loading />;
  if (!detail) return <View style={{ flex: 1, backgroundColor: COLORS.bg }} />;

  const title = detail.title || detail.name;
  const year = (detail.release_date || detail.first_air_date || '').substring(0, 4);
  const rating = detail.vote_average ? detail.vote_average.toFixed(1) : 'N/A';
  const runtime = detail.runtime ? `${Math.floor(detail.runtime / 60)}h ${detail.runtime % 60}min` : null;
  const cast = detail.credits?.cast?.slice(0, 10) || [];
  const similar = detail.similar?.results?.slice(0, 10) || [];
  const isFav = isFavorite(detail.id);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} showsVerticalScrollIndicator={false}>
      {/* Backdrop */}
      <View>
        <Image source={{ uri: getImageUrl(detail.backdrop_path, 'w780') }} style={s.backdrop} />
        <LinearGradient colors={['transparent', COLORS.bg]} style={s.gradient} />
      </View>

      {/* Voltar */}
      <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={COLORS.white} />
      </TouchableOpacity>

      <View style={s.content}>
        {/* Poster + Info */}
        <View style={s.row}>
          <Image source={{ uri: getImageUrl(detail.poster_path, 'w342') }} style={s.poster} />
          <View style={s.headerInfo}>
            <Text style={s.titleText}>{title}</Text>
            <View style={s.metaRow}>
              <View style={s.ratingBadge}>
                <Ionicons name="star" size={13} color={COLORS.star} />
                <Text style={s.ratingVal}>{rating}</Text>
              </View>
              {year ? <Text style={s.metaText}>{year}</Text> : null}
              {runtime ? <Text style={s.metaText}>{runtime}</Text> : null}
            </View>
          </View>
        </View>

        {/* Gêneros */}
        {detail.genres?.length > 0 && (
          <View style={s.genresRow}>
            {detail.genres.map((g) => (
              <View key={g.id} style={s.genreTag}>
                <Text style={s.genreText}>{g.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Botão Assistir + Favorito */}
        <TouchableOpacity style={s.watchBtn} onPress={() => Alert.alert('▶ Reproduzindo', `${title}\n\nEm um app real, aqui abriria o player.`)}>
          <Ionicons name="play" size={20} color={COLORS.white} />
          <Text style={s.watchBtnText}>Assistir Agora</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.watchBtn, { backgroundColor: isFav ? COLORS.primary : COLORS.bgCard, marginTop: 8 }]}
          onPress={handleFav}
        >
          <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={COLORS.white} />
          <Text style={s.watchBtnText}>{isFav ? 'Remover da Lista' : 'Adicionar à Lista'}</Text>
        </TouchableOpacity>

        {/* Sinopse */}
        {detail.overview ? (
          <>
            <Text style={s.section}>Sinopse</Text>
            <Text style={s.overview}>{detail.overview}</Text>
          </>
        ) : null}

        {/* Elenco */}
        {cast.length > 0 && (
          <>
            <Text style={s.section}>Elenco</Text>
            <FlatList
              data={cast}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `c-${item.id}`}
              renderItem={({ item }) => (
                <View style={s.castItem}>
                  {item.profile_path ? (
                    <Image source={{ uri: getImageUrl(item.profile_path, 'w185') }} style={s.castImg} />
                  ) : (
                    <View style={[s.castImg, { justifyContent: 'center', alignItems: 'center' }]}>
                      <Ionicons name="person" size={24} color={COLORS.darkGray} />
                    </View>
                  )}
                  <Text style={s.castName} numberOfLines={2}>{item.name}</Text>
                  <Text style={s.castChar} numberOfLines={1}>{item.character}</Text>
                </View>
              )}
            />
          </>
        )}

        {/* Similares */}
        {similar.length > 0 && (
          <>
            <Text style={s.section}>Títulos Similares</Text>
            <FlatList
              data={similar}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `sim-${item.id}`}
              renderItem={({ item }) => <MovieCard item={item} onPress={goToRelated} />}
            />
          </>
        )}

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
};

export default DetailsScreen;
