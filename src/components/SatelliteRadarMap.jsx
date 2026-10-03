// src/components/SatelliteRadarMap.jsx
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, LayersControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import HurricaneLayer from './HurricaneLayer';

// Componente auxiliar para recentrar el mapa cuando cambia la ciudad
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 6, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function SatelliteRadarMap({ weather }) {
  const [radarPath, setRadarPath] = useState(null);
  const [radarError, setRadarError] = useState(false);
  const intervalRef = useRef(null);

  // Coordenadas de la ciudad actual, o La Habana por defecto
  const center = weather
    ? [weather.current.latitude ?? 23.1136, weather.current.longitude ?? -82.3666]
    : [23.1136, -82.3666];

  // Obtener la ruta más reciente del radar de RainViewer
  useEffect(() => {
    const fetchRadar = async () => {
      try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (!res.ok) throw new Error('Error al obtener datos de radar');
        const data = await res.json();
        // La última trama (el "ahora") está en el último elemento de "past"
        const latest = data.radar.past[data.radar.past.length - 1];
        setRadarPath(`${data.host}${latest.path}`);
        setRadarError(false);
      } catch {
        setRadarError(true);
      }
    };

    fetchRadar();
    // Actualizar cada 5 minutos (300000 ms), ya que RainViewer se refresca cada 5 min
    intervalRef.current = setInterval(fetchRadar, 5 * 60 * 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700/50 
                    bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm">
      <div className="p-5 border-b border-slate-200 dark:border-slate-700/50">
        <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-lg flex items-center gap-2">
          🛰️ Satélite y radar meteorológico
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          Satélite: NASA GIBS (GeoColor) · Radar: RainViewer · Huracanes: NOAA
        </p>
      </div>

      <div className="h-[500px] w-full relative">
        <MapContainer
          center={center}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <MapRecenter center={center} />

          <LayersControl position="topright">
            {/* Capa base: mapa de OpenStreetMap */}
            <LayersControl.BaseLayer checked name="🗺️ Mapa (OSM)">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>

            {/* Capa base: imagen satelital NASA GIBS */}
            <LayersControl.BaseLayer name="🛰️ Satélite (NASA)">
              <TileLayer
                url="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GOES-East_ABI_GeoColor/default/default/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png"
                attribution='Imagen satelital: <a href="https://earthdata.nasa.gov/gibs">NASA GIBS</a>'
                maxZoom={7}
                maxNativeZoom={7}
              />
            </LayersControl.BaseLayer>

            {/* Capa overlay: radar de precipitación RainViewer */}
            {radarPath && !radarError && (
              <LayersControl.Overlay checked name="🌧️ Radar (RainViewer)">
                <TileLayer
                  url={`${radarPath}/256/{z}/{x}/{y}/2/1_1.png`}
                  attribution='Radar: <a href="https://www.rainviewer.com/">RainViewer</a>'
                  tileSize={256}
                  opacity={0.7}
                  maxZoom={7}
                  maxNativeZoom={7}
                />
              </LayersControl.Overlay>
            )}

            {/* 👇 NUEVA LÍNEA: Capa de trayectoria de huracanes (NOAA) */}
            <HurricaneLayer />

          </LayersControl>
        </MapContainer>

        {/* Mensaje si el radar no está disponible */}
        {radarError && (
          <div className="absolute bottom-4 left-4 z-[1000] bg-red-100 dark:bg-red-900/50 
                          text-red-700 dark:text-red-200 text-xs px-3 py-2 rounded-lg 
                          border border-red-300 dark:border-red-700">
            ⚠️ Radar no disponible temporalmente
          </div>
        )}
      </div>

      <div className="p-3 text-center text-[11px] text-slate-400 dark:text-slate-500 border-t 
                      border-slate-200 dark:border-slate-700/50">
        Datos satelitales de NASA GIBS · Datos de radar de RainViewer · Huracanes de NOAA
      </div>
    </div>
  );
}