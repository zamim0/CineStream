// TELA 3 - DETALHES (com trailers do YouTube)
// REQUISITO 1: JSX | REQUISITO 3: Tela | REQUISITO 5: Hooks | REQUISITO 7/8: API+Axios
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity, FlatList,
  Linking, StyleSheet,
} from 'react-native';
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

  // Abrir trailer no YouTube
  const handlePlayTrailer = useCallback(() => {
    if (!detail) return;

    const videos = detail.videos?.results || [];
    // Procura trailer oficial em PT-BR ou EN
    const trailer =
      videos.find(v => v.type === 'Trailer' && v.site === 'YouTube' && v.official) ||
      videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
      videos.find(v => v.site === 'YouTube');

    if (trailer) {
      const url = `https://www.youtube.com/watch?v=${trailer.key}`;
      Linking.openURL(url);
    } else {
      // Se não tem trailer na API, busca no YouTube pelo nome
      const title = detail.title || detail.name;
      const searchQuery = encodeURIComponent(`${title} trailer oficial legendado`);
      const url = `https://www.youtube.com/results?search_query=${searchQuery}`;
      Linking.openURL(url);
    }
  }, [detail]);

  if (loading) return <Loading />;
  if (!detail) return <View style={{ flex: 1, backgroundColor: COLORS.bg }} />;

  const title = detail.title || detail.name;
  const year = (detail.release_date || detail.first_air_date || '').substring(0, 4);
  const rating = detail.vote_average ? detail.vote_average.toFixed(1) : 'N/A';
  const runtime = detail.runtime ? `${Math.floor(detail.runtime / 60)}h ${detail.runtime % 60}min` : null;
  const cast = detail.credits?.cast?.slice(0, 10) || [];
  const similar = detail.similar?.results?.slice(0, 10) || [];
  const isFav = isFavorite(detail.id);
  const videos = detail.videos?.results?.filter(v => v.site === 'YouTube') || [];
  const trailers = videos.filter(v => v.type === 'Trailer');
  const teasers = videos.filter(v => v.type === 'Teaser');
  const allVideos = [...trailers, ...teasers].slice(0, 5);

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

        {/* Botão Assistir Trailer */}
        <TouchableOpacity style={t.trailerBtn} onPress={handlePlayTrailer}>
          <Ionicons name="play" size={22} color={COLORS.white} />
          <Text style={t.trailerBtnText}>Assistir Trailer</Text>
          <Ionicons name="logo-youtube" size={20} color="#FF0000" />
        </TouchableOpacity>

        {/* Botão Favorito */}
        <TouchableOpacity
          style={[s.watchBtn, { backgroundColor: isFav ? COLORS.primary : COLORS.bgCard, marginTop: 8 }]}
          onPress={handleFav}
        >
          <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={COLORS.white} />
          <Text style={s.watchBtnText}>{isFav ? 'Remover da Lista' : 'Adicionar à Lista'}</Text>
        </TouchableOpacity>

        {/* Lista de vídeos/trailers disponíveis */}
        {allVideos.length > 0 && (
          <>
            <Text style={s.section}>🎬 Vídeos Disponíveis</Text>
            {allVideos.map((video) => (
              <TouchableOpacity
                key={video.id}
                style={t.videoItem}
                onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.key}`)}
                activeOpacity={0.7}
              >
                {/* Thumbnail do YouTube */}
                <View style={t.thumbWrap}>
                  <Image
                    source={{ uri: `https://img.youtube.com/vi/${video.key}/mqdefault.jpg` }}
                    style={t.thumb}
                    resizeMode="cover"
                  />
                  <View style={t.playOverlay}>
                    <Ionicons name="play-circle" size={36} color="rgba(255,255,255,0.9)" />
                  </View>
                </View>
                <View style={t.videoInfo}>
                  <Text style={t.videoTitle} numberOfLines={2}>{video.name}</Text>
                  <View style={t.videoMeta}>
                    <View style={[t.typeBadge, video.type === 'Teaser' && { backgroundColor: '#F39C12' }]}>
                      <Text style={t.typeBadgeText}>{video.type}</Text>
                    </View>
                    <Ionicons name="logo-youtube" size={14} color="#FF0000" />
                    <Text style={t.videoLang}>{video.iso_639_1?.toUpperCase()}</Text>
                  </View>
                </View>
                <Ionicons name="open-outline" size={18} color={COLORS.darkGray} />
              </TouchableOpacity>
            ))}
          </>
        )}

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

const t = StyleSheet.create({
  trailerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 8,
    marginTop: 16, gap: 10,
  },
  trailerBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },

  videoItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: 10, marginBottom: 10,
    padding: 8, gap: 10, borderWidth: 1, borderColor: COLORS.border,
  },
  thumbWrap: { position: 'relative' },
  thumb: { width: 140, height: 80, borderRadius: 6, backgroundColor: COLORS.bgInput },
  playOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 6,
  },
  videoInfo: { flex: 1 },
  videoTitle: { color: COLORS.white, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  videoMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  typeBadge: {
    backgroundColor: COLORS.primary, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4,
  },
  typeBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
  videoLang: { color: COLORS.darkGray, fontSize: 11 },
});

export default DetailsScreen;
