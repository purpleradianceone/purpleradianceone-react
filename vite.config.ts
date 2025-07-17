import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
  }
  ,
  server: {
    allowedHosts: [
      '167513946451.ngrok-free.app', 'https://71f374734896.ngrok-free.app','https://167513946451.ngrok-free.app', 'https://315d7d0f7560.ngrok-free.app' // ← Add your ngrok domain here
    ]
  },
  plugins: [react()],
  define: {
    global: 'globalThis', // 👈 Fix for SockJS requiring "global"
  },
})
