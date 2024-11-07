import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config'

// Route components
const LoginView = () => import('../views/LoginView.vue')
const ChatView = () => import('../views/ChatView.vue')

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
    path: '/:pathMatch(.*)*',
    redirect: '/chat'
  }
]

// Router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  // Set page title
  document.title = to.meta.title ? `PNJ - ${to.meta.title}` : 'PNJ'
  
  // Wait for Firebase to initialize
  const user = await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe()
      resolve(user)
    })
  })
  
  // Handle navigation based on auth state
  if (requiresAuth && !user) {
    next({ 
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  else if (requiresGuest && user) {
    next('/chat')
  }
  else {
    next()
  }
})

export default router