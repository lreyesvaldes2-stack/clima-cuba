// src/hooks/useAutoRefresh.js
import { useEffect, useRef, useState } from 'react';

export function useAutoRefresh(callback, intervalMs = 10 * 60 * 1000) {
  const [enabled, setEnabled] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => {
      savedCallback.current?.();
      setLastRefresh(new Date());
    }, intervalMs);

    return () => clearInterval(id);
  }, [enabled, intervalMs]);

  const refreshNow = () => {
    savedCallback.current?.();
    setLastRefresh(new Date());
  };

  return { enabled, setEnabled, lastRefresh, refreshNow };
}