<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MessageSquare } from 'lucide-vue-next'
import ChatList from '../components/chat/ChatList.vue'
import ChatArea from '../components/chat/ChatArea.vue'
import { useChatStore } from '../stores/useChatStore'
import { useAuthStore } from '../stores/useAuthStore'

const chatStore = useChatStore()
const authStore = useAuthStore()

// State
const isMobile = ref(window.innerWidth < 768)
const showChatView = ref(false)
const isTyping = ref(false)

// Methods
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

const handleChatSelect = (chat) => {
  chatStore.selectChat(chat.id)
  showChatView.value = true
}

const handleBack = () => {
  showChatView.value = false
  setTimeout(() => {
    chatStore.selectedChat = null
  }, 300) // Wait for transition to complete
}

const handleSendMessage = async (message) => {
  if (!chatStore.selectedChat) return

  await chatStore.sendMessage(chatStore.selectedChat.id, message)

  // Simulate typing for demo
  if (chatStore.selectedChat.id === 1) { // Only for John's chat
    isTyping.value = true
    setTimeout(() => {
      isTyping.value = false
      chatStore.sendMessage(chatStore.selectedChat.id, "Thanks for the update! 👍", "john123")
    }, 2000)
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
  chatStore.initializeChats()

  // Set initial viewport height
  const updateHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
  window.addEventListener('resize', updateHeight)
  updateHeight()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="h-full bg-gray-900">
    <!-- Chat List View -->
    <div 
      class="h-full"
      :class="{ 'hidden': showChatView }"
    >
      <ChatList
        :chats="chatStore.chats"
        :selected-chat="chatStore.selectedChat"
        :current-user="authStore.user"
        @select-chat="handleChatSelect"
      />
    </div>

    <!-- Chat Area (Full Screen Modal) -->
    <div 
      class="fixed inset-0 bg-gray-900 transform transition-all duration-300 ease-in-out"
      :class="{
        'translate-x-0 opacity-100': showChatView,
        'translate-x-full opacity-0 pointer-events-none': !showChatView
      }"
      style="z-index: 1000;"
    >
      <ChatArea
        v-if="chatStore.selectedChat"
        :chat="chatStore.selectedChat"
        :current-user-id="authStore.user?.uid"
        :is-typing="isTyping"
        @back="handleBack"
        @send="handleSendMessage"
      />
    </div>
  </div>
</template>

<style scoped>
.h-full {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}

@supports (-webkit-touch-callout: none) {
  .h-full {
    height: -webkit-fill-available;
  }
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Ensure smooth scrolling */
* {
  -webkit-overflow-scrolling: touch;
}

/* Prevent overscroll behavior */
.overscroll-contain {
  overscroll-behavior: contain;
}
</style>