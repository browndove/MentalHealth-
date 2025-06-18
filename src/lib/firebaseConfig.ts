
// src/lib/firebaseConfig.ts
/**
 * @fileOverview Firebase project configuration.
 * Reads Firebase credentials from environment variables.
 */

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID; // Optional

// Server-side logging for diagnostics
if (typeof window === 'undefined') { // Log only on server-side
  console.log('\n--- SERVER-SIDE FIREBASE CONFIGURATION CHECK ---');
  console.log(`[SERVER LOG] Checking environment variables for Firebase config...`);
  console.log(`[SERVER LOG] process.env.NEXT_PUBLIC_FIREBASE_API_KEY: ${apiKey ? `Loaded (starts with "${apiKey.substring(0, 5)}...")` : 'MISSING or empty'}`);
  console.log(`[SERVER LOG] process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${authDomain ? `Loaded (starts with "${authDomain.substring(0, 10)}...")` : 'MISSING or empty'}`);
  console.log(`[SERVER LOG] process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${projectId ? `Loaded (starts with "${projectId.substring(0, 5)}...")` : 'MISSING or empty'}`);
  console.log(`[SERVER LOG] process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${storageBucket ? 'Loaded' : 'MISSING or empty'}`);
  console.log(`[SERVER LOG] process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${messagingSenderId ? 'Loaded' : 'MISSING or empty'}`);
  console.log(`[SERVER LOG] process.env.NEXT_PUBLIC_FIREBASE_APP_ID: ${appId ? 'Loaded' : 'MISSING or empty'}`);
  console.log('--- END SERVER-SIDE FIREBASE CONFIGURATION CHECK ---\n');

  // More aggressive check on server-side
  const requiredConfigValues = {
    NEXT_PUBLIC_FIREBASE_API_KEY: apiKey,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: authDomain,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: projectId,
    // storageBucket, messagingSenderId, appId are also usually required for full functionality
    // but API_KEY is the most critical for initialization.
  };
  const missingVars = Object.entries(requiredConfigValues)
      .filter(([, value]) => !value)
      .map(([key]) => key);

  if (missingVars.length > 0) {
      const errorMsg = `[SERVER CRITICAL ERROR] The following Firebase environment variables are MISSING or EMPTY: ${missingVars.join(', ')}. ` +
                       `These are essential for Firebase to initialize on the server. ` +
                       `Please ensure they are correctly set in your .env file at the project root AND that the development server has been RESTARTED.`;
      console.error("***********************************************************************************");
      console.error(errorMsg);
      console.error("***********************************************************************************");
      // Note: The actual error that stops the app is thrown in firebase.ts if apiKey is missing.
      // This console.error is for clearer server-side diagnosis.
  }
}


const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
};

// Client-side warning (less critical for this specific server error, but good for completeness)
if (typeof window !== 'undefined' && !firebaseConfig.apiKey) {
  console.warn(
    '[CLIENT WARN] Firebase API Key is not available client-side. This might lead to issues if Firebase is used client-side before server hydration. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set, .env is correct, and dev server was restarted.'
  );
}

export default firebaseConfig;
