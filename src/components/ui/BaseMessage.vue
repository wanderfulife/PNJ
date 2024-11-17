<script setup>
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/useAuthStore'

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
  isOutgoing: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'sent',
    validator: (value) => ['sent', 'delivered', 'read'].includes(value)
  }
})

const authStore = useAuthStore()
const platformClass = computed(() => authStore.platform?.toLowerCase())
</script>

<template>
  <div 
    :class="[
      'message-container',
      { 'outgoing': isOutgoing },
      platformClass
    ]"
  >
    <div class="message-bubble">
      <p class="message-text">{{ content }}</p>
      <div class="message-footer">
        <span class="message-time">{{ timestamp }}</span>
        <Check 
          v-if="isOutgoing"
          class="message-status"
          :class="status"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-container {
  display: flex;
  padding: var(--spacing-1) var(--spacing-4);
  margin: var(--spacing-1) 0;
  max-width: 85%;
  animation: slideIn var(--transition-base);
}

.message-container.outgoing {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-bubble {
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface);
  border-radius: var(--platform-radius);
  position: relative;
}

.outgoing .message-bubble {
  background-color: var(--platform-primary);
}

.message-text {
  color: var(--color-text);
  font-size: var(--font-size-base);
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-1);
  margin-top: var(--spacing-1);
  min-height: 1.25rem;
}

.message-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.message-status {
  width: 1rem;
  height: 1rem;
  transition: all var(--transition-fast);
}

.message-status.sent {
  color: var(--color-text-secondary);
  opacity: 0.5;
}

.message-status.delivered {
  color: var(--color-text-secondary);
  opacity: 0.8;
}

.message-status.read {
  color: var(--color-success);
}

/* Platform specific styles */
.ios .message-bubble {
  border-radius: calc(var(--platform-radius) * 1.2);
}

.android .message-bubble {
  border-radius: calc(var(--platform-radius) * 2);
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>