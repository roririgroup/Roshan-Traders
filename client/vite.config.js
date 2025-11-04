import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.lottie'],
<<<<<<< HEAD
=======
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://localhost:7700',
        changeOrigin: true,
      },
    },
  },
>>>>>>> c9f10485ce667d750f74ff46fc726fc7d1982858
})
