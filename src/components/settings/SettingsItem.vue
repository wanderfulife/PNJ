<!-- components/settings/SettingsItem.vue -->
<script setup>
import { computed, ref, watch } from 'vue';
import ToggleSwitch from '../ui/ToggleSwitch.vue';

const props = defineProps({
  icon: {
    type: [Object, Function], // Allow both Object and Function types for icons
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  hasToggle: {
    type: Boolean,
    default: false
  },
  modelValue: {  // Add modelValue prop for v-model support
    type: Boolean,
    default: false
  },
  route: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle', 'click', 'update:modelValue']);

const isClickable = computed(() => props.route || !props.hasToggle);

// Local state for toggle value
const localValue = ref(props.modelValue);

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal;
});

const handleClick = () => {
  if (props.disabled) return;
  if (isClickable.value) {
    emit('click');
  }
};

const handleToggle = (value) => {
  localValue.value = value;
  emit('update:modelValue', value);
  emit('toggle', value);
};
</script>

<template>
  <div
    class="settings-item"
    :class="{
      'settings-item--clickable': isClickable,
      'settings-item--disabled': disabled
    }"
    @click="handleClick"
  >
    <div class="settings-item__content">
      <component
        :is="icon"
        class="settings-item__icon"
        :class="{ 'settings-item__icon--active': hasToggle && modelValue }"
        aria-hidden="true"
      />
      
      <div class="settings-item__text">
        <h3 class="settings-item__title">{{ title }}</h3>
        <p v-if="description" class="settings-item__description">
          {{ description }}
        </p>
      </div>
    </div>

    <ToggleSwitch
      v-if="hasToggle"
      :model-value="modelValue"
      :disabled="disabled"
      :label="title"
      @update:model-value="handleToggle"
    />
    
    <div v-else-if="route" class="settings-item__chevron">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="settings-item__chevron-icon"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background-color: var(--color-surface, #1F2937);
  transition: background-color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.settings-item--clickable {
  cursor: pointer;
}

.settings-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.settings-item__content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.settings-item__icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-text-secondary, #9CA3AF);
}

.settings-item__icon--active {
  color: var(--color-primary, #7C3AED);
}

.settings-item__text {
  min-width: 0;
}

.settings-item__title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text, #F3F4F6);
  margin: 0;
}

.settings-item__description {
  font-size: 0.875rem;
  color: var(--color-text-secondary, #9CA3AF);
  margin: 0.25rem 0 0 0;
  line-height: 1.25;
}

.settings-item__chevron {
  flex-shrink: 0;
  color: var(--color-text-secondary, #9CA3AF);
  margin-left: 1rem;
}

.settings-item__chevron-icon {
  width: 1.25rem;
  height: 1.25rem;
}

@media (hover: hover) {
  .settings-item--clickable:hover {
    background-color: var(--color-surface-light, #374151);
  }
}

@media (hover: none) {
  .settings-item--clickable:active {
    background-color: var(--color-surface-light, #374151);
  }
}

@media (prefers-reduced-motion: reduce) {
  .settings-item {
    transition: none;
  }
}
</style>