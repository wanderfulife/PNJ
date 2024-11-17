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
    default: 120
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const input = ref(null)
const content = ref(props.modelValue)

// Platform detection
const platformClass = computed(() => authStore.platform?.toLowerCase())

// Computed max height
const computedMaxHeight = computed(() => {
  return typeof props.maxHeight === 'number' 
    ? `${props.maxHeight}px` 
    : props.maxHeight
})

// Safe height update
const updateHeight = () => {
  if (!input.value) return
  
  requestAnimationFrame(() => {
    const el = input.value
    if (!el) return

    el.style.height = '0'
    const maxHeightValue = parseInt(computedMaxHeight.value)
    const scrollHeight = el.scrollHeight
    const newHeight = Math.min(scrollHeight, maxHeightValue)
    el.style.height = `${newHeight}px`
  })
}

const onInput = (e) => {
  const newValue = e.target.value
  content.value = newValue
  emit('update:modelValue', newValue)
  updateHeight()
}

const onKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    if (content.value.trim()) {
      emit('submit')
    }
  }
}

// Watch for external value changes
watch(() => props.modelValue, (newVal) => {
  if (newVal !== content.value) {
    content.value = newVal
    updateHeight()
  }
})

onMounted(() => {
  updateHeight()
})
</script>

<template>
  <div :class="['base-input-container', platformClass]">
    <textarea
      ref="input"
      v-model="content"
      class="base-input"
      :style="{ maxHeight: computedMaxHeight }"
      rows="1"
      :placeholder="placeholder"
      @input="onInput"
      @keydown="onKeydown"
    />
    <slot name="suffix" />
  </div>
</template>

<style scoped>
.base-input-container {
  position: relative;
  display: flex;
  align-items: flex-end;
  background-color: var(--gray-800);
  border-radius: 9999px;
  min-height: 42px;
}

.base-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--foreground);
  font-family: inherit;
  font-size: var(--text-base);
  line-height: 1.5;
  min-height: 42px;
  outline: none;
  padding: 0.75rem 1rem;
  resize: none;
  width: 100%;
}

.base-input::placeholder {
  color: var(--gray-400);
}

/* Platform specific styles */
.ios .base-input {
  font-size: 16px !important;
}

/* Hide scrollbar but keep functionality */
.base-input {
  scrollbar-width: none;
}

.base-input::-webkit-scrollbar {
  display: none;
}

/* Focus styles */
.base-input-container:focus-within {
  outline: 2px solid var(--primary);
  outline-offset: -1px;
}

/* Prevent zoom on iOS */
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