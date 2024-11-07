<script setup>
import { ref, computed } from 'vue'
import { Search, Settings, Plus, LogOut } from 'lucide-vue-next'
import BaseInput from '../ui/BaseInput.vue'
import { useAuth } from '../../composables/useAuth'
import { useRouter } from 'vue-router'

const { logout } = useAuth()
const router = useRouter()

const props = defineProps({
  chats: {
    type: Array,
    default: () => []
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

const emit = defineEmits(['selectChat'])
const searchQuery = ref('')
const isLoggingOut = ref(false)

const handleLogout = async () => {
  if (isLoggingOut.value) return
  
  try {
    isLoggingOut.value = true
    await logout() // Attendre que la déconnexion Firebase soit terminée
    await router.replace('/login') // Rediriger après la déconnexion
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <div class="flex flex-col h-full bg-gray-900">
    <!-- En-tête avec recherche -->
    <div class="safe-area-top px-4 pt-2 pb-3">
      <BaseInput
        v-model="searchQuery"
        placeholder="Search chats"
        class="bg-gray-800 rounded-xl"
      >
        <template #prefix>
          <Search class="w-5 h-5 text-gray-400" />
        </template>
      </BaseInput>
    </div>

    <!-- Liste des chats -->
    <div class="flex-1 overflow-y-auto">
      <div class="divide-y divide-gray-800">
        <button
          v-for="chat in filteredChats"
          :key="chat.id"
          class="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-800 active:bg-gray-700 transition-colors"
          :class="{ 'bg-gray-800': selectedChat?.id === chat.id }"
          @click="emit('selectChat', chat)"
        >
          <!-- Avatar avec indicateur online -->
          <div class="relative flex-shrink-0">
            <img 
              :src="chat.avatar" 
              :alt="chat.name"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div 
              v-if="chat.online" 
              class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"
            />
          </div>

          <!-- Infos du chat -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline">
              <h3 class="text-base font-medium truncate">{{ chat.name }}</h3>
              <span class="text-sm text-gray-400 flex-shrink-0">
                {{ chat.lastMessageTime }}
              </span>
            </div>
            <p class="text-sm text-gray-400 truncate mt-0.5">
              {{ chat.lastMessage }}
            </p>
          </div>

          <!-- Badge messages non lus -->
          <div 
            v-if="chat.unreadCount" 
            class="flex-shrink-0 bg-purple-600 rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center"
          >
            <span class="text-xs font-medium">{{ chat.unreadCount }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Barre d'actions -->
    <div class="safe-area-bottom border-t border-gray-800">
      <div class="px-4 py-2 flex justify-between items-center">
        <!-- User section -->
        <div class="flex items-center space-x-2">
          <img 
            :src="currentUser.avatar || '/api/placeholder/32/32'" 
            :alt="currentUser.email"
            class="w-8 h-8 rounded-full object-cover"
          />
          <span class="text-sm text-gray-400 truncate max-w-[120px]">
            {{ currentUser.email }}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-1">
          <button class="p-2 hover:bg-gray-800 rounded-full">
            <Plus class="w-5 h-5" />
          </button>
          <button class="p-2 hover:bg-gray-800 rounded-full">
            <Settings class="w-5 h-5" />
          </button>
          <button 
            class="p-2 hover:bg-gray-800 rounded-full text-red-400 hover:text-red-300"
            :disabled="isLoggingOut"
            @click="handleLogout"
          >
            <LogOut 
              class="w-5 h-5"
              :class="{ 'animate-spin': isLoggingOut }"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optimisations pour le toucher */
button {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Optimisations pour le défilement */
.overflow-y-auto {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
}

/* Animation de transition */
.transition-colors {
  transition-property: background-color;
  transition-duration: 200ms;
}
</style>