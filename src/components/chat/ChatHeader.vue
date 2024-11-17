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
      aria-label="Go back"
    >
      <ChevronLeft class="back-icon" aria-hidden="true" />
    </button>

    <div class="user-container">
      <div class="avatar-container">
        <img
          :src="chat.avatar"
          :alt="`${chat.name}'s avatar`"
          class="avatar"
        />
        <div 
          v-if="chat.online" 
          class="online-indicator"
          aria-hidden="true"
        />
      </div>
      
      <div class="user-info">
        <h2 class="user-name">{{ chat.name }}</h2>
        <p class="user-status">
          {{ chat.online ? 'Online' : 'Offline' }}
        </p>
      </div>
    </div>

    <button 
      class="menu-button"
      aria-label="More options"
    >
      <MoreVertical class="menu-icon" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  height: 3.5rem;
  padding: 0 var(--spacing-4);
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.back-button {
  padding: var(--spacing-2);
  margin-left: calc(-1 * var(--spacing-2));
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.back-button:hover {
  background-color: var(--color-surface);
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
  background-color: var(--color-success);
  border-radius: var(--radius-full);
  border: 2px solid var(--color-background);
}

.user-info {
  margin-left: var(--spacing-3);
  min-width: 0;
}

.user-name {
  font-size: var(--font-size-base);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-text);
}

.user-status {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.menu-button {
  padding: var(--spacing-2);
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.menu-button:hover {
  background-color: var(--color-surface);
}

.menu-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Platform specific styles */
.ios {
  padding-top: var(--safe-area-inset-top);
  height: calc(3.5rem + var(--safe-area-inset-top));
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
  transition: opacity var(--transition-fast);
}

.android .back-button:active::after,
.android .menu-button:active::after {
  opacity: 0.1;
}

/* Touch optimizations */
@media (hover: none) {
  .back-button,
  .menu-button {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
}

/* Animation subtiles */
.back-button:active,
.menu-button:active {
  transform: scale(0.95);
  transition: transform var(--transition-fast);
}
</style>