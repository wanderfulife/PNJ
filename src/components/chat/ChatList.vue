<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { Search, Settings, MessageCircle } from "lucide-vue-next"; // Changed MessagePlus to MessageCircle
import NewChatDialog from './NewChatDialog.vue';

const router = useRouter();
const authStore = useAuthStore();
const chatStore = useChatStore();

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
const showNewChatDialog = ref(false);
const platformClass = computed(() => authStore.platform?.toLowerCase());

const filteredChats = computed(() => {
  if (!searchQuery.value) return props.chats;
  
  const query = searchQuery.value.toLowerCase();
  return props.chats.filter(chat => 
    chat.name.toLowerCase().includes(query) ||
    chat.lastMessage?.toLowerCase().includes(query)
  );
});

const handleChatClick = (chat) => {
  emit("select-chat", chat);
};

const goToSettings = () => {
  router.push("/settings");
};

onMounted(async () => {
  await chatStore.loadUserChats();
});
</script>

<template>
  <div :class="['chat-list-container', platformClass]">
    <!-- Header Section -->
    <div class="header">
      <div class="header-content">
        <div class="user-info">
          <h1 class="header-title">Messages</h1>
          <p class="user-email">{{ currentUser.email }}</p>
        </div>

        <button
          class="settings-button"
          @click="goToSettings"
          aria-label="Settings"
        >
          <Settings class="icon-settings" aria-hidden="true" />
        </button>
      </div>

      <!-- New Chat Button -->
      <button 
        class="new-chat-button"
        @click="showNewChatDialog = true"
        aria-label="New Chat"
      >
        <MessageCircle class="icon" aria-hidden="true" /> <!-- Changed to MessageCircle -->
        <span>New Conversation</span>
      </button>

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
        v-for="chat in filteredChats"
        :key="chat.id"
        class="chat-item"
        :class="{ selected: selectedChat?.id === chat.id }"
        @click="handleChatClick(chat)"
      >
        <!-- Avatar -->
        <div class="avatar-wrapper">
          <img :src="chat.avatar" class="avatar" alt="" />
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
          {{ chat.unreadCount }}
        </div>
      </button>

      <div v-if="filteredChats.length === 0" class="empty-state">
        <p v-if="searchQuery">No conversations found matching "{{ searchQuery }}"</p>
        <p v-else>No conversations yet. Start a new one!</p>
      </div>
    </div>

    <!-- New Chat Dialog -->
    <NewChatDialog
      v-if="showNewChatDialog"
      @close="showNewChatDialog = false"
    />
  </div>
</template>

<style scoped>
.chat-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Header Styles */
.header {
  padding: var(--spacing-4);
  padding-bottom: var(--spacing-3);
  background-color: var(--color-background);
}

.header-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
}

.user-email {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.settings-button {
  padding: var(--spacing-2);
  margin-top: var(--spacing-2);
  color: var(--color-text);
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
}

.icon-settings {
  width: 1.5rem;
  height: 1.5rem;
}

/* New Chat Button */
.new-chat-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--platform-primary);
  border: none;
  border-radius: var(--platform-radius);
  color: white;
  font-weight: 500;
  margin-bottom: var(--spacing-3);
  transition: opacity 0.2s ease;
}

.new-chat-button:hover {
  opacity: 0.9;
}

.new-chat-button .icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Search Section */
.search-wrapper {
  position: relative;
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
  padding: 12px var(--spacing-4) 12px 38px;
  background-color: var(--color-surface);
  border: none;
  border-radius: var(--platform-radius);
  color: var(--color-text);
  font-size: 16px;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

/* Chat List */
.chat-list {
  flex: 1;
  overflow-y: auto;
  padding-top: var(--spacing-2);
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
  transition: background-color 0.2s ease;
}

.chat-item:hover {
  background-color: var(--color-surface);
}

.chat-item.selected {
  background-color: var(--color-surface);
}

/* Avatar styles */
.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-full);
  object-fit: cover;
  background-color: var(--color-surface);
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: var(--color-success);
  border-radius: 50%;
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
  margin-bottom: 2px;
}

.chat-name {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
}

.chat-time {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.chat-message {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Unread Badge */
.unread-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background-color: var(--platform-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 10px;
}

/* Empty State */
.empty-state {
  padding: var(--spacing-4);
  text-align: center;
  color: var(--color-text-secondary);
}

/* Platform specific styles */
.ios .search-input,
.ios .new-chat-button {
  border-radius: 10px;
}

.android .search-input,
.android .new-chat-button {
  border-radius: 4px;
}

/* Touch Optimizations */
@media (hover: none) {
  .chat-item,
  .settings-button,
  .new-chat-button {
    -webkit-tap-highlight-color: transparent;
  }

  .chat-item:active {
    background-color: var(--color-surface);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .chat-item,
  .new-chat-button {
    transition: none;
  }
}
</style>