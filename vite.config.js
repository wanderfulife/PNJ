import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2020',  // Set target to ES2020 to support top-level await
    rollupOptions: {
      output: {
        format: 'es'  // Ensure output is in ES module format
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'  // Ensure esbuild also targets ES2020
    }
  }
})