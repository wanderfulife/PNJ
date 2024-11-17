import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',  // Enable connections from all IPs
    port: 5173,       // Explicitly set port
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    rollupOptions: {
      output: {
        format: 'es'
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})