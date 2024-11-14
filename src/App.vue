<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const appReady = ref(false)

// Simulate a user for testing
const currentUser = {
  uid: 'test123',
  email: 'test@student.42.fr',
  avatar: '/api/placeholder/32/32'
}

onMounted(async () => {
  // For testing, we'll automatically go to chat view
  try {
    await router.replace('/chat')
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
      v-if="!appReady"
      class="h-full flex items-center justify-center"
    >
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>

    <!-- Main content -->
    <router-view 
      v-else 
      v-slot="{ Component }"
      :current-user="currentUser"
    >
      <transition name="page-transition" mode="out-in">
        <component :is="Component" :current-user="currentUser" />
      </transition>
    </router-view>
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

/* Mobile height fix */
@supports (-webkit-touch-callout: none) {
  #app {
    height: -webkit-fill-available;
  }
}
</style>