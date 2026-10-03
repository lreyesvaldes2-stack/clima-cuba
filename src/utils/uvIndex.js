// src/utils/uvIndex.js

export function getUVInfo(uv) {
  if (uv == null) return {
    level: 'Sin datos',
    color: 'bg-slate-400',
    textColor: 'text-slate-700 dark:text-slate-300',
    emoji: '❓',
    advice: 'Sin información disponible.',
  };

  if (uv < 3) return {
    level: 'Bajo',
    color: 'bg-green-500',
    textColor: 'text-green-700 dark:text-green-300',
    emoji: '🟢',
    advice: 'Puedes estar al aire libre sin protección.',
  };
  if (uv < 6) return {
    level: 'Moderado',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    emoji: '🟡',
    advice: 'Usa protector solar si estarás más de 30 min al sol.',
  };
  if (uv < 8) return {
    level: 'Alto',
    color: 'bg-orange-500',
    textColor: 'text-orange-700 dark:text-orange-300',
    emoji: '🟠',
    advice: 'Protector solar SPF 30+, sombrero y gafas. Evita el mediodía.',
  };
  if (uv < 11) return {
    level: 'Muy alto',
    color: 'bg-red-500',
    textColor: 'text-red-700 dark:text-red-300',
    emoji: '🔴',
    advice: 'Evita el sol entre 10am y 4pm. Protección obligatoria.',
  };
  return {
    level: 'Extremo',
    color: 'bg-purple-600',
    textColor: 'text-purple-700 dark:text-purple-300',
    emoji: '🟣',
    advice: 'Quédate en interiores. El sol es peligroso incluso con protección.',
  };
}