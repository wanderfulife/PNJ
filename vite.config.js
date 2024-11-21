import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    headers: {
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
      'firebase/auth',
      'firebase/database'
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