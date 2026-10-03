// src/hooks/useMultiWeather.js
import { useState, useCallback } from 'react';

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

async function fetchOne(city) {
  const params = new URLSearchParams({
    latitude: city.latitude.toString(),
    longitude: city.longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'pressure_msl',
      'cloud_cover',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
  });

  const res = await fetch(`${WEATHER_API}?${params}`);
  if (!res.ok) throw new Error(`Error al obtener datos de ${city.name}`);
  const data = await res.json();
  return {
    city,
    current: data.current,
    daily: data.daily,
    timezone: data.timezone,
  };
}

export function useMultiWeather() {
  const [cities, setCities] = useState([]); // hasta 3
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (list) => {
    if (!list || list.length === 0) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await Promise.all(list.map(fetchOne));
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCity = useCallback(
    (city) => {
      if (!city) return;
      setCities((prev) => {
        const exists = prev.some(
          (c) =>
            Math.abs(c.latitude - city.latitude) < 0.01 &&
            Math.abs(c.longitude - city.longitude) < 0.01
        );
        if (exists || prev.length >= 3) return prev;
        const next = [...prev, city];
        // Disparar fetch
        setTimeout(() => fetchAll(next), 0);
        return next;
      });
    },
    [fetchAll]
  );

  const removeCity = useCallback(
    (city) => {
      setCities((prev) => {
        const next = prev.filter(
          (c) =>
            !(
              Math.abs(c.latitude - city.latitude) < 0.01 &&
              Math.abs(c.longitude - city.longitude) < 0.01
            )
        );
        if (next.length === 0) setResults([]);
        else setTimeout(() => fetchAll(next), 0);
        return next;
      });
    },
    [fetchAll]
  );

  const clearCities = useCallback(() => {
    setCities([]);
    setResults([]);
  }, []);

  return {
    cities,
    results,
    loading,
    error,
    addCity,
    removeCity,
    clearCities,
  };
}