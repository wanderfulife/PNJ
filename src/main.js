import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeFirebase } from './firebase/config'
import './style.css'

// Initialize Firebase
initializeFirebase().catch(console.error)

const app = createApp(App)
app.use(router)
app.mount('#app')