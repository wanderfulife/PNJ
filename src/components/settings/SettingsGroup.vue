<!-- components/settings/SettingsGroup.vue -->
<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <section class="settings-group">
    <div class="settings-group__header">
      <h2 class="settings-group__title">{{ title }}</h2>
      <p v-if="description" class="settings-group__description">
        {{ description }}
      </p>
    </div>
    
    <div class="settings-group__content">
      <slot></slot>
    </div>
  </section>
</template>

<style scoped>
.settings-group {
  background-color: var(--color-surface, #1F2937);
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.settings-group__header {
  padding: 1.25rem 1.25rem 1rem;
}

.settings-group__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text, #F3F4F6);
  margin: 0;
}

.settings-group__description {
  font-size: 0.875rem;
  color: var(--color-text-secondary, #9CA3AF);
  line-height: 1.4;
  margin: 0.25rem 0 0 0;
}

.settings-group__content {
  display: flex;
  flex-direction: column;
}

.settings-group__content > :not(:last-child) {
  border-bottom: 1px solid var(--color-border, #374151);
}
</style>