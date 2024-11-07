<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from './composables/useAuth'
import { useRouter } from 'vue-router'

const { user, loading: authLoading, isInitialized } = useAuth()
const router = useRouter()

// State for initial app loading
const appReady = ref(false)

// App initialization
onMounted(async () => {
  try {
    // Wait for auth to initialize
    await new Promise(resolve => {
      const unwatch = watch(isInitialized, (initialized) => {
        if (initialized) {
          unwatch()
          resolve()
        }
      }, { immediate: true })
    })
    
    // Handle routing based on auth state
    if (user.value) {
      await router.replace('/chat')
    } else {
      await router.replace('/login')
    }
    
    // Short delay for transitions
    setTimeout(() => {
      appReady.value = true
    }, 100)
  } catch (error) {
    console.error('Error initializing app:', error)
    appReady.value = true
  }
})
</script>

<template>
  <div id="app" class="bg-gray-900">
    <!-- Initial loading screen -->
    <div
      v-if="!appReady || !isInitialized"
      class="h-full flex items-center justify-center"
    >
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>

    <!-- Main content -->
    <router-view v-else v-slot="{ Component }">
      <transition name="page-transition" mode="out-in">
        <component :is="Component" :current-user="user" />
      </transition>
    </router-view>

    <!-- Auth loading overlay -->
    <div
      v-if="authLoading && appReady"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-purple-500"></div>
    </div>
  </div>
</template>

<style>
#app {
  height: 100vh;
  height: var(--app-height);
  display: flex;
  flex-direction: column;
}

.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.2s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
}
</style>