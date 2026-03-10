import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',// Isse '0.0.0.0' enable ho jata hai (All network interfaces)
    port: 5173,      // Aapka default port
    strictPort: true // Agar port busy ho toh ye fail ho jaye, doosre port par na jaye
  }
})