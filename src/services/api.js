// REQUISITO 7: Integração com API backend
// REQUISITO 8: Uso de Axios
import axios from 'axios';

// ============================================================
// INSTRUÇÕES PARA OBTER SUA CHAVE API GRATUITA DO TMDB:
// 1. Acesse https://www.themoviedb.org/ e crie uma conta
// 2. Vá em: Perfil → Configurações → API
// 3. Clique em "Criar" → Tipo "Developer" → Aceitar termos
// 4. Preencha qualquer coisa (URL pode ser https://localhost)
// 5. Copie a "API Key (v3 auth)" e cole abaixo
// ============================================================
const API_KEY = '4686ec8f54cb4337468bbbfaaf209296';
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR',
  },
  timeout: 8000,
});

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// ============================================================
// DADOS LOCAIS DE FALLBACK (caso a API não funcione)
// ============================================================
const FALLBACK_MOVIES = [
  { id: 438631, title: 'Duna: Parte 2', overview: 'Paul Atreides se une aos Fremen para enfrentar os Harkonnens e guiar o destino do universo, enquanto luta para evitar um futuro sombrio que só ele pode prever.', poster_path: '/8b8R8l88Qje9dn9OE8PY05Nez7S.jpg', backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', vote_average: 8.2, release_date: '2024-02-27', media_type: 'movie' },
  { id: 823464, title: 'Godzilla e Kong: O Novo Império', overview: 'Godzilla e Kong devem coexistir ou um deles deve ceder. Uma investigação revela a história das Titans e o desafio que conecta os dois à raça humana.', poster_path: '/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg', backdrop_path: '/veIyxxi5Gs8gvztLEW1Ysb8rrzs.jpg', vote_average: 7.1, release_date: '2024-03-27', media_type: 'movie' },
  { id: 693134, title: 'Duna: Parte 1', overview: 'Paul Atreides, um jovem brilhante nascido em um grande destino, deve viajar ao planeta mais perigoso do universo para garantir o futuro de sua família.', poster_path: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', backdrop_path: '/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg', vote_average: 7.8, release_date: '2021-09-15', media_type: 'movie' },
  { id: 872585, title: 'Oppenheimer', overview: 'A história de J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica durante a Segunda Guerra Mundial.', poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', vote_average: 8.1, release_date: '2023-07-19', media_type: 'movie' },
  { id: 346698, title: 'Barbie', overview: 'Barbie vive uma crise existencial e é expulsa da Barbieland. Ela embarca em uma aventura no mundo real com Ken.', poster_path: '/iuFNMS8U5cb6xfzi51Dbxi0lJSp.jpg', backdrop_path: '/nHf61UzkfFno5dHMJMa1fExKopR.jpg', vote_average: 7.0, release_date: '2023-07-19', media_type: 'movie' },
  { id: 786892, title: 'Furiosa: Uma Saga Mad Max', overview: 'A origem de Furiosa, que é arrancada do Green Place e cai nas mãos do Senhor da Guerra Dementus.', poster_path: '/iADOJ8Zymht2JPMoy3R7xceZprc.jpg', backdrop_path: '/shrwC6U8Bka8UBVPnHtHaReaFSu.jpg', vote_average: 7.6, release_date: '2024-05-22', media_type: 'movie' },
  { id: 533535, title: 'Deadpool & Wolverine', overview: 'Deadpool é convidado pelo TVA para uma missão que pode mudar o multiverso. Ele recruta Wolverine para a aventura.', poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', backdrop_path: '/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg', vote_average: 7.7, release_date: '2024-07-24', media_type: 'movie' },
  { id: 1022789, title: 'Divertida Mente 2', overview: 'Riley entra na puberdade e novas emoções aparecem: Ansiedade, Inveja, Tédio e Vergonha.', poster_path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', backdrop_path: '/p5ozvmdgsmbWe0H8Xk7Rc8SCwAB.jpg', vote_average: 7.6, release_date: '2024-06-11', media_type: 'movie' },
  { id: 1011985, title: 'Kung Fu Panda 4', overview: 'Po é escolhido como líder espiritual do Vale da Paz. Ele precisa encontrar um novo Guerreiro Dragão antes que uma vilã feiticeira ataque.', poster_path: '/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg', backdrop_path: '/kYgQzzjNis5jJalYtIHgrom0gOx.jpg', vote_average: 7.1, release_date: '2024-03-02', media_type: 'movie' },
  { id: 940721, title: 'Godzilla Minus One', overview: 'No Japão pós-guerra, um ex-piloto kamikaze enfrenta um Godzilla aterrorizado, encontrando propósito ao proteger sua família adotiva.', poster_path: '/hkxxMIGaiCTmrEArK7J56JTKUlB.jpg', backdrop_path: '/bQS43HSLZzMjZkcHJz4fGc9fDSa.jpg', vote_average: 7.9, release_date: '2023-11-03', media_type: 'movie' },
  { id: 762441, title: 'Um Lugar Silencioso: Dia Um', overview: 'A história de como começou a invasão alienígena em Nova York, quando criaturas que caçam pelo som atacam a humanidade.', poster_path: '/hU42CRk14JuPEdqZMdpwKEWaWEK.jpg', backdrop_path: '/2RVcJbWFmICRDsVxJSnNbKNfBFo.jpg', vote_average: 6.8, release_date: '2024-06-26', media_type: 'movie' },
  { id: 653346, title: 'Planeta dos Macacos: O Reinado', overview: 'Várias gerações após o reinado de César, os macacos dominam e os humanos vivem nas sombras.', poster_path: '/gKkl37BQuKTanygYQG1pyYgLVgf.jpg', backdrop_path: '/fqv8v6AycXKsivp1T5yKtLbGXce.jpg', vote_average: 7.1, release_date: '2024-05-08', media_type: 'movie' },
  { id: 1184918, title: 'O Robô Selvagem', overview: 'A robô ROZZUM 7134 naufraga numa ilha selvagem e aprende a se adaptar ao ambiente, adotando um filhote de ganso.', poster_path: '/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg', backdrop_path: '/mQZJoIhTEkNhCYAqcHrQqhENLdu.jpg', vote_average: 8.3, release_date: '2024-09-12', media_type: 'movie' },
  { id: 945961, title: 'Alien: Romulus', overview: 'Jovens colonizadores enfrentam a forma de vida mais terrificante do universo em uma estação espacial abandonada.', poster_path: '/b33nnKl1GSFbao4l3fZDDqsMail.jpg', backdrop_path: '/9SSEUrSqhljBMzRe4aBTh17rUaC.jpg', vote_average: 7.2, release_date: '2024-08-13', media_type: 'movie' },
  { id: 1064028, title: 'Beetlejuice Beetlejuice', overview: 'Lydia Deetz retorna para a casa assombrada quando uma tragédia reabre o portal para o Além.', poster_path: '/kKgQzkUCnQmeTPkyIwHly2t6ZFI.jpg', backdrop_path: '/xi1VSt3DtkevUmzYhtiMultUKOf.jpg', vote_average: 7.1, release_date: '2024-09-04', media_type: 'movie' },
];

const FALLBACK_SERIES = [
  { id: 1396, name: 'Breaking Bad', overview: 'Walter White, um professor de química com câncer terminal, começa a produzir metanfetamina com seu ex-aluno Jesse Pinkman para garantir o futuro financeiro de sua família.', poster_path: '/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg', backdrop_path: '/9faGSFi5jam6pDWGNd0p8JcJgXQ.jpg', vote_average: 8.9, first_air_date: '2008-01-20', media_type: 'tv' },
  { id: 94997, name: 'House of the Dragon', overview: 'A história dos Targaryen, ambientada 200 anos antes dos eventos de Game of Thrones, quando uma guerra civil divide a família.', poster_path: '/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg', backdrop_path: '/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg', vote_average: 8.4, first_air_date: '2022-08-21', media_type: 'tv' },
  { id: 66732, name: 'Stranger Things', overview: 'Quando um garoto desaparece, uma cidade inteira mergulha em mistérios envolvendo experimentos secretos, forças sobrenaturais e uma garota estranha.', poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', backdrop_path: '/56v2KjBlYj2O1qgBf0x7MHQOSGM.jpg', vote_average: 8.6, first_air_date: '2016-07-15', media_type: 'tv' },
  { id: 100088, name: 'The Last of Us', overview: 'Joel é contratado para contrabandear Ellie, de 14 anos, para fora de uma zona de quarentena opressiva. O que começa como um pequeno trabalho logo se torna uma jornada brutal e comovente.', poster_path: '/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', backdrop_path: '/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg', vote_average: 8.8, first_air_date: '2023-01-15', media_type: 'tv' },
  { id: 84958, name: 'Loki', overview: 'Loki cria uma nova linha temporal após roubar o Tesseract. A TVA o captura e ele embarca em uma aventura pelo multiverso.', poster_path: '/voHUmluYmKyleFkTu3lOXQG702u.jpg', backdrop_path: '/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg', vote_average: 8.2, first_air_date: '2021-06-09', media_type: 'tv' },
  { id: 1399, name: 'Game of Thrones', overview: 'Nove famílias nobres lutam pelo controle de Westeros, enquanto um antigo inimigo retorna após milhares de anos de dormência.', poster_path: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', backdrop_path: '/suopoADq0k8YZr4dQXcU6pToj6s.jpg', vote_average: 8.4, first_air_date: '2011-04-17', media_type: 'tv' },
  { id: 1418, name: 'The Big Bang Theory', overview: 'Dois físicos brilhantes mas socialmente desajeitados compartilham um apartamento e suas vidas mudam quando uma bela garota se muda para o apartamento ao lado.', poster_path: '/oUnMlyYHQ09GHpOQtFjVcGiiJzR.jpg', backdrop_path: '/nGsNruW3W27V6r4gkyc3iiEGsKR.jpg', vote_average: 7.9, first_air_date: '2007-09-24', media_type: 'tv' },
  { id: 71912, name: 'The Witcher', overview: 'Geralt de Rivia, um mutante caçador de monstros, luta para encontrar seu lugar em um mundo onde as pessoas frequentemente se provam mais perversas que as bestas.', poster_path: '/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', backdrop_path: '/jBJWaqoSCiARWtfV0GlqHrcdiJq.jpg', vote_average: 8.0, first_air_date: '2019-12-20', media_type: 'tv' },
  { id: 93405, name: 'Squid Game', overview: 'Centenas de jogadores falidos aceitam um convite para competir em jogos infantis por uma tentadora recompensa, mas as consequências são mortais.', poster_path: '/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg', backdrop_path: '/oaGvjB0DvdhXhOAuADfHb261ZHa.jpg', vote_average: 7.8, first_air_date: '2021-09-17', media_type: 'tv' },
  { id: 246, name: 'Avatar: The Last Airbender', overview: 'Em um mundo dividido em quatro nações, um jovem avatar deve dominar os quatro elementos para restaurar a paz.', poster_path: '/cHFZA0aKOJba3PVcYVwfZzwqTz0.jpg', backdrop_path: '/lztz5XBPCO0LIGGZvuqL70P2fFz.jpg', vote_average: 8.7, first_air_date: '2005-02-21', media_type: 'tv' },
];

// Função para busca local nos dados fallback
const searchFallback = (query) => {
  const q = query.toLowerCase();
  const allItems = [...FALLBACK_MOVIES, ...FALLBACK_SERIES];
  return allItems.filter(item => {
    const title = (item.title || item.name || '').toLowerCase();
    const overview = (item.overview || '').toLowerCase();
    return title.includes(q) || overview.includes(q);
  });
};

// ============================================================
// FUNÇÕES DA API (com fallback automático)
// ============================================================

const fetchWithFallback = async (endpoint, fallbackData, params = {}) => {
  try {
    const res = await api.get(endpoint, { params });
    if (res.data && res.data.results) {
      return res.data.results;
    }
    return fallbackData;
  } catch (error) {
    console.log(`API indisponível para ${endpoint}, usando dados locais`);
    return fallbackData;
  }
};

export const getTrendingMovies = async () => {
  return fetchWithFallback('/trending/movie/week', FALLBACK_MOVIES);
};

export const getPopularMovies = async () => {
  return fetchWithFallback('/movie/popular', FALLBACK_MOVIES.slice().sort(() => Math.random() - 0.5));
};

export const getTopRatedMovies = async () => {
  const sorted = [...FALLBACK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
  return fetchWithFallback('/movie/top_rated', sorted);
};

export const getNowPlayingMovies = async () => {
  return fetchWithFallback('/movie/now_playing', FALLBACK_MOVIES.slice(0, 10));
};

export const getPopularSeries = async () => {
  return fetchWithFallback('/tv/popular', FALLBACK_SERIES);
};

export const getTopRatedSeries = async () => {
  const sorted = [...FALLBACK_SERIES].sort((a, b) => b.vote_average - a.vote_average);
  return fetchWithFallback('/tv/top_rated', sorted);
};

export const getMovieDetails = async (id) => {
  try {
    const res = await api.get(`/movie/${id}`, {
      params: { append_to_response: 'credits,similar,videos' },
    });
    return res.data;
  } catch (error) {
    // Retorna dado local simplificado
    const movie = FALLBACK_MOVIES.find(m => m.id === id);
    if (movie) {
      return {
        ...movie,
        genres: [{ id: 28, name: 'Ação' }, { id: 878, name: 'Ficção Científica' }],
        runtime: 148,
        status: 'Released',
        credits: { cast: [], crew: [] },
        similar: { results: FALLBACK_MOVIES.filter(m => m.id !== id).slice(0, 6) },
      };
    }
    throw error;
  }
};

export const getSeriesDetails = async (id) => {
  try {
    const res = await api.get(`/tv/${id}`, {
      params: { append_to_response: 'credits,similar,videos' },
    });
    return res.data;
  } catch (error) {
    const series = FALLBACK_SERIES.find(s => s.id === id);
    if (series) {
      return {
        ...series,
        genres: [{ id: 18, name: 'Drama' }, { id: 10765, name: 'Ficção Científica & Fantasia' }],
        number_of_seasons: 3,
        number_of_episodes: 24,
        status: 'Returning Series',
        credits: { cast: [], crew: [] },
        similar: { results: FALLBACK_SERIES.filter(s => s.id !== id).slice(0, 6) },
      };
    }
    throw error;
  }
};

export const searchMulti = async (query) => {
  try {
    const res = await api.get('/search/multi', { params: { query } });
    const results = res.data.results.filter((i) => i.media_type !== 'person');
    if (results.length > 0) return results;
    // Se API retornou vazio, tenta fallback
    return searchFallback(query);
  } catch (error) {
    console.log('API indisponível para busca, usando dados locais');
    return searchFallback(query);
  }
};

export default api;
