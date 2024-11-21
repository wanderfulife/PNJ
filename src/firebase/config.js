import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth,
  browserLocalPersistence,
  inMemoryPersistence,
  indexedDBLocalPersistence
} from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { Capacitor } from '@capacitor/core';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: "https://pnj-jay-default-rtdb.europe-west1.firebasedatabase.app"
};

let app = null;
let auth = null;
let database = null;

export const initializeFirebase = async () => {
  if (app) return { app, auth, database };

  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);

    // Configure database settings
    const dbConfig = {
      synchronizeTabs: true,
    };

    if (import.meta.env.DEV) {
      dbConfig.experimentalForceLongPolling = true;
      // Uncomment if you want to use emulator
      // connectDatabaseEmulator(database, 'localhost', 9000);
    }

    const platform = Capacitor.getPlatform();
    
    if (platform === 'ios') {
      auth = initializeAuth(app, {
        persistence: inMemoryPersistence
      });
    } else { 
      auth = initializeAuth(app, {
        persistence: [
          indexedDBLocalPersistence,
          browserLocalPersistence,
          inMemoryPersistence
        ]
      });
    }

    return { app, auth, database };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};

export const getFirebaseAuth = () => auth || getAuth(app);
export const getFirebaseDatabase = () => database || getDatabase(app);

// Initialize Firebase immediately
initializeFirebase().catch(console.error);

export { auth, database };