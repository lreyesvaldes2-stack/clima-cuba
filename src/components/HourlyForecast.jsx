// src/components/HourlyForecast.jsx
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTempValue } from '../utils/units';

export default function HourlyForecast({ hourly, tempUnit }) {
  if (!hourly || hourly.time.length === 0) return null;

  const formatHour = (isoStr, index) => {
    if (index === 0) return 'Ahora';
    const hour = isoStr.split('T')[1]?.slice(0, 2) || '00';
    return `${hour}h`;
  };

  return (
    <div className="rounded-3xl border p-6 shadow-xl transition-colors duration-300
                    bg-white/80 dark:bg-slate-800/60 
                    border-slate-200 dark:border-slate-700/50">
      <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-lg mb-5 flex items-center gap-2">
        <span>🕐</span> Próximas 24 horas
      </h3>

      <div className="flex gap-3 overflow-x-auto pb-3 -mx-2 px-2 scrollbar-thin">
        {hourly.time.map((time, i) => {
          const info = getWeatherInfo(hourly.weather_code[i]);
          const isNow = i === 0;
          return (
            <div
              key={time}
              className={`shrink-0 w-[88px] rounded-2xl p-3 text-center transition-all duration-300
                          ${isNow
                            ? 'bg-sky-100 dark:bg-sky-900/50 border-2 border-sky-400 dark:border-sky-600'
                            : 'bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/30 hover:border-sky-500/50'
                          }`}
            >
              <p className={`text-[11px] mb-2 font-semibold capitalize
                             ${isNow ? 'text-sky-700 dark:text-sky-300' : 'text-slate-500 dark:text-slate-400'}`}>
                {formatHour(time, i)}
              </p>
              <div className="text-2xl mb-2">{info.icon}</div>
              <p className="text-slate-900 dark:text-slate-100 font-bold text-sm tabular-nums">
                {formatTempValue(hourly.temperature_2m[i], tempUnit)}°
              </p>
              <p className="text-[10px] text-sky-600 dark:text-sky-400 mt-1">
                💧 {hourly.precipitation_probability[i] ?? 0}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}