import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initializeFirebase } from './firebase/config'

// Create application instance and store once
const app = createApp(App)
const pinia = createPinia()

// Centralized error handling
const handleError = (err, vm, info) => {
  console.error('Error:', {
    message: err,
    component: vm?._isVue ? {
      name: vm.$options?.name,
      props: vm.$props
    } : vm,
    info
  })
}

// Configure app-wide handlers
app.config.errorHandler = handleError
app.config.warnHandler = (msg, vm, trace) => {
  console.warn('Warning:', {
    message: msg,
    component: vm?._isVue ? {
      name: vm.$options?.name,
      props: vm.$props
    } : vm,
    trace
  })
}

// Initialize app with error boundary
const initApp = async () => {
  try {
    await initializeFirebase()
    
    // Install plugins
    app.use(pinia)
    app.use(router)
    
    // Mount application
    app.mount('#app')
  } catch (error) {
    handleError(error, null, 'App initialization failed')
  }
}

// Start the application
initApp()

// Export for testing purposes if needed
export { app, pinia }