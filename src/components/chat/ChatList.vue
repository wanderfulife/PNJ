<script setup>
import { ref, computed } from "vue";
import { Search, Settings } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";

const router = useRouter();
const authStore = useAuthStore();

const props = defineProps({
  chats: {
    type: Array,
    required: true,
  },
  selectedChat: {
    type: Object,
    default: null,
  },
  currentUser: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["select-chat"]);
const searchQuery = ref("");
const platformClass = computed(() => authStore.platform?.toLowerCase());

const handleChatClick = (chat) => {
  emit("select-chat", chat);
};

const goToSettings = () => {
  router.push("/settings");
};
</script>

<template>
  <div :class="['chat-list-container', platformClass]">
    <!-- Header Section -->
    <div class="header">
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
          aria-label="Settings"
        >
          <Settings class="icon-settings" aria-hidden="true" />
        </button>
      </div>

      <!-- Search Input -->
      <div class="search-wrapper">
        <Search class="search-icon" aria-hidden="true" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search conversations"
          class="search-input"
        />
      </div>
    </div>

    <!-- Chat List -->
    <div class="chat-list">
      <button
        v-for="chat in chats"
        :key="chat.id"
        class="chat-item"
        :class="{ selected: selectedChat?.id === chat.id }"
        @click="handleChatClick(chat)"
      >
        <!-- Avatar -->
        <div class="avatar-wrapper">
          <img :src="chat.avatar" class="avatar" />
          <div v-if="chat.online" class="online-indicator" aria-hidden="true" />
        </div>

        <!-- Chat Info -->
        <div class="chat-info">
          <div class="chat-header">
            <h3 class="chat-name">{{ chat.name }}</h3>
            <span class="chat-time">{{ chat.lastMessageTime }}</span>
          </div>
          <p class="chat-message">{{ chat.lastMessage }}</p>
        </div>

        <!-- Unread Badge -->
        <div v-if="chat.unreadCount" class="unread-badge" role="status">
          <span>{{ chat.unreadCount }}</span>
        </div>
      </button>
    </div>

    <!-- New Chat Button -->
    <div class="new-chat-container">
      <button class="new-chat-button">+ New Chat</button>
    </div>
  </div>
</template>

<style scoped>
.chat-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-background);
}

/* Header Styles */
.header {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text);
}

.user-email {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.settings-button {
  padding: var(--spacing-2);
  border-radius: var(--radius-full);
  background: transparent;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.settings-button:hover {
  background-color: var(--color-surface);
}

.icon-settings {
  width: 1.25rem;
  height: 1.25rem;
}

/* Search Section */
.search-wrapper {
  position: relative;
  margin-top: var(--spacing-2);
}

.search-icon {
  position: absolute;
  left: var(--spacing-3);
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text-secondary);
}

.search-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4) var(--spacing-3) var(--spacing-8);
  background-color: var(--color-surface);
  border: none;
  border-radius: var(--platform-radius);
  color: var(--color-text);
  font-size: var(--font-size-base);
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.search-input:focus {
  outline: none;
  background-color: var(--color-surface-light);
}

/* Chat List */
.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-2) 0;
}

.chat-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  gap: var(--spacing-3);
  background: none;
  border: none;
  color: var(--color-text);
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.chat-item:hover {
  background-color: var(--color-surface);
}

.chat-item.selected {
  background-color: var(--color-surface-light);
}

/* Avatar styles... */
.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.75rem;
  height: 0.75rem;
  background-color: var(--color-success);
  border-radius: var(--radius-full);
  border: 2px solid var(--color-background);
}

/* Chat Info */
.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--spacing-1);
}

.chat-name {
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.chat-message {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Unread Badge */
.unread-badge {
  flex-shrink: 0;
  background-color: var(--platform-primary);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 500;
  min-width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--spacing-2);
}

/* New Chat Button */
.new-chat-container {
  padding: var(--spacing-4);
}

.new-chat-button {
  width: 100%;
  padding: var(--spacing-3);
  background-color: var(--platform-primary);
  color: white;
  border: none;
  border-radius: var(--platform-radius);
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.new-chat-button:hover {
  opacity: 0.9;
}

/* Platform Specific Styles */
.ios .header {
  padding-top: calc(var(--spacing-4) + var(--safe-area-inset-top));
}

.ios .new-chat-container {
  padding-bottom: calc(var(--spacing-4) + var(--safe-area-inset-bottom));
}

.android .chat-item {
  position: relative;
  overflow: hidden;
}

.android .chat-item::after {
  content: "";
  position: absolute;
  inset: 0;
  background-color: currentColor;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.android .chat-item:active::after {
  opacity: 0.1;
}

/* Scroll Optimizations */
.chat-list {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

.chat-list::-webkit-scrollbar {
  width: 4px;
}

.chat-list::-webkit-scrollbar-track {
  background: transparent;
}

.chat-list::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: var(--radius-sm);
}

/* Touch Optimizations */
@media (hover: none) {
  .chat-item,
  .settings-button,
  .new-chat-button {
    -webkit-tap-highlight-color: transparent;
  }

  .search-input {
    font-size: 16px;
  }
}

/* Animations */
@keyframes badge-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.unread-badge {
  animation: badge-pulse 2s infinite;
}
</style>