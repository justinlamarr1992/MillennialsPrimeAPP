// Using Firebase Web SDK (recommended for Expo)
import { initializeApp } from "firebase/app";
import { indexedDBLocalPersistence, initializeAuth } from "firebase/auth";

// Validate required environment variables
const requiredEnvVars = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Suppress only the specific Firebase React Native warning during auth initialization
// Firebase incorrectly detects Expo as React Native and warns about AsyncStorage
// This is a false positive - Expo uses Firebase Web SDK with IndexedDB persistence
const originalConsoleWarn = console.warn;
console.warn = function (...args: unknown[]) {
  const message = typeof args[0] === "string" ? args[0] : "";
  // Suppress the known Firebase warning about React Native environment
  if (
    message.includes("@firebase/auth") &&
    message.includes("React Native") &&
    message.includes("AsyncStorage")
  ) {
    return;
  }
  // Otherwise, log the warning as usual
  originalConsoleWarn.apply(console, args);
};

// Initialize Auth with IndexedDB persistence for Expo (Web SDK)
let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: indexedDBLocalPersistence,
  });
} finally {
  // Always restore console.warn, even if initialization fails
  console.warn = originalConsoleWarn;
}

export const auth = authInstance;
