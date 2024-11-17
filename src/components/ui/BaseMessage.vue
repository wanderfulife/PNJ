<script setup>
import { Check } from 'lucide-vue-next'

defineProps({
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
</script>

<template>
  <div :class="['message-container', { 'outgoing': isOutgoing }]">
    <div :class="['message-bubble', { 'outgoing': isOutgoing }]">
      <p class="message-text">{{ content }}</p>
      <div class="message-footer">
        <span class="message-time">{{ timestamp }}</span>
        <Check 
          v-if="isOutgoing"
          class="message-status"
          :class="{
            'status-sent': status === 'sent',
            'status-delivered': status === 'delivered',
            'status-read': status === 'read'
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-container {
  display: flex;
  max-width: 85%;
  margin: var(--spacing-1) 0;
  padding: 0 var(--spacing-2);
}

.message-container.outgoing {
  margin-left: auto;
  justify-content: flex-end;
}

.message-bubble {
  position: relative;
  background-color: var(--gray-800);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-3) var(--spacing-4);
  border-bottom-left-radius: 0;
  max-width: 100%;
  word-wrap: break-word;
}

.message-bubble.outgoing {
  background-color: var(--primary);
  border-bottom-left-radius: var(--radius-2xl);
  border-bottom-right-radius: 0;
}

.message-text {
  color: var(--foreground);
  font-size: var(--text-base);
  line-height: 1.4;
  white-space: pre-wrap;
}

.message-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-1);
  margin-top: var(--spacing-1);
}

.message-time {
  font-size: var(--text-xs);
  color: var(--gray-300);
  margin-left: var(--spacing-2);
}

.message-status {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.message-status.status-sent {
  color: var(--gray-400);
}

.message-status.status-delivered {
  color: var(--blue-400);
}

.message-status.status-read {
  color: var(--green-400);
}

/* Animation pour les nouveaux messages */
@keyframes slideIn {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.message-container {
  animation: slideIn 0.2s ease-out;
}
</style>