import { ref, onMounted, onUnmounted } from 'vue';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { useRouter } from 'vue-router';

export function useAuth() {
  const router = useRouter();
  const platform = Capacitor.getPlatform();
  const isNativePlatform = platform === 'ios' || platform === 'android';
  
  const user = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const isInitialized = ref(false);

  let unsubscribe = null;

  const saveUserToPreferences = async (userData) => {
    if (!isNativePlatform) return; // Skip for web platform
    
    try {
      await Preferences.set({
        key: 'user',
        value: JSON.stringify(userData)
      });
      console.log(`[${platform}] User preferences saved`);
    } catch (e) {
      console.error(`[${platform}] Error saving user preferences:`, e);
    }
  };

  const clearUserPreferences = async () => {
    if (!isNativePlatform) return; // Skip for web platform
    
    try {
      await Preferences.remove({ key: 'user' });
      console.log(`[${platform}] User preferences cleared`);
    } catch (e) {
      console.error(`[${platform}] Error clearing user preferences:`, e);
    }
  };

  const setupAuthObserver = () => {
    unsubscribe = onAuthStateChanged(auth, async (userData) => {
      console.log(`[${platform}] Auth state changed:`, userData ? 'User logged in' : 'No user');
      
      if (userData) {
        user.value = {
          uid: userData.uid,
          email: userData.email
        };
        await saveUserToPreferences(user.value);
      } else {
        user.value = null;
        await clearUserPreferences();
      }
      
      isInitialized.value = true;
    });
  };

  const login = async (email, password) => {
    try {
      loading.value = true;
      error.value = null;
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await router.replace('/chat');
      }
      
    } catch (e) {
      console.error(`[${platform}] Login error:`, e);
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const register = async (email, password) => {
    try {
      loading.value = true;
      error.value = null;
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await router.replace('/chat');
      }
      
    } catch (e) {
      console.error(`[${platform}] Registration error:`, e);
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      await signOut(auth);
      user.value = null;
      await clearUserPreferences();
      await router.replace('/login');
      
    } catch (e) {
      console.error(`[${platform}] Logout error:`, e);
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    console.log(`[${platform}] Auth composable mounted`);
    setupAuthObserver();
  });

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
      console.log(`[${platform}] Auth observer cleanup`);
    }
  });

  return {
    user,
    error,
    loading,
    isInitialized,
    login,
    register,
    logout
  };
}