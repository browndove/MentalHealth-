// src/lib/firebase.ts
/**
 * @fileOverview Initializes Firebase app and exports auth and firestore instances lazily.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function initializeFirebase() {
  if (!getApps().length) {
    if (firebaseConfig.apiKey) {
      try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
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
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  }
}

// These functions ensure Firebase is initialized only when first needed.
export function getAuthInstance(): Auth {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
}

export function getDbInstance(): Firestore {
  if (!db) {
    initializeFirebase();
  }
  return db;
}
