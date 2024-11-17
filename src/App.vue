<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()
const appReady = ref(false)

const handleResize = () => {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
}

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  handleResize()

  try {
    await authStore.checkAuthState()
    if (authStore.user) {
      await router.replace('/chat')
    }
    setTimeout(() => {
      appReady.value = true
    }, 100)
  } catch (error) {
    console.error(`Error initializing app:`, error)
    appReady.value = true
  }
})
</script>

<template>
  <div id="app" :class="authStore.platform">
    <!-- Initial loading screen -->
    <div v-if="!appReady" class="loading-screen">
      <div class="loading-spinner"></div>
    </div>

    <!-- Main content -->
    <router-view 
      v-else 
      v-slot="{ Component }"
    >
      <transition name="page-transition" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
/* Ces variables CSS remplacent style.css */
:root {
  /* Couleurs de base */
  --color-primary: #8B5CF6;
  --color-primary-dark: #7C3AED;
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;

  /* Couleurs de fond et texte */
  --color-background: #111827;
  --color-surface: #1F2937;
  --color-surface-light: #374151;
  --color-text: #FFFFFF;
  --color-text-secondary: #9CA3AF;
  --color-border: #374151;

  /* Typographie */
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;

  /* Espacement */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;

  /* Animation */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;

  /* Z-index */
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-modal: 30;
  --z-popup: 40;
}

/* Styles de base */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
  font-family: var(--font-sans);
  -webkit-text-size-adjust: 100%;
}

body {
  height: 100%;
  margin: 0;
  background-color: var(--color-background);
  color: var(--color-text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Platform-specific variables */
.ios {
  /* iOS specific */
  --safe-area-inset-top: env(safe-area-inset-top);
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  --platform-radius: 10px;
  --platform-primary: #007AFF;
  --platform-font: -apple-system, BlinkMacSystemFont, sans-serif;
}

.android {
  /* Android specific */
  --platform-radius: 4px;
  --platform-primary: #3DDC84;
  --platform-font: Roboto, sans-serif;
}

.web {
  /* Web specific */
  --platform-radius: 8px;
  --platform-primary: var(--color-primary);
  --platform-font: var(--font-sans);
}

/* Loading screen */
.loading-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--color-surface);
  border-top-color: var(--platform-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Page transitions */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity var(--transition-base);
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
}

/* Utilitaires d'accessibilité */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Optimisations tactiles */
@media (hover: none) {
  * {
    cursor: default !important;
  }

  input, 
  button {
    font-size: 16px; /* Prevent zoom on iOS */
    touch-action: manipulation;
  }
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Support des préférences de mouvement réduit */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>