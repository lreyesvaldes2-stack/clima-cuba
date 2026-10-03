/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',   // ← ESTA LÍNEA ES CLAVE para modo oscuro/claro
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}