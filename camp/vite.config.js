// camp/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0', // Разрешает прослушивание всех интерфейсов
    port: 5173,
    // 👇 ДОБАВЬТЕ ЭТУ СТРОКУ
    allowedHosts: ['summer-camp-1.ru'], 
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://backend:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})