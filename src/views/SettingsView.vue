<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useProfileStore } from '@/stores/useProfileStore'
import { Moon, Bell, Shield, Key, HelpCircle, LogOut, ChevronLeft, Camera, Edit2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const profileStore = useProfileStore()

const showProfileEdit = ref(false)
const isLoggingOut = ref(false)
const editForm = ref({
  displayName: '',
  email: ''
})

// Pour suivre l'état de l'upload de la photo
const isUploadingPhoto = ref(false)

const settingsItems = [
  { 
    icon: Bell,
    title: 'Notifications', 
    description: 'Manage alerts',
    hasToggle: true,
    preferenceKey: 'notifications'
  },
  { 
    icon: Shield,
    title: 'Privacy', 
    description: 'Control your privacy',
    hasToggle: false
  },
  { 
    icon: Key,
    title: 'Security', 
    description: 'Account security settings',
    hasToggle: false
  },
  { 
    icon: HelpCircle,
    title: 'Help', 
    description: 'Get support',
    hasToggle: false
  },
]

const handleBack = () => {
  router.push('/chat')
}

const handleLogout = async () => {
  if (isLoggingOut.value) return
  try {
    isLoggingOut.value = true
    await authStore.logout()
    await router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}

const startProfileEdit = () => {
  editForm.value = {
    displayName: authStore.user?.displayName || '',
    email: authStore.user?.email || ''
  }
  showProfileEdit.value = true
}

const handleProfileUpdate = async () => {
  if (editForm.value.email !== authStore.user?.email) {
    await authStore.updateUserEmail(editForm.value.email)
  }
  
  if (editForm.value.displayName !== authStore.user?.displayName) {
    await authStore.updateUserProfile({
      displayName: editForm.value.displayName
    })
  }
  
  showProfileEdit.value = false
}

const handlePhotoUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  try {
    isUploadingPhoto.value = true
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await authStore.updateUserProfile({
      photoURL: '/api/placeholder/128/128' // URL simulée
    })
  } catch (error) {
    console.error('Photo upload error:', error)
  } finally {
    isUploadingPhoto.value = false
  }
}

const handleToggleSetting = async (preferenceKey) => {
  if (!preferenceKey) return
  await profileStore.savePreferences({
    [preferenceKey]: !profileStore.preferences[preferenceKey]
  })
}

const handleDarkModeToggle = async () => {
  await profileStore.savePreferences({
    darkMode: !profileStore.preferences.darkMode
  })
}

onMounted(() => {
  profileStore.loadPreferences()
})
</script>

<template>
  <div class="settings-view" :class="authStore.platform">
    <!-- Safe area top -->
    <div class="safe-area-top"></div>

    <div class="settings-content">
      <div class="settings-container">
        <!-- Profile Section -->
        <div class="profile-card">
          <div class="profile-header">
            <button @click="handleBack" class="back-button">
              <ChevronLeft class="icon-small" />
            </button>
            <h2 class="title">Profile</h2>
          </div>

          <div class="profile-content">
            <!-- Photo Profile -->
            <div class="photo-container">
              <img
                :src="authStore.user?.photoURL"
                :alt="authStore.user?.displayName"
                class="profile-photo"
              />
              <label class="photo-upload-button" :class="{ 'disabled': isUploadingPhoto }">
                <Camera class="icon-mini" />
                <input 
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload"
                  :disabled="isUploadingPhoto"
                />
              </label>
            </div>

            <!-- Edit Form -->
            <div v-if="showProfileEdit" class="edit-form">
              <input
                v-model="editForm.displayName"
                type="text"
                placeholder="Display Name"
                class="form-input"
              />
              <input
                v-model="editForm.email"
                type="email"
                placeholder="Email"
                class="form-input"
              />
              <div class="button-group">
                <button 
                  @click="handleProfileUpdate"
                  :disabled="authStore.loading"
                  class="primary-button"
                >
                  {{ authStore.loading ? 'Saving...' : 'Save' }}
                </button>
                <button 
                  @click="showProfileEdit = false"
                  class="secondary-button"
                >
                  Cancel
                </button>
              </div>
              <p v-if="authStore.error" class="error-message">
                {{ authStore.error }}
              </p>
            </div>

            <!-- Profile Display -->
            <div v-else class="profile-info">
              <h2 class="profile-name">{{ authStore.user?.displayName }}</h2>
              <p class="profile-email">{{ authStore.user?.email }}</p>
              <button @click="startProfileEdit" class="edit-button">
                <Edit2 class="icon-mini" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Settings List -->
        <div class="settings-card">
          <!-- Dark Mode Toggle -->
          <div class="settings-item">
            <div class="settings-item-content">
              <Moon class="icon-small text-subtle" />
              <div class="settings-item-text">
                <h3 class="settings-item-title">Dark Mode</h3>
                <p class="settings-item-description">Toggle dark theme</p>
              </div>
            </div>
            <button
              @click="handleDarkModeToggle"
              class="toggle-switch"
              :class="{ 'active': profileStore.preferences.darkMode }"
            >
              <span class="toggle-knob"></span>
            </button>
          </div>

          <!-- Other Settings -->
          <div
            v-for="(item, index) in settingsItems"
            :key="index"
            class="settings-item"
          >
            <div class="settings-item-content">
              <component :is="item.icon" class="icon-small text-subtle" />
              <div class="settings-item-text">
                <h3 class="settings-item-title">{{ item.title }}</h3>
                <p class="settings-item-description">{{ item.description }}</p>
              </div>
            </div>
            <button
              v-if="item.hasToggle"
              @click="handleToggleSetting(item.preferenceKey)"
              class="toggle-switch"
              :class="{ 'active': profileStore.preferences[item.preferenceKey] }"
            >
              <span class="toggle-knob"></span>
            </button>
          </div>
        </div>

        <!-- Logout Button -->
        <button 
          @click="handleLogout"
          :disabled="isLoggingOut"
          class="logout-button"
        >
          <LogOut class="icon-small" :class="{ 'spinning': isLoggingOut }" />
          <span>Log Out</span>
        </button>
      </div>
    </div>

    <!-- Safe area bottom -->
    <div class="safe-area-bottom"></div>
  </div>
</template>

<style scoped>
/* Variables par plateforme */
.ios {
  --background-color: #000000;
  --card-background: #1C1C1E;
  --input-background: #2C2C2E;
  --border-color: #38383A;
  --primary-color: #0A84FF;
  --primary-hover: #0066CC;
  --text-color: #FFFFFF;
  --text-secondary: #98989F;
  --danger-color: #FF453A;
  --border-radius: 12px;
  --toggle-width: 44px;
  --toggle-height: 24px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.android {
  --background-color: #121212;
  --card-background: #1E1E1E;
  --input-background: #2C2C2C;
  --border-color: #2C2C2C;
  --primary-color: #3DDC84;
  --primary-hover: #2ea864;
  --text-color: #FFFFFF;
  --text-secondary: #9E9E9E;
  --danger-color: #CF6679;
  --border-radius: 8px;
  --toggle-width: 44px;
  --toggle-height: 24px;
  font-family: Roboto, sans-serif;
}

.web {
  --background-color: #111827;
  --card-background: #1F2937;
  --input-background: #374151;
  --border-color: #4B5563;
  --primary-color: #8B5CF6;
  --primary-hover: #7C3AED;
  --text-color: #FFFFFF;
  --text-secondary: #9CA3AF;
  --danger-color: #EF4444;
  --border-radius: 8px;
  --toggle-width: 44px;
  --toggle-height: 24px;
  font-family: system-ui, sans-serif;
}

/* Layout de base */
.settings-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.settings-container {
  max-width: 42rem;
  margin: 0 auto;
  padding: 1rem;
}

/* Cartes */
.profile-card,
.settings-card {
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  padding: 1.5rem;
}

/* En-tête de profil */
.profile-header {
  position: relative;
  margin-bottom: 1.5rem;
}

.back-button {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.5rem;
  border-radius: 50%;
  background: transparent;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: var(--input-background);
}

.title {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
}

/* Photo de profil */
.photo-container {
  position: relative;
  width: 8rem;
  height: 8rem;
  margin: 0 auto;
}

.profile-photo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-color);
}

