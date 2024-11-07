<script setup>
import { ref, watch } from 'vue'

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
    type: String,
    default: '120px'
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const input = ref(null)
const content = ref(props.modelValue)

const updateHeight = () => {
  if (!input.value) return
  input.value.style.height = '0'
  input.value.style.height = Math.min(input.value.scrollHeight, parseInt(props.maxHeight)) + 'px'
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
    :style="{ maxHeight: maxHeight }"
    rows="1"
    :placeholder="placeholder"
    @input="onInput"
    @keydown="onKeydown"
  />
</template>