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
import { getDatabase, ref as dbRef, set, get } from 'firebase/database'
import { getFirebaseAuth } from '../firebase/config'
import { Preferences } from '@capacitor/preferences'
import { Capacitor } from '@capacitor/core'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const error = ref(null)
  const loading = ref(false)
  const isInitialized = ref(false)
  const platform = Capacitor.getPlatform()

  // Create or update user in database
  const createUserInDatabase = async (userData) => {
    try {
      const database = getDatabase()
      const userRef = dbRef(database, `users/${userData.uid}`)

      // Check if user exists
      const snapshot = await get(userRef)
      const existingData = snapshot.val()

      const updatedData = {
        email: userData.email,
        displayName: userData.displayName || existingData?.displayName || null,
        photoURL: userData.photoURL || existingData?.photoURL || null,
        lastActive: new Date().toISOString(),
        ...(!existingData && { createdAt: new Date().toISOString() })
      }

      await set(userRef, updatedData)
    } catch (e) {
      console.error('Error updating user in database:', e)
      throw e
    }
  }

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

      // Update user data in database
      await createUserInDatabase(user.value)

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

      // Create user in database
      await createUserInDatabase(user.value)

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

      // Update last active timestamp before logout
      if (user.value?.uid) {
        const database = getDatabase()
        await set(dbRef(database, `users/${user.value.uid}/lastActive`), new Date().toISOString())
      }

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

      // Update user data in database
      await createUserInDatabase(user.value)

      // Update local storage
      await Preferences.set({
        key: 'user',
        value: JSON.stringify(user.value)
      })
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

      // Update user data in database
      await createUserInDatabase(user.value)

      // Update local storage
      await Preferences.set({
        key: 'user',
        value: JSON.stringify(user.value)
      })
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
      // First try to get user from local storage
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

          // Update user data in database
          await createUserInDatabase(user.value)

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