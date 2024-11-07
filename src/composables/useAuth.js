// src/composables/useAuth.js
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirebaseAuth } from '../firebase/config';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { useRouter } from 'vue-router';

export function useAuth() {
  const router = useRouter();
  const platform = Capacitor.getPlatform();
  
  const user = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const isInitialized = ref(false);

  let unsubscribe = null;

  const handleNavigation = async (userData) => {
    const currentRoute = router.currentRoute.value;
    
    if (userData) {
      // User is logged in
      if (currentRoute.path === '/login') {
        // If we're on the login page, redirect to chat
        console.log('[Router] Redirecting to chat after login');
        await router.replace('/chat');
      }
    } else {
      // User is not logged in
      if (currentRoute.path !== '/login') {
        // If we're not on the login page, redirect there
        console.log('[Router] Redirecting to login - no user');
        await router.replace('/login');
      }
    }
  };

  const setupAuthObserver = async () => {
    try {
      const auth = await getFirebaseAuth();
      
      if (unsubscribe) {
        unsubscribe();
      }

      unsubscribe = onAuthStateChanged(auth, async (userData) => {
        console.log(`[${platform}] Auth state changed:`, userData ? 'User logged in' : 'No user');
        
        if (userData) {
          user.value = {
            uid: userData.uid,
            email: userData.email
          };

          try {
            await Preferences.set({
              key: 'user',
              value: JSON.stringify(user.value)
            });
            console.log(`[${platform}] User preferences saved`);
            await handleNavigation(userData);
          } catch (e) {
            console.error(`[${platform}] Error saving user preferences:`, e);
          }
        } else {
          user.value = null;
          try {
            await Preferences.remove({ key: 'user' });
            console.log(`[${platform}] User preferences cleared`);
            await handleNavigation(null);
          } catch (e) {
            console.error(`[${platform}] Error clearing user preferences:`, e);
          }
        }
        
        isInitialized.value = true;
      });
    } catch (e) {
      console.error(`[${platform}] Error in setupAuthObserver:`, e);
      isInitialized.value = true;
    }
  };

  const checkAuthState = async () => {
    try {
      const storedUser = await Preferences.get({ key: 'user' });
      if (storedUser.value) {
        user.value = JSON.parse(storedUser.value);
        console.log(`[${platform}] Found stored user:`, user.value.email);
      }
      await setupAuthObserver();
    } catch (e) {
      console.error(`[${platform}] Error in checkAuthState:`, e);
      isInitialized.value = true;
    }
  };

  const login = async (email, password) => {
    try {
      loading.value = true;
      error.value = null;
      const auth = await getFirebaseAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log(`[${platform}] Login successful:`, result.user.email);
      await handleNavigation(result.user);
      return result.user;
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
      const auth = await getFirebaseAuth();
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log(`[${platform}] Registration successful:`, result.user.email);
      await handleNavigation(result.user);
      return result.user;
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
      const auth = await getFirebaseAuth();
      console.log(`[${platform}] Logging out`);
      
      await Preferences.remove({ key: 'user' });
      await signOut(auth);
      user.value = null;
      
      console.log(`[${platform}] Logout successful`);
      await handleNavigation(null);
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
    checkAuthState();
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
    logout,
    checkAuthState
  };
}