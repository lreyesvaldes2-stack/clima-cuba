// src/components/CompareView.jsx
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTempValue, formatWind } from '../utils/units';
import LoadingSpinner from './LoadingSpinner';

export default function CompareView({
  cities,
  results,
  loading,
  onRemove,
  onClear,
  onAddCurrent,
  currentCity,
  tempUnit,
  windUnit,
}) {
  return (
    <div className="space-y-6">
      {/* Barra de control */}
      <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl 
                      border border-slate-200 dark:border-slate-700/50 p-4 
                      flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
            ⚖️ Comparando {cities.length}/3 ciudades
          </span>
          {cities.map((c) => (
            <span
              key={`${c.name}-${c.latitude}`}
              className="px-2.5 py-1 rounded-full text-xs
                         bg-sky-100 dark:bg-sky-900/40 
                         text-sky-700 dark:text-sky-300 
                         border border-sky-300 dark:border-sky-700
                         flex items-center gap-1"
            >
              {c.name}
              <button
                onClick={() => onRemove(c)}
                className="hover:text-red-500 ml-1"
                title="Quitar"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {currentCity && cities.length < 3 && (
            <button
              onClick={() => onAddCurrent(currentCity)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold
                         bg-sky-500 hover:bg-sky-600 text-white transition-colors"
            >
              + Añadir actual
            </button>
          )}
          {cities.length > 0 && (
            <button
              onClick={onClear}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold
                         bg-red-100 dark:bg-red-900/30 
                         text-red-700 dark:text-red-300
                         border border-red-300 dark:border-red-800
                         hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && cities.length === 0 && (
        <div className="text-center py-16 bg-white/60 dark:bg-slate-800/40 
                        rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="text-6xl mb-4">⚖️</div>
          <h3 className="text-slate-700 dark:text-slate-300 font-semibold text-lg mb-2">
            Comparador de ciudades
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            Usa el buscador de arriba y haz clic en el botón <strong>+ Comparar</strong> en las
            ciudades, o añade la actual. Podrás comparar hasta 3 ciudades en paralelo.
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className={`grid gap-4 ${
          results.length === 1 ? 'grid-cols-1' :
          results.length === 2 ? 'md:grid-cols-2' :
          'md:grid-cols-3'
        }`}>
          {results.map((r) => {
            const info = getWeatherInfo(r.current.weather_code);
            const days = r.daily.time.length;

            return (
              <div
                key={`${r.city.name}-${r.city.latitude}`}
                className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm 
                           rounded-3xl border border-slate-200 dark:border-slate-700/50 
                           overflow-hidden shadow-xl"
              >
                {/* Header con gradiente */}
                <div className={`relative p-5 bg-gradient-to-br ${info.gradient}`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="min-w-0">
                        <h4 className="text-white font-bold text-lg truncate">
                          {r.city.name}
                        </h4>
                        <p className="text-white/80 text-xs truncate">
                          {r.city.province && `${r.city.province}, `}{r.city.country}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemove(r.city)}
                        title="Quitar"
                        className="shrink-0 w-7 h-7 rounded-full 
                                   bg-white/20 hover:bg-white/30 
                                   text-white flex items-center justify-center 
                                   transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-5xl font-bold text-white drop-shadow-lg">
                        {formatTempValue(r.current.temperature_2m, tempUnit)}°
                      </span>
                      <span className="text-5xl drop-shadow-lg">{info.icon}</span>
                    </div>
                    <p className="text-white/90 text-sm mt-1 font-medium">
                      {info.description}
                    </p>
                  </div>
                </div>

                {/* Detalles */}
                <div className="p-4 space-y-3">
                  {[
                    { label: 'Sensación', value: `${formatTempValue(r.current.apparent_temperature, tempUnit)}°` },
                    { label: 'Humedad',   value: `${r.current.relative_humidity_2m}%` },
                    { label: 'Viento',    value: formatWind(r.current.wind_speed_10m, windUnit) },
                    { label: 'Presión',   value: `${Math.round(r.current.pressure_msl)} hPa` },
                    { label: 'Nubosidad', value: `${r.current.cloud_cover}%` },
                  ].map((d) => (
                    <div
                      key={d.label}
                      className="flex items-center justify-between text-sm
                                 border-b border-slate-200 dark:border-slate-700/30 
                                 pb-2 last:border-0 last:pb-0"
                    >
                      <span className="text-slate-500 dark:text-slate-400">{d.label}</span>
                      <span className="text-slate-800 dark:text-slate-100 font-semibold tabular-nums">
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Mini pronóstico 3 días */}
                <div className="px-4 pb-4 grid grid-cols-3 gap-2">
                  {Array.from({ length: Math.min(3, days) }).map((_, i) => {
                    const dInfo = getWeatherInfo(r.daily.weather_code[i]);
                    return (
                      <div
                        key={i}
                        className="text-center bg-slate-50 dark:bg-slate-900/60 
                                   rounded-xl py-2 border border-slate-200 dark:border-slate-700/30"
                      >
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">
                          {i === 0 ? 'Hoy' : `+${i}d`}
                        </p>
                        <div className="text-xl">{dInfo.icon}</div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                          {formatTempValue(r.daily.temperature_2m_max[i], tempUnit)}°
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
                          {formatTempValue(r.daily.temperature_2m_min[i], tempUnit)}°
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}