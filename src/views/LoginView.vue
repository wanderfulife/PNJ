<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '../components/auth/LoginForm.vue'
import { useAuthStore } from '../stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const handleSubmit = async ({ email, password, isRegistering }) => {
  try {
    const action = isRegistering ? authStore.register : authStore.login
    await action(email, password)
    
    await router.replace('/chat')
  } catch (err) {
    console.error('Auth error:', err)
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-900">
    <!-- Safe Area Top -->
    <div class="safe-area-top bg-gray-900" />

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <LoginForm
        :loading="authStore.loading"
        :error="authStore.error"
        @submit="handleSubmit"
      />
    </main>

    <!-- Safe Area Bottom -->
    <div class="safe-area-bottom bg-gray-900" />
  </div>
</template>

<style>
:root {
  --viewport-height: 100vh;
}

@supports (-webkit-touch-callout: none) {
  .min-h-screen {
    min-height: var(--viewport-height);
  }
}
</style>