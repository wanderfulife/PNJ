import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import {initializeAuthForPlatform } from './firebase/config'

async function initializeApp() {
  try {
    await initializeAuthForPlatform()
  } catch (error) {
    console.error('Failed to initialize auth:', error)
  }
  
  const app = createApp(App)
  app.use(router)
  app.mount('#app')
}

initializeApp()