// src/components/WeatherAnimation.jsx
import { useMemo } from 'react';

export default function WeatherAnimation({ type }) {
  const particles = useMemo(() => {
    if (type === 'rain' || type === 'storm') {
      return Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.45 + Math.random() * 0.45,
        length: 12 + Math.random() * 22,
      }));
    }
    if (type === 'snow') {
      return Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 4,
        size: 2 + Math.random() * 4,
      }));
    }
    if (type === 'stars') {
      return Array.from({ length: 90 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 70,
        delay: Math.random() * 3,
        duration: 1.5 + Math.random() * 2,
        size: 1 + Math.random() * 2,
      }));
    }
    return [];
  }, [type]);

  if (!type || type === 'none') return null;

  if (type === 'rain' || type === 'storm') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute top-0 w-[2px] bg-gradient-to-b from-transparent via-sky-300/50 to-sky-400/80"
            style={{
              left: `${p.left}%`,
              height: `${p.length}px`,
              animation: `rain-drop ${p.duration}s linear ${p.delay}s infinite`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
        {type === 'storm' && (
          <div
            className="absolute inset-0 bg-white"
            style={{ animation: 'lightning-flash 6s ease-in-out infinite' }}
          />
        )}
      </div>
    );
  }

  if (type === 'snow') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute top-0 rounded-full bg-white/85 shadow-sm"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `snow-fall ${p.duration}s linear ${p.delay}s infinite`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'stars') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `star-twinkle ${p.duration}s ease-in-out ${p.delay}s infinite`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'sun') {
    return (
      <div className="fixed top-0 right-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div
          className="w-[500px] h-[500px] -mt-40 -mr-40 rounded-full 
                     bg-gradient-to-br from-yellow-200/50 via-amber-300/30 to-transparent blur-3xl"
          style={{ animation: 'sun-pulse 5s ease-in-out infinite' }}
        />
      </div>
    );
  }

  return null;
}