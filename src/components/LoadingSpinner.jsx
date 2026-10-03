// src/components/LoadingSpinner.jsx
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-300 dark:border-slate-700 rounded-full 
                        animate-spin border-t-sky-500" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🌤️</div>
      </div>
      <p className="text-slate-600 dark:text-slate-400 text-sm animate-pulse">
        Cargando datos meteorológicos...
      </p>
    </div>
  );
}