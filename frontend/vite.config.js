import { defineConfig } from 'vite'
import autoprefixer from 'autoprefixer'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.js'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: [
      'localhost',
      '*.ngrok-free.app',
      '*.ngrok.io'
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router')) {
            return 'vendor-react'
          }
          
          // UI libraries
          if (id.includes('node_modules/bootstrap') || 
              id.includes('node_modules/react-bootstrap') || 
              id.includes('node_modules/@radix-ui')) {
            return 'vendor-ui'
          }
          
          // Animation
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer'
          }
          
          // Maps
          if (id.includes('node_modules/leaflet') || 
              id.includes('node_modules/react-leaflet')) {
            return 'vendor-leaflet'
          }
          
          // Charts
          if (id.includes('node_modules/chart.js') || 
              id.includes('node_modules/react-chartjs')) {
            return 'vendor-charts'
          }
          
          // Utilities
          if (id.includes('node_modules/axios') || 
              id.includes('node_modules/date-fns') || 
              id.includes('node_modules/lodash') ||
              id.includes('node_modules/@tanstack')) {
            return 'vendor-utils'
          }
          
          // Admin/Dashboard pages (lazy load)
          if (id.includes('pages/Admin') || 
              id.includes('pages/Tienda/Dashboard') ||
              id.includes('pages/Cliente/Dashboard')) {
            return 'pages-dashboard'
          }
          
          // Repartidor pages (lazy load)  
          if (id.includes('pages/Repartidor')) {
            return 'pages-repartidor'
          }
          
          // Other vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    },
    chunkSizeWarningLimit: 500,
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer
      ]
    }
  },
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})