<script setup>
import { ChevronLeft } from 'lucide-vue-next'

defineProps({
  chat: {
    type: Object,
    required: true
  },
  showBackButton: {
    type: Boolean,
    default: false
  }
})

defineEmits(['back'])
</script>

<template>
  <div class="h-14 flex items-center px-4 border-b border-gray-800 safe-area-top">
    <button
      v-if="showBackButton"
      class="p-2 -ml-2 rounded-full hover:bg-gray-800"
      @click="$emit('back')"
    >
      <ChevronLeft class="w-6 h-6" />
    </button>

    <div class="flex items-center flex-1 min-w-0">
      <img
        :src="chat.avatar"
        :alt="chat.name"
        class="w-8 h-8 rounded-full object-cover"
      />
      
      <div class="ml-3 min-w-0">
        <h2 class="text-base font-medium truncate">{{ chat.name }}</h2>
        <p class="text-sm text-gray-400">
          {{ chat.online ? 'Online' : 'Offline' }}
        </p>
      </div>
    </div>

    <slot name="actions"></slot>
  </div>
</template>