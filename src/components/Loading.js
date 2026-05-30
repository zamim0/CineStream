// REQUISITO 1: JSX | REQUISITO 2: Componente reutilizável
import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { baseStyles, COLORS } from '../styles/theme';

const Loading = ({ text = 'Carregando...' }) => (
  <View style={baseStyles.center}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={{ color: COLORS.darkGray, marginTop: 12 }}>{text}</Text>
  </View>
);

export default Loading;
