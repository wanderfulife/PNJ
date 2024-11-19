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
    :style="{ minHeight: `${screenHeight}px` }"
  >
    <div class="safe-area-top" />

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
  background-color: var(--color-background);
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

/* Platform specific styles */
.ios {
  font-family: var(--platform-font);
}

.android {
  font-family: var(--platform-font);
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

/* Mobile height handling */
@supports (-webkit-touch-callout: none) {
  .login-view {
    position: fixed;
    inset: 0;
    overflow-y: auto;
  }
}
</style>