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
  <div :class="['message', isOutgoing ? 'outgoing' : 'incoming']">
    <div :class="['message-bubble', isOutgoing ? 'outgoing' : 'incoming']">
      <p class="message-content">{{ content }}</p>
      <div class="message-footer">
        <span class="message-timestamp">{{ timestamp }}</span>
        <Check 
          v-if="isOutgoing"
          class="status-icon"
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
/* BaseMessage.css */

.message {
  display: flex;
  max-width: 85%;
}

.message.outgoing {
  margin-left: auto;
  margin-right: initial;
}

.message.incoming {
  margin-right: auto;
  margin-left: initial;
}

.message-bubble {
  border-radius: 1rem;
  padding: 0.5rem 1rem;
}

.message-bubble.outgoing {
  background-color: #7c3aed; /* bg-purple-600 */
  border-bottom-right-radius: 0;
}

.message-bubble.incoming {
  background-color: #1f2937; /* bg-gray-800 */
  border-bottom-left-radius: 0;
}

.message-content {
  font-size: 1rem;
  color: #ffffff;
}

.message-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 0.25rem;
  gap: 0.25rem;
}

.message-timestamp {
  font-size: 0.75rem;
  color: #d1d5db; /* text-gray-300 */
}

.status-icon {
  width: 1rem;
  height: 1rem;
}

.status-sent {
  color: #9ca3af; /* text-gray-400 */
}

.status-delivered {
  color: #60a5fa; /* text-blue-400 */
}

.status-read {
  color: #34d399; /* text-green-400 */
}
</style>