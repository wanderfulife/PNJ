<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Send, Paperclip, Image, Smile, Mic } from 'lucide-vue-next'
import BaseInput from '../ui/BaseInput.vue'
import { Keyboard } from '@capacitor/keyboard'
import { Capacitor } from '@capacitor/core'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const emit = defineEmits(['send'])

// State
const message = ref('')
const baseInputRef = ref(null)
const isNative = Capacitor.isNativePlatform()
const keyboardHeight = ref(0)
const isRecording = ref(false)

// Platform detection
const platformClass = computed(() => authStore.platform?.toLowerCase())

// Message handling
const handleSend = () => {
  if (!message.value.trim()) return
  
  emit('send', message.value.trim())
  message.value = ''
  
  // Reset input height after sending
  requestAnimationFrame(() => {
    if (baseInputRef.value?.$el) {
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
const startRecording = () => {
  isRecording.value = true
}

const stopRecording = () => {
  isRecording.value = false
}

// Lifecycle hooks
onMounted(setupKeyboardListeners)

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
        <!-- Attachment buttons -->
        <button class="chat-button" type="button">
          <Paperclip class="icon-button" />
        </button>
        
        <button class="chat-button" type="button">
          <Image class="icon-button" />
        </button>
        
        <!-- Input area -->
        <div class="input-wrapper">
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
        <div class="action-wrapper">
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
              class="icon-button"
              :class="{ 'recording': isRecording }"
            />
          </button>
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
.chat-input-wrapper {
  position: relative;
  background-color: var(--background);
}

.chat-input-container {
  position: relative;
  background-color: var(--background);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--gray-800);
}

.chat-input-inner {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
}

/* Buttons */
.chat-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--foreground);
  cursor: pointer;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.chat-button:hover {
  background-color: var(--gray-800);
}

.icon-button {
  width: 1.5rem;
  height: 1.5rem;
}

/* Input area */
.input-wrapper {
  flex: 1;
  min-width: 0;
}

/* Send/Record button */
.action-wrapper {
  flex-shrink: 0;
}

.send-button,
.record-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-button {
  background-color: var(--primary);
  color: var(--foreground);
}

.send-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.record-button {
  background-color: transparent;
  color: var(--foreground);
}

.record-button:hover {
  background-color: var(--gray-800);
}

.icon-button.recording {
  color: var(--error);
  animation: pulse 1s infinite;
}

/* Recording indicator */
.recording-indicator {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  padding: 1rem;
  background-color: var(--gray-800);
  color: var(--foreground);
  text-align: center;
  font-size: 0.875rem;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Platform specific styles */
.ios {
  padding-bottom: env(safe-area-inset-bottom);
}

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
  opacity: 0.1;
}

/* Touch optimizations */
.chat-button,
.send-button,
.record-button {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* iOS specific styles */
@supports (-webkit-touch-callout: none) {
  .chat-input-container {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Web platform hover effects */
@media (hover: hover) {
  .chat-button:hover {
    background-color: var(--gray-800);
  }

  .send-button:hover:not(:disabled) {
    background-color: var(--primary-hover);
  }

  .record-button:hover {
    background-color: var(--gray-800);
  }
}

.chat-input-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--background);
  border-top: 1px solid var(--gray-800);
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
}

.input-field {
  flex: 1;
  min-height: 42px;
  padding: 0.75rem 1rem;
  background-color: var(--gray-800);
  border: none;
  border-radius: 9999px;
  color: var(--foreground);
  font-size: 1rem;
  line-height: 1.5;
  resize: none;
}

.input-field:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--primary);
}

.button-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  color: var(--foreground);
  transition: background-color 0.2s;
  cursor: pointer;
}

.send-button {
  background-color: var(--primary);
}

.send-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.attachment-button {
  padding: 0.5rem;
}

.attachment-button:hover {
  background-color: var(--gray-800);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

.recording-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background-color: var(--error);
  color: white;
  font-size: 0.875rem;
}

/* Animations */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.recording {
  animation: pulse 1s infinite;
  color: var(--error);
}

/* Platform specific styles */
.ios .chat-input-container {
  padding-bottom: env(safe-area-inset-bottom);
}

.android .action-button::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: currentColor;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.2s;
}

.android .action-button:active::after {
  opacity: 0.1;
}
</style>