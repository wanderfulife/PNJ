<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  maxHeight: {
    type: [String, Number],
    default: '120px'
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const input = ref(null)
const content = ref(props.modelValue)

// Mise à jour de la hauteur sécurisée
const updateHeight = () => {
  if (!input.value) return
  
  // S'assurer que l'élément est monté et a un style
  requestAnimationFrame(() => {
    if (input.value && input.value.style) {
      input.value.style.height = '0'
      const maxHeightValue = typeof props.maxHeight === 'number' 
        ? `${props.maxHeight}px` 
        : props.maxHeight
      const newHeight = Math.min(input.value.scrollHeight, parseInt(maxHeightValue))
      input.value.style.height = `${newHeight}px`
    }
  })
}

const onInput = (e) => {
  content.value = e.target.value
  emit('update:modelValue', content.value)
  updateHeight()
}

const onKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    emit('submit')
  }
}

// S'assurer que la hauteur est mise à jour après le montage
onMounted(() => {
  updateHeight()
})

// Observer les changements de valeur
watch(() => props.modelValue, (newVal) => {
  content.value = newVal
  updateHeight()
})
</script>

<template>
  <textarea
    ref="input"
    v-model="content"
    class="w-full bg-gray-800 rounded-full px-4 py-2 text-white placeholder-gray-400 resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500"
    :style="{
      maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
      minHeight: '42px'
    }"
    rows="1"
    :placeholder="placeholder"
    @input="onInput"
    @keydown="onKeydown"
  />
</template>