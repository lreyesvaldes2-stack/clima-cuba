// src/hooks/useGeolocation.js
import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = new Error('Geolocalización no soportada por el navegador');
        setError(err.message);
        reject(err);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocoding con Nominatim (OpenStreetMap, gratis)
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=es`,
              { headers: { 'User-Agent': 'ClimaApp/1.0' } }
            );
            const data = await res.json();
            const name =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.municipality ||
              data.address?.state ||
              'Mi ubicación';
            resolve({
              name,
              province: data.address?.state || '',
              country: data.address?.country || '',
              latitude,
              longitude,
            });
          } catch {
            resolve({
              name: 'Mi ubicación',
              province: '',
              country: '',
              latitude,
              longitude,
            });
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          const msg =
            err.code === 1 ? 'Permiso de ubicación denegado' :
            err.code === 2 ? 'Ubicación no disponible' :
            'Tiempo de espera agotado';
          setError(msg);
          setLoading(false);
          reject(new Error(msg));
        },
        { timeout: 10000, enableHighAccuracy: false, maximumAge: 60000 }
      );
    });
  }, []);

  return { getLocation, loading, error };
}