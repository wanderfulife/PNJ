<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { Search, Settings } from "lucide-vue-next";

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
          {{ chat.unreadCount }}
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-list-container {
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.header {
  padding: var(--spacing-4);
  padding-bottom: var(--spacing-3);
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
}

.icon-settings {
  width: 1.5rem;
  height: 1.5rem;
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
  border-radius: 10px;
  color: var(--color-text);
  font-size: 17px;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.search-input:focus {
  outline: none;
}

/* Chat List */
.chat-list {
  flex: 1;
  overflow-y: auto;
  margin-top: var(--spacing-2);
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
  font-size: 17px;
  font-weight: 500;
  color: var(--color-text);
}

.chat-time {
  font-size: 15px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.chat-message {
  font-size: 15px;
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
  background-color: #007aff;
  color: white;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
}

/* Touch Optimizations */
@media (hover: none) {
  .chat-item,
  .settings-button {
    -webkit-tap-highlight-color: transparent;
  }

  .search-input {
    font-size: 16px;
  }
}
</style>