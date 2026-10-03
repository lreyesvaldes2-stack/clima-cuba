// src/components/FavoritesBar.jsx
export default function FavoritesBar({ favorites, onSelect, onRemove }) {
  if (!favorites || favorites.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-yellow-500 text-sm">⭐</span>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Favoritos
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {favorites.map((city) => (
          <div
            key={`${city.name}-${city.latitude}`}
            className="group flex items-center gap-1 pl-3 pr-1 py-1.5 rounded-full
                       bg-yellow-50 dark:bg-yellow-900/20 
                       border border-yellow-300 dark:border-yellow-700/50
                       hover:bg-yellow-100 dark:hover:bg-yellow-900/40
                       transition-all duration-200"
          >
            <button
              onClick={() => onSelect(city)}
              className="text-slate-700 dark:text-yellow-200 text-xs font-medium 
                         hover:text-yellow-700 dark:hover:text-yellow-100"
            >
              {city.name}
            </button>
            <button
              onClick={() => onRemove(city)}
              title="Quitar de favoritos"
              className="w-5 h-5 rounded-full flex items-center justify-center
                         text-slate-400 dark:text-yellow-600
                         hover:bg-red-500 hover:text-white 
                         text-xs transition-colors"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}