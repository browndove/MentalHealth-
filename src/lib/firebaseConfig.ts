// src/lib/firebaseConfig.ts
/**
 * @fileOverview Firebase project configuration.
 * Reads Firebase credentials from environment variables.
 */

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (typeof window === 'undefined') { // Log only on server-side
  console.log('[Server Sided Log] Attempting to load Firebase config...');
  console.log('[Server Sided Log] NEXT_PUBLIC_FIREBASE_API_KEY value is:', apiKey ? `"${apiKey.substring(0, 5)}..." (Exists)` : 'MISSING or empty');
  console.log('[Server Sided Log] NEXT_PUBLIC_FIREBASE_PROJECT_ID value is:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? `"${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.substring(0,5)}..." (Exists)` : 'MISSING or empty');
}


const firebaseConfig = {
  apiKey: apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Basic check to ensure config is loaded client-side
if (typeof window !== 'undefined' && !firebaseConfig.apiKey) {
  console.warn(
    '[Client Sided Log] Firebase config is not fully loaded. Ensure NEXT_PUBLIC_FIREBASE_ environment variables are set and the .env file is correctly configured AND the development server was restarted.'
  );
}

export default firebaseConfig;
