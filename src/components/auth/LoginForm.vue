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
  }
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

      <div v-if="error" class="error-message" role="alert">
        {{ error }}
      </div>

      <button type="submit" :disabled="loading" class="submit-button">
        <span v-if="loading" class="loading-spinner" aria-hidden="true" />
        <span>{{ isRegistering ? "Create Account" : "Sign In" }}</span>
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
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--color-text-secondary);
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
  color: var(--color-text-secondary);
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--platform-radius);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.input:focus {
  border-color: var(--platform-primary);
  outline: none;
}

.input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: var(--color-error);
  font-size: 0.875rem;
  text-align: center;
  animation: shake 0.5s ease;
}

.submit-button {
  width: 100%;
  padding: 0.875rem;
  background-color: var(--platform-primary);
  color: white;
  border: none;
  border-radius: var(--platform-radius);
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.2s;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.toggle-container {
  margin-top: 1.5rem;
  text-align: center;
}

.toggle-button {
  color: var(--platform-primary);
  background: none;
  border: none;
  font-size: 0.875rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.toggle-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Platform specific styles */
.ios {
  --form-radius: 10px;
  
  .input {
    border-radius: var(--form-radius);
  }
  
  .submit-button {
    border-radius: var(--form-radius);
    font-weight: 600;
  }
}

.android {
  --form-radius: 4px;
  
  .input {
    border-radius: var(--form-radius);
  }
  
  .submit-button {
    border-radius: var(--form-radius);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .toggle-button {
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .login-container {
    padding: 1.5rem;
  }
  
  .input,
  .submit-button {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}

/* Touch optimizations */
@media (hover: none) {
  .input,
  .submit-button,
  .toggle-button {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
  }
  
  .error-message {
    animation: none;
  }
  
  .input,
  .submit-button {
    transition: none;
  }
}
</style>