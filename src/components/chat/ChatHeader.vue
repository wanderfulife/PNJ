<script setup>
import { computed } from 'vue'
import { ChevronLeft, MoreVertical } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/useAuthStore' 

const authStore = useAuthStore()

const props = defineProps({
  chat: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back'])

// Computation de la classe de plateforme
const platformClass = computed(() => authStore.platform.toLowerCase())
</script>

<template>
  <div :class="['chat-header', platformClass]">
    <button
      class="back-button"
      @click="$emit('back')"
    >
      <ChevronLeft class="back-icon" />
    </button>

    <div class="user-container">
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
/* ChatHeader.css */

.chat-header {
  display: flex;
  align-items: center;
  height: 3.5rem;
  padding: 0 1rem;
  background-color: #111827; /* bg-gray-900 */
  border-bottom: 1px solid #1f2937; /* border-gray-800 */
}

.back-button {
  padding: 0.5rem;
  margin-left: -0.5rem;
  border-radius: 9999px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #1f2937; /* hover:bg-gray-800 */
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
  margin-left: 0.5rem;
}

.avatar-container {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.5rem;
  height: 0.5rem;
  background-color: #10b981; /* bg-green-500 */
  border-radius: 9999px;
  border: 2px solid #111827; /* border-gray-900 */
}

.user-info {
  margin-left: 0.75rem;
  min-width: 0;
}

.user-name {
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  font-size: 0.875rem;
  color: #9ca3af; /* text-gray-400 */
}

.menu-button {
  padding: 0.5rem;
  border-radius: 9999px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.2s;
}

.menu-button:hover {
  background-color: #1f2937; /* hover:bg-gray-800 */
}

.menu-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Platform specific styles */
/* iOS */
.ios .chat-header {
  padding-top: env(safe-area-inset-top);
}

.ios .chat-header {
  height: calc(3.5rem + env(safe-area-inset-top));
}

/* Android */
.android .back-button,
.android .menu-button {
  position: relative;
  overflow: hidden;
}

.android .back-button::after,
.android .menu-button::after {
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

.android .back-button:active::after,
.android .menu-button:active::after {
  opacity: 0.1;
}

/* Web */
@media (hover: hover) {
  .web .back-button:hover,
  .web .menu-button:hover {
    background-color: #1f2937;
  }
}
</style>