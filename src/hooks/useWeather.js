// src/hooks/useWeather.js
import { useState, useCallback } from 'react';

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
const AIR_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (latitude, longitude, locationName) => {
    setLoading(true);
    setError(null);

    try {
      // ── Llamada 1: Clima ─────────────────────────────────
      const weatherParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
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
        hourly: [
          'temperature_2m',
          'weather_code',
          'precipitation_probability',
          'wind_speed_10m',
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'precipitation_probability_max',
          'wind_speed_10m_max',
          'uv_index_max',
          'sunrise',
          'sunset',
        ].join(','),
        timezone: 'auto',
        forecast_days: '7',
        temperature_unit: 'celsius',
        wind_speed_unit: 'kmh',
      });

      // ── Llamada 2: Calidad del aire ──────────────────────
      const airParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: ['european_aqi', 'us_aqi', 'pm2_5', 'pm10', 'ozone', 'nitrogen_dioxide'].join(','),
        timezone: 'auto',
      });

      const [weatherRes, airRes] = await Promise.all([
        fetch(`${WEATHER_API}?${weatherParams}`),
        fetch(`${AIR_API}?${airParams}`),
      ]);

      if (!weatherRes.ok) throw new Error('Error al obtener datos meteorológicos');
      if (!airRes.ok) throw new Error('Error al obtener calidad del aire');

      const data = await weatherRes.json();
      const airData = await airRes.json();

      // Encontrar el índice de la hora actual en el array hourly
      const nowIso = data.current.time.slice(0, 13); // "2026-10-02T17"
      const startIdx = data.hourly.time.findIndex((t) => t.slice(0, 13) === nowIso);
      const safeStart = startIdx >= 0 ? startIdx : 0;
      const endIdx = Math.min(safeStart + 24, data.hourly.time.length);

      const hourly24 = {
        time: data.hourly.time.slice(safeStart, endIdx),
        temperature_2m: data.hourly.temperature_2m.slice(safeStart, endIdx),
        weather_code: data.hourly.weather_code.slice(safeStart, endIdx),
        precipitation_probability: data.hourly.precipitation_probability.slice(safeStart, endIdx),
        wind_speed_10m: data.hourly.wind_speed_10m.slice(safeStart, endIdx),
      };

      setWeather({
        location: locationName || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
        current: data.current,
        daily: data.daily,
        hourly: hourly24,
        timezone: data.timezone,
      });

      setAirQuality({
        european_aqi: airData.current.european_aqi,
        us_aqi: airData.current.us_aqi,
        pm2_5: airData.current.pm2_5,
        pm10: airData.current.pm10,
        ozone: airData.current.ozone,
        nitrogen_dioxide: airData.current.nitrogen_dioxide,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCity = useCallback(async (query) => {
    if (!query || query.length < 2) return [];

    try {
      const res = await fetch(
        `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=5&language=es&format=json`
      );
      if (!res.ok) throw new Error('Error en la búsqueda');
      const data = await res.json();
      return data.results || [];
    } catch {
      return [];
    }
  }, []);

  return { weather, airQuality, loading, error, fetchWeather, searchCity };
}