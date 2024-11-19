<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ChatList from '../components/chat/ChatList.vue';
import ChatArea from '../components/chat/ChatArea.vue';
import { useChatStore } from '../stores/useChatStore';
import { useAuthStore } from '../stores/useAuthStore';
import { storeToRefs } from 'pinia';

// Store initialization with storeToRefs for better reactivity
const chatStore = useChatStore();
const authStore = useAuthStore();
const { chats, selectedChat } = storeToRefs(chatStore);
const { user } = storeToRefs(authStore);

// Reactive state
const isMobile = ref(window.innerWidth < 768);
const showChatView = ref(false);
const isTyping = ref(false);

// Computed properties
const platformClass = computed(() => authStore.platform?.toLowerCase());
const shouldShowChatArea = computed(() => !isMobile.value || showChatView.value);
const shouldShowChatList = computed(() => !isMobile.value || !showChatView.value);

// Resize handler with debounce
let resizeTimeout;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    isMobile.value = window.innerWidth < 768;
    updateViewportHeight();
  }, 150); // Debounce resize events
};

// View height handler for mobile
const updateViewportHeight = () => {
  document.documentElement.style.setProperty(
    '--viewport-height',
    `${window.innerHeight}px`
  );
};

// Chat handlers
const handleChatSelect = (chat) => {
  chatStore.selectChat(chat.id);
  if (isMobile.value) {
    showChatView.value = true;
  }
};

const handleBack = () => {
  showChatView.value = false;
  // Use RAF to ensure smooth transition
  requestAnimationFrame(() => {
    chatStore.selectChat(null);
  });
};

const handleSendMessage = async (message) => {
  if (!selectedChat.value || !message.trim()) return;
  
  await chatStore.sendMessage(selectedChat.value.id, message);

  // Demo response simulation
  if (selectedChat.value.id === 1) {
    isTyping.value = true;
    setTimeout(() => {
      isTyping.value = false;
      chatStore.sendMessage(selectedChat.value.id, "Got your message! 👍");
    }, 2000);
  }
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  chatStore.initializeChats();
  updateViewportHeight();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  clearTimeout(resizeTimeout);
});
</script>

<template>
  <div :class="['chat-view', platformClass]">
    <!-- Chat List -->
    <Transition name="slide-list">
      <div 
        v-show="shouldShowChatList"
        class="chat-list-container"
      >
        <ChatList
          :chats="chats"
          :selected-chat="selectedChat"
          :current-user="user"
          @select-chat="handleChatSelect"
        />
      </div>
    </Transition>

    <!-- Desktop Chat Area -->
    <Transition name="fade">
      <div 
        v-if="!isMobile"
        class="chat-area-desktop"
      >
        <template v-if="selectedChat">
          <ChatArea
            :chat="selectedChat"
            :current-user-id="user?.uid"
            :is-typing="isTyping"
            @send="handleSendMessage"
          />
        </template>
        <div v-else class="empty-state">
          <div class="empty-state-content">
            <h2>Select a conversation</h2>
            <p>Choose a chat from the list to start messaging</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Mobile Chat Area -->
    <Transition name="slide-chat">
      <div 
        v-if="isMobile && shouldShowChatArea"
        class="chat-area-mobile"
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
    </Transition>
  </div>
</template>

<style scoped>
/* ... previous styles remain the same until transitions ... */

/* Improved Transitions */
/* List transitions - slides left */
.slide-list-enter-active,
.slide-list-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-list-enter-from {
  transform: translateX(-100%);
}

.slide-list-leave-to {
  transform: translateX(-100%);
}

/* Chat transitions - slides from right */
.slide-chat-enter-active,
.slide-chat-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-chat-enter-from {
  transform: translateX(100%);
}

.slide-chat-leave-to {
  transform: translateX(100%);
}

/* Fade transition for desktop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile View Positioning */
.chat-area-mobile {
  position: fixed;
  inset: 0;
  background-color: var(--color-background);
  z-index: 50;
  /* Add transform-origin for smoother animations */
  transform-origin: right center;
  overflow: hidden;
}

.chat-list-container {
  position: relative;
  /* Add transform-origin for smoother animations */
  transform-origin: left center;
  
  @media (min-width: 768px) {
    position: sticky;
    top: 0;
  }
}

/* High Performance Hints */
.chat-area-mobile,
.chat-list-container {
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  perspective: 1000;
  -webkit-perspective: 1000;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .slide-list-enter-active,
  .slide-list-leave-active,
  .slide-chat-enter-active,
  .slide-chat-leave-active,
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}

/* Prevent Content Shifting */
.chat-view {
  position: relative;
  isolation: isolate;
}

/* Prevent Scrolling When Transitioning */
.chat-view.transitioning {
  overflow: hidden;
}
</style>