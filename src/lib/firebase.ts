
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
    const errorMessage = "Firebase config is missing. Ensure NEXT_PUBLIC_FIREBASE_ environment variables are set correctly and the server/build process has access to them.";
    console.error(errorMessage); // This will log in server console
    throw new Error(errorMessage); // This error is what the user is seeing
  }
} else {
  app = getApp(); // Use the existing app
}

try {
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
} catch (error) {
  console.error("Error getting Firebase services (Auth/Firestore):", error);
  console.error("This usually means the Firebase app object ('app') was not initialized correctly, possibly due to missing or invalid Firebase config.");
  throw new Error("Failed to get Firebase services. Check Firebase initialization and configuration.");
}

export { app, authInstance as auth, dbInstance as db };
