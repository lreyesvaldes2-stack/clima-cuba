// src/components/AutoRefreshIndicator.jsx
import { useState, useEffect } from 'react';

export default function AutoRefreshIndicator({ enabled, onToggle, lastRefresh }) {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = Math.floor((Date.now() - lastRefresh.getTime()) / 1000);
      setSecondsAgo(diff);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [lastRefresh]);

  const formatAgo = () => {
    if (secondsAgo < 60) return `hace ${secondsAgo}s`;
    const m = Math.floor(secondsAgo / 60);
    if (m < 60) return `hace ${m} min`;
    const h = Math.floor(m / 60);
    return `hace ${h}h`;
  };

  return (
    <button
      onClick={onToggle}
      title={enabled ? 'Desactivar auto-refresco' : 'Activar auto-refresco'}
      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors
                  border flex items-center gap-1.5
                  ${enabled
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                    : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
    >
      <span className={enabled ? 'animate-pulse' : ''}>🔄</span>
      <span className="hidden sm:inline">
        {enabled ? formatAgo() : 'Auto OFF'}
      </span>
    </button>
  );
}