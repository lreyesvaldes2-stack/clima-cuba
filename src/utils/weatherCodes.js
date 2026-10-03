// src/utils/weatherCodes.js
export const WEATHER_CODES = {
  0:  { description: 'Cielo despejado',       icon: '☀️', gradient: 'from-amber-400 to-orange-500' },
  1:  { description: 'Mayormente despejado',  icon: '🌤️', gradient: 'from-yellow-400 to-amber-500' },
  2:  { description: 'Parcialmente nublado',  icon: '⛅', gradient: 'from-sky-400 to-blue-500' },
  3:  { description: 'Nublado',               icon: '☁️', gradient: 'from-slate-400 to-slate-600' },
  45: { description: 'Niebla',                icon: '🌫️', gradient: 'from-slate-300 to-slate-500' },
  48: { description: 'Niebla con escarcha',   icon: '🌫️', gradient: 'from-slate-300 to-slate-500' },
  51: { description: 'Llovizna ligera',       icon: '🌦️', gradient: 'from-sky-300 to-blue-400' },
  53: { description: 'Llovizna moderada',     icon: '🌦️', gradient: 'from-sky-400 to-blue-500' },
  55: { description: 'Llovizna densa',        icon: '🌧️', gradient: 'from-sky-500 to-blue-600' },
  61: { description: 'Lluvia ligera',         icon: '🌧️', gradient: 'from-blue-400 to-blue-600' },
  63: { description: 'Lluvia moderada',       icon: '🌧️', gradient: 'from-blue-500 to-indigo-600' },
  65: { description: 'Lluvia fuerte',         icon: '🌧️', gradient: 'from-blue-600 to-indigo-800' },
  71: { description: 'Nieve ligera',          icon: '🌨️', gradient: 'from-slate-200 to-blue-300' },
  73: { description: 'Nieve moderada',        icon: '🌨️', gradient: 'from-slate-300 to-blue-400' },
  75: { description: 'Nieve fuerte',          icon: '❄️', gradient: 'from-slate-400 to-blue-500' },
  80: { description: 'Chubascos ligeros',     icon: '🌦️', gradient: 'from-sky-400 to-blue-500' },
  81: { description: 'Chubascos moderados',   icon: '🌧️', gradient: 'from-blue-500 to-indigo-600' },
  82: { description: 'Chubascos violentos',   icon: '⛈️', gradient: 'from-indigo-600 to-purple-800' },
  95: { description: 'Tormenta eléctrica',    icon: '⛈️', gradient: 'from-purple-600 to-red-700' },
  96: { description: 'Tormenta con granizo',  icon: '⛈️', gradient: 'from-purple-700 to-red-800' },
  99: { description: 'Tormenta severa',       icon: '🌩️', gradient: 'from-red-600 to-red-900' },
};

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { description: 'Desconocido', icon: '❓', gradient: 'from-slate-500 to-slate-700' };
}

export function getWindDirection(degrees) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(degrees / 45) % 8];
}