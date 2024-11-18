<!-- components/ui/ToggleSwitch.vue -->
<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
};
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="label"
    :disabled="disabled"
    class="toggle-switch"
    :class="{
      'toggle-switch--active': modelValue,
      'toggle-switch--disabled': disabled
    }"
    @click="toggle"
  >
    <div class="toggle-switch__track">
      <span 
        class="toggle-switch__slider" 
        :class="{ 'toggle-switch__slider--active': modelValue }"
        aria-hidden="true" 
      />
    </div>
  </button>
</template>

<style scoped>
.toggle-switch {
  position: relative;
  width: 3.25rem;
  height: 2rem;
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.toggle-switch--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-switch__track {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-surface-dark, #374151);
  border-radius: 9999px;
  transition: background-color 0.2s ease;
}

.toggle-switch--active .toggle-switch__track {
  background-color: var(--color-primary, #7C3AED);
}

.toggle-switch__slider {
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.toggle-switch__slider--active {
  transform: translateX(1.25rem);
}

@media (hover: hover) {
  .toggle-switch:hover:not(.toggle-switch--disabled) .toggle-switch__track {
    background-color: var(--color-surface-darker, #4B5563);
  }

  .toggle-switch--active:hover:not(.toggle-switch--disabled) .toggle-switch__track {
    background-color: var(--color-primary-dark, #6D28D9);
  }
}

/* Réduire les animations si l'utilisateur le préfère */
@media (prefers-reduced-motion: reduce) {
  .toggle-switch__track,
  .toggle-switch__slider {
    transition: none;
  }
}
</style>