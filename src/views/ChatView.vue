<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ChatList from '../components/chat/ChatList.vue'
import ChatArea from '../components/chat/ChatArea.vue'
import { useChatStore } from '../stores/useChatStore'
import { useAuthStore } from '../stores/useAuthStore'
import { storeToRefs } from 'pinia'

// Store initialization
const chatStore = useChatStore()
const authStore = useAuthStore()
const { chats, selectedChat } = storeToRefs(chatStore)
const { user } = storeToRefs(authStore)

// Reactive state
const isMobile = ref(window.innerWidth < 768)
const showChatView = ref(false)
const isTyping = ref(false)
const platformClass = computed(() => authStore.platform?.toLowerCase())

// Methods
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

const handleChatSelect = (chat) => {
  chatStore.selectChat(chat.id)
  if (isMobile.value) {
    showChatView.value = true
  }
}

const handleBack = () => {
  showChatView.value = false
  setTimeout(() => {
    chatStore.selectChat(null)
  }, 300)
}

const handleSendMessage = async (message) => {
  if (!selectedChat.value || !message.trim()) return
  
  await chatStore.sendMessage(selectedChat.value.id, message)

  // Simulate response for demo
  if (selectedChat.value.id === 1) {
    isTyping.value = true
    setTimeout(() => {
      isTyping.value = false
      chatStore.sendMessage(selectedChat.value.id, "Got your message! 👍")
    }, 2000)
  }
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
  chatStore.initializeChats()

  const updateViewportHeight = () => {
    document.documentElement.style.setProperty(
      '--viewport-height',
      `${window.innerHeight}px`
    )
  }
  
  window.addEventListener('resize', updateViewportHeight)
  updateViewportHeight()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div :class="['chat-view', platformClass]">
    <!-- Chat List (Desktop & Mobile) -->
    <div 
      class="chat-list-view"
      :class="{ 
        'hidden': isMobile && showChatView,
        'desktop': !isMobile 
      }"
    >
      <ChatList
        :chats="chats"
        :selected-chat="selectedChat"
        :current-user="user"
        @select-chat="handleChatSelect"
      />
    </div>

    <!-- Chat Area (Desktop) -->
    <div 
      v-if="!isMobile"
      class="chat-area-desktop"
    >
      <div v-if="selectedChat" class="chat-area-content">
        <ChatArea
          :chat="selectedChat"
          :current-user-id="user?.uid"
          :is-typing="isTyping"
          @send="handleSendMessage"
        />
      </div>
      <div v-else class="empty-state">
        <div class="empty-state-content">
          <h2>Select a conversation</h2>
          <p>Choose a chat from the list to start messaging</p>
        </div>
      </div>
    </div>

    <!-- Chat Area (Mobile Modal) -->
    <div 
      v-if="isMobile"
      class="chat-area-mobile"
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
/* Base Layout */
.chat-view {
  height: 100vh;
  height: var(--viewport-height);
  background-color: #111827;
  display: flex;
  overflow: hidden;
}

/* List View */
.chat-list-view {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  background-color: #111827;
  transition: transform 0.3s ease-in-out;
}

.chat-list-view.desktop {
  width: 360px;
  border-right: 1px solid #1F2937;
}

/* Desktop Chat Area */
.chat-area-desktop {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #111827;
  overflow: hidden;
}

.chat-area-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Empty State */
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111827;
  padding: 2rem;
}

.empty-state-content {
  text-align: center;
  color: #9CA3AF;
}

.empty-state-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #fff;
}

.empty-state-content p {
  font-size: 1rem;
  color: #6B7280;
}

/* Mobile Chat Area */
.chat-area-mobile {
  position: fixed;
  inset: 0;
  background-color: #111827;
  z-index: 50;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.chat-area-mobile.hidden {
  transform: translateX(100%);
  opacity: 0;
  pointer-events: none;
}

.chat-area-mobile.visible {
  transform: translateX(0);
  opacity: 1;
}

/* Mobile List View Hidden State */
@media (max-width: 767px) {
  .chat-list-view.hidden {
    transform: translateX(-100%);
  }
}

/* Platform Specific Styles */
.ios {
  --safe-area-top: env(safe-area-inset-top);
  --safe-area-bottom: env(safe-area-inset-bottom);
  height: calc(var(--viewport-height) - var(--safe-area-top) - var(--safe-area-bottom));
  padding-top: var(--safe-area-top);
  padding-bottom: var(--safe-area-bottom);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Touch Optimization */
@media (hover: none) {
  * {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
}

/* High-Performance Animations */
.chat-area-mobile {
  will-change: transform, opacity;
}

/* Scrolling Behavior */
* {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
}

/* Desktop Enhancements */
@media (min-width: 768px) {
  .chat-view {
    max-width: 1440px;
    margin: 0 auto;
    height: 100vh;
    position: relative;
  }
  
  .chat-list-view.desktop {
    border-right: 1px solid #1F2937;
    background-color: #0F1623;
  }
  
  .chat-area-desktop {
    background: linear-gradient(to bottom, #111827, #0F1623);
  }
}

/* Prevent Content Selection During Transitions */
.chat-area-mobile.visible,
.chat-area-mobile.hidden {
  user-select: none;
}

/* Loading States */
.chat-view[data-loading="true"] {
  opacity: 0.7;
  pointer-events: none;
}

/* Focus States */
:focus {
  outline: none;
}

:focus-visible {
  outline: 2px solid #7C3AED;
  outline-offset: 2px;
}
</style>