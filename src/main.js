import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { auth } from './firebase/config'

const app = createApp(App)
app.mount('#app')