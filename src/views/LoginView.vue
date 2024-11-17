<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleSubmit = async ({ email, password, isRegistering }) => {
  try {
    if (isRegistering) {
      await authStore.register(email, password)
    } else {
      await authStore.login(email, password)
    }
    await router.push('/chat')
  } catch (error) {
    console.error('Authentication error:', error)
  }
}
</script>

<template>
  <div class="login-view">
    <!-- Safe Area Top -->
    <div class="safe-area-top"></div>

    <!-- Main Content -->
    <main class="login-content">
      <LoginForm
        :loading="authStore.loading"
        :error="authStore.error"
        @submit="handleSubmit"
      />
    </main>

    <!-- Safe Area Bottom -->
    <div class="safe-area-bottom"></div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background);
}

.login-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--spacing-4);
}

@media (min-width: 640px) {
  .login-content {
    padding: 0 var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .login-content {
    padding: 0 var(--spacing-8);
  }
}

/* Fix for mobile viewport height */
@supports (-webkit-touch-callout: none) {
  .login-view {
    min-height: var(--app-height);
  }
}
</style>