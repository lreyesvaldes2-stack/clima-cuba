// src/components/ShareButton.jsx
import { useState } from 'react';

export default function ShareButton({ weather }) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (!weather) return null;

  const temp = Math.round(weather.current.temperature_2m);
  const desc = weather.current.weather_code;
  const text = `🌎 Clima en ${weather.location}: ${temp}°C`;

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setShowMenu(false);
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank'
    );
    setShowMenu(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowMenu(false);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Clima en Tiempo Real',
          text,
          url: window.location.href,
        });
      } catch {
        // Usuario canceló
      }
    } else {
      setShowMenu((s) => !s);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={nativeShare}
        title="Compartir clima"
        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 
                   text-slate-800 dark:text-slate-200 text-sm font-semibold
                   hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors
                   border border-slate-300 dark:border-slate-700 flex items-center gap-1.5"
      >
        📤 <span className="hidden sm:inline">Compartir</span>
      </button>

      {showMenu && (
        <div className="absolute top-full right-0 mt-2 w-48 z-50
                        bg-white dark:bg-slate-800 
                        rounded-2xl border border-slate-300 dark:border-slate-700
                        shadow-2xl overflow-hidden">
          <button
            onClick={shareWhatsApp}
            className="w-full px-4 py-3 text-left text-sm flex items-center gap-2
                       hover:bg-slate-100 dark:hover:bg-slate-700/70 
                       transition-colors border-b border-slate-200 dark:border-slate-700/50"
          >
            <span className="text-lg">💬</span> WhatsApp
          </button>
          <button
            onClick={shareTwitter}
            className="w-full px-4 py-3 text-left text-sm flex items-center gap-2
                       hover:bg-slate-100 dark:hover:bg-slate-700/70 
                       transition-colors border-b border-slate-200 dark:border-slate-700/50"
          >
            <span className="text-lg">🐦</span> Twitter / X
          </button>
          <button
            onClick={copyToClipboard}
            className="w-full px-4 py-3 text-left text-sm flex items-center gap-2
                       hover:bg-slate-100 dark:hover:bg-slate-700/70 
                       transition-colors"
          >
            <span className="text-lg">{copied ? '✅' : '📋'}</span>
            {copied ? '¡Copiado!' : 'Copiar texto'}
          </button>
        </div>
      )}
    </div>
  );
}