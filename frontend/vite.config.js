import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./figma-master/src', import.meta.url)),
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
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-separator',
            '@radix-ui/react-switch'
          ],
          'vendor-heroui': ['@heroui/react', '@heroui/theme', 'framer-motion'],
          'vendor-leaflet': ['leaflet', 'react-leaflet'],
          'vendor-bootstrap': ['bootstrap', 'react-bootstrap'],
          'vendor-utils': ['axios', 'date-fns', 'lodash']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
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