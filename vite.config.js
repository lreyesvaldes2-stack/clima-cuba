// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠️ Debe coincidir EXACTAMENTE con el nombre del repo en GitHub
export default defineConfig({
  plugins: [react()],
  base: '/clima-cuba/',
})