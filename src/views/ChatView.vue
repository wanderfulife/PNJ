<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MessageSquare } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import ChatList from '../components/chat/ChatList.vue'
import ChatArea from '../components/chat/ChatArea.vue'

const router = useRouter()

// Props
const props = defineProps({
  currentUser: {
    type: Object,
    required: true
  }
})

// État local
const isMobile = ref(window.innerWidth < 768)
const showChat = ref(false)
const selectedChat = ref(null)
const chats = ref([
  {
    id: 1,
    name: "Demo Chat",
    avatar: "/api/placeholder/48/48",
    lastMessage: "Welcome to the chat!",
    lastMessageTime: "just now",
    online: true,
    unreadCount: 0,
    messages: []
  }
])

// Gestion du responsive
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    showChat.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Gestion de la navigation
const handleChatSelect = (chat) => {
  selectedChat.value = chat
  if (isMobile.value) {
    showChat.value = true
  }
}

const handleBack = () => {
  if (isMobile.value) {
    showChat.value = false
  }
}

// Gestion de la déconnexion
const handleLogout = async () => {
  await router.push('/login')
}
</script>

<template>
  <div class="h-full flex bg-gray-900">
    <!-- Liste des chats -->
    <div
      :class="[
        'md:w-[380px] border-r border-gray-800',
        {
          'hidden md:block': showChat && isMobile,
          'w-full': !showChat || !isMobile
        }
      ]"
    >
      <ChatList
        :current-user="currentUser"
        :selected-chat="selectedChat"
        :chats="chats"
        @select-chat="handleChatSelect"
        @logout="handleLogout"
      />
    </div>

    <!-- Zone de chat -->
    <div
      :class="[
        'flex-1',
        {
          'hidden md:block': !showChat && isMobile,
          'w-full md:w-auto': showChat
        }
      ]"
    >
      <template v-if="selectedChat">
        <ChatArea
          :chat="selectedChat"
          :current-user="currentUser"
          @back="handleBack"
        />
      </template>

      <!-- État vide (desktop uniquement) -->
      <div
        v-else-if="!isMobile"
        class="h-full flex flex-col items-center justify-center text-gray-400 space-y-4"
      >
        <div class="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
          <MessageSquare class="w-8 h-8" />
        </div>
        <p class="text-lg">Select a conversation to start chatting</p>
      </div>
    </div>
  </div>
</template>