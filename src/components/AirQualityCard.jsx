// src/components/AirQualityCard.jsx
import { getAQIInfo, getAQIPercentage } from '../utils/airQuality';

export default function AirQualityCard({ airQuality }) {
  const aqi = airQuality?.european_aqi;
  const info = getAQIInfo(aqi);
  const percentage = getAQIPercentage(aqi);

  const pollutants = [
    { label: 'PM2.5', value: airQuality?.pm2_5, unit: 'µg/m³', icon: '🟤' },
    { label: 'PM10',  value: airQuality?.pm10,  unit: 'µg/m³', icon: '🟠' },
    { label: 'O₃',    value: airQuality?.ozone, unit: 'µg/m³', icon: '🔵' },
    { label: 'NO₂',   value: airQuality?.nitrogen_dioxide, unit: 'µg/m³', icon: '🟡' },
  ];

  return (
    <div className={`rounded-3xl border p-6 shadow-xl transition-colors duration-300
                     bg-white/80 dark:bg-slate-800/60 
                     border-slate-200 dark:border-slate-700/50`}>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-lg flex items-center gap-2">
          <span>🌫️</span> Calidad del aire
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${info.bgColor} ${info.textColor} 
                          border ${info.borderColor}`}>
          {info.emoji} {info.level}
        </span>
      </div>

      {/* Valor grande de AQI */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-5xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
          {aqi ?? '—'}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          European AQI
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-5">
        <div
          className={`h-full ${info.color} rounded-full transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Consejo */}
      <p className={`text-xs ${info.textColor} ${info.bgColor} border ${info.borderColor} 
                     rounded-xl p-3 mb-5`}>
        💡 {info.advice}
      </p>

      {/* Contaminantes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {pollutants.map((p) => (
          <div key={p.label} className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 
                                        border border-slate-200 dark:border-slate-700/30">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">{p.icon}</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">{p.label}</p>
            </div>
            <p className="text-slate-900 dark:text-slate-100 font-semibold text-sm tabular-nums">
              {p.value != null ? Math.round(p.value) : '—'}
              <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1 font-normal">
                {p.unit}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}