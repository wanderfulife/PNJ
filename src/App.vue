<script setup>
import { ref, computed } from 'vue'
import ChatList from './components/ChatList.vue'
import ChatArea from './components/ChatArea.vue'

// Current user with default values
const currentUser = ref({
  id: 1,
  name: 'You',
  avatar: '/placeholder.svg?height=40&width=40'
})

// Chat data
const chats = ref([
  {
    id: 1,
    name: "Sarah's AI",
    avatar: '/placeholder.svg?height=40&width=40',
    online: true,
    lastMessage: "That's fascinating! I can see why you'd enjoy...",
    lastMessageTime: '2:31 PM',
    unreadCount: 2,
    messages: [
      {
        id: 1,
        content: "Hi! I'd love to learn more about your interests. What kind of activities do you enjoy?",
        sender: 2,
        time: '2:30 PM',
        read: true
      },
      {
        id: 2,
        content: "I'm really into hiking and photography. I love capturing beautiful landscapes!",
        sender: 1,
        time: '2:31 PM',
        read: true
      }
    ]
  }
])

const activeTab = ref('All')
const searchQuery = ref('')
const selectedChat = ref(chats.value[0])
const showChatList = ref(true)

const handleChatSelect = (chat) => {
  selectedChat.value = chat
  if (window.innerWidth < 768) {
    showChatList.value = false
  }
}

const handleSendMessage = (message) => {
  if (!selectedChat.value) return

  const newMessage = {
    id: Date.now(),
    content: message,
    sender: currentUser.value.id,
    time: new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: 'numeric',
      hour12: true 
    }),
    read: false
  }

  selectedChat.value.messages.push(newMessage)
  selectedChat.value.lastMessage = message
  selectedChat.value.lastMessageTime = newMessage.time
}
</script>

<template>
  <div class="h-full w-full flex flex-col bg-gray-900 text-gray-100">
    <!-- Mobile view -->
    <div class="flex flex-col h-full w-full">
      <ChatList
        v-if="showChatList"
        :current-user="currentUser"
        :chats="chats"
        :selected-chat="selectedChat"
        :active-tab="activeTab"
        :search-query="searchQuery"
        @update:active-tab="tab => activeTab = tab"
        @update:search-query="query => searchQuery = query"
        @select-chat="handleChatSelect"
      />
      <ChatArea
        v-else
        :selected-chat="selectedChat"
        :current-user="currentUser"
        @send-message="handleSendMessage"
        @back="showChatList = true"
      />
    </div>
  </div>
</template>