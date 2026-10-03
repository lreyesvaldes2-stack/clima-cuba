// src/components/HurricaneLayer.jsx
import { useState, useEffect } from 'react';
import { GeoJSON, LayersControl } from 'react-leaflet';

// URL del servicio de la NOAA que contiene el cono de error y el área de peligro
// de los huracanes activos en la cuenca del Atlántico.
const NOAA_CONE_URL = 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Active_Hurricanes_v1/FeatureServer/4/query?where=1%3D1&outFields=*&f=geojson';

export default function HurricaneLayer() {
  const [hurricaneData, setHurricaneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHurricaneData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(NOAA_CONE_URL);
        if (!res.ok) throw new Error('Error al obtener datos de huracanes');
        const data = await res.json();
        setHurricaneData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHurricaneData();
    // Actualizar cada 30 minutos (los conos se actualizan con cada aviso, aprox. cada 6 horas, pero 30 min es un buen balance)
    const interval = setInterval(fetchHurricaneData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Función para dar estilo a cada elemento GeoJSON según su tipo
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.STORMNAME) {
      // Añadir un tooltip con el nombre de la tormenta
      layer.bindTooltip(feature.properties.STORMNAME, { sticky: true });
    }

    // Personalizar el estilo según el tipo de geometría o propiedades
    // (Esta es una simplificación, se puede refinar)
    if (feature.geometry.type === 'Polygon') {
      // El cono de error
      layer.setStyle({
        color: '#ff7800',
        weight: 2,
        opacity: 0.8,
        fillColor: '#ff7800',
        fillOpacity: 0.15,
      });
    } else if (feature.geometry.type === 'LineString') {
      // La trayectoria pronosticada
      layer.setStyle({
        color: '#ff0000',
        weight: 3,
        opacity: 0.9,
        dashArray: '5, 10',
      });
    }
  };

  if (loading || error || !hurricaneData) {
    // No mostrar nada si no hay datos o hay un error para no sobrecargar el mapa
    return null;
  }

  return (
    <LayersControl.Overlay name="🌀 Trayectoria de Huracanes">
      <GeoJSON
        data={hurricaneData}
        onEachFeature={onEachFeature}
        // Puedes añadir un estilo general aquí si lo prefieres
      />
    </LayersControl.Overlay>
  );
}