<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import LoginForm from "@/components/auth/LoginForm.vue";

const router = useRouter();
const authStore = useAuthStore();
const platformClass = computed(() => authStore.platform?.toLowerCase());
const screenHeight = computed(() => window.innerHeight);

const handleSubmit = async ({ email, password, isRegistering }) => {
  try {
    if (isRegistering) {
      await authStore.register(email, password);
    } else {
      await authStore.login(email, password);
    }
    await router.push("/chat");
  } catch (error) {
    console.error("Authentication error:", error);
  }
};
</script>

<template>
  <div 
    :class="['login-view', platformClass]"
    :style="{ minHeight: `${screenHeight}px` }">
    <div  />

    <main class="login-content">
      <LoginForm
        :loading="authStore.loading"
        :error="authStore.error"
        @submit="handleSubmit"
      />
    </main>

    <div class="safe-area-bottom" />
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
}

.login-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
  gap: var(--spacing-8);
}

.brand {
  text-align: center;
  animation: fadeIn var(--transition-base);
}

.brand-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-2);
}

.brand-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

/* Platform specific styles */
.ios {
  font-family: var(--platform-font);
}

.ios .brand-title {
  font-weight: 600;
  letter-spacing: -0.02em;
}

.android {
  font-family: var(--platform-font);
}

.android .brand-title {
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .login-content {
    padding: var(--spacing-8);
    max-width: 28rem;
    margin: 0 auto;
    width: 100%;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile height handling */
@supports (-webkit-touch-callout: none) {
  .login-view {
    /* Remove min-height: -webkit-fill-available since we're using dynamic height */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
  }
}
</style>