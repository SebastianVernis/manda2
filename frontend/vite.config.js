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
        manualChunks: {
          'react': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'ui': ['react-bootstrap', '@radix-ui/react-avatar', '@radix-ui/react-dialog'],
          'vendor': ['axios', 'lodash', '@tanstack/react-query']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
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