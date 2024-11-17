<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MessageSquare } from 'lucide-vue-next'
import ChatList from '../components/chat/ChatList.vue'
import ChatArea from '../components/chat/ChatArea.vue'
import { useChatStore } from '../stores/useChatStore'
import { useAuthStore } from '../stores/useAuthStore'
import { storeToRefs } from 'pinia'

// Store initialization
const chatStore = useChatStore()
const authStore = useAuthStore()

// Destructure what we need from the store
const { chats, selectedChat } = storeToRefs(chatStore)
const { user } = storeToRefs(authStore)

// Local state
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
    chatStore.selectChat(null)
  }, 300) // Wait for transition to complete
}

const handleSendMessage = async (message) => {
  if (!selectedChat.value || !message.trim()) return

  // Appeler sendMessage avec chatId et content séparément
  await chatStore.sendMessage(selectedChat.value.id, message)

  // Simulation de réponse pour demo
  if (selectedChat.value.id === 1) { // Only for first chat
    isTyping.value = true
    setTimeout(() => {
      isTyping.value = false
      chatStore.sendMessage(selectedChat.value.id, "Thanks for the update! 👍")
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
  <div class="chat-view">
    <!-- Chat List View -->
    <div 
      class="chat-list-view"
      :class="{ 'hidden': showChatView }"
    >
      <ChatList
        :chats="chats"
        :selected-chat="selectedChat"
        :current-user="user"
        @select-chat="handleChatSelect"
      />
    </div>

    <!-- Chat Area (Full Screen Modal) -->
    <div 
      class="chat-area-modal"
      :class="{
        'visible': showChatView,
        'hidden': !showChatView
      }"
    >
      <ChatArea
        v-if="selectedChat"
        :chat="selectedChat"
        :current-user-id="user?.uid"
        :is-typing="isTyping"
        @back="handleBack"
        @send="handleSendMessage"
      />
    </div>
  </div>
</template>

<style scoped>
.chat-view {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  background-color: var(--background);
}

.chat-list-view {
  height: 100%;
}

.chat-list-view.hidden {
  display: none;
}

.chat-area-modal {
  position: fixed;
  inset: 0;
  background-color: var(--background);
  transform: translateX(0);
  opacity: 1;
  transition: all 0.3s ease-in-out;
  z-index: 1000;
}

.chat-area-modal.hidden {
  transform: translateX(100%);
  opacity: 0;
  pointer-events: none;
}

.chat-area-modal.visible {
  transform: translateX(0);
  opacity: 1;
}

@supports (-webkit-touch-callout: none) {
  .chat-view {
    height: -webkit-fill-available;
  }
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