// src/components/ForecastCard.jsx
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTempValue, formatWind } from '../utils/units';
import TemperatureChart from './TemperatureChart';

export default function ForecastCard({ weather, tempUnit, windUnit }) {
  const daily = weather.daily;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl 
                    border border-slate-200 dark:border-slate-700/50 p-6 shadow-xl 
                    transition-colors duration-300 space-y-8">
      {/* Gráfico SVG */}
      <TemperatureChart daily={daily} tempUnit={tempUnit} />

      {/* Divisor */}
      <div className="border-t border-slate-200 dark:border-slate-700/50" />

      {/* Tarjetas de 7 días */}
      <div>
        <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-lg mb-5 flex items-center gap-2">
          <span>📅</span> Pronóstico extendido — 7 días
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {daily.time.map((day, i) => {
            const info = getWeatherInfo(daily.weather_code[i]);
            return (
              <div key={day} className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 text-center 
                                        border border-slate-200 dark:border-slate-700/30
                                        hover:border-sky-500/50 hover:bg-white dark:hover:bg-slate-900/80 
                                        transition-all duration-300 group cursor-default">
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-2 capitalize font-medium">
                  {i === 0 ? 'Hoy' : formatDate(day)}
                </p>
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {info.icon}
                </div>
                <div className="flex justify-center gap-2 text-sm">
                  <span className="text-slate-900 dark:text-slate-100 font-semibold">
                    {formatTempValue(daily.temperature_2m_max[i], tempUnit)}°
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">
                    {formatTempValue(daily.temperature_2m_min[i], tempUnit)}°
                  </span>
                </div>
                <div className="mt-2 text-xs text-sky-600 dark:text-sky-400">
                  💧 {daily.precipitation_probability_max[i]}%
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-500 truncate">
                  🌬️ {formatWind(daily.wind_speed_10m_max[i], windUnit)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}