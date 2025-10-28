import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.lottie'],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:7700',
        changeOrigin: true,
      },
    },
  },
})
