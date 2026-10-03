// src/components/SunMoonCard.jsx
import { useMemo } from 'react';
import { getMoonPhase } from '../utils/moonPhase';
import { getUVInfo } from '../utils/uvIndex';

export default function SunMoonCard({ weather }) {
  const sunrise = weather.daily.sunrise?.[0];
  const sunset = weather.daily.sunset?.[0];
  const uv = weather.daily.uv_index_max?.[0];

  const moon = useMemo(() => getMoonPhase(new Date()), []);
  const uvInfo = getUVInfo(uv);

  const formatTime = (isoStr) => {
    if (!isoStr) return '—';
    // isoStr = "2026-10-02T06:47" → devuelve "06:47"
    return isoStr.split('T')[1]?.slice(0, 5) || '—';
  };

  // Duración del día
  const dayDuration = useMemo(() => {
    if (!sunrise || !sunset) return null;
    const rise = new Date(sunrise).getTime();
    const set = new Date(sunset).getTime();
    const diff = (set - rise) / (1000 * 60); // minutos
    const h = Math.floor(diff / 60);
    const m = Math.round(diff % 60);
    return `${h}h ${m}m`;
  }, [sunrise, sunset]);

  return (
    <div className="rounded-3xl border p-6 shadow-xl transition-colors duration-300
                    bg-white/80 dark:bg-slate-800/60 
                    border-slate-200 dark:border-slate-700/50">
      <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-lg mb-5 flex items-center gap-2">
        <span>🌅</span> Sol, luna y UV
      </h3>

      {/* Amanecer / Atardecer */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/20 
                        rounded-2xl p-4 border border-amber-200 dark:border-amber-800/50">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🌅</span>
            <p className="text-amber-700 dark:text-amber-300 text-xs font-semibold uppercase tracking-wide">
              Amanecer
            </p>
          </div>
          <p className="text-amber-900 dark:text-amber-100 text-2xl font-bold tabular-nums">
            {formatTime(sunrise)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-rose-100 dark:from-orange-900/30 dark:to-rose-900/20 
                        rounded-2xl p-4 border border-orange-200 dark:border-orange-800/50">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🌇</span>
            <p className="text-orange-700 dark:text-orange-300 text-xs font-semibold uppercase tracking-wide">
              Atardecer
            </p>
          </div>
          <p className="text-orange-900 dark:text-orange-100 text-2xl font-bold tabular-nums">
            {formatTime(sunset)}
          </p>
        </div>
      </div>

      {/* Duración del día */}
      {dayDuration && (
        <div className="flex items-center justify-between px-4 py-2.5 mb-5 
                        bg-slate-50 dark:bg-slate-900/60 rounded-xl 
                        border border-slate-200 dark:border-slate-700/30">
          <span className="text-xs text-slate-500 dark:text-slate-400">☀️ Duración del día</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
            {dayDuration}
          </span>
        </div>
      )}

      {/* Luna y UV lado a lado */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-4 
                        border border-indigo-200 dark:border-indigo-800/50 text-center">
          <div className="text-4xl mb-1">{moon.icon}</div>
          <p className="text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            {moon.name}
          </p>
          <p className="text-indigo-500 dark:text-indigo-400 text-[10px] mt-1">
            {Math.round(moon.illumination * 100)}% iluminada
          </p>
        </div>

        <div className={`rounded-2xl p-4 border text-center transition-colors
                         bg-slate-50 dark:bg-slate-900/60
                         border-slate-200 dark:border-slate-700/30`}>
          <div className="text-3xl mb-1">{uvInfo.emoji}</div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            UV {uv != null ? Math.round(uv) : '—'} · {uvInfo.level}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
            {uvInfo.advice}
          </p>
        </div>
      </div>
    </div>
  );
}