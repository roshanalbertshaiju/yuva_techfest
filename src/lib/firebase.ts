import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Fail loudly if required keys are missing (excluding optional measurementId)
const missingKeys = Object.entries(firebaseConfig)
  .filter(([key, val]) => !val && key !== 'measurementId')
  .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, "_$1").toUpperCase()}`);

let app: any;
let db: any;
let auth: any;
let analytics: any = null;

if (missingKeys.length > 0) {
  if (typeof window !== "undefined") {
    throw new Error(`Firebase Configuration Error: Missing environment variables: ${missingKeys.join(', ')}`);
  } else {
    console.warn(`⚠️ Warning: Firebase environment variables are missing. Firebase features will be disabled during build.`);
    app = {} as any;
    db = {} as any;
    auth = {} as any;
  }
} else {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);

  // Initialize Analytics conditionally (safeguarded for SSR/Node contexts)
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }
}

export { app, db, auth, analytics };
