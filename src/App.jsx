// src/App.jsx
import { useEffect, useMemo, useCallback, useState } from 'react';
import { useWeather } from './hooks/useWeather';
import { useTheme } from './hooks/useTheme';
import { useUnits } from './hooks/useUnits';
import { useFavorites } from './hooks/useFavorites';
import { useHistory } from './hooks/useHistory';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import { useMultiWeather } from './hooks/useMultiWeather';
import { getBackground, getAnimationType } from './utils/weatherBackgrounds';
import { generateAlerts } from './utils/alerts';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import HourlyForecast from './components/HourlyForecast';
import LoadingSpinner from './components/LoadingSpinner';
import LiveClock from './components/LiveClock';
import ThemeToggle from './components/ThemeToggle';
import UnitToggle from './components/UnitToggle';
import WeatherAnimation from './components/WeatherAnimation';
import AlertsBanner from './components/AlertsBanner';
import AirQualityCard from './components/AirQualityCard';
import SunMoonCard from './components/SunMoonCard';
import FavoritesBar from './components/FavoritesBar';
import CompareView from './components/CompareView';
import SatelliteRadarMap from './components/SatelliteRadarMap';

const DEFAULT_CITY = {
  name: 'La Habana',
  province: 'La Habana',
  country: 'Cuba',
  latitude: 23.1136,
  longitude: -82.3666,
};

