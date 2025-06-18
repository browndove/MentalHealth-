
// src/lib/firebase.ts
/**
 * @fileOverview Initializes Firebase app and exports auth and firestore instances.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

let app: FirebaseApp;
let authInstance: Auth; // Renamed to avoid conflict if 'auth' is used as a function name
let dbInstance: Firestore; // Renamed

// Ensure this logic runs correctly in both client and server environments
if (!getApps().length) {
  if (firebaseConfig.apiKey) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error("Firebase initialization error:", error);
      throw new Error("Failed to initialize Firebase with the provided configuration.");
    }
  } else {
    const errorMessage = "Firebase config is missing. CRITICAL: Ensure NEXT_PUBLIC_FIREBASE_ environment variables are set correctly in your .env file (at the project root) AND that the development server has been RESTARTED. Check your server startup logs for detailed messages from 'firebaseConfig.ts' about which variables are loaded or missing.";
    // This explicit throw ensures the app doesn't proceed with a non-functional Firebase setup.
    throw new Error(errorMessage); 
  }
} else {
  app = getApp(); // Use the existing app
  // Even if app exists, re-check if config was loaded for the current context (e.g. server vs client)
  // This is a bit redundant due to the check above but ensures robustness.
  if (!firebaseConfig.apiKey && typeof window === 'undefined') {
     const errorMessage = "Firebase config is missing on server (existing app context). CRITICAL: Ensure NEXT_PUBLIC_FIREBASE_ environment variables are set correctly in your .env file (at the project root) AND that the development server has been RESTARTED. Check your server startup logs for detailed messages from 'firebaseConfig.ts'.";
     throw new Error(errorMessage);
  }
}

try {
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
} catch (error) {
  console.error("Error getting Firebase services (Auth/Firestore):", error);
  console.error("This usually means the Firebase app object ('app') was not initialized correctly, possibly due to missing or invalid Firebase config. Check server logs for '[SERVER CRITICAL ERROR]' messages from firebaseConfig.ts.");
  throw new Error("Failed to get Firebase services. Check Firebase initialization and configuration, and review server startup logs.");
}

export { app, authInstance as auth, dbInstance as db };

