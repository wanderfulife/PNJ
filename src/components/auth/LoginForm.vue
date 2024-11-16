<script setup>
import { ref, defineEmits } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'


const authStore = useAuthStore()

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit'])

const isRegistering = ref(false)
const email = ref('')
const password = ref('')

const handleSubmit = () => {
  emit('submit', {
    email: email.value.toLowerCase(),
    password: password.value,
    isRegistering: isRegistering.value
  })
}

const toggleMode = () => {
  isRegistering.value = !isRegistering.value
  email.value = ''
  password.value = ''
}
</script>

<template>
  <div class="login-container" :class="authStore.platform">
    <!-- En-tête -->
    <div class="header">
      <h2 class="title">
        {{ isRegistering ? 'Create Account' : 'Welcome Back' }}
      </h2>
      <p class="subtitle">
        {{ isRegistering ? 'Sign up to get started' : 'Sign in to continue' }}
      </p>
    </div>

    <!-- Formulaire -->
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="email" class="label">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          inputmode="email"
          autocomplete="email"
          autocapitalize="none"
          required
          :disabled="loading"
          class="input"
          placeholder="your@email.com"
        />
      </div>

      <div class="form-group">
        <label for="password" class="label">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          :disabled="loading"
          class="input"
          placeholder="••••••••"
        />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="submit-button"
      >
        <span v-if="loading" class="loading-spinner"></span>
        <span v-else>
          {{ isRegistering ? 'Create Account' : 'Sign In' }}
        </span>
      </button>
    </form>

    <!-- Toggle Mode -->
    <div class="toggle-container">
      <button
        type="button"
        @click="toggleMode"
        :disabled="loading"
        class="toggle-button"
      >
        {{ isRegistering ? 'Already have an account? Sign in' : 'New here? Create account' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Variables par plateforme */
.ios {
  --primary-color: #007AFF;
  --primary-hover: #0051a8;
  --input-bg: #1C1C1E;
  --label-color: #8E8E93;
  --error-color: #FF453A;
  --text-color: #FFFFFF;
  --border-radius: 10px;
}

.android {
  --primary-color: #3DDC84;
  --primary-hover: #2ea864;
  --input-bg: #2C2C2C;
  --label-color: #9E9E9E;
  --error-color: #CF6679;
  --text-color: #FFFFFF;
  --border-radius: 8px;
}

.web {
  --primary-color: #8B5CF6;
  --primary-hover: #6D28D9;
  --input-bg: #374151;
  --label-color: #9CA3AF;
  --error-color: #EF4444;
  --text-color: #FFFFFF;
  --border-radius: 8px;
}

/* Conteneur principal */
.login-container {
  width: 100%;
  max-width: 24rem;
  padding: 1rem;
  margin: 0 auto;
}

/* En-tête */
.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--label-color);
  font-size: 0.875rem;
}

/* Formulaire */
.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  color: var(--label-color);
  font-weight: 500;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--input-bg);
  color: var(--text-color);
  border: none;
  border-radius: var(--border-radius);
  font-size: 16px; /* Empêche le zoom sur iOS */
}

.input:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Message d'erreur */
.error-message {
  color: var(--error-color);
  font-size: 0.875rem;
  text-align: center;
  margin-top: 0.5rem;
}

/* Bouton de soumission */
.submit-button {
  width: 100%;
  padding: 0.875rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Spinner de chargement */
.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Toggle button */
.toggle-container {
  text-align: center;
  margin-top: 1.5rem;
}

.toggle-button {
  color: var(--primary-color);
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.toggle-button:hover:not(:disabled) {
  opacity: 0.8;
}

.toggle-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Optimisations mobiles */
@supports (-webkit-touch-callout: none) {
  .input, button {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
}

/* Safe areas iOS */
.ios .login-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>