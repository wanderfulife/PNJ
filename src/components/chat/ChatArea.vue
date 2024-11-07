<script setup>
import { ref, watchEffect } from 'vue'
import ChatHeader from './ChatHeader.vue'
import ChatInput from './ChatInput.vue'
import BaseMessage from '../ui/BaseMessage.vue'

const props = defineProps({
  chat: {
    type: Object,
    required: true
  },
  currentUserId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['back', 'send'])

const messagesContainer = ref(null)

watchEffect(() => {
  // Scroll to bottom when messages change
  if (messagesContainer.value) {
    const container = messagesContainer.value
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight
    })
  }
})
</script>

<template>
  <div class="flex flex-col h-full bg-gray-900">
    <ChatHeader
      :chat="chat"
      show-back-button
      @back="$emit('back')"
    />
    
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-3"
    >
      <BaseMessage
        v-for="message in chat.messages"
        :key="message.id"
        :content="message.content"
        :timestamp="message.time"
        :is-outgoing="message.sender === currentUserId"
        :status="message.status"
      />
    </div>

    <ChatInput @send="$emit('send', $event)" />
  </div>
</template>