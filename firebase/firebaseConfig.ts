// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// import firebase from "firebase/app";
// import { getAuth } from "firebase/auth";
// Testing
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
// import {
//   getAuth,
//   initializeAuth,
//   getReactNativePersistence,
// } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Testing
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBKQKpVGfoDr0UQwRubiOMCU0_rmInP8u8",
  authDomain: "millennialsprime.firebaseapp.com",
  projectId: "millennialsprime",
  storageBucket: "millennialsprime.appspot.com",
  messagingSenderId: "927784632",
  appId: "1:927784632:web:0f708daf11463ab028de4d",
  measurementId: "G-29BSPZ140C",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);
// export default auth;

// Testing
// BIGGEST CHANGE IF IT FAILS
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// Testing

// import { initializeApp } from "firebase/app";
// import {
//   initializeAuth,
//   getReactNativePersistence,
// } from "firebase/auth/react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyBKQKpVGfoDr0UQwRubiOMCU0_rmInP8u8",
//   authDomain: "millennialsprime.firebaseapp.com",
//   projectId: "millennialsprime",
//   storageBucket: "millennialsprime.appspot.com",
//   messagingSenderId: "927784632",
//   appId: "1:927784632:web:0f708daf11463ab028de4d",
//   measurementId: "G-29BSPZ140C",
// };

// export const app = initializeApp(firebaseConfig);

// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });
