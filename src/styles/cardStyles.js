// REQUISITO 6: Estilização em arquivos separados
import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from './theme';

export const cardStyles = StyleSheet.create({
  card: { width: SIZES.cardW, marginRight: 12 },
  image: {
    width: SIZES.cardW, height: SIZES.cardH,
    borderRadius: 8, backgroundColor: COLORS.bgCard,
  },
  title: { color: COLORS.white, fontSize: 12, fontWeight: '600', marginTop: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  ratingText: { color: COLORS.star, fontSize: 11, marginLeft: 3, fontWeight: 'bold' },
  year: { color: COLORS.darkGray, fontSize: 10, marginLeft: 8 },
  placeholder: {
    width: SIZES.cardW, height: SIZES.cardH, borderRadius: 8,
    backgroundColor: COLORS.bgCard, justifyContent: 'center', alignItems: 'center',
  },
});

export const searchCardStyles = StyleSheet.create({
  item: {
    flexDirection: 'row', backgroundColor: COLORS.bgCard,
    borderRadius: 8, marginBottom: 12, overflow: 'hidden',
  },
  image: { width: 90, height: 135, backgroundColor: COLORS.bgInput },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  title: { color: COLORS.white, fontSize: 15, fontWeight: 'bold' },
  meta: { color: COLORS.darkGray, fontSize: 12, marginTop: 4 },
  overview: { color: COLORS.gray, fontSize: 12, marginTop: 6, lineHeight: 17 },
});

export const detailStyles = StyleSheet.create({
  backdrop: { width: SIZES.width, height: 300 },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 150 },
  backBtn: {
    position: 'absolute', top: 50, left: 16, width: 40, height: 40,
    borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },
  content: { padding: SIZES.padding, marginTop: -50 },
  row: { flexDirection: 'row', gap: 14 },
  poster: { width: 120, height: 180, borderRadius: 8, backgroundColor: COLORS.bgCard },
  headerInfo: { flex: 1, justifyContent: 'flex-end' },
  titleText: { color: COLORS.white, fontSize: 22, fontWeight: 'bold' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4,
  },
  ratingVal: { color: COLORS.star, fontSize: 13, fontWeight: 'bold', marginLeft: 4 },
  metaText: { color: COLORS.gray, fontSize: 13 },
  genresRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 8 },
  genreTag: {
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14,
  },
  genreText: { color: COLORS.gray, fontSize: 12 },
  watchBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, paddingVertical: 13, borderRadius: 8, marginTop: 16, gap: 8,
  },
  watchBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 15 },
  section: { color: COLORS.white, fontSize: 17, fontWeight: 'bold', marginTop: 22, marginBottom: 10 },
  overview: { color: COLORS.gray, fontSize: 14, lineHeight: 22 },
  castItem: { alignItems: 'center', marginRight: 16, width: 70 },
  castImg: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.bgCard },
  castName: { color: COLORS.white, fontSize: 10, marginTop: 6, textAlign: 'center' },
  castChar: { color: COLORS.darkGray, fontSize: 9, textAlign: 'center', marginTop: 2 },
});
