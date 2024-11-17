<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Phone, Video } from 'lucide-vue-next'
import ChatHeader from './ChatHeader.vue'
import ChatInput from './ChatInput.vue'
import BaseMessage from '../ui/BaseMessage.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()

const props = defineProps({
  chat: {
    type: Object,
    required: true
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

// Platform class computation
const platformClass = computed(() => authStore.platform?.toLowerCase())

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

const handleBack = () => {
  emit('back')
}
</script>

<template>
  <div v-if="chat" :class="['chat-area', platformClass]">
    <ChatHeader
      :chat="chat"
      :show-back-button="true"
      @back="handleBack"
    />
    
    <!-- Messages Container -->
    <div
      ref="messagesContainer"
      class="messages-container"
    >
      <div class="messages-wrapper">
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

    <ChatInput 
      @send="handleSend"
      class="chat-input"
    />
  </div>
</template>

<style scoped>
.chat-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--background);
  overflow: hidden;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: var(--gray-700) transparent;
  padding: var(--spacing-2) 0;
}

.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background-color: var(--gray-700);
  border-radius: var(--radius-full);
}

.messages-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-bottom: var(--spacing-4);
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  color: var(--gray-400);
  font-size: var(--text-sm);
}

.typing-dots {
  display: flex;
  gap: var(--spacing-1);
}

.typing-dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--gray-400);
  border-radius: var(--radius-full);
  animation: bounce 1s infinite;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.chat-input {
  flex-shrink: 0;
  border-top: 1px solid var(--gray-800);
  background-color: var(--background);
  position: relative;
  z-index: 1;
}

/* Platform specific styles */
.ios .messages-container {
  padding-top: calc(var(--spacing-2) + env(safe-area-inset-top));
}

.android .messages-container {
  padding-top: var(--spacing-2);
}
</style>