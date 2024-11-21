import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth,
  browserLocalPersistence,
  inMemoryPersistence,
  indexedDBLocalPersistence
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { Capacitor } from '@capacitor/core';

// Helper function to validate environment variables
const validateEnvVariables = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

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
    // Validate environment variables before initialization
    validateEnvVariables();

    // Initialize Firebase app
    app = initializeApp(firebaseConfig);
    
    // Initialize database
    database = getDatabase(app);

    const platform = Capacitor.getPlatform();
    
    try {
      // Initialize auth with appropriate persistence
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
    } catch (authError) {
      console.error('Auth initialization error:', authError);
      // Fallback to basic auth if custom initialization fails
      auth = getAuth(app);
    }

    return { app, auth, database };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};

export const getFirebaseAuth = () => {
  if (!auth && app) {
    try {
      auth = getAuth(app);
    } catch (error) {
      console.error('Error getting Firebase auth:', error);
      throw error;
    }
  }
  return auth;
};

export const getFirebaseDatabase = () => database || getDatabase(app);

// Initialize Firebase immediately with error handling
initializeFirebase().catch(error => {
  console.error('Firebase initialization failed:', error.message);
});

export { auth, database };