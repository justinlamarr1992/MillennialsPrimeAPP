// Using React Native Firebase SDK (native implementation)
// Configuration is automatically read from GoogleService-Info.plist (iOS) and google-services.json (Android)
// Firebase is initialized in AppDelegate.swift via FirebaseApp.configure()

// DEPRECATION NOTE (for future maintainers):
// React Native Firebase will deprecate the current namespaced API in v22 in favor of modular API
// Current usage: auth().signInWithEmailAndPassword()
// Future v22 usage: Will match Firebase Web SDK modular API (getAuth(), signInWithEmailAndPassword())
// Migration guide: https://rnfirebase.io/migrating-to-v22
// This is a FUTURE change - current code works correctly and warnings are informational only

import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

// Export the auth module instance
// Persistence is handled automatically by the native SDK
export { auth };

// Export types for use throughout the app
export type { FirebaseAuthTypes };
