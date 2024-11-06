<script setup>
import { ref, computed, onMounted } from 'vue'
import ChatList from './components/ChatList.vue'
import ChatArea from './components/ChatArea.vue'

// Current user
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

// UI state
const activeTab = ref('All')
const searchQuery = ref('')
const selectedChat = ref(null)

// Computed
const filteredChats = computed(() => {
  return chats.value.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Methods
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

// Lifecycle
onMounted(() => {
  // Select first chat by default
  if (chats.value.length > 0) {
    selectedChat.value = chats.value[0]
  }
})
</script>

<template>
  <div class="flex h-screen bg-gray-900 text-gray-100">
    <ChatList
      :current-user="currentUser"
      :chats="filteredChats"
      :selected-chat="selectedChat"
      v-model:active-tab="activeTab"
      v-model:search-query="searchQuery"
      @select-chat="chat => selectedChat = chat"
    />
    <ChatArea
      :selected-chat="selectedChat"
      :current-user="currentUser"
      @send-message="handleSendMessage"
    />
  </div>
</template>