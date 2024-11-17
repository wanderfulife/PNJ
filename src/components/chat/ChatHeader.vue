<script setup>
import { computed } from 'vue'
import { ChevronLeft, MoreVertical } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/useAuthStore' 

const authStore = useAuthStore()

const props = defineProps({
  chat: {
    type: Object,
    required: true
  },
  showBackButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['back'])

// Platform class computation
const platformClass = computed(() => authStore.platform?.toLowerCase())

const handleBack = () => {
  emit('back')
}
</script>

<template>
  <div :class="['chat-header', platformClass]">
    <button
      v-if="showBackButton"
      class="back-button"
      @click="handleBack"
    >
      <ChevronLeft class="back-icon" />
    </button>

    <div class="user-container">
      <div class="avatar-container">
        <img
          :src="chat.avatar"
          class="avatar"
        />
        <div 
          v-if="chat.online" 
          class="online-indicator"
        />
      </div>
      
      <div class="user-info">
        <h2 class="user-name">{{ chat.name }}</h2>
        <p class="user-status">
          {{ chat.online ? 'Online' : 'Offline' }}
        </p>
      </div>
    </div>

    <button class="menu-button">
      <MoreVertical class="menu-icon" />
    </button>
  </div>
</template>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  height: 3.5rem;
  padding: 0 var(--spacing-4);
  background-color: var(--background);
  border-bottom: 1px solid var(--gray-800);
}

.back-button {
  padding: var(--spacing-2);
  margin-left: calc(-1 * var(--spacing-2));
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  color: var(--foreground);
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: var(--gray-800);
}

.back-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.user-container {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  margin-left: var(--spacing-2);
}

.avatar-container {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--success);
  border-radius: var(--radius-full);
  border: 2px solid var(--background);
}

.user-info {
  margin-left: var(--spacing-3);
  min-width: 0;
}

.user-name {
  font-size: var(--text-base);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--foreground);
}

.user-status {
  font-size: var(--text-sm);
  color: var(--gray-400);
}

.menu-button {
  padding: var(--spacing-2);
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  color: var(--foreground);
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-button:hover {
  background-color: var(--gray-800);
}

.menu-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Platform specific styles */
.ios .chat-header {
  padding-top: env(safe-area-inset-top);
  height: calc(3.5rem + env(safe-area-inset-top));
}

.android .back-button,
.android .menu-button {
  position: relative;
  overflow: hidden;
}

.android .back-button::after,
.android .menu-button::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: currentColor;
  opacity: 0;
  transition: opacity 0.2s;
}

.android .back-button:active::after,
.android .menu-button:active::after {
  opacity: 0.1;
}

/* Touch optimizations */
.back-button,
.menu-button {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Web platform hover effects */
@media (hover: hover) {
  .web .back-button:hover,
  .web .menu-button:hover {
    background-color: var(--gray-800);
  }
}
</style>