// src/components/WeatherCard.jsx
import { getWeatherInfo, getWindDirection } from '../utils/weatherCodes';
import { formatTempValue, formatWind } from '../utils/units';

export default function WeatherCard({
  weather,
  tempUnit,
  windUnit,
  isFavorite,
  onToggleFavorite,
  onAddToCompare,
  compareCount = 0,
}) {
  const current = weather.current;
  const info = getWeatherInfo(current.weather_code);

  const details = [
    { label: 'Sensación térmica', value: `${formatTempValue(current.apparent_temperature, tempUnit)}°${tempUnit}` },
    { label: 'Humedad',           value: `${current.relative_humidity_2m}%` },
    { label: 'Viento',            value: `${formatWind(current.wind_speed_10m, windUnit)} ${getWindDirection(current.wind_direction_10m)}` },
    { label: 'Presión',           value: `${Math.round(current.pressure_msl)} hPa` },
    { label: 'Nubosidad',         value: `${current.cloud_cover}%` },
    { label: 'Día/Noche',         value: current.is_day ? '☀️ Día' : '🌙 Noche' },
  ];

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${info.gradient} 
                     p-8 shadow-2xl shadow-black/20 dark:shadow-black/40 transition-all duration-500`}>
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-lg">📍</span>
            <h2 className="text-white/90 text-lg font-medium">{weather.location}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFavorite}
              title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              className={`w-9 h-9 rounded-full flex items-center justify-center 
                         text-lg transition-all duration-200
                         ${isFavorite
                           ? 'bg-yellow-400 text-white shadow-lg scale-105'
                           : 'bg-white/20 text-white hover:bg-white/30'
                         }`}
            >
              {isFavorite ? '⭐' : '☆'}
            </button>
            <button
              onClick={onAddToCompare}
              disabled={compareCount >= 3}
              title={compareCount >= 3 ? 'Máximo 3 ciudades' : 'Añadir al comparador'}
              className="px-3 h-9 rounded-full flex items-center justify-center gap-1
                         text-xs font-semibold text-white
                         bg-white/20 hover:bg-white/30 
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-200"
            >
              ⚖️ + Comparar
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-7xl md:text-8xl font-bold text-white drop-shadow-lg">
              {formatTempValue(current.temperature_2m, tempUnit)}°
            </div>
            <p className="text-white/90 text-xl mt-1 font-medium">{info.description}</p>
          </div>
          <div className="text-7xl md:text-8xl drop-shadow-lg">{info.icon}</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {details.map((detail, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <p className="text-white/70 text-xs mb-1">{detail.label}</p>
              <p className="text-white font-semibold text-sm">{detail.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}