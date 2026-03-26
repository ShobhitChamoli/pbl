import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React and related libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Separate chart library (one of the largest dependencies)
          'charts': ['recharts'],
          // Separate UI libraries
          'ui-vendor': ['framer-motion', 'lucide-react', 'react-joyride', 'react-circular-progressbar', 'react-countup'],
          // Separate utility libraries
          'utils': ['axios', 'jspdf', 'jspdf-autotable', 'xlsx']
        }
      }
    },
    // Increase chunk size warning limit to 600kb (from default 500kb)
    chunkSizeWarningLimit: 600,
  }
})