export default function App() {
  const { weather, airQuality, loading, error, fetchWeather } = useWeather();
  const { isDark, toggleTheme } = useTheme();
  const { tempUnit, windUnit, toggleTemp, toggleWind } = useUnits();
  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorites();
  const { history, addToHistory, clearHistory } = useHistory();
  const [view, setView] = useState('single'); // 'single' | 'compare' | 'map'

  const multi = useMultiWeather();
  const [lastCity, setLastCity] = useState(DEFAULT_CITY);

  const handleFetch = useCallback(
    (city) => {
      setLastCity(city);
      const locationName = city.province
        ? `${city.name}, ${city.province}, ${city.country}`
        : `${city.name}${city.country ? `, ${city.country}` : ''}`;
      fetchWeather(city.latitude, city.longitude, locationName);
    },
    [fetchWeather]
  );

  useEffect(() => {
    handleFetch(DEFAULT_CITY);
  }, [handleFetch]);

  const handleCitySelect = useCallback(
    (city) => {
      handleFetch(city);
      addToHistory(city);
    },
    [handleFetch, addToHistory]
  );

  const autoRefreshCallback = useCallback(() => {
    if (lastCity) handleFetch(lastCity);
  }, [lastCity, handleFetch]);

  const { enabled, setEnabled, lastRefresh, refreshNow } = useAutoRefresh(
    autoRefreshCallback,
    10 * 60 * 1000
  );

  const bgClasses = useMemo(() => {
    if (!weather) {
      return isDark
        ? 'from-slate-950 via-slate-900 to-slate-950'
        : 'from-slate-50 via-white to-slate-100';
    }
    return getBackground(isDark, weather.current.weather_code, weather.current.is_day);
  }, [weather, isDark]);

  const animationType = useMemo(() => {
    if (!weather) return 'none';
    return getAnimationType(weather.current.weather_code, weather.current.is_day);
  }, [weather]);

  const alerts = useMemo(() => generateAlerts(weather, airQuality), [weather, airQuality]);

  return (
    <div className={`relative min-h-screen transition-all duration-1000
                     bg-gradient-to-br ${bgClasses}`}>
      <WeatherAnimation type={animationType} />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 
                        bg-sky-300/10 dark:bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 
                        bg-purple-300/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🌎</span>
            <h1 className="text-2xl md:text-3xl font-bold 
                           bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 
                           dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400 
                           bg-clip-text text-transparent">
              Clima en Tiempo Real
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <UnitToggle
              tempUnit={tempUnit}
              windUnit={windUnit}
              onToggleTemp={toggleTemp}
              onToggleWind={toggleWind}
            />
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </div>

        {/* Pestañas de vista */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setView('single')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all
                       ${view === 'single'
                         ? 'bg-sky-500 text-white shadow-lg'
                         : 'bg-white/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                       }`}
          >
            🌍 Vista individual
          </button>
          <button
            onClick={() => setView('compare')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all relative
                       ${view === 'compare'
                         ? 'bg-sky-500 text-white shadow-lg'
                         : 'bg-white/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                       }`}
          >
            ⚖️ Comparar
            {multi.cities.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] 
                               bg-yellow-400 text-slate-900 font-bold">
                {multi.cities.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setView('map')}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all
                       ${view === 'map'
                         ? 'bg-sky-500 text-white shadow-lg'
                         : 'bg-white/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                       }`}
          >
            🛰️ Mapa satelital
          </button>
        </div>

        <SearchBar
          onSelect={handleCitySelect}
          history={history}
          onClearHistory={clearHistory}
          weather={weather}
          autoRefreshEnabled={enabled}
          onToggleAutoRefresh={() => {
            setEnabled((e) => !e);
            if (!enabled) refreshNow();
          }}
          lastRefresh={lastRefresh}
        />

        <FavoritesBar
          favorites={favorites}
          onSelect={handleCitySelect}
          onRemove={removeFavorite}
        />

        {weather && view === 'single' && (
          <LiveClock timezone={weather.timezone} location={weather.location} />
        )}

        <main className="mt-6 space-y-6">
          {view === 'single' && (
            <>
              {loading && <LoadingSpinner />}

              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700/50 
                                rounded-2xl p-6 text-center">
                  <p className="text-red-700 dark:text-red-300 text-lg mb-2">⚠️ Error</p>
                  <p className="text-red-600 dark:text-red-400/80 text-sm">{error}</p>
                  <button
                    onClick={() => handleFetch(DEFAULT_CITY)}
                    className="mt-4 px-6 py-2 bg-red-200 dark:bg-red-600/30 
                               hover:bg-red-300 dark:hover:bg-red-600/50 
                               rounded-xl text-red-800 dark:text-red-200 text-sm transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {!loading && weather && (
                <>
                  <AlertsBanner alerts={alerts} />
                  <WeatherCard
                    weather={weather}
                    tempUnit={tempUnit}
                    windUnit={windUnit}
                    isFavorite={isFavorite(lastCity)}
                    onToggleFavorite={() => toggleFavorite(lastCity)}
                    onAddToCompare={() => multi.addCity(lastCity)}
                    compareCount={multi.cities.length}
                  />
                  <HourlyForecast hourly={weather.hourly} tempUnit={tempUnit} />

                  <div className="grid md:grid-cols-2 gap-6">
                    <AirQualityCard airQuality={airQuality} />
                    <SunMoonCard weather={weather} />
                  </div>

                  <ForecastCard weather={weather} tempUnit={tempUnit} windUnit={windUnit} />
                </>
              )}
            </>
          )}

          {view === 'compare' && (
            <CompareView
              cities={multi.cities}
              results={multi.results}
              loading={multi.loading}
              onRemove={multi.removeCity}
              onClear={multi.clearCities}
              onAddCurrent={multi.addCity}
              currentCity={lastCity}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />
          )}

          {view === 'map' && <SatelliteRadarMap weather={weather} />}
        </main>

        <footer className="mt-16 text-center text-slate-500 dark:text-slate-600 text-xs">
          <p>
            Datos meteorológicos:{' '}
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer"
               className="text-sky-600 dark:text-sky-500 hover:text-sky-500 dark:hover:text-sky-400 
                          underline underline-offset-2">
              Open-Meteo
            </a>{' '}· Satélite:{' '}
            <a href="https://earthdata.nasa.gov/gibs" target="_blank" rel="noopener noreferrer"
               className="text-sky-600 dark:text-sky-500 hover:text-sky-500 dark:hover:text-sky-400 
                          underline underline-offset-2">
              NASA GIBS
            </a>{' '}· Radar:{' '}
            <a href="https://www.rainviewer.com/" target="_blank" rel="noopener noreferrer"
               className="text-sky-600 dark:text-sky-500 hover:text-sky-500 dark:hover:text-sky-400 
                          underline underline-offset-2">
              RainViewer
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}