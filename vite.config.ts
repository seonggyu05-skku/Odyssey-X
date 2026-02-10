import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Using PostCSS for tailwind instead of the vite plugin to avoid build hangs
export default defineConfig({
  plugins: [
    react(),
  ],
})
