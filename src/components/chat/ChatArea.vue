<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { MoreVertical, Phone, Video } from 'lucide-vue-next'
import ChatHeader from './ChatHeader.vue'
import ChatInput from './ChatInput.vue'
import BaseMessage from '../ui/BaseMessage.vue'

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
  <div v-if="chat" class="flex flex-col h-full bg-gray-900">
    <!-- Chat Header -->
    <ChatHeader
      :chat="chat"
      show-back-button
      @back="$emit('back')"
    >
      <template #actions>
        <div class="flex items-center space-x-2">
          <button class="p-2 rounded-full hover:bg-gray-800">
            <Phone class="w-5 h-5" />
          </button>
          <button class="p-2 rounded-full hover:bg-gray-800">
            <Video class="w-5 h-5" />
          </button>
          <button class="p-2 rounded-full hover:bg-gray-800">
            <MoreVertical class="w-5 h-5" />
          </button>
        </div>
      </template>
    </ChatHeader>
    
    <!-- Messages Area -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-3 custom-scrollbar"
    >
      <BaseMessage
        v-for="message in messages"
        :key="message.id"
        :content="message.content"
        :timestamp="message.time"
        :is-outgoing="message.sender === currentUserId"
        :status="message.status"
      />
      
      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex items-center space-x-2 text-gray-400 text-sm">
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
        <span>Typing...</span>
      </div>
    </div>

    <!-- Input Area -->
    <ChatInput 
      @send="handleSend"
      class="border-t border-gray-800"
    />
  </div>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.700') transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.700');
  border-radius: 2px;
}

/* Touch optimizations */
.overscroll-contain {
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
</style>