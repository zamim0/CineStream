# 🎬 CineStream - App de Filmes e Séries

Aplicativo mobile com **React Native (Expo SDK 52)** para explorar filmes e séries usando a API do **TMDB**.

---

## ✅ Requisitos Atendidos

| # | Requisito | Status |
|---|-----------|--------|
| 1 | Uso de JSX | ✅ |
| 2 | Componentes reutilizáveis | ✅ MovieCard, Section, SearchBar, Loading |
| 3 | Mínimo de 3 telas | ✅ Home, Busca, Detalhes, Favoritos |
| 4 | React Navigation | ✅ Bottom Tabs + Stack |
| 5 | Uso de Hooks | ✅ useState, useEffect, useCallback, useContext |
| 6 | Estilização em arquivos separados | ✅ theme.js, cardStyles.js |
| 7 | Integração com API backend | ✅ TMDB API |
| 8 | Uso de Axios | ✅ api.js |

---

## 🚀 Como Rodar

### Pré-requisitos
- **Node.js v20** (IMPORTANTE: NÃO usar v22 ou v24)
- **VS Code**
- **Expo Go** no celular

### Passo a passo

1. Abra a pasta **CineStream** no VS Code
2. Abra o terminal: `Ctrl + '`
3. Rode:
```
npm install
npx expo start
```
4. Aperte `w` para abrir no navegador, ou escaneie o QR Code com Expo Go

---

## 📁 Estrutura

```
CineStream/
├── App.js
├── src/
│   ├── components/    (MovieCard, Section, SearchBar, Loading)
│   ├── screens/       (Home, Search, Details, Favorites)
│   ├── navigation/    (AppNavigator, FavoritesContext)
│   ├── services/      (api.js - Axios + TMDB)
│   └── styles/        (theme.js, cardStyles.js)
```
