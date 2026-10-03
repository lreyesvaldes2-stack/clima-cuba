// src/utils/airQuality.js

// Clasificación del European AQI (0-100+)
// https://www.eea.europa.eu/themes/air/air-quality-index
export function getAQIInfo(aqi) {
  if (aqi == null) return { level: 'Desconocido', color: 'bg-slate-400', textColor: 'text-slate-700 dark:text-slate-300', bgColor: 'bg-slate-100 dark:bg-slate-800/50', borderColor: 'border-slate-300 dark:border-slate-700', emoji: '❓', advice: 'Sin datos disponibles' };

  if (aqi <= 20) return {
    level: 'Buena',
    color: 'bg-green-500',
    textColor: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    borderColor: 'border-green-200 dark:border-green-800',
    emoji: '😊',
    advice: 'Calidad del aire ideal para actividades al aire libre.',
  };
  if (aqi <= 40) return {
    level: 'Aceptable',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    emoji: '🙂',
    advice: 'Calidad del aire aceptable. Disfruta del aire libre.',
  };
  if (aqi <= 60) return {
    level: 'Moderada',
    color: 'bg-orange-500',
    textColor: 'text-orange-700 dark:text-orange-300',
    bgColor: 'bg-orange-50 dark:bg-orange-900/30',
    borderColor: 'border-orange-200 dark:border-orange-800',
    emoji: '😐',
    advice: 'Personas sensibles deberían reducir esfuerzo prolongado al aire libre.',
  };
  if (aqi <= 80) return {
    level: 'Mala',
    color: 'bg-red-500',
    textColor: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-50 dark:bg-red-900/30',
    borderColor: 'border-red-200 dark:border-red-800',
    emoji: '😷',
    advice: 'Evita actividades intensas al aire libre. Considera usar mascarilla.',
  };
  if (aqi <= 100) return {
    level: 'Muy mala',
    color: 'bg-purple-600',
    textColor: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-purple-50 dark:bg-purple-900/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    emoji: '🤢',
    advice: 'Permanece en interiores. Cierra ventanas si es posible.',
  };
  return {
    level: 'Extremadamente mala',
    color: 'bg-red-800',
    textColor: 'text-red-800 dark:text-red-200',
    bgColor: 'bg-red-100 dark:bg-red-950/50',
    borderColor: 'border-red-400 dark:border-red-900',
    emoji: '☠️',
    advice: 'Emergencia sanitaria. No salgas al exterior.',
  };
}

// Porcentaje para barra de progreso (0-100, cap a 100+ = 100%)
export function getAQIPercentage(aqi) {
  if (aqi == null) return 0;
  return Math.min((aqi / 100) * 100, 100);
}