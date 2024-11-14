<script setup>
import { ChevronLeft, MoreVertical } from 'lucide-vue-next'

const props = defineProps({
  chat: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back'])
</script>

<template>
  <div class="flex items-center h-14 px-4 bg-gray-900 border-b border-gray-800 safe-area-top">
    <button
      class="p-2 -ml-2 rounded-full hover:bg-gray-800"
      @click="$emit('back')"
    >
      <ChevronLeft class="w-6 h-6" />
    </button>

    <div class="flex items-center flex-1 min-w-0 ml-2">
      <div class="relative flex-shrink-0">
        <img
          :src="chat.avatar"
          class="w-8 h-8 rounded-full object-cover"
        />
        <div 
          v-if="chat.online" 
          class="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-gray-900"
        />
      </div>
      
      <div class="ml-3 min-w-0">
        <h2 class="text-base font-medium truncate">{{ chat.name }}</h2>
        <p class="text-sm text-gray-400">
          {{ chat.online ? 'Online' : 'Offline' }}
        </p>
      </div>
    </div>

    <button class="p-2 rounded-full hover:bg-gray-800">
      <MoreVertical class="w-6 h-6" />
    </button>
  </div>
</template>

<style scoped>
button {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
</style>