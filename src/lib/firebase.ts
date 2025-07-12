
// src/lib/firebase.ts
/**
 * @fileOverview Initializes Firebase app and exports auth and firestore instances lazily.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';
import { getFirestore, type Firestore } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

let app: FirebaseApp;

// This function ensures Firebase is initialized only once.
function initializeFirebase() {
  if (getApps().length === 0) {
    if (firebaseConfig.apiKey) {
      try {
        app = initializeApp(firebaseConfig);
      } catch (error) {
        console.error("Firebase initialization error:", error);
        // This error is critical and should stop execution if config is present but invalid.
        throw new Error("Failed to initialize Firebase with the provided configuration.");
      }
    } else {
        // This block will now primarily be a safeguard. The AuthProvider logic
        // should prevent client-side calls until env vars are loaded.
        // Server-side actions will have env vars.
        const errorMessage = "Firebase config is missing. This can happen if environment variables are not loaded correctly. For client-side, ensure the page has loaded fully. For server-side, check your hosting environment's variable setup.";
        console.error("Firebase Initialization Failure: API Key is missing.");
        throw new Error(errorMessage);
    }
  } else {
    app = getApp();
  }
}

// Export functions that return the instances.
// Initialization is called implicitly on first use.
export function getAuthInstance(): Auth {
  if (!app) initializeFirebase();
  return getAuth(app);
}

export function getDbInstance(): Firestore {
  if (!app) initializeFirebase();
  return getFirestore(app);
}

export function getRealtimeDbInstance(): Database {
    if (!app) initializeFirebase();
    return getDatabase(app);
}
