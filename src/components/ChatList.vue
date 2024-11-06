<script setup>
import { Search, Settings, PlusIcon } from 'lucide-vue-next'

defineProps({
  currentUser: {
    type: Object,
    required: true
  },
  chats: {
    type: Array,
    required: true
  },
  selectedChat: {
    type: Object,
    default: null
  },
  activeTab: {
    type: String,
    required: true
  },
  searchQuery: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:activeTab', 'update:searchQuery', 'selectChat'])
</script>

<template>
  <div class="w-80 border-r border-gray-800">
    <!-- User Profile -->
    <div class="p-4 flex items-center justify-between">
      <div class="flex items-center">
        <img 
          :src="currentUser.avatar" 
          class="w-10 h-10 rounded-full"
          alt="Profile"
        />
        <button class="ml-4 p-2 hover:bg-gray-800 rounded-full">
          <PlusIcon class="w-5 h-5" />
        </button>
      </div>
      <button class="p-2 hover:bg-gray-800 rounded-full">
        <Settings class="w-5 h-5" />
      </button>
    </div>

    <!-- Search -->
    <div class="px-4 pb-4">
      <div class="relative">
        <Search class="w-4 h-4 absolute left-3 top-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search chats"
          :value="searchQuery"
          @input="emit('update:searchQuery', $event.target.value)"
          class="w-full bg-gray-800 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-700"
        />
      </div>
    </div>

    <!-- Chat List -->
    <div class="overflow-y-auto h-[calc(100vh-140px)]">
      <div class="flex px-4 py-2 space-x-4">
        <button 
          v-for="tab in ['All', 'NPCs', 'Friends']" 
          :key="tab"
          :class="[
            'px-4 py-1 rounded-full text-sm',
            activeTab === tab ? 'bg-gray-800' : 'text-gray-400'
          ]"
          @click="emit('update:activeTab', tab)"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Chat Items -->
      <div class="space-y-1">
        <div
          v-for="chat in chats"
          :key="chat.id"
          :class="[
            'flex items-center px-4 py-3 cursor-pointer hover:bg-gray-800',
            selectedChat?.id === chat.id ? 'bg-gray-800' : ''
          ]"
          @click="emit('selectChat', chat)"
        >
          <div class="relative">
            <img 
              :src="chat.avatar" 
              class="w-10 h-10 rounded-full"
              :alt="chat.name"
            />
            <div 
              v-if="chat.online" 
              class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"
            ></div>
          </div>
          <div class="ml-3 flex-1 overflow-hidden">
            <div class="flex justify-between items-center">
              <h3 class="text-sm font-medium">{{ chat.name }}</h3>
              <span class="text-xs text-gray-500">{{ chat.lastMessageTime }}</span>
            </div>
            <p class="text-sm text-gray-400 truncate">{{ chat.lastMessage }}</p>
          </div>
          <div 
            v-if="chat.unreadCount" 
            class="ml-2 bg-purple-600 rounded-full w-5 h-5 flex items-center justify-center"
          >
            <span class="text-xs">{{ chat.unreadCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>