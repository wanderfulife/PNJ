import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth,
  browserLocalPersistence,
  inMemoryPersistence,
  indexedDBLocalPersistence
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

let app = null;
let auth = null;

export const initializeFirebase = async () => {
  if (auth) {
    return { app, auth };
  }

  try {
    if (!app) {
      app = initializeApp({
        ...firebaseConfig,
        // Ajout des options de sécurité supplémentaires
        authDomain: window.location.hostname === 'localhost' 
          ? 'localhost' 
          : firebaseConfig.authDomain
      });
    }

    const platform = Capacitor.getPlatform();
    console.log(`Initializing Firebase Auth for platform: ${platform}`);

    const persistenceOrder = [
      indexedDBLocalPersistence,
      browserLocalPersistence,
      inMemoryPersistence,
    ];

    if (platform === 'ios') {
      try {
        auth = initializeAuth(app, {
          persistence: inMemoryPersistence
        });
      } catch (error) {
        console.warn('iOS auth initialization failed, falling back to default:', error);
        auth = getAuth(app);
      }
    } else {
      try {
        auth = initializeAuth(app, {
          persistence: persistenceOrder,
          popupRedirectResolver: undefined
        });
      } catch (error) {
        console.warn('Auth initialization failed, falling back to default:', error);
        auth = getAuth(app);
      }
    }

    return { app, auth };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};

export const getFirebaseAuth = () => {
  if (!auth) {
    return getAuth(app);
  }
  return auth;
};

// Initialize Firebase immediately
initializeFirebase().catch(console.error);

export { auth };