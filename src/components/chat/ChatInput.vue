<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Send, Paperclip, Image, Smile, Mic } from 'lucide-vue-next'
import BaseInput from '../ui/BaseInput.vue'
import { Keyboard } from '@capacitor/keyboard'
import { Capacitor } from '@capacitor/core'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const emit = defineEmits(['send'])

const message = ref('')
const baseInputRef = ref(null)
const isNative = Capacitor.isNativePlatform()
const keyboardHeight = ref(0)
const isRecording = ref(false)

// Platform detection
const platformClass = computed(() => authStore.platform.toLowerCase())

// Message handling
const handleSend = () => {
  if (!message.value.trim()) return
  
  emit('send', message.value.trim())
  message.value = ''
  
  requestAnimationFrame(() => {
    if (baseInputRef.value) {
      baseInputRef.value.$el.style.height = '42px'
    }
  })
}

// Keyboard handling for native platforms
const setupKeyboardListeners = async () => {
  if (!isNative) return

  try {
    await Keyboard.addListener('keyboardWillShow', (info) => {
      keyboardHeight.value = info.keyboardHeight
    })

    await Keyboard.addListener('keyboardWillHide', () => {
      keyboardHeight.value = 0
    })
  } catch (error) {
    console.error('Error setting up keyboard listeners:', error)
  }
}

// Voice recording handlers
const startRecording = async () => {
  isRecording.value = true
}

const stopRecording = async () => {
  isRecording.value = false
}

// Lifecycle hooks
onMounted(() => {
  setupKeyboardListeners()
})

onUnmounted(async () => {
  if (isNative) {
    try {
      await Keyboard.removeAllListeners()
    } catch (error) {
      console.error('Error removing keyboard listeners:', error)
    }
  }
})
</script>

<template>
  <div class="chat-input-wrapper">
    <div 
      :class="['chat-input-container', platformClass]"
      :style="{ paddingBottom: `${keyboardHeight}px` }"
    >
      <div class="chat-input-inner">
        <div class="chat-input-content">
          <!-- Attachment buttons -->
          <button class="chat-button" type="button">
            <Paperclip class="icon-button" />
          </button>
          
          <button class="chat-button" type="button">
            <Image class="icon-button" />
          </button>
          
          <!-- Input area -->
          <div class="input-container">
            <BaseInput
              ref="baseInputRef"
              v-model="message"
              placeholder="Type a message"
              :max-height="120"
              @submit="handleSend"
            >
              <template #suffix>
                <button class="chat-button" type="button">
                  <Smile class="icon-button" />
                </button>
              </template>
            </BaseInput>
          </div>
          
          <!-- Send/Record button -->
          <div class="action-container">
            <button
              v-if="message.trim()"
              class="send-button"
              :disabled="!message.trim()"
              @click="handleSend"
            >
              <Send class="icon-button" />
            </button>
            
            <button
              v-else
              class="record-button"
              @touchstart="startRecording"
              @touchend="stopRecording"
              @mousedown="startRecording"
              @mouseup="stopRecording"
              @mouseleave="stopRecording"
            >
              <Mic 
                class="record-icon"
                :class="{ 'active': isRecording }"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Recording indicator -->
      <div 
        v-if="isRecording"
        class="recording-indicator"
      >
        Recording... Slide to cancel
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ChatInput.css */

.chat-input-wrapper {
  border-top: 1px solid #1f2937; /* border-gray-800 */
}

.chat-input-container {
  position: relative;
  background-color: rgba(17, 24, 39, 0.95); /* bg-gray-900/95 */
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}

.chat-input-inner {
  padding: 0.5rem 1rem;
}

.chat-input-content {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

/* Attachment buttons */
.chat-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition-property: background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.icon-button {
  width: 1.5rem;
  height: 1.5rem;
}

/* Input area */
.input-container {
  flex: 1;
  display: flex;
  align-items: flex-end;
  min-width: 0;
}

/* Send/Record button container */
.action-container {
  flex-shrink: 0;
}

/* Send button */
.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background-color: #7c3aed; /* bg-purple-600 */
  transition-property: background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Record button */
.record-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  transition-property: background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.record-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.record-icon.active {
  color: #ef4444; /* text-red-500 */
}

/* Recording indicator */
.recording-indicator {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  padding: 1rem;
  background-color: #1f2937; /* bg-gray-800 */
  text-align: center;
  font-size: 0.875rem;
  color: #ffffff;
}

/* Platform specific styles */
/* iOS */
.ios .chat-input-container {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Android */
.android .chat-button::after,
.android .send-button::after,
.android .record-button::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: currentColor;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.2s;
}

.android .chat-button:active::after,
.android .send-button:active::after,
.android .record-button:active::after {
  opacity: 0.12;
}

/* Web */
@media (hover: hover) {
  .web .chat-button:hover {
    background-color: #1f2937; /* hover:bg-gray-800 */
  }
  
  .web .chat-button:active {
    background-color: #374151; /* active:bg-gray-700 */
  }

  .web .send-button:hover {
    background-color: #6d28d9; /* hover:bg-purple-700 */
  }

  .web .send-button:active {
    background-color: #5b21b6; /* active:bg-purple-800 */
  }

  .web .record-button:hover {
    background-color: #1f2937; /* hover:bg-gray-800 */
  }

  .web .record-button:active {
    background-color: #374151; /* active:bg-gray-700 */
  }
}
</style>