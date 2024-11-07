<script setup>
import { ref } from 'vue'
import { Send, Paperclip, Image } from 'lucide-vue-next'
import BaseInput from '../ui/BaseInput.vue'

const emit = defineEmits(['send'])
const message = ref('')

const handleSend = () => {
  if (!message.value.trim()) return
  emit('send', message.value)
  message.value = ''
}
</script>

<template>
  <div class="border-t border-gray-800 px-4 py-2 safe-area-bottom">
    <div class="flex items-center space-x-2">
      <button class="p-2 rounded-full hover:bg-gray-800">
        <Paperclip class="w-6 h-6" />
      </button>
      
      <button class="p-2 rounded-full hover:bg-gray-800">
        <Image class="w-6 h-6" />
      </button>
      
      <BaseInput
        v-model="message"
        placeholder="Type a message"
        class="flex-1"
        @submit="handleSend"
      />
      
      <button 
        class="p-3 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600"
        :disabled="!message.trim()"
        @click="handleSend"
      >
        <Send class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>