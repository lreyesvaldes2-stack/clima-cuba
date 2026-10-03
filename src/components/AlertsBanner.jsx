// src/components/AlertsBanner.jsx
export default function AlertsBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  const SEVERITY = {
    high: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      border: 'border-red-300 dark:border-red-700',
      text: 'text-red-800 dark:text-red-200',
      badge: 'bg-red-500 text-white',
      label: 'Alta',
    },
    medium: {
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      border: 'border-amber-300 dark:border-amber-700',
      text: 'text-amber-800 dark:text-amber-200',
      badge: 'bg-amber-500 text-white',
      label: 'Media',
    },
    low: {
      bg: 'bg-sky-50 dark:bg-sky-900/30',
      border: 'border-sky-300 dark:border-sky-700',
      text: 'text-sky-800 dark:text-sky-200',
      badge: 'bg-sky-500 text-white',
      label: 'Baja',
    },
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const s = SEVERITY[alert.severity] || SEVERITY.medium;
        return (
          <div
            key={alert.id}
            className={`flex items-start gap-3 p-4 rounded-2xl border ${s.bg} ${s.border} 
                        shadow-sm transition-all duration-300`}
          >
            <span className="text-2xl shrink-0" aria-hidden="true">{alert.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className={`font-semibold text-sm ${s.text}`}>{alert.title}</h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.badge}`}>
                  {s.label}
                </span>
              </div>
              <p className={`text-xs ${s.text} opacity-90 leading-relaxed`}>{alert.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}