<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const platformClass = computed(() => authStore.platform?.toLowerCase())

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  label: String,
  error: String,
  maxHeight: {
    type: [String, Number],
    default: 120
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const input = ref(null)
const content = ref(props.modelValue)

const computedMaxHeight = computed(() => {
  return typeof props.maxHeight === 'number' 
    ? `${props.maxHeight}px` 
    : props.maxHeight
})

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
  <div :class="['base-input-container', platformClass, { 'has-error': error }]">
    <label 
      v-if="label"
      class="input-label"
      :for="label"
    >
      {{ label }}
    </label>

    <div class="input-wrapper">
      <textarea
        ref="input"
        :id="label"
        v-model="content"
        class="base-input"
        :class="{ 'has-error': error }"
        :style="{ maxHeight: computedMaxHeight }"
        :type="type"
        :placeholder="placeholder"
        rows="1"
        @input="onInput"
        @keydown="onKeydown"
      />
      <slot name="suffix" />
    </div>

    <span 
      v-if="error"
      class="error-message"
      role="alert"
    >
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.base-input-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.input-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: flex-end;
}

.base-input {
  width: 100%;
  min-height: 42px;
  padding: var(--spacing-2) var(--spacing-3);
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--platform-radius);
  font-family: inherit;
  font-size: var(--font-size-base);
  line-height: 1.5;
  resize: none;
  transition: all var(--transition-fast);
}

.base-input:focus {
  outline: none;
  border-color: var(--platform-primary);
  background-color: var(--color-surface-light);
}

.base-input.has-error {
  border-color: var(--color-error);
}

.error-message {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  animation: shake var(--transition-fast);
}

/* Platform specific styles */
.ios .base-input {
  border-radius: calc(var(--platform-radius) * 1.2);
}

.android .base-input {
  border-radius: calc(var(--platform-radius) * 1.5);
}

/* Animations */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* Scroll behavior */
.base-input {
  scrollbar-width: none;
}

.base-input::-webkit-scrollbar {
  display: none;
}

/* Mobile optimizations */
@media (hover: none) {
  .base-input {
    font-size: 16px;
    -webkit-tap-highlight-color: transparent;
  }
}

/* Focus visible */
.base-input:focus-visible {
  box-shadow: 0 0 0 2px var(--platform-primary);
}
</style>