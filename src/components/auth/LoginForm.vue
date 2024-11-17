<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["submit"]);

const isRegistering = ref(false);
const email = ref("");
const password = ref("");

const handleSubmit = () => {
  emit("submit", {
    email: email.value.toLowerCase(),
    password: password.value,
    isRegistering: isRegistering.value,
  });
};

const toggleMode = () => {
  isRegistering.value = !isRegistering.value;
  email.value = "";
  password.value = "";
};
</script>

<template>
  <div class="login-container" :class="authStore.platform">
    <div class="header">
      <h2 class="title">
        {{ isRegistering ? "Create Account" : "Welcome Back" }}
      </h2>
      <p class="subtitle">
        {{ isRegistering ? "Sign up to get started" : "Sign in to continue" }}
      </p>
    </div>

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

      <button type="submit" :disabled="loading" class="submit-button">
        <span v-if="loading" class="loading-spinner"></span>
        <span v-else>
          {{ isRegistering ? "Create Account" : "Sign In" }}
        </span>
      </button>
    </form>

    <div class="toggle-container">
      <button
        type="button"
        @click="toggleMode"
        :disabled="loading"
        class="toggle-button"
      >
        {{ isRegistering ? "Already have an account? Sign in" : "New here? Create account" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  width: 100%;
  max-width: 24rem;
  padding: 1rem;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #9CA3AF;
  font-size: 0.875rem;
}

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
  font-weight: 500;
  color: #9CA3AF;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #374151;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.input:focus {
  outline: 2px solid #8B5CF6;
  outline-offset: 2px;
}

.input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #EF4444;
  font-size: 0.875rem;
  text-align: center;
}

.submit-button {
  width: 100%;
  padding: 0.875rem;
  background-color: #8B5CF6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #7C3AED;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.toggle-container {
  text-align: center;
  margin-top: 1.5rem;
}

.toggle-button {
  color: #8B5CF6;
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

/* Platform specific styles */
.ios {
  --primary-color: #007AFF;
  --input-bg: #1C1C1E;
}

.ios .input {
  border-radius: 10px;
  background-color: var(--input-bg);
}

.ios .submit-button {
  background-color: var(--primary-color);
  border-radius: 10px;
  font-weight: 600;
}

.ios .toggle-button {
  color: var(--primary-color);
}

.android {
  --primary-color: #3DDC84;
  --input-bg: #2C2C2C;
}

.android .input {
  border-radius: 4px;
  background-color: var(--input-bg);
}

.android .submit-button {
  background-color: var(--primary-color);
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.android .toggle-button {
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .login-container {
    padding: 1.5rem;
  }
  
  .input,
  .submit-button {
    font-size: 16px;
  }
}

@supports (-webkit-touch-callout: none) {
  .input,
  .submit-button,
  .toggle-button {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
}
</style>