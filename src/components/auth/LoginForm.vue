<script setup>
import { ref, defineEmits } from 'vue'
import BaseInput from '../ui/BaseInput.vue'

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
    email: email.value.toLowerCase(), // Force lowercase pour l'email
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
  <div class="w-full max-w-sm p-4 space-y-6">
    <!-- En-tête -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-white">
        {{ isRegistering ? 'Create Account' : 'Welcome Back' }}
      </h2>
      <p class="mt-2 text-gray-400">
        {{ isRegistering ? 'Sign up to get started' : 'Sign in to continue' }}
      </p>
    </div>

    <!-- Formulaire -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium text-gray-400">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          inputmode="email"
          autocomplete="email"
          autocapitalize="none"
          required
          :disabled="loading"
          class="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="your@email.com"
        />
      </div>

      <div class="space-y-2">
        <label for="password" class="block text-sm font-medium text-gray-400">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          :disabled="loading"
          class="w-full bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="••••••••"
        />
      </div>

      <div v-if="error" class="text-sm text-red-500 text-center">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <template v-if="loading">
          <span class="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
        </template>
        <template v-else>
          {{ isRegistering ? 'Create Account' : 'Sign In' }}
        </template>
      </button>
    </form>

    <!-- Toggle Mode -->
    <div class="text-center">
      <button
        type="button"
        @click="toggleMode"
        :disabled="loading"
        class="text-purple-400 hover:text-purple-300 text-sm disabled:opacity-50 py-2 px-4"
      >
        {{ isRegistering ? 'Already have an account? Sign in' : 'New here? Create account' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Prevent iOS zoom on input focus */
@supports (-webkit-touch-callout: none) {
  input {
    font-size: 16px !important;
  }
}

/* Augmenter la zone de tap pour les boutons sur mobile */
button {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
</style>