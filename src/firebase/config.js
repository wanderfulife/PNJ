// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  indexedDBLocalPersistence, 
  setPersistence,
  initializeAuth,
  browserLocalPersistence,
  inMemoryPersistence
} from 'firebase/auth';
import { Capacitor } from '@capacitor/core';

const firebaseConfig = {
  apiKey: "AIzaSyDZKFJstxeldmesFGloR_0Gh-5q39PLjEY",
  authDomain: "pnj-jay.firebaseapp.com",
  projectId: "pnj-jay",
  storageBucket: "pnj-jay.firebasestorage.app",
  messagingSenderId: "325908568285",
  appId: "1:325908568285:web:159f69d049f7864db82334"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create a basic auth instance that will be enhanced later
let auth = getAuth(app);

const initializeAuthForPlatform = async () => {
  const platform = Capacitor.getPlatform();

  if (platform === 'android') {
    try {
      await setPersistence(auth, indexedDBLocalPersistence);
      console.log('[Android] Firebase persistence set');
    } catch (error) {
      console.error('[Android] Error setting persistence:', error);
    }
  } 
  else if (platform === 'ios') {
    // Re-initialize auth for iOS
    auth = initializeAuth(app, {
      persistence: indexedDBLocalPersistence
    });
    console.log('[iOS] Firebase auth initialized');
  } 
  else {
    // Web platform
    try {
      await setPersistence(auth, browserLocalPersistence);
      console.log('[Web] Firebase persistence set to browserLocal');
    } catch (error) {
      console.error('[Web] Error setting persistence:', error);
      try {
        await setPersistence(auth, inMemoryPersistence);
        console.log('[Web] Fallback to inMemory persistence');
      } catch (error) {
        console.error('[Web] Critical error setting persistence:', error);
      }
    }
  }
  return auth;
};

// Export both auth and the initialization function
export { auth, initializeAuthForPlatform };