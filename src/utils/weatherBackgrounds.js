// src/utils/weatherBackgrounds.js

// Categoriza el código WMO en un tipo simple
export function getWeatherCategory(code) {
  if (code <= 1) return 'clear';        // despejado
  if (code === 2) return 'partly';      // parcialmente nublado
  if (code === 3) return 'cloudy';      // nublado
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 51 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 95) return 'storm';
  return 'clear';
}

// Fondo dinámico según clima + día/noche + tema
export function getBackground(isDark, weatherCode, isDay) {
  const cat = getWeatherCategory(weatherCode);

  const BG = {
    dark: {
      clear:  'from-sky-900 via-blue-900 to-indigo-950',
      partly: 'from-sky-950 via-blue-950 to-indigo-950',
      cloudy: 'from-slate-800 via-slate-900 to-slate-950',
      fog:    'from-slate-700 via-slate-800 to-slate-900',
      rain:   'from-slate-800 via-slate-900 to-blue-950',
      snow:   'from-slate-600 via-slate-700 to-blue-900',
      storm:  'from-slate-950 via-purple-950 to-slate-950',
      night:  'from-slate-950 via-indigo-950 to-slate-950',
    },
    light: {
      clear:  'from-sky-100 via-blue-100 to-indigo-100',
      partly: 'from-sky-100 via-slate-100 to-blue-100',
      cloudy: 'from-slate-200 via-slate-100 to-slate-200',
      fog:    'from-slate-200 via-slate-100 to-slate-200',
      rain:   'from-slate-300 via-slate-200 to-blue-100',
      snow:   'from-slate-100 via-blue-50 to-indigo-100',
      storm:  'from-slate-300 via-purple-100 to-slate-200',
      night:  'from-slate-200 via-indigo-100 to-slate-200',
    },
  };

  const theme = isDark ? BG.dark : BG.light;

  // Si es de noche y el clima es "clear" o "partly", usamos el fondo nocturno
  if (!isDay && (cat === 'clear' || cat === 'partly')) {
    return theme.night;
  }
  return theme[cat] || theme.clear;
}

// Tipo de animación a mostrar
export function getAnimationType(weatherCode, isDay) {
  if (weatherCode >= 95) return 'storm';
  if (weatherCode >= 51 && weatherCode <= 67) return 'rain';
  if (weatherCode >= 80 && weatherCode <= 82) return 'rain';
  if (weatherCode >= 71 && weatherCode <= 77) return 'snow';
  if (!isDay && weatherCode <= 2) return 'stars';
  if (isDay && weatherCode <= 1) return 'sun';
  return 'none';
}