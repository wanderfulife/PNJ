<!-- components/settings/SettingsItem.vue -->
<script setup>
import { computed } from 'vue';
import ToggleSwitch from '../ui/ToggleSwitch.vue';

const props = defineProps({
  icon: {
    type: Object,
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
  toggleValue: {
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

const emit = defineEmits(['toggle', 'click']);

const isClickable = computed(() => props.route || !props.hasToggle);

const handleClick = () => {
  if (props.disabled) return;
  if (isClickable.value) {
    emit('click');
  }
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
        :class="{ 'settings-item__icon--active': hasToggle && toggleValue }"
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
      v-model="modelValue"
      :disabled="disabled"
      :label="title"
      @update:modelValue="$emit('toggle', $event)"
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

/* Styles spécifiques aux appareils tactiles */
@media (hover: hover) {
  .settings-item--clickable:hover {
    background-color: var(--color-surface-light, #374151);
  }
}

/* Styles spécifiques aux appareils tactiles */
@media (hover: none) {
  .settings-item--clickable:active {
    background-color: var(--color-surface-light, #374151);
  }
}

/* Réduire les animations si l'utilisateur le préfère */
@media (prefers-reduced-motion: reduce) {
  .settings-item {
    transition: none;
  }
}
</style>