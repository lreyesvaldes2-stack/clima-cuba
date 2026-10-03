// src/components/SearchBar.jsx
import { useState, useEffect, useRef } from 'react';
import { useWeather } from '../hooks/useWeather';
import { useGeolocation } from '../hooks/useGeolocation';
import { DEFAULT_CITIES } from '../utils/cities';
import HistoryDropdown from './HistoryDropdown';
import ShareButton from './ShareButton';
import AutoRefreshIndicator from './AutoRefreshIndicator';

export default function SearchBar({
  onSelect,
  history,
  onClearHistory,
  weather,
  autoRefreshEnabled,
  onToggleAutoRefresh,
  lastRefresh,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { searchCity } = useWeather();
  const { getLocation, loading: geoLoading, error: geoError } = useGeolocation();
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.length < 2) {
      setResults([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      const cities = await searchCity(query);
      setResults(cities);
      setShowResults(true);
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [query, searchCity]);

  const handleSelect = (city) => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    onSelect(city);
  };

  const handleGeolocate = async () => {
    try {
      const loc = await getLocation();
      handleSelect(loc);
    } catch {
      // el error ya está en geoError
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Barra de controles superior */}
      <div className="flex items-center justify-end gap-2 mb-3 flex-wrap">
        <AutoRefreshIndicator
          enabled={autoRefreshEnabled}
          onToggle={onToggleAutoRefresh}
          lastRefresh={lastRefresh}
        />
        <HistoryDropdown
          history={history}
          onSelect={onSelect}
          onClear={onClearHistory}
        />
        <ShareButton weather={weather} />
      </div>

      {/* Input con botón de geolocalización */}
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Busca cualquier ciudad del mundo..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl 
                       bg-white/90 dark:bg-slate-800/80 
                       border border-slate-300 dark:border-slate-700
                       text-slate-900 dark:text-slate-100 
                       placeholder-slate-500 dark:placeholder-slate-400 text-lg
                       focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
                       backdrop-blur-sm transition-all duration-300"
          />
        </div>

        <button
          onClick={handleGeolocate}
          disabled={geoLoading}
          title="Usar mi ubicación actual"
          className="px-4 rounded-2xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50
                     text-white text-xl transition-colors flex items-center justify-center
                     min-w-[60px]"
        >
          {geoLoading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent 
                             rounded-full animate-spin" />
          ) : (
            '📍'
          )}
        </button>
      </div>

      {geoError && (
        <p className="text-red-500 text-xs mt-2 text-center">⚠️ {geoError}</p>
      )}

      {/* Resultados */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full 
                        bg-white dark:bg-slate-800 
                        rounded-2xl border border-slate-300 dark:border-slate-700
                        shadow-2xl shadow-black/20 dark:shadow-black/50 
                        overflow-hidden z-50">
          {results.map((city, i) => (
            <button
              key={`${city.id}-${i}`}
              onClick={() => handleSelect({
                name: city.name,
                province: city.admin1 || '',
                latitude: city.latitude,
                longitude: city.longitude,
                country: city.country || '',
              })}
              className="w-full px-4 py-3 text-left 
                         hover:bg-slate-100 dark:hover:bg-slate-700/70 
                         transition-colors flex items-center justify-between 
                         border-b border-slate-200 dark:border-slate-700/50 last:border-0"
            >
              <div>
                <span className="text-slate-900 dark:text-slate-100 font-medium">{city.name}</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">
                  {city.admin1 && `${city.admin1}, `}{city.country}
                </span>
              </div>
              <span className="text-slate-400 dark:text-slate-500 text-xs">{city.country_code}</span>
            </button>
          ))}
        </div>
      )}

      {/* Accesos rápidos */}
      {!query && (
        <div className="mt-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 text-center">
            🇨🇺 Cuba y América del Norte — Acceso rápido
          </p>
          <div className="flex flex-wrap gap-2 justify-center max-h-40 overflow-y-auto px-2">
            {DEFAULT_CITIES.map((city) => (
              <button
                key={`${city.name}-${city.country}`}
                onClick={() => onSelect(city)}
                className="px-3 py-1.5 rounded-full 
                           bg-white/70 dark:bg-slate-800/60 
                           border border-slate-300 dark:border-slate-700
                           text-slate-700 dark:text-slate-300 text-xs 
                           hover:bg-sky-100 dark:hover:bg-sky-600/30 
                           hover:border-sky-500 hover:text-sky-700 dark:hover:text-sky-300
                           transition-all duration-200"
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}