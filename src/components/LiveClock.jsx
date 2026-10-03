// src/components/LiveClock.jsx
import { useState, useEffect } from 'react';

export default function LiveClock({ timezone, location }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timezone) return null;

  let timeStr = '';
  let dateStr = '';
  try {
    timeStr = now.toLocaleTimeString('es-ES', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    dateStr = now.toLocaleDateString('es-ES', {
      timeZone: timezone,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  } catch {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-3 text-slate-600 dark:text-slate-400 
                    text-sm md:text-base my-6">
      <span className="text-2xl">🕐</span>
      <div className="text-left">
        <div className="font-mono text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 
                        tabular-nums tracking-tight">
          {timeStr}
        </div>
        <div className="text-xs md:text-sm capitalize text-slate-500 dark:text-slate-500">
          {dateStr} · {location}
        </div>
      </div>
    </div>
  );
}