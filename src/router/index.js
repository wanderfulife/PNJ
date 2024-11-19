import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'

// Lazy-loaded route components with consistent naming
const routes = [
  {
    path: '/',
    redirect: '/chat'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { 
      requiresGuest: true,
      title: 'Login'
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/ChatView.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Chat'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
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

// Router instance with history mode
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Get auth requirements
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  // Update document title
  document.title = to.meta.title ? `PNJ - ${to.meta.title}` : 'PNJ'
  
  const authStore = useAuthStore()
  
  // Wait for auth initialization if needed
  if (!authStore.isInitialized) {
    await authStore.checkAuthState()
  }
  
  // Handle auth navigation
  if (requiresAuth && !authStore.user) {
    return next({ 
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  
  if (requiresGuest && authStore.user) {
    return next('/chat')
  }
  
  next()
})

export default router