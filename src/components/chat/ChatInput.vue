# ChatInput.vue
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
        <!-- Clip button -->
        <button class="action-btn btn-clip">
          <Paperclip class="icon" />
        </button>

        <!-- Gallery button -->
        <button class="action-btn btn-gallery">
          <Image class="icon" />
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
        <!-- Emoji button -->
        <button class="action-btn btn-emoji">
          <Smile class="icon" />
        </button>

        <!-- Voice message button -->
        <button class="action-btn btn-voice">
          <Mic class="icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-input-wrapper {
  position: relative;
  width: 100%;
  background-color: #0f1117;
  margin-top: -1px; /* Supprime l'espace blanc */
  padding: 12px 6px;
}

.chat-input-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(75, 85, 99, 0.2) 15%,
    rgba(75, 85, 99, 0.2) 85%,
    transparent
  );
}

.chat-input-container {
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 4px;
}

.actions-group {
  display: flex;
  gap: 2px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: rgba(156, 163, 175, 0.8);
  transition: all 0.15s ease;
  background: transparent;
  position: relative;
}

.action-btn:hover {
  background-color: rgba(75, 85, 99, 0.2);
  color: rgba(156, 163, 175, 1);
}

.action-btn:active {
  transform: scale(0.95);
}

.input-field-wrapper {
  flex: 1;
  position: relative;
  height: 38px;
  min-width: 0;
  margin: 0 4px;
}

.message-input {
  width: 100%;
  height: 100%;
  padding: 8px 16px;
  background-color: rgba(31, 41, 55, 0.4);
  border: none;
  border-radius: 19px;
  color: white;
  font-size: 15px;
  transition: background-color 0.2s ease;
}

.message-input::placeholder {
  color: rgb(156, 163, 175);
}

.message-input:focus {
  outline: none;
  background-color: rgba(31, 41, 55, 0.6);
}

.icon {
  width: 21px;
  height: 21px;
  opacity: 0.9;
  transition: transform 0.2s ease;
}

.action-btn:hover .icon {
  transform: scale(1.1);
}

/* Style particulier pour les boutons */
.btn-clip:hover { color: #60A5FA; }
.btn-gallery:hover { color: #34D399; }
.btn-emoji:hover { color: #FCD34D; }
.btn-voice:hover { color: #F87171; }

/* Platform specific adjustments */
.ios {
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

/* Ripple effect for Android */
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

/* Touch optimization */
@media (hover: none) {
  .action-btn {
    -webkit-tap-highlight-color: transparent;
  }
  
  .message-input {
    font-size: 16px; /* Prevent zoom on iOS */
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