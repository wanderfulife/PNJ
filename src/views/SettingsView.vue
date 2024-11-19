<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import { useProfileStore } from '../stores/useProfileStore';
import {
  Bell,
  Shield,
  Key,
  ChevronLeft,
  Moon,
  Languages,
  Smartphone,
  User
} from 'lucide-vue-next';

import SettingsGroup from '../components/settings/SettingsGroup.vue';
import SettingsItem from '../components/settings/SettingsItem.vue';

const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const isLoggingOut = ref(false);

// Memoized settings configurations
const notificationSettings = computed(() => [
  {
    icon: Bell,
    title: 'Push Notifications',
    description: 'Receive alerts when you get new messages',
    hasToggle: true,
    preferenceKey: 'pushNotifications',
    route: null
  },
  {
    icon: Bell,
    title: 'Message Sounds',
    description: 'Play sounds for new messages',
    hasToggle: true,
    preferenceKey: 'messageSounds',
    route: null
  }
]);

const privacySettings = computed(() => [
  {
    icon: Shield,
    title: 'Privacy Settings',
    description: 'Manage your privacy preferences',
    hasToggle: false,
    route: '/privacy'
  },
  {
    icon: Key,
    title: 'Security',
    description: 'Password and authentication settings',
    hasToggle: false,
    route: '/security'
  }
]);

const applicationSettings = computed(() => [
  {
    icon: Moon,
    title: 'Dark Mode',
    description: 'Toggle dark/light theme',
    hasToggle: true,
    preferenceKey: 'darkMode',
    route: null
  },
  {
    icon: Languages,
    title: 'Language',
    description: 'Choose your preferred language',
    hasToggle: false,
    route: '/language'
  },
  {
    icon: Smartphone,
    title: 'App Version',
    description: `Version ${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
    hasToggle: false,
    route: null
  }
]);

const handleBack = () => router.push('/chat');

const handleLogout = async () => {
  if (isLoggingOut.value) return;
  
  try {
    isLoggingOut.value = true;
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    isLoggingOut.value = false;
  }
};

const handleToggleSetting = async (key, value) => {
  try {
    await profileStore.savePreferences({ [key]: value });
  } catch (error) {
    console.error('Toggle setting error:', error);
  }
};
</script>

<template>
  <div class="settings-view" :class="authStore.platform">
    <!-- Header -->
    <header class="settings-header">
      <button class="header-button" @click="handleBack">
        <ChevronLeft class="header-icon" aria-hidden="true" />
        <span class="sr-only">Back</span>
      </button>
      <h1 class="header-title">Settings</h1>
    </header>

    <!-- Scrollable Container -->
    <div class="settings-scroll-container">
      <main class="settings-content">
        <!-- Profile Section -->
        <section class="profile-section">
          <div class="profile-avatar">
            <User class="profile-icon" aria-hidden="true" />
          </div>
          <div class="profile-info">
            <h2 class="profile-name">
              {{ authStore.user?.displayName || 'Student' }}
            </h2>
            <p class="profile-email">{{ authStore.user?.email }}</p>
          </div>
        </section>

        <!-- Settings Groups -->
        <SettingsGroup 
          title="Notifications"
          description="Manage message alerts and sounds"
        >
          <SettingsItem
            v-for="item in notificationSettings"
            :key="item.title"
            v-bind="item"
            :toggle-value="profileStore.preferences[item.preferenceKey]"
            @toggle="handleToggleSetting(item.preferenceKey, $event)"
          />
        </SettingsGroup>

        <SettingsGroup
          title="Privacy & Security"
          description="Control your data and privacy settings"
        >
          <SettingsItem
            v-for="item in privacySettings"
            :key="item.title"
            v-bind="item"
            @click="router.push(item.route)"
          />
        </SettingsGroup>

        <SettingsGroup
          title="Application"
          description="General app settings"
        >
          <SettingsItem
            v-for="item in applicationSettings"
            :key="item.title"
            v-bind="item"
            :toggle-value="item.hasToggle ? profileStore.preferences[item.preferenceKey] : undefined"
            @toggle="item.hasToggle && handleToggleSetting(item.preferenceKey, $event)"
            @click="item.route && router.push(item.route)"
          />
        </SettingsGroup>

        <!-- Logout Button -->
        <button
          class="logout-button"
          :disabled="isLoggingOut"
          @click="handleLogout"
        >
          <User
            class="icon"
            :class="{ 'animate-spin': isLoggingOut }"
            aria-hidden="true"
          />
          <span>{{ isLoggingOut ? 'Logging out...' : 'Log Out' }}</span>
        </button>
      </main>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  color: var(--color-text);
  overflow: hidden;
}

.settings-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-background);
}

.settings-scroll-container {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.settings-content {
  max-width: 640px;
  margin: 0 auto;
  padding: 1rem;
}

/* Header styles */
.header-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  border: none;
  border-radius: 9999px;
  background-color: transparent;
  color: var(--color-text);
  transition: background-color 0.2s;
}

.header-button:hover {
  background-color: var(--color-surface-light);
}

.header-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
}

/* Profile section */
.profile-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: var(--color-surface);
  border-radius: 1rem;
}

.profile-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  background-color: var(--color-primary);
  border-radius: 9999px;
  flex-shrink: 0;
}

.profile-icon {
  width: 2rem;
  height: 2rem;
  color: white;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.profile-email {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Logout button */
.logout-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  margin-top: 2rem;
  background-color: var(--color-surface);
  border: none;
  border-radius: 0.75rem;
  color: var(--color-error);
  font-weight: 500;
  transition: all 0.2s ease;
}

.logout-button:hover:not(:disabled) {
  background-color: var(--color-surface-light);
  transform: translateY(-1px);
}

.logout-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (min-width: 640px) {
  .settings-content {
    padding: 2rem;
  }
  
  .profile-section {
    padding: 2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .settings-view *,
  .settings-view *::before,
  .settings-view *::after {
    transition: none !important;
    animation: none !important;
  }
}
</style>