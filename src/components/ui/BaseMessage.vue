<script setup>
import { computed } from 'vue';
import { Check } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/useAuthStore';

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
});

const authStore = useAuthStore();
const platformClass = computed(() => authStore.platform?.toLowerCase());

const statusColor = computed(() => {
  switch (props.status) {
    case 'read':
      return 'var(--color-success)';
    case 'delivered':
      return 'var(--color-text-secondary)';
    default:
      return 'var(--color-text-secondary)';
  }
});
</script>

<template>
  <div 
    :class="[
      'message-container',
      { 'outgoing': isOutgoing },
      platformClass
    ]"
  >
    <div 
      class="message-bubble"
      :class="{ 'outgoing': isOutgoing }"
    >
      <p class="message-text">{{ content }}</p>
      <div class="message-footer">
        <time class="message-time">{{ timestamp }}</time>
        <Check 
          v-if="isOutgoing"
          class="message-status"
          :style="{ color: statusColor }"
          :aria-label="status"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-container {
  display: flex;
  padding: 0.25rem 1rem;
  margin: 0.25rem 0;
  max-width: 85%;
  animation: slideIn 0.2s ease-out;
  transform-origin: left center;
}

.message-container.outgoing {
  margin-left: auto;
  flex-direction: row-reverse;
  transform-origin: right center;
}

.message-bubble {
  position: relative;
  padding: 0.75rem 1rem;
  background-color: var(--color-surface);
  border-radius: var(--platform-radius);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transform: translateZ(0);
  overflow: hidden;
}

.message-bubble.outgoing {
  background-color: var(--platform-primary);
}

.message-text {
  color: var(--color-text);
  font-size: var(--font-size-base);
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

.message-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
  margin-top: 0.25rem;
  min-height: 1.25rem;
}

.message-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  opacity: 0.8;
}

.message-status {
  width: 1rem;
  height: 1rem;
  transition: color var(--transition-fast);
}

/* Platform Specific Styles */
.ios .message-bubble {
  --message-radius: 16px;
  border-radius: var(--message-radius);
}

.ios .message-bubble:not(.outgoing) {
  border-top-left-radius: calc(var(--message-radius) / 2);
}

.ios .message-bubble.outgoing {
  border-top-right-radius: calc(var(--message-radius) / 2);
}

.android .message-bubble {
  --message-radius: 18px;
  border-radius: var(--message-radius);
}

.android .message-bubble:not(.outgoing) {
  border-bottom-right-radius: calc(var(--message-radius) / 2);
}

.android .message-bubble.outgoing {
  border-bottom-left-radius: calc(var(--message-radius) / 2);
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* High Performance Optimizations */
.message-bubble {
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .message-container {
    animation: none;
  }
  
  .message-status {
    transition: none;
  }
}

/* Touch Optimization */
@supports (-webkit-touch-callout: none) {
  .message-container {
    -webkit-tap-highlight-color: transparent;
  }
}

/* Large Screen Adjustments */
@media (min-width: 768px) {
  .message-container {
    max-width: 75%;
  }
}

/* Dark Mode Optimization */
@media (prefers-color-scheme: dark) {
  .message-bubble {
    box-shadow: none;
  }
}
</style>