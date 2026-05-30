// REQUISITO 6: Estilização em arquivos separados
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const COLORS = {
  bg: '#0D0D0D',
  bgCard: '#1A1A1A',
  bgInput: '#2A2A2A',
  primary: '#E50914',
  white: '#FFFFFF',
  gray: '#B3B3B3',
  darkGray: '#666666',
  star: '#FFD700',
  border: '#333333',
};

export const SIZES = {
  width,
  cardW: width * 0.32,
  cardH: width * 0.32 * 1.5,
  padding: 16,
};

export const baseStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', color: COLORS.white,
    marginLeft: SIZES.padding, marginTop: 20, marginBottom: 10,
  },
});
