import { initializeApp } from 'firebase/app';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  User,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAnpDYcES1Of4Li4s-0Rme4dqaaMYWX50g",
  authDomain: "tictactoeapp-b558d.firebaseapp.com",
  projectId: "tictactoeapp-b558d",
  storageBucket: "tictactoeapp-b558d.appspot.com",
  messagingSenderId: "120604308516",
  appId: "1:120604308516:web:2fdc68b545e956a22ad4b1",
  storageBucket: 'gs://tictactoeapp-b558d.appspot.com/'
};



const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const storage = getStorage(app);

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
  sendPasswordResetEmail
};
