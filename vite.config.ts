import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
        '/api': 'http://localhost:8080', // Adjust this to your backend URL
    },
},
  plugins: [react()],
})