.photo-upload-button {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0.5rem;
  background-color: var(--primary-color);
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
}

.photo-upload-button:hover {
  transform: scale(1.1);
}

.photo-upload-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Formulaire */
.edit-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--input-background);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-color);
  font-size: 16px;
}

/* Boutons */
.button-group {
  display: flex;
  gap: 0.5rem;
}

.primary-button,
.secondary-button {
  flex: 1;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: background-color 0.2s;
}

.primary-button {
  background-color: var(--primary-color);
  color: white;
}

.primary-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.secondary-button {
  background-color: var(--input-background);
  color: var(--text-color);
}

.secondary-button:hover:not(:disabled) {
  opacity: 0.8;
}

/* Items de paramètres */
.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.settings-item-text {
  display: flex;
  flex-direction: column;
}

.settings-item-title {
  font-weight: 500;
}

.settings-item-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  width: var(--toggle-width);
  height: var(--toggle-height);
  border-radius: var(--toggle-height);
  background-color: var(--input-background);
  transition: background-color 0.2s;
}

.toggle-switch.active {
  background-color: var(--primary-color);
}

.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(var(--toggle-height) - 4px);
  height: calc(var(--toggle-height) - 4px);
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

.toggle-switch.active .toggle-knob {
  transform: translateX(calc(var(--toggle-width) - var(--toggle-height)));
}

/* Bouton de déconnexion */
.logout-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: var(--card-background);
  color: var(--danger-color);
  border-radius: var(--border-radius);
  transition: background-color 0.2s;
}

.logout-button:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--danger-color) 10%, transparent);
}

.logout-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Icônes */
.icon-small {
  width: 1.25rem;
  height: 1.25rem;
}

.icon-mini {
  width: 1rem;
  height: 1rem;
}

.text-subtle {
  color: var(--text-secondary);
}

/* Animations */
.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Safe Areas */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
  background-color: var(--background-color);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
  background-color: var(--background-color);
}

/* Optimisations mobiles */
@supports (-webkit-touch-callout: none) {
  input, button {
    font-size: 16px !important;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
}

/* Scrollbar personnalisée */
.settings-content {
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.settings-content::-webkit-scrollbar {
  width: 4px;
}

.settings-content::-webkit-scrollbar-track {
  background: transparent;
}

.settings-content::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 2px;
}
</style>