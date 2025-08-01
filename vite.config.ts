import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
   server: {
    port: 80,
    host: true // opcional, si quieres acceder desde otras máquinas en la red
  }
})
