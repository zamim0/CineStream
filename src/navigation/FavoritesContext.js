// REQUISITO 5: Hooks (useState, useCallback, createContext, useContext)
import React, { createContext, useState, useCallback, useContext } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = useCallback((item) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === item.id);
      if (exists) return prev.filter((f) => f.id !== item.id);
      return [item, ...prev];
    });
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.some((f) => f.id === id),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
