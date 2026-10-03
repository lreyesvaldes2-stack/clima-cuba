// src/hooks/useHistory.js
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'weather_history';
const MAX_ITEMS = 5;

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const addToHistory = useCallback((city) => {
    if (!city) return;
    setHistory((prev) => {
      // Eliminar duplicados por coordenadas
      const filtered = prev.filter(
        (h) =>
          !(
            Math.abs(h.latitude - city.latitude) < 0.01 &&
            Math.abs(h.longitude - city.longitude) < 0.01
          )
      );
      return [city, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addToHistory, clearHistory };
}