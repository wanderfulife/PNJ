<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '../components/auth/LoginForm.vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login, register } = useAuth()
const loading = ref(false)
const error = ref('')

const handleSubmit = async ({ email, password, isRegistering }) => {
  try {
    loading.value = true
    error.value = ''
    
    const action = isRegistering ? register : login
    await action(email, password)
    
    // Rediriger vers /chat après une connexion réussie
    await router.replace('/chat')
  } catch (err) {
    console.error('Auth error:', err)
    error.value = err.message || 'An error occurred'
  } finally {
    loading.value = false
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
        :loading="loading"
        :error="error"
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