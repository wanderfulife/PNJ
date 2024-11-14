<script setup>
import { ref } from 'vue'
import { Search, Settings } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  chats: {
    type: Array,
    required: true
  },
  selectedChat: {
    type: Object,
    default: null
  },
  currentUser: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select-chat'])
const searchQuery = ref('')

const handleChatClick = (chat) => {
  emit('select-chat', chat)
}

const goToSettings = () => {
  router.push('/settings')
}
</script>

<template>
  <div class="flex flex-col h-full bg-gray-900">
    <!-- Header -->
    <div class="safe-area-top px-4 pt-2 pb-3 border-b border-gray-800">
      <div class="flex items-center justify-between mb-3">
        <!-- User Profile Section -->
        <div class="flex items-center space-x-3">
          <div class="relative">
           
          </div>
          <div class="flex flex-col">
            <h1 class="text-lg font-semibold">Messages</h1>
            <p class="text-xs text-gray-400">{{ currentUser.email }}</p>
          </div>
        </div>

        <!-- Settings Button -->
        <button 
          class="p-2 hover:bg-gray-800 rounded-full transition-colors"
          @click="goToSettings"
        >
          <Settings class="w-5 h-5" />
        </button>
      </div>

      <!-- Search -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search chats"
          class="w-full bg-gray-800 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>

    <!-- Chat List -->
    <div class="flex-1 overflow-y-auto">
      <div class="divide-y divide-gray-800">
        <button
          v-for="chat in chats"
          :key="chat.id"
          class="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-800 active:bg-gray-700"
          @click="handleChatClick(chat)"
        >
          <!-- Avatar with online status -->
          <div class="relative flex-shrink-0">
            <img 
              :src="chat.avatar"
              :alt="chat.name"
              class="w-12 h-12 rounded-full object-cover bg-gray-700"
            />
            <div 
              v-if="chat.online"
              class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"
            />
          </div>

          <!-- Chat Info -->
          <div class="flex-1 min-w-0 text-left">
            <div class="flex justify-between items-baseline">
              <h3 class="text-base font-medium truncate">{{ chat.name }}</h3>
              <span class="text-sm text-gray-400 flex-shrink-0">
                {{ chat.lastMessageTime }}
              </span>
            </div>
            <p class="text-sm text-gray-400 truncate">{{ chat.lastMessage }}</p>
          </div>

          <!-- Unread Badge -->
          <div 
            v-if="chat.unreadCount"
            class="flex-shrink-0 bg-purple-600 rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center"
          >
            <span class="text-xs font-medium">{{ chat.unreadCount }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- New Chat Button -->
    <div class="p-4">
      <button 
        class="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-xl py-3 px-4 font-medium transition-colors"
      >
        + New Chat
      </button>
    </div>
  </div>
</template>

<style scoped>
.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
}

/* Touch optimizations */
button {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* iOS input optimization */
@supports (-webkit-touch-callout: none) {
  input {
    font-size: 16px !important;
  }
}
</style>