// src/components/TemperatureChart.jsx
import { useMemo } from 'react';
import { formatTempValue } from '../utils/units';

const WIDTH = 720;
const HEIGHT = 220;
const PADDING_X = 45;
const PADDING_Y = 50;

export default function TemperatureChart({ daily, tempUnit }) {
  const { maxPoints, minPoints, minTemp } = useMemo(() => {
    const maxTemps = daily.temperature_2m_max;
    const minTemps = daily.temperature_2m_min;

    const globalMax = Math.max(...maxTemps);
    const globalMin = Math.min(...minTemps);
    const range = globalMax - globalMin || 1;

    const chartW = WIDTH - PADDING_X * 2;
    const chartH = HEIGHT - PADDING_Y * 2;
    const n = maxTemps.length;

    const toPoint = (val, i) => {
      const x = PADDING_X + (i / (n - 1)) * chartW;
      const y = PADDING_Y + chartH - ((val - globalMin) / range) * chartH;
      return [x, y];
    };

    return {
      maxPoints: maxTemps.map((t, i) => toPoint(t, i)),
      minPoints: minTemps.map((t, i) => toPoint(t, i)),
      minTemp: globalMin,
    };
  }, [daily]);

  const toPath = (points) =>
    points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('es-ES', { weekday: 'short' });
  };

  const bottomY = HEIGHT - PADDING_Y;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h4 className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2">
          📈 Tendencia de temperatura
        </h4>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" /> Máx
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-3 h-3 rounded-full bg-blue-400 inline-block" /> Mín
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-auto min-w-[500px] text-slate-900 dark:text-slate-100"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="maxAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(251 146 60)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="rgb(251 146 60)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="minAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(96 165 250)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="rgb(96 165 250)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Área bajo línea de máximas */}
          <path
            d={`${toPath(maxPoints)} L ${maxPoints[maxPoints.length - 1][0]} ${bottomY} L ${maxPoints[0][0]} ${bottomY} Z`}
            fill="url(#maxAreaGrad)"
          />
          {/* Área bajo línea de mínimas */}
          <path
            d={`${toPath(minPoints)} L ${minPoints[minPoints.length - 1][0]} ${bottomY} L ${minPoints[0][0]} ${bottomY} Z`}
            fill="url(#minAreaGrad)"
          />

          {/* Línea de máximas */}
          <path
            d={toPath(maxPoints)}
            fill="none"
            stroke="rgb(251 146 60)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Línea de mínimas */}
          <path
            d={toPath(minPoints)}
            fill="none"
            stroke="rgb(96 165 250)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 4"
          />

          {/* Puntos y etiquetas de temperatura máxima */}
          {maxPoints.map(([x, y], i) => (
            <g key={`max-${i}`}>
              <circle cx={x} cy={y} r="5" fill="rgb(251 146 60)" stroke="white" strokeWidth="2" />
              <text
                x={x}
                y={y - 14}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                className="fill-slate-900 dark:fill-slate-100"
              >
                {formatTempValue(daily.temperature_2m_max[i], tempUnit)}°
              </text>
            </g>
          ))}

          {/* Puntos y etiquetas de temperatura mínima */}
          {minPoints.map(([x, y], i) => (
            <g key={`min-${i}`}>
              <circle cx={x} cy={y} r="5" fill="rgb(96 165 250)" stroke="white" strokeWidth="2" />
              <text
                x={x}
                y={y + 22}
                textAnchor="middle"
                fontSize="11"
                fontWeight="500"
                className="fill-slate-600 dark:fill-slate-400"
              >
                {formatTempValue(daily.temperature_2m_min[i], tempUnit)}°
              </text>
            </g>
          ))}

          {/* Etiquetas de días abajo */}
          {maxPoints.map(([x], i) => (
            <text
              key={`day-${i}`}
              x={x}
              y={HEIGHT - 12}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              className="fill-slate-500 dark:fill-slate-400 capitalize"
            >
              {i === 0 ? 'Hoy' : formatDate(daily.time[i])}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}