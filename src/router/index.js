// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'

// Route components
const LoginView = () => import('../views/LoginView.vue')
const ChatView = () => import('../views/ChatView.vue')
const SettingsView = () => import('../views/SettingsView.vue')

// Routes configuration
const routes = [
  {
    path: '/',
    redirect: '/chat'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { 
      requiresGuest: true,
      title: 'Login'
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatView,
    meta: { 
      requiresAuth: true,
      title: 'Chat'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: {
      requiresAuth: true,
      title: 'Settings'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/chat'
  }
]

// Router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  // Set page title
  document.title = to.meta.title ? `PNJ - ${to.meta.title}` : 'PNJ'
  
  const authStore = useAuthStore()
  
  // Si l'état d'authentification n'est pas encore initialisé, attendez
  if (!authStore.isInitialized) {
    await authStore.checkAuthState()
  }
  
  if (requiresAuth && !authStore.user) {
    next({ 
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  else if (requiresGuest && authStore.user) {
    next('/chat')
  }
  else {
    next()
  }
})

export default router