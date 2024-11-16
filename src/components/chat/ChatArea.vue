<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { MoreVertical, Phone, Video } from 'lucide-vue-next'
import ChatHeader from './ChatHeader.vue'
import ChatInput from './ChatInput.vue'
import BaseMessage from '../ui/BaseMessage.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

const props = defineProps({
  chat: {
    type: Object,
    default: () => ({
      messages: [],
      name: '',
      avatar: '/api/placeholder/48/48',
      online: false
    })
  },
  currentUserId: {
    type: String,
    required: true
  },
  isTyping: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['back', 'send'])

// Refs
const messagesContainer = ref(null)
const messages = ref(props.chat?.messages || [])

// Computed
const platformClass = computed(() => authStore.platform.toLowerCase())

// Methods
const scrollToBottom = async (smooth = true) => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    })
  }
}

// Watchers
watch(() => props.chat?.messages, (newMessages) => {
  if (newMessages) {
    messages.value = newMessages
    scrollToBottom()
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  scrollToBottom(false)
})

const handleSend = (message) => {
  emit('send', message)
}
</script>

<template>
  <div v-if="chat" :class="['chat-area', platformClass]">
    <!-- Chat Header -->
    <ChatHeader
      :chat="chat"
      show-back-button
      @back="$emit('back')"
    >
      <template #actions>
        <div class="actions-container">
          <button class="action-button">
            <Phone class="action-icon" />
          </button>
          <button class="action-button">
            <Video class="action-icon" />
          </button>
          <button class="action-button">
            <MoreVertical class="action-icon" />
          </button>
        </div>
      </template>
    </ChatHeader>
    
    <!-- Messages Area -->
    <div
      ref="messagesContainer"
      class="messages-container"
    >
      <div class="messages-space">
        <BaseMessage
          v-for="message in messages"
          :key="message.id"
          :content="message.content"
          :timestamp="message.time"
          :is-outgoing="message.sender === currentUserId"
          :status="message.status"
        />
        
        <!-- Typing Indicator -->
        <div v-if="isTyping" class="typing-indicator">
          <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
          <span>Typing...</span>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <ChatInput 
      @send="handleSend"
      class="input-area"
    />
  </div>
</template>

<style scoped>
/* ChatArea.css */
.chat-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #111827; /* bg-gray-900 */
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 1rem;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #374151 transparent; /* colors.gray.700 */
}

.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background-color: #374151; /* colors.gray.700 */
  border-radius: 2px;
}

.messages-space {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Action buttons */
.actions-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-button {
  padding: 0.5rem;
  border-radius: 9999px;
  transition: background-color 0.2s;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.action-button:hover {
  background-color: #1f2937; /* hover:bg-gray-800 */
}

.action-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af; /* text-gray-400 */
  font-size: 0.875rem;
}

.typing-dots {
  display: flex;
  gap: 0.25rem;
}

.typing-dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: #9ca3af; /* bg-gray-400 */
  border-radius: 9999px;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.25rem);
  }
}

.typing-dot:nth-child(1) {
  animation: bounce 1s infinite;
  animation-delay: 0ms;
}

.typing-dot:nth-child(2) {
  animation: bounce 1s infinite;
  animation-delay: 150ms;
}

.typing-dot:nth-child(3) {
  animation: bounce 1s infinite;
  animation-delay: 300ms;
}

.input-area {
  border-top: 1px solid #1f2937; /* border-gray-800 */
}

/* Platform specific styles */
/* iOS */
.ios .messages-container {
  padding-top: calc(0.75rem + env(safe-area-inset-top));
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
}

/* Android */
.android .action-button {
  position: relative;
  overflow: hidden;
}

.android .action-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: currentColor;
  opacity: 0;
  transition: opacity 0.2s;
}

.android .action-button:active::after {
  opacity: 0.1;
}

/* Web */
@media (hover: hover) {
  .web .action-button:hover {
    background-color: #1f2937;
  }
}
</style>