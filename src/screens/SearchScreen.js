// TELA 2 - BUSCA FUNCIONAL COMPLETA
// REQUISITO 1: JSX | REQUISITO 3: Tela | REQUISITO 5: Hooks | REQUISITO 7/8: API+Axios
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, StatusBar,
  StyleSheet, Dimensions, ScrollView, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFavorites } from '../navigation/FavoritesContext';
import Loading from '../components/Loading';
import {
  searchMulti, getImageUrl,
  getTrendingMovies, getPopularSeries,
} from '../services/api';
import { COLORS } from '../styles/theme';

const { width } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();

  // Carregar sugestões de tendências ao abrir a tela
  useEffect(() => {
    const loadTrending = async () => {
      try {
        const [movies, series] = await Promise.all([
          getTrendingMovies(),
          getPopularSeries(),
        ]);
        setTrendingMovies(movies.slice(0, 10));
        setTrendingSeries(series.slice(0, 10));
      } catch (e) { console.error(e); }
      finally { setLoadingTrending(false); }
    };
    loadTrending();
  }, []);

  // Busca com debounce
  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchMulti(query);
        setResults(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

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

  // Filtrar resultados
  const filtered = results.filter((item) => {
    if (filter === 'all') return true;
    return item.media_type === filter;
  });

  // Contadores para filtros
  const movieCount = results.filter(i => i.media_type === 'movie').length;
  const tvCount = results.filter(i => i.media_type === 'tv').length;

  // Card de resultado da busca
  const ResultCard = ({ item }) => {
    const title = item.title || item.name || 'Sem título';
    const img = getImageUrl(item.poster_path, 'w342');
    const backdrop = getImageUrl(item.backdrop_path, 'w500');
    const year = (item.release_date || item.first_air_date || '').substring(0, 4);
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    const label = item.media_type === 'tv' ? 'Série' : 'Filme';
    const fav = isFavorite(item.id);

    return (
      <TouchableOpacity style={st.resultCard} onPress={() => goToDetail(item)} activeOpacity={0.85}>
        {/* Poster */}
        <View style={st.resultPosterWrap}>
          {img ? (
            <Image source={{ uri: img }} style={st.resultPoster} resizeMode="cover" />
          ) : (
            <View style={[st.resultPoster, { justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="film-outline" size={30} color={COLORS.darkGray} />
            </View>
          )}
          {/* Badge nota */}
          <View style={st.posterBadge}>
            <Ionicons name="star" size={10} color={COLORS.star} />
            <Text style={st.posterBadgeText}>{rating}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={st.resultInfo}>
          <Text style={st.resultTitle} numberOfLines={2}>{title}</Text>

          <View style={st.resultMetaRow}>
            <View style={[st.typeBadge, item.media_type === 'tv' && { backgroundColor: '#3498DB' }]}>
              <Ionicons name={item.media_type === 'tv' ? 'tv-outline' : 'film-outline'} size={10} color={COLORS.white} />
              <Text style={st.typeBadgeText}>{label}</Text>
            </View>
            {year ? <Text style={st.resultYear}>{year}</Text> : null}
          </View>

          {item.overview ? (
            <Text style={st.resultDesc} numberOfLines={3}>{item.overview}</Text>
          ) : (
            <Text style={[st.resultDesc, { fontStyle: 'italic' }]}>Sem descrição disponível.</Text>
          )}

          {/* Botões */}
          <View style={st.resultBtnRow}>
            <TouchableOpacity style={st.resultDetailBtn} onPress={() => goToDetail(item)}>
              <Ionicons name="eye-outline" size={14} color={COLORS.white} />
              <Text style={st.resultDetailBtnText}>Ver mais</Text>
            </TouchableOpacity>
            <TouchableOpacity style={st.resultFavBtn} onPress={() => handleFav(item)}>
              <Ionicons name={fav ? 'heart' : 'heart-outline'} size={14} color={fav ? COLORS.primary : COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Card de sugestão (trending)
  const TrendingCard = ({ item }) => {
    const img = getImageUrl(item.poster_path, 'w342');
    const rating = item.vote_average?.toFixed(1) || '';
    const fav = isFavorite(item.id);
    return (
      <TouchableOpacity style={st.trendCard} onPress={() => goToDetail(item)} activeOpacity={0.8}>
        <View>
          {img ? (
            <Image source={{ uri: img }} style={st.trendImg} resizeMode="cover" />
          ) : (
            <View style={[st.trendImg, { justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="film-outline" size={24} color={COLORS.darkGray} />
            </View>
          )}
          <TouchableOpacity style={st.trendFav} onPress={() => handleFav(item)}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={14} color={fav ? COLORS.primary : COLORS.white} />
          </TouchableOpacity>
          <View style={st.trendBadge}>
            <Ionicons name="star" size={9} color={COLORS.star} />
            <Text style={{ color: COLORS.star, fontSize: 10, fontWeight: 'bold' }}>{rating}</Text>
          </View>
        </View>
        <Text style={st.trendTitle} numberOfLines={1}>{item.title || item.name}</Text>
        <Text style={st.trendDesc} numberOfLines={2}>{item.overview}</Text>
      </TouchableOpacity>
    );
  };

  // ===== TELA COM RESULTADOS =====
  const hasResults = query.length >= 2;

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={st.header}>
        <Text style={st.headerTitle}>🔍 Buscar</Text>
        <Text style={st.headerSub}>Filmes, séries e mais</Text>
      </View>

      {/* Barra de busca */}
      <View style={st.searchBar}>
        <Ionicons name="search" size={20} color={COLORS.darkGray} />
        <TextInput
          style={st.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="O que você quer assistir?"
          placeholderTextColor={COLORS.darkGray}
          selectionColor={COLORS.primary}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setFilter('all'); }}>
            <Ionicons name="close-circle" size={20} color={COLORS.darkGray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros - só aparece quando tem busca */}
      {hasResults && results.length > 0 && (
        <View style={st.filterRow}>
          {[
            { key: 'all', label: `Todos (${results.length})`, icon: 'apps' },
            { key: 'movie', label: `Filmes (${movieCount})`, icon: 'film' },
            { key: 'tv', label: `Séries (${tvCount})`, icon: 'tv' },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[st.filterBtn, filter === f.key && st.filterBtnActive]}
              onPress={() => setFilter(f.key)}
            >
              <Ionicons name={f.icon} size={14} color={filter === f.key ? COLORS.white : COLORS.gray} />
              <Text style={[st.filterText, filter === f.key && st.filterTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Conteúdo */}
      {loading ? (
        <Loading text="Buscando..." />
      ) : hasResults && filtered.length > 0 ? (
        /* === RESULTADOS DA BUSCA === */
        <FlatList
          data={filtered}
          renderItem={({ item }) => <ResultCard item={item} />}
          keyExtractor={(item) => `res-${item.id}-${item.media_type}`}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={st.resultsCount}>{filtered.length} resultado{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</Text>
          }
        />
      ) : hasResults ? (
        /* === SEM RESULTADOS === */
        <View style={st.emptyState}>
          <Ionicons name="sad-outline" size={70} color={COLORS.darkGray} />
          <Text style={st.emptyTitle}>Nenhum resultado</Text>
          <Text style={st.emptySub}>Tente buscar por outro título ou nome</Text>
        </View>
      ) : (
        /* === TELA INICIAL (SUGESTÕES) === */
        <ScrollView showsVerticalScrollIndicator={false}>
          {loadingTrending ? (
            <Loading text="Carregando sugestões..." />
          ) : (
            <>
              {/* Sugestões rápidas */}
              <Text style={st.suggestTitle}>Sugestões rápidas</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
                {['Vingadores', 'Batman', 'Stranger Things', 'Breaking Bad', 'Oppenheimer', 'Barbie', 'The Last of Us', 'Deadpool'].map((term) => (
                  <TouchableOpacity key={term} style={st.quickChip} onPress={() => setQuery(term)}>
                    <Ionicons name="search" size={12} color={COLORS.gray} />
                    <Text style={st.quickChipText}>{term}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Filmes em alta */}
              <Text style={st.suggestTitle}>🔥 Filmes em Alta</Text>
              <FlatList
                data={trendingMovies}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                keyExtractor={(item) => `tm-${item.id}`}
                renderItem={({ item }) => <TrendingCard item={item} />}
              />

              {/* Séries em alta */}
              <Text style={st.suggestTitle}>📺 Séries Populares</Text>
              <FlatList
                data={trendingSeries}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                keyExtractor={(item) => `ts-${item.id}`}
                renderItem={({ item }) => <TrendingCard item={item} />}
              />

              {/* Categorias populares */}
              <Text style={st.suggestTitle}>🎭 Buscar por Categoria</Text>
              <View style={st.catGrid}>
                {[
                  { name: 'Ação', icon: 'flame', color: '#E74C3C', q: 'ação' },
                  { name: 'Comédia', icon: 'happy', color: '#F39C12', q: 'comédia' },
                  { name: 'Terror', icon: 'skull', color: '#8E44AD', q: 'terror' },
                  { name: 'Romance', icon: 'heart', color: '#E91E63', q: 'romance' },
                  { name: 'Ficção Científica', icon: 'planet', color: '#3498DB', q: 'ficção científica' },
                  { name: 'Animação', icon: 'color-palette', color: '#2ECC71', q: 'animação' },
                  { name: 'Documentário', icon: 'document-text', color: '#1ABC9C', q: 'documentário' },
                  { name: 'Suspense', icon: 'eye', color: '#E67E22', q: 'suspense' },
                ].map((cat) => (
                  <TouchableOpacity key={cat.name} style={st.catItem} onPress={() => setQuery(cat.q)}>
                    <View style={[st.catIcon, { backgroundColor: cat.color + '20' }]}>
                      <Ionicons name={cat.icon} size={22} color={cat.color} />
                    </View>
                    <Text style={st.catName}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ height: 30 }} />
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  // Header
  header: { paddingTop: 50, paddingHorizontal: 16, paddingBottom: 4 },
  headerTitle: { color: COLORS.white, fontSize: 28, fontWeight: 'bold' },
  headerSub: { color: COLORS.darkGray, fontSize: 13, marginTop: 2 },

  // Search bar
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgInput, borderRadius: 12,
    marginHorizontal: 16, marginVertical: 12, paddingHorizontal: 14, height: 50,
    gap: 10,
  },
  searchInput: { flex: 1, color: COLORS.white, fontSize: 16 },

  // Filtros
  filterRow: {
    flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8, gap: 8,
  },
  filterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
  },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.gray, fontSize: 12 },
  filterTextActive: { color: COLORS.white, fontWeight: 'bold' },

  // Resultados
  resultsCount: { color: COLORS.darkGray, fontSize: 12, marginBottom: 12, marginTop: 4 },

  resultCard: {
    flexDirection: 'row', backgroundColor: COLORS.bgCard,
    borderRadius: 12, marginBottom: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.border,
  },
  resultPosterWrap: { position: 'relative' },
  resultPoster: { width: 110, height: 165, backgroundColor: COLORS.bgInput },
  posterBadge: {
    position: 'absolute', bottom: 6, left: 6,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.75)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  posterBadgeText: { color: COLORS.star, fontSize: 11, fontWeight: 'bold' },

  resultInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  resultTitle: { color: COLORS.white, fontSize: 16, fontWeight: 'bold', lineHeight: 21 },
  resultMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  typeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4,
  },
  typeBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
  resultYear: { color: COLORS.gray, fontSize: 12 },
  resultDesc: { color: COLORS.gray, fontSize: 12, lineHeight: 17, marginTop: 6 },

  resultBtnRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  resultDetailBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6,
  },
  resultDetailBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  resultFavBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center',
  },

  // Estado vazio
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyTitle: { color: COLORS.gray, fontSize: 18, fontWeight: '600', marginTop: 14 },
  emptySub: { color: COLORS.darkGray, fontSize: 13, marginTop: 6 },

  // Sugestões
  suggestTitle: {
    color: COLORS.white, fontSize: 17, fontWeight: 'bold',
    marginLeft: 16, marginTop: 20, marginBottom: 12,
  },
  quickChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.bgCard, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  quickChipText: { color: COLORS.gray, fontSize: 13 },

  // Trending cards
  trendCard: { width: width * 0.34, marginRight: 12 },
  trendImg: { width: width * 0.34, height: width * 0.34 * 1.5, borderRadius: 10, backgroundColor: COLORS.bgCard },
  trendFav: {
    position: 'absolute', top: 6, right: 6, width: 28, height: 28,
    borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center',
  },
  trendBadge: {
    position: 'absolute', bottom: 6, left: 6,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4,
  },
  trendTitle: { color: COLORS.white, fontSize: 12, fontWeight: '600', marginTop: 6 },
  trendDesc: { color: COLORS.gray, fontSize: 10, lineHeight: 14, marginTop: 2 },

  // Categorias
  catGrid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10,
  },
  catItem: {
    width: (width - 52) / 2, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.bgCard, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  catIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  catName: { color: COLORS.white, fontSize: 13, fontWeight: '600' },
});

export default SearchScreen;
