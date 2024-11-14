// src/composables/useProfile.js
import { ref, watch } from 'vue'
import { getFirebaseAuth } from '../firebase/config'
import { updateProfile, updateEmail } from 'firebase/auth'
import { Preferences } from '@capacitor/preferences'

export function useProfile() {
  const profile = ref({
    displayName: '',
    email: '',
    photoURL: '',
    preferences: {
      darkMode: true,
      notifications: true
    }
  })
  const loading = ref(false)
  const error = ref(null)

  // Charger les préférences utilisateur depuis le stockage local
  const loadUserPreferences = async () => {
    try {
      const storedPrefs = await Preferences.get({ key: 'userPreferences' })
      if (storedPrefs.value) {
        profile.value.preferences = { ...profile.value.preferences, ...JSON.parse(storedPrefs.value) }
      }
    } catch (e) {
      console.error('Error loading preferences:', e)
    }
  }

  // Sauvegarder les préférences utilisateur
  const saveUserPreferences = async (preferences) => {
    try {
      profile.value.preferences = { ...profile.value.preferences, ...preferences }
      await Preferences.set({
        key: 'userPreferences',
        value: JSON.stringify(profile.value.preferences)
      })
      return true
    } catch (e) {
      console.error('Error saving preferences:', e)
      error.value = 'Failed to save preferences'
      return false
    }
  }

  // Mettre à jour le profil utilisateur
  const updateUserProfile = async ({ displayName, photoURL }) => {
    try {
      loading.value = true
      error.value = null
      const auth = await getFirebaseAuth()
      const user = auth.currentUser
      
      if (!user) throw new Error('No user logged in')

      await updateProfile(user, {
        displayName: displayName || user.displayName,
        photoURL: photoURL || user.photoURL
      })

      profile.value = {
        ...profile.value,
        displayName: user.displayName,
        photoURL: user.photoURL
      }

      return true
    } catch (e) {
      console.error('Error updating profile:', e)
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour l'email
  const updateUserEmail = async (newEmail) => {
    try {
      loading.value = true
      error.value = null
      const auth = await getFirebaseAuth()
      const user = auth.currentUser
      
      if (!user) throw new Error('No user logged in')

      await updateEmail(user, newEmail)
      profile.value.email = newEmail

      return true
    } catch (e) {
      console.error('Error updating email:', e)
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Initialiser le profil avec les données de l'utilisateur connecté
  const initializeProfile = async () => {
    const auth = await getFirebaseAuth()
    const user = auth.currentUser
    
    if (user) {
      profile.value = {
        ...profile.value,
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '/api/placeholder/128/128'
      }
      await loadUserPreferences()
    }
  }

  // Observer les changements d'authentification
  watch(async () => (await getFirebaseAuth()).currentUser, (user) => {
    if (user) {
      initializeProfile()
    } else {
      profile.value = {
        displayName: '',
        email: '',
        photoURL: '',
        preferences: {
          darkMode: true,
          notifications: true
        }
      }
    }
  })

  return {
    profile,
    loading,
    error,
    updateUserProfile,
    updateUserEmail,
    saveUserPreferences,
    loadUserPreferences,
    initializeProfile
  }
}