// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import firebase from "firebase/app";
import "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = firebase.auth();
