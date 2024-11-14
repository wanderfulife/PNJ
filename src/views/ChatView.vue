<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MessageSquare } from 'lucide-vue-next'
import ChatList from '../components/chat/ChatList.vue'
import ChatArea from '../components/chat/ChatArea.vue'

const props = defineProps({
  currentUser: {
    type: Object,
    required: true
  }
})

// State
const isMobile = ref(window.innerWidth < 768)
const showChatView = ref(false)
const selectedChat = ref(null)
const isTyping = ref(false)

// Demo chats data
const chats = ref([
  {
    id: 1,
    name: "John Smith",
    avatar: "/api/placeholder/48/48",
    online: true,
    lastMessage: "See you tomorrow at the meeting! 👋",
    lastMessageTime: "01:29 AM",
    unreadCount: 3,
    messages: [
      {
        id: 1,
        content: "Hey! How's the project coming along?",
        sender: "john123",
        time: "9:30 AM",
        status: "read"
      },
      {
        id: 2,
        content: "I've been working on the UI improvements",
        sender: props.currentUser.uid,
        time: "9:32 AM",
        status: "read"
      }
    ]
  },
  {
    id: 2,
    name: "Design Team",
    avatar: "/api/placeholder/48/48",
    online: false,
    lastMessage: "New UI mockups uploaded",
    lastMessageTime: "12:29 AM",
    unreadCount: 0,
    messages: []
  },
  {
    id: 3,
    name: "Alice Johnson",
    avatar: "/api/placeholder/48/48",
    online: true,
    lastMessage: "Thanks for your help! ⚡",
    lastMessageTime: "Wed",
    unreadCount: 0,
    messages: []
  }
])

// Methods
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

const handleChatSelect = (chat) => {
  selectedChat.value = chat
  showChatView.value = true
}

const handleBack = () => {
  showChatView.value = false
  setTimeout(() => {
    selectedChat.value = null
  }, 300) // Wait for transition to complete
}

const handleSendMessage = async (message) => {
  if (!selectedChat.value) return

  const newMessage = {
    id: Date.now(),
    content: message,
    sender: props.currentUser.uid,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'sent'
  }

  // Update the selected chat's messages
  selectedChat.value.messages = [...(selectedChat.value.messages || []), newMessage]
  selectedChat.value.lastMessage = message
  selectedChat.value.lastMessageTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  }).toUpperCase()

  // Update the chat in the chats list
  const chatIndex = chats.value.findIndex(c => c.id === selectedChat.value.id)
  if (chatIndex !== -1) {
    chats.value[chatIndex] = { ...selectedChat.value }
  }

  // Simulate message status updates
  setTimeout(() => {
    newMessage.status = 'delivered'
    selectedChat.value = { ...selectedChat.value }
  }, 1000)

  // Simulate reply for demo
  if (selectedChat.value.id === 1) { // Only for John's chat
    isTyping.value = true
    setTimeout(() => {
      isTyping.value = false
      const reply = {
        id: Date.now(),
        content: "Thanks for the update! 👍",
        sender: "john123",
        time: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }).toUpperCase(),
        status: "read"
      }
      selectedChat.value.messages = [...selectedChat.value.messages, reply]
      selectedChat.value.lastMessage = reply.content
      selectedChat.value.lastMessageTime = reply.time
      // Update in chats list
      const chatIndex = chats.value.findIndex(c => c.id === selectedChat.value.id)
      if (chatIndex !== -1) {
        chats.value[chatIndex] = { ...selectedChat.value }
      }
    }, 2000)
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()

  // Set initial viewport height
  const updateHeight = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
  window.addEventListener('resize', updateHeight)
  updateHeight()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="h-full bg-gray-900">
    <!-- Chat List View -->
    <div 
      class="h-full"
      :class="{ 'hidden': showChatView }"
    >
      <ChatList
        :chats="chats"
        :selected-chat="selectedChat"
        :current-user="currentUser"
        @select-chat="handleChatSelect"
      />
    </div>

    <!-- Chat Area (Full Screen Modal) -->
    <div 
      class="fixed inset-0 bg-gray-900 transform transition-all duration-300 ease-in-out"
      :class="{
        'translate-x-0 opacity-100': showChatView,
        'translate-x-full opacity-0 pointer-events-none': !showChatView
      }"
      style="z-index: 1000;"
    >
      <ChatArea
        v-if="selectedChat"
        :chat="selectedChat"
        :current-user-id="currentUser.uid"
        :is-typing="isTyping"
        @back="handleBack"
        @send="handleSendMessage"
      />
    </div>
  </div>
</template>

<style scoped>
.h-full {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}

@supports (-webkit-touch-callout: none) {
  .h-full {
    height: -webkit-fill-available;
  }
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Ensure smooth scrolling */
* {
  -webkit-overflow-scrolling: touch;
}

/* Prevent overscroll behavior */
.overscroll-contain {
  overscroll-behavior: contain;
}
</style>