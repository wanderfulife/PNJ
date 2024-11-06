<script setup>
import { Search, Settings, PlusIcon } from 'lucide-vue-next'

const props = defineProps({
  currentUser: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      name: 'Guest',
      avatar: '/placeholder.svg?height=40&width=40'
    })
  },
  chats: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedChat: {
    type: Object,
    default: null
  },
  activeTab: {
    type: String,
    required: true,
    default: 'All'
  },
  searchQuery: {
    type: String,
    required: true,
    default: ''
  }
})

const emit = defineEmits(['update:activeTab', 'update:searchQuery', 'selectChat'])
</script>

<template>
  <div class="flex flex-col h-full bg-gray-900">
    <!-- Status Bar Spacer -->
    <div class="safe-top bg-gray-900"></div>
    
    <!-- Search -->
    <div class="px-4 pt-2 pb-3 bg-gray-900">
      <div class="relative">
        <Search class="w-4 h-4 absolute left-3 top-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search chats"
          :value="searchQuery"
          @input="emit('update:searchQuery', $event.target.value)"
          class="w-full bg-gray-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-700"
        />
      </div>
    </div>

    <!-- Tabs -->
    <div class="px-4 py-2 flex space-x-2">
      <button 
        v-for="tab in ['All', 'NPCs', 'Friends']" 
        :key="tab"
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          activeTab === tab ? 'bg-gray-800 text-white' : 'text-gray-400'
        ]"
        @click="emit('update:activeTab', tab)"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Chat List -->
    <div class="flex-1 overflow-y-auto">
      <div 
        v-for="chat in chats"
        :key="chat.id"
        class="px-4 py-3 flex items-center space-x-3 active:bg-gray-800"
        @click="emit('selectChat', chat)"
      >
        <div class="relative flex-shrink-0">
          <img 
            :src="chat.avatar" 
            class="w-12 h-12 rounded-full bg-gray-800"
            :alt="chat.name"
          />
          <div 
            v-if="chat.online" 
            class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"
          />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-medium truncate">{{ chat.name }}</h3>
            <span class="text-xs text-gray-500 flex-shrink-0">{{ chat.lastMessageTime }}</span>
          </div>
          <p class="text-sm text-gray-400 truncate">{{ chat.lastMessage }}</p>
        </div>
        <div 
          v-if="chat.unreadCount" 
          class="flex-shrink-0 bg-purple-600 rounded-full w-5 h-5 flex items-center justify-center"
        >
          <span class="text-xs">{{ chat.unreadCount }}</span>
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div v-if="currentUser" class="px-4 py-2 border-t border-gray-800 safe-bottom">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <img 
            :src="currentUser.avatar" 
            class="w-8 h-8 rounded-full bg-gray-800"
            alt="Profile"
          />
          <button class="p-2 hover:bg-gray-800 rounded-full">
            <PlusIcon class="w-5 h-5" />
          </button>
        </div>
        <button class="p-2 hover:bg-gray-800 rounded-full">
          <Settings class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>