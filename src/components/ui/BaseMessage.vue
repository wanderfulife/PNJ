<script setup>
import { Check } from 'lucide-vue-next'

defineProps({
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
  isOutgoing: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'sent',
    validator: (value) => ['sent', 'delivered', 'read'].includes(value)
  }
})
</script>

<template>
  <div :class="[
    'flex max-w-[85%]',
    isOutgoing ? 'ml-auto' : 'mr-auto'
  ]">
    <div :class="[
      'rounded-2xl px-4 py-2',
      isOutgoing ? 'bg-purple-600 rounded-br-none' : 'bg-gray-800 rounded-bl-none'
    ]">
      <p class="text-base text-white">{{ content }}</p>
      <div class="flex items-center justify-end mt-1 space-x-1">
        <span class="text-xs text-gray-300">{{ timestamp }}</span>
        <Check 
          v-if="isOutgoing"
          class="w-4 h-4"
          :class="{
            'text-gray-400': status === 'sent',
            'text-blue-400': status === 'delivered',
            'text-green-400': status === 'read'
          }"
        />
      </div>
    </div>
  </div>
</template>