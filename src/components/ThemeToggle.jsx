// src/components/ThemeToggle.jsx
export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="relative w-14 h-8 rounded-full bg-slate-300 dark:bg-slate-700 
                 transition-colors duration-300 flex items-center px-1 
                 hover:bg-slate-400 dark:hover:bg-slate-600"
    >
      <span
        className={`absolute w-6 h-6 rounded-full bg-white dark:bg-slate-900 
                    shadow-md flex items-center justify-center text-xs
                    transition-transform duration-300 
                    ${isDark ? 'translate-x-6' : 'translate-x-0'}`}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}