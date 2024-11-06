<script setup>
import { ref } from 'vue'
import { Check, Paperclip, Image, Send } from 'lucide-vue-next'

const props = defineProps({
  selectedChat: {
    type: Object,
    default: null
  },
  currentUser: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['sendMessage'])
const newMessage = ref('')
const messagesContainer = ref(null)

const handleSendMessage = () => {
  if (!newMessage.value.trim()) return
  emit('sendMessage', newMessage.value)
  newMessage.value = ''
}
</script>

<template>
  <div class="flex-1 flex flex-col">
    <!-- Chat Header -->
    <div class="h-16 border-b border-gray-800 flex items-center px-4">
      <div v-if="selectedChat" class="flex items-center">
        <img 
          :src="selectedChat.avatar" 
          class="w-8 h-8 rounded-full"
          :alt="selectedChat.name"
        />
        <div class="ml-3">
          <h2 class="text-sm font-medium">{{ selectedChat.name }}</h2>
          <p class="text-xs text-gray-400">
            {{ selectedChat.online ? 'Online' : 'Offline' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div 
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4"
    >
      <div
        v-for="message in selectedChat?.messages"
        :key="message.id"
        :class="[
          'flex',
          message.sender === currentUser.id ? 'justify-end' : 'justify-start'
        ]"
      >
        <div 
          :class="[
            'max-w-[70%] rounded-lg px-4 py-2',
            message.sender === currentUser.id 
              ? 'bg-purple-600' 
              : 'bg-gray-800'
          ]"
        >
          <p class="text-sm">{{ message.content }}</p>
          <div class="flex items-center justify-end mt-1 space-x-1">
            <span class="text-xs text-gray-400">{{ message.time }}</span>
            <Check 
              v-if="message.sender === currentUser.id"
              class="w-4 h-4 text-gray-400"
              :class="{ 'text-purple-400': message.read }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="border-t border-gray-800 p-4">
      <div class="flex items-center space-x-2">
        <button class="p-2 hover:bg-gray-800 rounded-full">
          <Paperclip class="w-5 h-5" />
        </button>
        <button class="p-2 hover:bg-gray-800 rounded-full">
          <Image class="w-5 h-5" />
        </button>
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message"
          class="flex-1 bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-700"
          @keyup.enter="handleSendMessage"
        />
        <button 
          class="p-2 bg-purple-600 hover:bg-purple-700 rounded-full"
          @click="handleSendMessage"
        >
          <Send class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>