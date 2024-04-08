import { initializeApp } from "firebase/app";
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, User
  , signOut, sendPasswordResetEmail,
} from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAnpDYcES1Of4Li4s-0Rme4dqaaMYWX50g",
  authDomain: "tictactoeapp-b558d.firebaseapp.com",
  projectId: "tictactoeapp-b558d",
  messagingSenderId: "120604308516",
  appId: "1:120604308516:web:2fdc68b545e956a22ad4b1",
  storageBucket: "gs://tictactoeapp-b558d.appspot.com/",
};

// Initializing the Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Initializing Firebase auth with the app and setting the persistence to AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initializing Firebase storage with the app
const storage = getStorage(app);

// Initializing Firestore with the app
const firestore = getFirestore(app);

export {
  app,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  User,
  signOut,
  onAuthStateChanged,
  auth,
  storage,
  firestore,
  sendPasswordResetEmail,
};

