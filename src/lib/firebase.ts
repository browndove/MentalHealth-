
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
    const errorMessage = "Firebase config is missing. CRITICAL: Ensure NEXT_PUBLIC_FIREBASE_ environment variables are set correctly in your .env file (at the project root) AND that the Firebase Studio environment has been RESTARTED or UPDATED to load these variables. Check your SERVER STARTUP LOGS in Firebase Studio for detailed messages from 'firebaseConfig.ts' about which variables are loaded or missing.";
    console.error("**************** Firebase Initialization Failure ****************");
    console.error(errorMessage);
    console.error("*****************************************************************");
    throw new Error(errorMessage);
  }
} else {
  app = getApp(); // Use the existing app
  // Even if app exists, re-check if config was loaded for the current context (e.g. server vs client)
  if (!firebaseConfig.apiKey && typeof window === 'undefined') { // Check only on server
     const errorMessage = "Firebase config is missing on server (existing app context). CRITICAL: Ensure NEXT_PUBLIC_FIREBASE_ environment variables are set correctly in your .env file (at the project root) AND that the Firebase Studio server environment has been RESTARTED/UPDATED. Check your server startup logs in Firebase Studio for detailed messages from 'firebaseConfig.ts'.";
     console.error("**************** Firebase Re-check Failure (Server) ****************");
     console.error(errorMessage);
     console.error("********************************************************************");
     throw new Error(errorMessage);
  }
}

try {
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
} catch (error) {
  console.error("Error getting Firebase services (Auth/Firestore):", error);
  const detailMessage = "This usually means the Firebase app object ('app') was not initialized correctly, possibly due to missing or invalid Firebase config (API Key, etc.). Check server logs in Firebase Studio for '[SERVER CRITICAL ERROR]' or 'Firebase Initialization Failure' messages from firebaseConfig.ts or firebase.ts.";
  console.error(detailMessage);
  throw new Error(`Failed to get Firebase services. ${detailMessage}`);
}

export { app, authInstance as auth, dbInstance as db };
