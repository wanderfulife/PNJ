<script setup>
import { ref, computed } from 'vue'
import { Paperclip, Image, Smile, Mic } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const emit = defineEmits(['send'])

const message = ref('')
const isRecording = ref(false)

const platformClass = computed(() => authStore.platform?.toLowerCase())

const handleSend = () => {
  if (!message.value.trim()) return
  emit('send', message.value.trim())
  message.value = ''
}

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="chat-input-wrapper" :class="[platformClass]">
    <div class="chat-input-container">
      <!-- Action buttons group -->
      <div class="actions-group">
        <button 
          class="action-btn" 
          aria-label="Attach file"
        >
          <Paperclip class="icon" aria-hidden="true" />
        </button>

        <button 
          class="action-btn" 
          aria-label="Send photo"
        >
          <Image class="icon" aria-hidden="true" />
        </button>
      </div>

      <!-- Message input -->
      <div class="input-field-wrapper">
        <input
          v-model="message"
          type="text"
          placeholder="Type a message"
          class="message-input"
          @keydown="handleKeydown"
        />
      </div>

      <!-- Right actions group -->
      <div class="actions-group">
        <button 
          class="action-btn" 
          aria-label="Choose emoji"
        >
          <Smile class="icon" aria-hidden="true" />
        </button>

        <button 
          class="action-btn"
          :class="{ 'recording': isRecording }"
          aria-label="Record voice message"
        >
          <Mic class="icon" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-input-wrapper {
  background-color: #111827;
  border-top: 1px solid rgba(75, 85, 99, 0.2);
  padding: 0.75rem 0.375rem;
}

.chat-input-container {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  max-width: 56rem;
  margin: 0 auto;
  padding: 0 0.25rem;
}

.actions-group {
  display: flex;
  gap: 0.125rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.375rem;
  height: 2.375rem;
  border-radius: 50%;
  color: #9CA3AF;
  transition: all 0.15s ease;
  background: transparent;
  border: none;
  position: relative;
}

.action-btn:hover {
  background-color: rgba(75, 85, 99, 0.2);
  color: #D1D5DB;
}

.action-btn:active {
  transform: scale(0.95);
}

.input-field-wrapper {
  flex: 1;
  position: relative;
  height: 2.375rem;
  min-width: 0;
  margin: 0 0.25rem;
}

.message-input {
  width: 100%;
  height: 100%;
  padding: 0.5rem 1rem;
  background-color: rgba(31, 41, 55, 0.4);
  border: none;
  border-radius: 1.25rem;
  color: white;
  font-size: 0.9375rem;
  transition: background-color 0.2s ease;
}

.message-input::placeholder {
  color: #9CA3AF;
}

.message-input:focus {
  outline: none;
  background-color: rgba(31, 41, 55, 0.6);
}

.icon {
  width: 1.3125rem;
  height: 1.3125rem;
  opacity: 0.9;
  transition: transform 0.2s ease;
}

.action-btn:hover .icon {
  transform: scale(1.1);
}

/* Style spécifique aux actions */
.action-btn:nth-child(1):hover { color: #60A5FA; } /* Attach */
.action-btn:nth-child(2):hover { color: #34D399; } /* Image */
.action-btn:first-of-type:hover { color: #FCD34D; } /* Emoji */
.action-btn:last-of-type:hover { color: #F87171; } /* Voice */

/* Platform specific styles */
.ios {
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
}

.ios .message-input {
  font-size: 1rem;
}

.android .action-btn {
  overflow: hidden;
}

.android .action-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: currentColor;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 50%;
}

.android .action-btn:active::after {
  opacity: 0.1;
}

/* Recording state */
.recording {
  color: #EF4444;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Touch optimizations */
@media (hover: none) {
  .action-btn {
    -webkit-tap-highlight-color: transparent;
  }
  
  .message-input {
    font-size: 1rem; /* Prevent zoom on iOS */
  }
}

/* Animations subtiles */
@keyframes subtle-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-1px); }
}

.action-btn:active .icon {
  animation: subtle-bounce 0.2s ease;
}
</style>