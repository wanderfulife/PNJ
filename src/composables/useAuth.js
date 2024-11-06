// src/composables/useAuth.js
import { ref, onMounted } from 'vue';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export function useAuth() {
  const user = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const isInitialized = ref(false);

  const platform = Capacitor.getPlatform();

  // Set up auth state listener
  const unsubscribe = onAuthStateChanged(auth, async (userData) => {
    console.log(`[${platform}] Auth state changed:`, userData ? 'User logged in' : 'No user');
    if (userData) {
      user.value = {
        uid: userData.uid,
        email: userData.email,
      };
      try {
        await Preferences.set({
          key: 'user',
          value: JSON.stringify(user.value)
        });
        console.log(`[${platform}] User preferences saved`);
      } catch (e) {
        console.error(`[${platform}] Error saving user preferences:`, e);
      }
    } else {
      user.value = null;
      try {
        await Preferences.remove({ key: 'user' });
        console.log(`[${platform}] User preferences cleared`);
      } catch (e) {
        console.error(`[${platform}] Error clearing user preferences:`, e);
      }
    }
    isInitialized.value = true;
  });

  const checkAuthState = async () => {
    try {
      const userData = await Preferences.get({ key: 'user' });
      if (userData.value) {
        const parsedUser = JSON.parse(userData.value);
        console.log(`[${platform}] Found stored user data:`, parsedUser);
      }
    } catch (e) {
      console.error(`[${platform}] Error checking stored auth state:`, e);
    }
  };

  const login = async (email, password) => {
    console.log(`[${platform}] Attempting login...`);
    try {
      loading.value = true;
      error.value = null;
      const { user: userData } = await signInWithEmailAndPassword(auth, email, password);
      console.log(`[${platform}] Login successful, user:`, userData.uid);
      return userData;
    } catch (e) {
      console.error(`[${platform}] Login error:`, e);
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    console.log(`[${platform}] Attempting logout...`);
    try {
      await signOut(auth);
      console.log(`[${platform}] Logout successful`);
    } catch (e) {
      console.error(`[${platform}] Logout error:`, e);
      error.value = e.message;
      throw e;
    }
  };

  onMounted(() => {
    console.log(`[${platform}] Auth component mounted`);
    return () => {
      unsubscribe();
      console.log(`[${platform}] Auth listener cleanup`);
    };
  });

  return {
    user,
    error,
    loading,
    isInitialized,
    login,
    logout,
    checkAuthState
  };
}