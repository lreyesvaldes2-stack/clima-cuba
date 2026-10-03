// src/hooks/useFavorites.js
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'weather_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // localStorage lleno o deshabilitado
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (city) => {
      if (!city) return false;
      return favorites.some(
        (f) =>
          Math.abs(f.latitude - city.latitude) < 0.01 &&
          Math.abs(f.longitude - city.longitude) < 0.01
      );
    },
    [favorites]
  );

  const addFavorite = useCallback((city) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) =>
          Math.abs(f.latitude - city.latitude) < 0.01 &&
          Math.abs(f.longitude - city.longitude) < 0.01
      );
      if (exists) return prev;
      return [...prev, city].slice(0, 20); // máx 20 favoritos
    });
  }, []);

  const removeFavorite = useCallback((city) => {
    setFavorites((prev) =>
      prev.filter(
        (f) =>
          !(
            Math.abs(f.latitude - city.latitude) < 0.01 &&
            Math.abs(f.longitude - city.longitude) < 0.01
          )
      )
    );
  }, []);

  const toggleFavorite = useCallback(
    (city) => {
      if (isFavorite(city)) removeFavorite(city);
      else addFavorite(city);
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite };
}