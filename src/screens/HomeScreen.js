// TELA 1 - HOME (Visual Netflix/Letterboxd)
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ScrollView, View, Text, Image, TouchableOpacity, StatusBar,
  FlatList, Dimensions, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Loading from '../components/Loading';
import { useFavorites } from '../navigation/FavoritesContext';
import {
  getTrendingMovies, getPopularMovies, getTopRatedMovies,
  getNowPlayingMovies, getPopularSeries, getTopRatedSeries, getImageUrl,
} from '../services/api';
import { COLORS, SIZES } from '../styles/theme';

const { width } = Dimensions.get('window');
const CARD_W = width * 0.36;
const CARD_H = CARD_W * 1.5;

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerRef = useRef(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const load = async () => {
      try {
        const [trending, popular, topRated, nowPlaying, series, topSeries] = await Promise.all([
          getTrendingMovies(), getPopularMovies(), getTopRatedMovies(),
          getNowPlayingMovies(), getPopularSeries(), getTopRatedSeries(),
        ]);
        setData({ trending, popular, topRated, nowPlaying, series, topSeries });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  // Auto-scroll banner
  useEffect(() => {
    if (!data.trending?.length) return;
    const timer = setInterval(() => {
      setBannerIndex(prev => {
        const next = (prev + 1) % Math.min(data.trending.length, 6);
        try { bannerRef.current?.scrollToIndex({ index: next, animated: true }); } catch {}
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [data.trending]);

  const goToDetail = useCallback((item) => {
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    navigation.navigate('Details', { id: item.id, mediaType: type });
  }, [navigation]);

  const handleFav = useCallback((item) => {
    toggleFavorite({
      id: item.id,
      title: item.title || item.name,
      poster_path: item.poster_path,
      vote_average: item.vote_average,
      release_date: item.release_date || item.first_air_date,
      media_type: item.media_type || (item.title ? 'movie' : 'tv'),
    });
  }, [toggleFavorite]);

  if (loading) return <Loading text="Carregando CineStream..." />;

  const bannerMovies = (data.trending || []).slice(0, 6);

  // Componente de card com descrição e favorito (estilo Letterboxd)
  const MovieCardFull = ({ item }) => {
    const img = getImageUrl(item.poster_path, 'w342');
    const rating = item.vote_average?.toFixed(1) || 'N/A';
    const year = (item.release_date || item.first_air_date || '').substring(0, 4);
    const fav = isFavorite(item.id);
    return (
      <TouchableOpacity style={st.card} onPress={() => goToDetail(item)} activeOpacity={0.8}>
        <View>
          {img ? (
            <Image source={{ uri: img }} style={st.cardImg} resizeMode="cover" />
          ) : (
            <View style={[st.cardImg, { justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="film-outline" size={30} color={COLORS.darkGray} />
            </View>
          )}
          {/* Botão favorito */}
          <TouchableOpacity
            style={st.favBtn}
            onPress={() => handleFav(item)}
          >
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={18} color={fav ? COLORS.primary : COLORS.white} />
          </TouchableOpacity>
          {/* Badge de nota */}
          <View style={st.ratingBadge}>
            <Ionicons name="star" size={10} color={COLORS.star} />
            <Text style={st.ratingBadgeText}>{rating}</Text>
          </View>
        </View>
        <Text style={st.cardTitle} numberOfLines={1}>{item.title || item.name}</Text>
        <Text style={st.cardYear}>{year}</Text>
        <Text style={st.cardDesc} numberOfLines={3}>{item.overview || 'Sem descrição disponível.'}</Text>
      </TouchableOpacity>
    );
  };

  // Card largo horizontal com descrição (estilo Letterboxd)
  const WideCard = ({ item }) => {
    const img = getImageUrl(item.backdrop_path, 'w780');
    const poster = getImageUrl(item.poster_path, 'w185');
    const rating = item.vote_average?.toFixed(1) || 'N/A';
    const year = (item.release_date || item.first_air_date || '').substring(0, 4);
    const fav = isFavorite(item.id);
    return (
      <TouchableOpacity style={st.wideCard} onPress={() => goToDetail(item)} activeOpacity={0.85}>
        {img ? (
          <Image source={{ uri: img }} style={st.wideImg} resizeMode="cover" />
        ) : (
          <View style={[st.wideImg, { backgroundColor: COLORS.bgCard }]} />
        )}
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.95)']} style={st.wideGradient}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {poster && <Image source={{ uri: poster }} style={st.widePoster} resizeMode="cover" />}
            <View style={{ flex: 1 }}>
              <Text style={st.wideTitle} numberOfLines={2}>{item.title || item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <Ionicons name="star" size={13} color={COLORS.star} />
                <Text style={{ color: COLORS.star, fontWeight: 'bold', fontSize: 13 }}>{rating}</Text>
                <Text style={{ color: COLORS.darkGray, fontSize: 12 }}>•</Text>
                <Text style={{ color: COLORS.gray, fontSize: 12 }}>{year}</Text>
              </View>
              <Text style={st.wideDesc} numberOfLines={3}>{item.overview || 'Sem descrição.'}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 10, gap: 8 }}>
            <TouchableOpacity style={st.widePlayBtn} onPress={() => goToDetail(item)}>
              <Ionicons name="play" size={16} color={COLORS.white} />
              <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 13 }}>Assistir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={st.wideFavBtn} onPress={() => handleFav(item)}>
              <Ionicons name={fav ? 'heart' : 'heart-outline'} size={16} color={fav ? COLORS.primary : COLORS.white} />
              <Text style={{ color: COLORS.white, fontSize: 13 }}>{fav ? 'Na Lista' : 'Minha Lista'}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Seção horizontal com cards + descrição
  const SectionFull = ({ title, items }) => {
    if (!items?.length) return null;
    return (
      <View>
        <Text style={st.sectionTitle}>{title}</Text>
        <FlatList
          data={items}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          keyExtractor={(item) => `${title}-${item.id}`}
          renderItem={({ item }) => <MovieCardFull item={item} />}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ===== HEADER ===== */}
        <View style={st.header}>
          <Text style={st.logo}>CINESTREAM</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SearchTab')}>
            <Ionicons name="search" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* ===== BANNER PRINCIPAL ===== */}
        {bannerMovies.length > 0 && (
          <View>
            <FlatList
              ref={bannerRef}
              data={bannerMovies}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `ban-${item.id}`}
              onMomentumScrollEnd={(e) => setBannerIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
              getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
              renderItem={({ item }) => {
                const fav = isFavorite(item.id);
                const rating = item.vote_average?.toFixed(1) || 'N/A';
                const year = (item.release_date || item.first_air_date || '').substring(0, 4);
                return (
                  <TouchableOpacity activeOpacity={1} onPress={() => goToDetail(item)} style={{ width }}>
                    <Image source={{ uri: getImageUrl(item.backdrop_path, 'w780') }} style={{ width, height: 500 }} resizeMode="cover" />
                    <LinearGradient
                      colors={['transparent', 'rgba(13,13,13,0.5)', 'rgba(13,13,13,0.9)', COLORS.bg]}
                      style={st.bannerGradient}
                    >
                      <View style={st.bannerBadgeRow}>
                        <View style={st.bannerBadge}>
                          <Text style={st.bannerBadgeText}>EM DESTAQUE</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons name="star" size={13} color={COLORS.star} />
                          <Text style={{ color: COLORS.star, fontWeight: 'bold', fontSize: 14 }}>{rating}</Text>
                        </View>
                        <Text style={{ color: COLORS.darkGray }}>•</Text>
                        <Text style={{ color: COLORS.gray, fontSize: 13 }}>{year}</Text>
                      </View>
                      <Text style={st.bannerTitle} numberOfLines={2}>{item.title || item.name}</Text>
                      <Text style={st.bannerDesc} numberOfLines={4}>{item.overview}</Text>
                      <View style={st.bannerBtnRow}>
                        <TouchableOpacity style={st.bannerPlayBtn} onPress={() => goToDetail(item)}>
                          <Ionicons name="play" size={20} color={COLORS.white} />
                          <Text style={st.bannerPlayText}>Assistir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={st.bannerInfoBtn} onPress={() => goToDetail(item)}>
                          <Ionicons name="information-circle-outline" size={20} color={COLORS.white} />
                          <Text style={st.bannerInfoText}>Detalhes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={st.bannerFavBtn} onPress={() => handleFav(item)}>
                          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? COLORS.primary : COLORS.white} />
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }}
            />
            {/* Dots */}
            <View style={st.dotsRow}>
              {bannerMovies.map((_, i) => (
                <View key={i} style={[st.dot, i === bannerIndex && st.dotActive]} />
              ))}
            </View>
          </View>
        )}

        {/* ===== FILMES ===== */}
        <SectionFull title="🔥 Em Alta Agora" items={data.trending} />
        <SectionFull title="🎬 Em Cartaz nos Cinemas" items={data.nowPlaying} />

        {/* ===== DESTAQUE LARGO 1 ===== */}
        {data.topRated?.[0] && <WideCard item={data.topRated[0]} />}

        <SectionFull title="⭐ Mais Bem Avaliados" items={data.topRated} />

        {/* ===== DESTAQUE LARGO 2 ===== */}
        {data.popular?.[2] && <WideCard item={data.popular[2]} />}

        <SectionFull title="🍿 Filmes Populares" items={data.popular} />

        {/* ===== TOP 10 ===== */}
        <Text style={st.sectionTitle}>🏆 Top 10 da Semana</Text>
        <FlatList
          data={(data.trending || []).slice(0, 10)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          keyExtractor={(item) => `top-${item.id}`}
          renderItem={({ item, index }) => {
            const img = getImageUrl(item.poster_path, 'w342');
            const rating = item.vote_average?.toFixed(1) || '';
            const fav = isFavorite(item.id);
            return (
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'flex-end', marginRight: 4 }} onPress={() => goToDetail(item)}>
                <Text style={st.topNumber}>{index + 1}</Text>
                <View>
                  <Image source={{ uri: img }} style={st.topImg} resizeMode="cover" />
                  <TouchableOpacity style={[st.favBtn, { top: 4, right: 4 }]} onPress={() => handleFav(item)}>
                    <Ionicons name={fav ? 'heart' : 'heart-outline'} size={16} color={fav ? COLORS.primary : COLORS.white} />
                  </TouchableOpacity>
                  <View style={[st.ratingBadge, { bottom: 4, left: 4 }]}>
                    <Ionicons name="star" size={9} color={COLORS.star} />
                    <Text style={st.ratingBadgeText}>{rating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {/* ===== SÉRIES ===== */}
        <SectionFull title="📺 Séries Populares" items={data.series} />

        {/* ===== DESTAQUE LARGO SÉRIE ===== */}
        {data.series?.[1] && <WideCard item={data.series[1]} />}

        <SectionFull title="📺 Séries Mais Bem Avaliadas" items={data.topSeries} />

        {/* ===== GRID LANÇAMENTOS ===== */}
        <Text style={st.sectionTitle}>🆕 Lançamentos Recentes</Text>
        <View style={st.grid}>
          {(data.nowPlaying || []).slice(0, 6).map((item) => {
            const img = getImageUrl(item.poster_path, 'w342');
            const rating = item.vote_average?.toFixed(1) || '';
            const year = (item.release_date || '').substring(0, 4);
            const fav = isFavorite(item.id);
            const gw = (width - 48) / 3;
            return (
              <TouchableOpacity key={`g-${item.id}`} style={{ width: gw, marginBottom: 16 }} onPress={() => goToDetail(item)}>
                <View>
                  <Image source={{ uri: img }} style={{ width: gw, height: gw * 1.5, borderRadius: 8, backgroundColor: COLORS.bgCard }} resizeMode="cover" />
                  <TouchableOpacity style={[st.favBtn, { top: 4, right: 4, width: 28, height: 28 }]} onPress={() => handleFav(item)}>
                    <Ionicons name={fav ? 'heart' : 'heart-outline'} size={14} color={fav ? COLORS.primary : COLORS.white} />
                  </TouchableOpacity>
                  <View style={[st.ratingBadge, { bottom: 4, left: 4 }]}>
                    <Ionicons name="star" size={9} color={COLORS.star} />
                    <Text style={st.ratingBadgeText}>{rating}</Text>
                  </View>
                </View>
                <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: '600', marginTop: 4 }} numberOfLines={1}>{item.title || item.name}</Text>
                <Text style={{ color: COLORS.darkGray, fontSize: 10 }}>{year}</Text>
                <Text style={{ color: COLORS.gray, fontSize: 10, marginTop: 2, lineHeight: 14 }} numberOfLines={2}>{item.overview}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const st = StyleSheet.create({
  // Header
  header: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 48, paddingHorizontal: 16, paddingBottom: 10,
    backgroundColor: 'rgba(13,13,13,0.6)',
  },
  logo: { color: COLORS.primary, fontSize: 22, fontWeight: '900', letterSpacing: 2 },

  // Banner
  bannerGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 320,
    justifyContent: 'flex-end', padding: 16,
  },
  bannerBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  bannerBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  bannerBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  bannerTitle: {
    color: COLORS.white, fontSize: 30, fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 6,
  },
  bannerDesc: { color: COLORS.gray, fontSize: 13, lineHeight: 20, marginTop: 8 },
  bannerBtnRow: { flexDirection: 'row', marginTop: 14, gap: 10, alignItems: 'center' },
  bannerPlayBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, paddingVertical: 13, borderRadius: 8, gap: 8,
  },
  bannerPlayText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  bannerInfoBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)', paddingVertical: 13, borderRadius: 8, gap: 8,
  },
  bannerInfoText: { color: COLORS.white, fontWeight: '600', fontSize: 16 },
  bannerFavBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center',
  },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.darkGray },
  dotActive: { width: 22, backgroundColor: COLORS.primary },

  // Section
  sectionTitle: {
    fontSize: 19, fontWeight: 'bold', color: COLORS.white,
    marginLeft: 16, marginTop: 24, marginBottom: 12,
  },

  // Card com descrição
  card: { width: CARD_W, marginRight: 14 },
  cardImg: { width: CARD_W, height: CARD_H, borderRadius: 10, backgroundColor: COLORS.bgCard },
  cardTitle: { color: COLORS.white, fontSize: 13, fontWeight: '700', marginTop: 8 },
  cardYear: { color: COLORS.darkGray, fontSize: 11, marginTop: 2 },
  cardDesc: { color: COLORS.gray, fontSize: 11, lineHeight: 15, marginTop: 4 },
  favBtn: {
    position: 'absolute', top: 6, right: 6, width: 32, height: 32,
    borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute', bottom: 6, left: 6, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, gap: 3,
  },
  ratingBadgeText: { color: COLORS.star, fontSize: 11, fontWeight: 'bold' },

  // Wide card
  wideCard: { marginHorizontal: 16, marginTop: 24, borderRadius: 12, overflow: 'hidden' },
  wideImg: { width: width - 32, height: 220 },
  wideGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
    justifyContent: 'flex-end', padding: 14,
  },
  widePoster: { width: 60, height: 90, borderRadius: 6 },
  wideTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  wideDesc: { color: COLORS.gray, fontSize: 12, lineHeight: 17, marginTop: 4 },
  widePlayBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, paddingVertical: 9, borderRadius: 6, gap: 6,
  },
  wideFavBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)', paddingVertical: 9, borderRadius: 6, gap: 6,
  },

  // Top 10
  topNumber: {
    color: 'rgba(255,255,255,0.08)', fontSize: 90, fontWeight: '900',
    lineHeight: 95, marginRight: -14, zIndex: 1,
    textShadowColor: COLORS.border, textShadowOffset: { width: 2, height: 0 }, textShadowRadius: 1,
  },
  topImg: { width: CARD_W * 0.85, height: CARD_H * 0.85, borderRadius: 8, backgroundColor: COLORS.bgCard },

  // Grid
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16,
    gap: 8,
  },
});

export default HomeScreen;
