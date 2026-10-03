// src/hooks/useUnits.js
import { useState, useEffect } from 'react';

export function useUnits() {
  const [tempUnit, setTempUnit] = useState(() => localStorage.getItem('tempUnit') || 'C');
  const [windUnit, setWindUnit] = useState(() => localStorage.getItem('windUnit') || 'kmh');

  useEffect(() => {
    localStorage.setItem('tempUnit', tempUnit);
    localStorage.setItem('windUnit', windUnit);
  }, [tempUnit, windUnit]);

  const toggleTemp = () => setTempUnit((u) => (u === 'C' ? 'F' : 'C'));
  const toggleWind = () => setWindUnit((u) => (u === 'kmh' ? 'mph' : 'kmh'));

  return { tempUnit, windUnit, toggleTemp, toggleWind };
}