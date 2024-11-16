import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './useAuthStore'
import { Preferences } from '@capacitor/preferences'

export const useProfileStore = defineStore('profile', () => {
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref(null)
  
  const preferences = ref({
    darkMode: true,
    notifications: true
  })

  // Load preferences
  const loadPreferences = async () => {
    try {
      const storedPrefs = await Preferences.get({ key: 'userPreferences' })
      if (storedPrefs.value) {
        preferences.value = { ...preferences.value, ...JSON.parse(storedPrefs.value) }
      }
    } catch (e) {
      console.error('Error loading preferences:', e)
    }
  }

  // Save preferences
  const savePreferences = async (newPreferences) => {
    try {
      preferences.value = { ...preferences.value, ...newPreferences }
      await Preferences.set({
        key: 'userPreferences',
        value: JSON.stringify(preferences.value)
      })
      return true
    } catch (e) {
      console.error('Error saving preferences:', e)
      error.value = 'Failed to save preferences'
      return false
    }
  }

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      loading.value = true
      error.value = null
      await authStore.updateUserProfile(profileData)
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    preferences,
    loading,
    error,
    loadPreferences,
    savePreferences,
    updateProfile
  }
})
