// src/utils/units.js

// Temperatura: internamente siempre trabajamos en Celsius
export const convertTemp = (celsius, unit) => {
  if (unit === 'F') return celsius * 9 / 5 + 32;
  return celsius;
};

export const formatTemp = (celsius, unit) => {
  return `${Math.round(convertTemp(celsius, unit))}°${unit}`;
};

export const formatTempValue = (celsius, unit) => {
  return Math.round(convertTemp(celsius, unit));
};

// Viento: internamente siempre trabajamos en km/h
export const convertWind = (kmh, unit) => {
  if (unit === 'mph') return kmh * 0.621371;
  return kmh;
};

export const formatWind = (kmh, unit) => {
  const val = Math.round(convertWind(kmh, unit));
  const suffix = unit === 'mph' ? 'mph' : 'km/h';
  return `${val} ${suffix}`;
};