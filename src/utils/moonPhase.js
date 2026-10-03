// src/utils/moonPhase.js

// Calcula la fase lunar usando un algoritmo estándar
// Referencia: ciclo lunar de 29.530588853 días desde la luna nueva conocida del 6 enero 2000

const LUNAR_CYCLE = 29.530588853; // días
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0); // ms

export function getMoonPhase(date = new Date()) {
  const daysSince = (date.getTime() - KNOWN_NEW_MOON) / (24 * 60 * 60 * 1000);
  const phase = ((daysSince % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
  const fraction = phase / LUNAR_CYCLE;

  // 8 fases lunares principales
  if (fraction < 0.0625 || fraction >= 0.9375) {
    return { name: 'Luna nueva',          icon: '🌑', illumination: 0 };
  }
  if (fraction < 0.1875) {
    return { name: 'Luna creciente',      icon: '🌒', illumination: 0.25 };
  }
  if (fraction < 0.3125) {
    return { name: 'Cuarto creciente',    icon: '🌓', illumination: 0.5 };
  }
  if (fraction < 0.4375) {
    return { name: 'Gibosa creciente',    icon: '🌔', illumination: 0.75 };
  }
  if (fraction < 0.5625) {
    return { name: 'Luna llena',          icon: '🌕', illumination: 1 };
  }
  if (fraction < 0.6875) {
    return { name: 'Gibosa menguante',    icon: '🌖', illumination: 0.75 };
  }
  if (fraction < 0.8125) {
    return { name: 'Cuarto menguante',    icon: '🌗', illumination: 0.5 };
  }
  return { name: 'Luna menguante',        icon: '🌘', illumination: 0.25 };
}