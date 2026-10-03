// src/components/HistoryDropdown.jsx
import { useState, useRef, useEffect } from 'react';

export default function HistoryDropdown({ history, onSelect, onClear }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!history || history.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        title="Historial de búsquedas"
        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 
                   text-slate-800 dark:text-slate-200 text-sm font-semibold
                   hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors
                   border border-slate-300 dark:border-slate-700 flex items-center gap-1.5"
      >
        🕘 <span className="hidden sm:inline">Recientes</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 z-50
                        bg-white dark:bg-slate-800 
                        rounded-2xl border border-slate-300 dark:border-slate-700
                        shadow-2xl shadow-black/20 dark:shadow-black/50 
                        overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 
                          border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Últimas búsquedas
            </span>
            <button
              onClick={() => {
                onClear();
                setOpen(false);
              }}
              className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
            >
              Limpiar
            </button>
          </div>
          {history.map((city, i) => (
            <button
              key={`${city.name}-${i}`}
              onClick={() => {
                onSelect(city);
                setOpen(false);
              }}
              className="w-full px-3 py-2.5 text-left 
                         hover:bg-slate-100 dark:hover:bg-slate-700/70 
                         transition-colors flex items-center gap-2 
                         border-b border-slate-200 dark:border-slate-700/50 last:border-0"
            >
              <span className="text-slate-400 text-sm">📍</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                  {city.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {city.province}{city.province && city.country && ', '}{city.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}