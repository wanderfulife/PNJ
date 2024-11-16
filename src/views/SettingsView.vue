<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'
import { useProfileStore } from '../stores/useProfileStore'
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
  <div class="flex flex-col h-full bg-gray-900">
    <!-- Safe area top -->
    <div class="safe-area-top" />

    <div class="flex-1 overflow-y-auto overscroll-contain custom-scrollbar">
      <div class="max-w-2xl mx-auto p-4">
        <!-- Profile Section -->
        <div class="bg-gray-800 rounded-2xl p-6 mb-6">
          <div class="relative">
            <button 
              @click="handleBack"
              class="absolute top-0 left-0 p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <ChevronLeft class="w-5 h-5" />
            </button>
            <h2 class="text-center text-xl font-semibold mb-6">Profile</h2>
          </div>

          <div class="flex flex-col items-center space-y-4">
            <!-- Photo Profile -->
            <div class="relative group">
              <img
                :src="authStore.user?.photoURL"
                :alt="authStore.user?.displayName"
                class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-purple-900"
              />
              <label 
                class="absolute bottom-0 right-0 p-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white shadow-lg transition-transform transform group-hover:scale-110 cursor-pointer"
                :class="{ 'opacity-50': isUploadingPhoto }"
              >
                <Camera class="w-4 h-4" />
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
            <div v-if="showProfileEdit" class="w-full space-y-4">
              <input
                v-model="editForm.displayName"
                type="text"
                placeholder="Display Name"
                class="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
              />
              <input
                v-model="editForm.email"
                type="email"
                placeholder="Email"
                class="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
              />
              <div class="flex space-x-2">
                <button 
                  @click="handleProfileUpdate"
                  :disabled="authStore.loading"
                  class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {{ authStore.loading ? 'Saving...' : 'Save' }}
                </button>
                <button 
                  @click="showProfileEdit = false"
                  class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
              <p v-if="authStore.error" class="text-red-500 text-sm text-center">
                {{ authStore.error }}
              </p>
            </div>

            <!-- Profile Display -->
            <div v-else class="text-center">
              <h2 class="text-xl font-semibold">{{ authStore.user?.displayName }}</h2>
              <p class="text-gray-400">{{ authStore.user?.email }}</p>
              <button 
                @click="startProfileEdit"
                class="mt-4 inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300"
              >
                <Edit2 class="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Settings List -->
        <div class="bg-gray-800 rounded-2xl mb-6">
          <!-- Dark Mode Toggle -->
          <div class="p-4 border-b border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <Moon class="w-5 h-5 text-gray-300" />
                <div>
                  <h3 class="font-medium">Dark Mode</h3>
                  <p class="text-sm text-gray-400">Toggle dark theme</p>
                </div>
              </div>
              <button
                @click="handleDarkModeToggle"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                :class="profileStore.preferences.darkMode ? 'bg-purple-600' : 'bg-gray-700'"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="profileStore.preferences.darkMode ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>
          </div>

          <!-- Other Settings -->
          <div
            v-for="(item, index) in settingsItems"
            :key="index"
            class="p-4 flex items-center justify-between hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
          >
            <div class="flex items-center space-x-3">
              <component :is="item.icon" class="w-5 h-5 text-gray-300" />
              <div>
                <h3 class="font-medium">{{ item.title }}</h3>
                <p class="text-sm text-gray-400">{{ item.description }}</p>
              </div>
            </div>
            <button
              v-if="item.hasToggle"
              @click="handleToggleSetting(item.preferenceKey)"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              :class="profileStore.preferences[item.preferenceKey] ? 'bg-purple-600' : 'bg-gray-700'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="profileStore.preferences[item.preferenceKey] ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>
        </div>

        <!-- Logout Button -->
        <button 
          @click="handleLogout"
          :disabled="isLoggingOut"
          class="w-full flex items-center justify-center space-x-2 bg-gray-800 text-red-500 py-4 rounded-lg hover:bg-red-900/20 transition-colors disabled:opacity-50"
        >
          <LogOut class="w-5 h-5" :class="{ 'animate-spin': isLoggingOut }" />
          <span>Log Out</span>
        </button>
      </div>
    </div>

    <!-- Safe area bottom -->
    <div class="safe-area-bottom" />
  </div>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.700') transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.700');
  border-radius: 2px;
}

/* Touch optimizations */
button {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* iOS input optimization */
@supports (-webkit-touch-callout: none) {
  input {
    font-size: 16px !important;
  }
}
</style>