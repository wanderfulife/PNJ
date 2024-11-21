<script setup>
import { ref } from "vue";
import { useChatStore } from "@/stores/useChatStore";

const emit = defineEmits(["close"]);
const chatStore = useChatStore();

const email = ref("");
const loading = ref(false);
const error = ref("");

const handleSubmit = async () => {
  if (!email.value || loading.value) return;

  try {
    loading.value = true;
    const chatId = await chatStore.createChat(email.value);
    if (chatId) {
      emit("close");
    }
  } catch (e) {
    error.value = e.message || "Failed to create chat";
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  if (!loading.value) {
    emit("close");
  }
};
</script>

<template>
  <div class="dialog-overlay" @click.self="handleCancel">
    <div class="dialog-content">
      <h2 class="dialog-title">New Conversation</h2>

      <form @submit.prevent="handleSubmit" class="dialog-form">
        <div class="form-group">
          <label for="email" class="form-label">Friend's Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="form-input"
            placeholder="Enter email address"
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <div class="dialog-actions">
          <button
            type="button"
            class="cancel-button"
            @click="handleCancel"
            :disabled="loading"
          >
            Cancel
          </button>
          <button type="submit" class="submit-button" :disabled="loading">
            <span v-if="loading">Creating...</span>
            <span v-else>Start Chat</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.dialog-content {
  background-color: var(--color-surface);
  border-radius: var(--platform-radius);
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.form-input {
  padding: 0.75rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--platform-radius);
  color: var(--color-text);
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--platform-primary);
}

.error-message {
  color: var(--color-error);
  font-size: 0.875rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.cancel-button,
.submit-button {
  padding: 0.625rem 1rem;
  border-radius: var(--platform-radius);
  font-weight: 500;
  transition: opacity 0.2s;
}

.cancel-button {
  background-color: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.submit-button {
  background-color: var(--platform-primary);
  color: white;
  border: none;
}

.cancel-button:disabled,
.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>