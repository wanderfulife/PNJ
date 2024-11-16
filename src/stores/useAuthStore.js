import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail
} from 'firebase/auth'
import { getFirebaseAuth } from '../firebase/config'
import { Preferences } from '@capacitor/preferences'
import { Capacitor } from '@capacitor/core'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const error = ref(null)
  const loading = ref(false)
  const isInitialized = ref(false)
  const platform = Capacitor.getPlatform()

  // Methods
  const login = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      const auth = await getFirebaseAuth()
      const result = await signInWithEmailAndPassword(auth, email, password)
      user.value = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      }
      await Preferences.set({
        key: 'user',
        value: JSON.stringify(user.value)
      })
      return result.user
    } catch (e) {
      console.error(`[${platform}] Login error:`, e)
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const register = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      const auth = await getFirebaseAuth()
      const result = await createUserWithEmailAndPassword(auth, email, password)
      user.value = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      }
      await Preferences.set({
        key: 'user',
        value: JSON.stringify(user.value)
      })
      return result.user
    } catch (e) {
      console.error(`[${platform}] Registration error:`, e)
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      loading.value = true
      error.value = null
      const auth = await getFirebaseAuth()
      await Preferences.remove({ key: 'user' })
      await signOut(auth)
      user.value = null
    } catch (e) {
      console.error(`[${platform}] Logout error:`, e)
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateUserProfile = async (profileData) => {
    try {
      loading.value = true
      error.value = null
      const auth = await getFirebaseAuth()
      const currentUser = auth.currentUser
      
      if (!currentUser) throw new Error('No user logged in')

      await updateProfile(currentUser, profileData)
      user.value = {
        ...user.value,
        ...profileData
      }
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateUserEmail = async (newEmail) => {
    try {
      loading.value = true
      error.value = null
      const auth = await getFirebaseAuth()
      const currentUser = auth.currentUser
      
      if (!currentUser) throw new Error('No user logged in')

      await updateEmail(currentUser, newEmail)
      user.value.email = newEmail
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Initialize
  const checkAuthState = async () => {
    try {
      const storedUser = await Preferences.get({ key: 'user' })
      if (storedUser.value) {
        user.value = JSON.parse(storedUser.value)
      }
      const auth = await getFirebaseAuth()
      onAuthStateChanged(auth, async (userData) => {
        if (userData) {
          user.value = {
            uid: userData.uid,
            email: userData.email,
            displayName: userData.displayName,
            photoURL: userData.photoURL
          }
          await Preferences.set({
            key: 'user',
            value: JSON.stringify(user.value)
          })
        } else {
          user.value = null
          await Preferences.remove({ key: 'user' })
        }
        isInitialized.value = true
      })
    } catch (e) {
      console.error(`[${platform}] Error in checkAuthState:`, e)
      isInitialized.value = true
    }
  }

  return {
    user,
    error,
    loading,
    isInitialized,
    platform,
    login,
    register,
    logout,
    updateUserProfile,
    updateUserEmail,
    checkAuthState
  }
})