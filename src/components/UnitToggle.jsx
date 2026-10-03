// src/components/UnitToggle.jsx
export default function UnitToggle({ tempUnit, windUnit, onToggleTemp, onToggleWind }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onToggleTemp}
        title="Cambiar unidad de temperatura"
        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 
                   text-slate-800 dark:text-slate-200 text-sm font-semibold
                   hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors
                   border border-slate-300 dark:border-slate-700"
      >
        °{tempUnit}
      </button>
      <button
        onClick={onToggleWind}
        title="Cambiar unidad de viento"
        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 
                   text-slate-800 dark:text-slate-200 text-sm font-semibold
                   hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors
                   border border-slate-300 dark:border-slate-700"
      >
        {windUnit === 'kmh' ? 'km/h' : 'mph'}
      </button>
    </div>
  );
}