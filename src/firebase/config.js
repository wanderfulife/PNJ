// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  indexedDBLocalPersistence, 
  setPersistence,
  initializeAuth,
  browserLocalPersistence 
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

// Platform-specific auth initialization
let auth;
const platform = Capacitor.getPlatform();

if (platform === 'android') {
  auth = getAuth(app);
  // Set persistence for Android
  setPersistence(auth, indexedDBLocalPersistence)
    .then(() => {
      console.log('[Android] Firebase persistence set');
    })
    .catch((error) => {
      console.error('[Android] Error setting persistence:', error);
    });
} else if (platform === 'ios') {
  // iOS specific initialization
  auth = initializeAuth(app, {
    persistence: indexedDBLocalPersistence
  });
  console.log('[iOS] Firebase auth initialized');
} else {
  // Web fallback
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('[Web] Firebase persistence set');
    })
    .catch((error) => {
      console.error('[Web] Error setting persistence:', error);
    });
}

export { auth };