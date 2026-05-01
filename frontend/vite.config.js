import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['sherikqurt.uz', '178.105.71.147', 'localhost'],
    hmr: {
      host: 'sherikqurt.uz',
      clientPort: 443,
    },
    proxy: {
      '/api': {
        target: 'http://web:8000',
        changeOrigin: true,
      },
      '/api/token': {
        target: 'http://web:8000',
        changeOrigin: true,
      }
    }
  }
})
