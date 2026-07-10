// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:61147', changeOrigin: true },
      // Uploaded PDFs are served by the API at /files/** — proxy so the in-app
      // PDF viewer (and "Open PDF") work in dev too.
      '/files': { target: 'http://localhost:61147', changeOrigin: true }
    }
  }
})
