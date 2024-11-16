<script setup>
import { ref, computed } from 'vue'
import { Search, Settings } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps({
  chats: {
    type: Array,
    required: true
  },
  selectedChat: {
    type: Object,
    default: null
  },
  currentUser: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select-chat'])
const searchQuery = ref('')

const handleChatClick = (chat) => {
  emit('select-chat', chat)
}

const goToSettings = () => {
  router.push('/settings')
}

// Computation de la classe de plateforme
const platformClass = computed(() => authStore.platform.toLowerCase())
</script>

<template>
  <div :class="['chat-list-container', platformClass]">
    <!-- Header -->
    <div class="header safe-area-top">
      <div class="header-content">
        <!-- User Profile Section -->
        <div class="user-profile">
          <div class="user-info">
            <h1 class="header-title">Messages</h1>
            <p class="user-email">{{ currentUser.email }}</p>
          </div>
        </div>

        <!-- Settings Button -->
        <button 
          class="settings-button"
          @click="goToSettings"
        >
          <Settings class="w-5 h-5" />
        </button>
      </div>

      <!-- Search -->
      <div class="search-container">
        <Search class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search chats"
          class="search-input"
        />
      </div>
    </div>

    <!-- Chat List -->
    <div class="chat-list">
      <div class="chat-list-divider">
        <button
          v-for="chat in chats"
          :key="chat.id"
          class="chat-item"
          @click="handleChatClick(chat)"
        >
          <!-- Avatar with online status -->
          <div class="avatar-container">
            <img 
              :src="chat.avatar"
              :alt="chat.name"
              class="avatar"
            />
            <div 
              v-if="chat.online"
              class="online-indicator"
            />
          </div>

          <!-- Chat Info -->
          <div class="chat-info">
            <div class="chat-header">
              <h3 class="chat-name">{{ chat.name }}</h3>
              <span class="chat-time">
                {{ chat.lastMessageTime }}
              </span>
            </div>
            <p class="chat-message">{{ chat.lastMessage }}</p>
          </div>

          <!-- Unread Badge -->
          <div 
            v-if="chat.unreadCount"
            class="unread-badge"
          >
            <span class="unread-count">{{ chat.unreadCount }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- New Chat Button -->
    <div class="new-chat-container">
      <button class="new-chat-button">
        + New Chat
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Base styles */
.chat-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #111827; /* bg-gray-900 */
}

/* Header styles */
.header {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #1f2937; /* border-gray-800 */
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: 1.125rem;
  font-weight: 600;
}

.user-email {
  font-size: 0.75rem;
  color: #9ca3af; /* text-gray-400 */
}

/* Settings button */
.settings-button {
  padding: 0.5rem;
  border-radius: 9999px;
  transition: background-color 0.2s;
}

.settings-button:hover {
  background-color: #1f2937; /* hover:bg-gray-800 */
}

/* Search input */
.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af; /* text-gray-400 */
}

.search-input {
  width: 100%;
  background-color: #1f2937; /* bg-gray-800 */
  border-radius: 0.75rem;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  color: white;
}

.search-input::placeholder {
  color: #9ca3af; /* placeholder-gray-400 */
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #8b5cf6; /* ring-2 ring-purple-500 */
}

/* Chat list */
.chat-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
}

.chat-list-divider {
  border-top: 1px solid #1f2937; /* divide-gray-800 */
}

/* Chat item */
.chat-item {
  width: 100%;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: background-color 0.2s;
  text-align: left;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.chat-item:hover {
  background-color: #1f2937; /* hover:bg-gray-800 */
}

.chat-item:active {
  background-color: #374151; /* active:bg-gray-700 */
}

/* Avatar */
.avatar-container {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  object-fit: cover;
  background-color: #374151; /* bg-gray-700 */
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.625rem;
  height: 0.625rem;
  background-color: #10b981; /* bg-green-500 */
  border-radius: 9999px;
  border: 2px solid #111827; /* border-gray-900 */
}

/* Chat info */
.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.chat-name {
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-time {
  font-size: 0.875rem;
  color: #9ca3af; /* text-gray-400 */
  flex-shrink: 0;
}

.chat-message {
  font-size: 0.875rem;
  color: #9ca3af; /* text-gray-400 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Unread badge */
.unread-badge {
  flex-shrink: 0;
  background-color: #7c3aed; /* bg-purple-600 */
  border-radius: 9999px;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unread-count {
  font-size: 0.75rem;
  font-weight: 500;
}

/* New chat button */
.new-chat-container {
  padding: 1rem;
}

.new-chat-button {
  width: 100%;
  background-color: #7c3aed; /* bg-purple-600 */
  color: white;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.new-chat-button:hover {
  background-color: #6d28d9; /* hover:bg-purple-700 */
}

.new-chat-button:active {
  background-color: #5b21b6; /* active:bg-purple-800 */
}

/* Platform specific styles */
/* iOS */
.ios .search-input {
  font-size: 16px !important;
}

.ios .safe-area-top {
  padding-top: env(safe-area-inset-top);
}

/* Android */
.android .chat-item {
  /* Add Android-specific ripple effect */
  position: relative;
  overflow: hidden;
}

.android .chat-item::after {
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

.android .chat-item:active::after {
  opacity: 0.1;
}

/* Web */
@media (hover: hover) {
  .web .chat-item:hover {
    background-color: #1f2937;
  }
  
  .web .settings-button:hover {
    background-color: #1f2937;
  }
  
  .web .new-chat-button:hover {
    background-color: #6d28d9;
  }
}
</style>