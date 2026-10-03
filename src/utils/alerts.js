// src/utils/alerts.js
import { getAQIInfo } from './airQuality';

// Genera alertas automáticas basadas en los datos meteorológicos
export function generateAlerts(weather, airQuality) {
  if (!weather) return [];

  const alerts = [];
  const { current, daily } = weather;
  const uvToday = daily.uv_index_max?.[0] ?? 0;

  // 1. Tormenta eléctrica (código WMO 95-99)
  if (current.weather_code >= 95) {
    alerts.push({
      id: 'thunderstorm',
      severity: 'high',
      title: 'Tormenta eléctrica',
      message: 'Se están produciendo tormentas con actividad eléctrica. Evita zonas abiertas y refúgiate en interiores.',
      icon: '⛈️',
    });
  }
  // 2. Lluvia intensa
  else if (current.weather_code === 65 || current.weather_code === 82) {
    alerts.push({
      id: 'heavy-rain',
      severity: 'high',
      title: 'Lluvia intensa',
      message: 'Precipitaciones fuertes en la zona. Precaución al conducir y evita cruzar ríos o zonas inundables.',
      icon: '🌧️',
    });
  }
  // 3. Lluvia moderada
  else if ([63, 81].includes(current.weather_code)) {
    alerts.push({
      id: 'moderate-rain',
      severity: 'medium',
      title: 'Lluvias moderadas',
      message: 'Se esperan lluvias moderadas. Lleva paraguas si vas a salir.',
      icon: '🌦️',
    });
  }

  // 4. Viento fuerte (> 50 km/h)
  if (current.wind_speed_10m >= 50) {
    alerts.push({
      id: 'strong-wind',
      severity: current.wind_speed_10m >= 75 ? 'high' : 'medium',
      title: 'Vientos fuertes',
      message: `Ráfagas de ${Math.round(current.wind_speed_10m)} km/h. Asegura objetos sueltos y ten precaución.`,
      icon: '💨',
    });
  }

  // 5. Temperatura extrema
  if (current.temperature_2m >= 35) {
    alerts.push({
      id: 'extreme-heat',
      severity: 'high',
      title: 'Calor extremo',
      message: `Temperatura de ${Math.round(current.temperature_2m)}°C. Hidrátate constantemente y evita el sol directo.`,
      icon: '🔥',
    });
  } else if (current.temperature_2m >= 32) {
    alerts.push({
      id: 'heat',
      severity: 'medium',
      title: 'Calor elevado',
      message: `Temperatura de ${Math.round(current.temperature_2m)}°C. Bebe agua con frecuencia.`,
      icon: '☀️',
    });
  }

  if (current.temperature_2m <= 0) {
    alerts.push({
      id: 'freezing',
      severity: current.temperature_2m <= -10 ? 'high' : 'medium',
      title: 'Temperaturas bajo cero',
      message: `Temperatura de ${Math.round(current.temperature_2m)}°C. Riesgo de hielo en carreteras. Abrígate bien.`,
      icon: '🥶',
    });
  }

  // 6. UV alto
  if (uvToday >= 8) {
    alerts.push({
      id: 'high-uv',
      severity: uvToday >= 11 ? 'high' : 'medium',
      title: `Índice UV ${uvToday >= 11 ? 'extremo' : 'muy alto'}`,
      message: `UV de ${Math.round(uvToday)}. Usa protector solar, gorra y gafas. Evita el sol entre 10am y 4pm.`,
      icon: '☀️',
    });
  }

  // 7. Calidad del aire mala
  if (airQuality?.european_aqi != null && airQuality.european_aqi > 60) {
    const info = getAQIInfo(airQuality.european_aqi);
    alerts.push({
      id: 'bad-air',
      severity: airQuality.european_aqi > 80 ? 'high' : 'medium',
      title: `Calidad del aire ${info.level.toLowerCase()}`,
      message: `${info.advice} AQI actual: ${airQuality.european_aqi}.`,
      icon: '😷',
    });
  }

  // 8. Niebla densa
  if (current.weather_code === 45 || current.weather_code === 48) {
    alerts.push({
      id: 'fog',
      severity: 'low',
      title: 'Niebla',
      message: 'Visibilidad reducida. Conduce con precaución y usa las luces antiniebla.',
      icon: '🌫️',
    });
  }

  return alerts;
}