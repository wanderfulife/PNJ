import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initializeFirebase } from './firebase/config'
import './style.css'

// Create application
const app = createApp(App)
const pinia = createPinia()

// Error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)
}

// Warning handler
app.config.warnHandler = (msg, vm, trace) => {
  console.warn('Global warning:', msg)
  console.warn('Component:', vm)
  console.warn('Trace:', trace)
}

// Initialize Firebase
const initApp = async () => {
  try {
    await initializeFirebase()
    app.use(pinia)
    app.use(router)
    app.mount('#app')
  } catch (error) {
    console.error('Error initializing app:', error)
  }
}

// Start the application
initApp()