import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initializeFirebase } from './firebase/config'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

// Initialize Firebase
initializeFirebase().catch(console.error)

app.use(pinia)
app.use(router)
app.mount('#app')