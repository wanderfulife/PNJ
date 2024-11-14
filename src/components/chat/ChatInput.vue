<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Send, Paperclip, Image, Smile, Mic } from 'lucide-vue-next'
import BaseInput from '../ui/BaseInput.vue'
import { Keyboard } from '@capacitor/keyboard'
import { Capacitor } from '@capacitor/core'

const emit = defineEmits(['send'])
const message = ref('')
const inputRef = ref(null)
const isNative = Capacitor.isNativePlatform()
const keyboardHeight = ref(0)
const isRecording = ref(false)

// Handle message sending
const handleSend = () => {
  if (!message.value.trim()) return
  emit('send', message.value.trim())
  message.value = ''
  
  // Restore input height after sending
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
  }
}

// Handle keyboard events for native platforms
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

// Handle voice recording
const startRecording = async () => {
  isRecording.value = true
  // Implement voice recording logic here
}

const stopRecording = async () => {
  isRecording.value = false
  // Implement stop recording and send logic here
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
  <div 
    class="border-t border-gray-800 bg-gray-900/95 backdrop-blur-lg"
    :style="{ paddingBottom: `${keyboardHeight}px` }"
  >
    <div class="px-4 py-2">
      <div class="flex items-end space-x-2">
        <!-- Attachment Button -->
        <button 
          class="p-2 rounded-full hover:bg-gray-800 active:bg-gray-700 flex-shrink-0"
          type="button"
        >
          <Paperclip class="w-6 h-6" />
        </button>
        
        <!-- Image Button -->
        <button 
          class="p-2 rounded-full hover:bg-gray-800 active:bg-gray-700 flex-shrink-0"
          type="button"
        >
          <Image class="w-6 h-6" />
        </button>
        
        <!-- Message Input -->
        <div class="flex-1 flex items-end min-w-0">
          <BaseInput
            ref="inputRef"
            v-model="message"
            placeholder="Type a message"
            class="flex-1 bg-gray-800 rounded-2xl focus:ring-2 focus:ring-purple-500"
            :max-height="120"
            @submit="handleSend"
          >
            <template #suffix>
              <button 
                class="p-2 rounded-full hover:bg-gray-700 active:bg-gray-600"
                type="button"
              >
                <Smile class="w-6 h-6" />
              </button>
            </template>
          </BaseInput>
        </div>
        
        <!-- Send/Voice Button -->
        <div class="flex-shrink-0">
          <button
            v-if="message.trim()"
            class="p-3 rounded-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 transition-colors"
            :disabled="!message.trim()"
            @click="handleSend"
          >
            <Send class="w-6 h-6" />
          </button>
          
          <button
            v-else
            class="p-3 rounded-full hover:bg-gray-800 active:bg-gray-700"
            @touchstart="startRecording"
            @touchend="stopRecording"
            @mousedown="startRecording"
            @mouseup="stopRecording"
            @mouseleave="stopRecording"
          >
            <Mic 
              class="w-6 h-6"
              :class="{ 'text-red-500': isRecording }"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Recording Indicator -->
    <div 
      v-if="isRecording"
      class="absolute left-0 right-0 bottom-full p-4 bg-gray-800 text-center text-sm"
    >
      Recording... Slide to cancel
    </div>
  </div>
</template>

<style scoped>
.backdrop-blur-lg {
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}

/* Touch optimizations */
button {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Transition effects */
.transition-colors {
  transition-property: background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* iOS input optimizations */
@supports (-webkit-touch-callout: none) {
  input, textarea {
    font-size: 16px !important;
  }
}
</style>