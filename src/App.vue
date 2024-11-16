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

<style scoped>
.ios {
  --primary-color: #007AFF;
  --background-color: #000000;
  --spinner-color: #007AFF;
}

.android {
  --primary-color: #3DDC84;
  --background-color: #121212;
  --spinner-color: #3DDC84;
}

.web {
  --primary-color: #8B5CF6;
  --background-color: #1F2937;
  --spinner-color: #8B5CF6;
}

#app {
  height: 100vh;
  height: var(--app-height);
  background-color: var(--background-color);
  display: flex;
  flex-direction: column;
}

.loading-screen {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 2px solid transparent;
  border-radius: 50%;
  border-top-color: var(--spinner-color);
  border-bottom-color: var(--spinner-color);
  animation: spin 1s linear infinite;
}

.ios #app {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  min-height: -webkit-fill-available;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.2s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
}

@supports (-webkit-touch-callout: none) {
  #app {
    height: -webkit-fill-available;
  }
}
</style>