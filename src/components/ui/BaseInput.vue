<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

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

// Platform detection
const platformClass = computed(() => authStore.platform.toLowerCase())

// Hauteur maximale calculée
const computedMaxHeight = computed(() => {
  return typeof props.maxHeight === 'number' 
    ? `${props.maxHeight}px` 
    : props.maxHeight
})

// Mise à jour de la hauteur sécurisée
const updateHeight = () => {
  if (!input.value) return
  
  requestAnimationFrame(() => {
    if (input.value && input.value.style) {
      input.value.style.height = '0'
      const maxHeightValue = parseInt(computedMaxHeight.value)
      const newHeight = Math.min(input.value.scrollHeight, maxHeightValue)
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

onMounted(() => {
  updateHeight()
})

watch(() => props.modelValue, (newVal) => {
  content.value = newVal
  updateHeight()
})
</script>

<template>
  <textarea
    ref="input"
    v-model="content"
    :class="['base-input', platformClass]"
    :style="{
      maxHeight: computedMaxHeight
    }"
    rows="1"
    :placeholder="placeholder"
    @input="onInput"
    @keydown="onKeydown"
  />
</template>

<style scoped>
/* BaseInput.css */

.base-input {
  width: 100%;
  background-color: #1f2937; /* bg-gray-800 */
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  color: #ffffff;
  resize: none;
  overflow: hidden;
  min-height: 42px;
  border: none;
  font-family: inherit;
  line-height: 1.5;
}

.base-input::placeholder {
  color: #9ca3af; /* placeholder-gray-400 */
}

.base-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #8b5cf6; /* focus:ring-2 focus:ring-purple-500 */
}

/* Platform specific adjustments */
.ios .base-input {
  font-size: 16px !important;
}

/* Scrollbar styling */
.base-input::-webkit-scrollbar {
  width: 0px;
}

/* Prevent zoom on focus for iOS */
@supports (-webkit-touch-callout: none) {
  .base-input {
    font-size: 16px;
  }
}

/* Remove default textarea styles */
.base-input {
  -webkit-appearance: none;
  appearance: none;
}

/* Ensure smooth height transitions */
.base-input {
  transition: height 0.1s ease-out;
}
</style>