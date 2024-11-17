import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
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
    },
    cssCodeSplit: true,
    cssMinify: true
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    },
    include: [
      'vue',
      '@capacitor/core',
      'lucide-vue-next',
      'pinia',
      'vue-router',
      'firebase/app',
      'firebase/auth'
    ]
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  css: {
    devSourcemap: true,
    modules: {
      scopeBehaviour: 'local'
    },
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  }
})