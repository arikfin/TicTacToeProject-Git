import { initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword,
         createUserWithEmailAndPassword,
         getAuth,
         onAuthStateChanged,
         User,
         signOut,
         initializeAuth,
         getReactNativePersistence} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyAnpDYcES1Of4Li4s-0Rme4dqaaMYWX50g",
    authDomain: "tictactoeapp-b558d.firebaseapp.com",
    projectId: "tictactoeapp-b558d",
    storageBucket: "tictactoeapp-b558d.appspot.com",
    messagingSenderId: "120604308516",
    appId: "1:120604308516:web:2fdc68b545e956a22ad4b1"
  };



  const app = initializeApp(firebaseConfig);
  // const auth = getAuth(app);
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });


export { app, 
         signInWithEmailAndPassword,
         createUserWithEmailAndPassword,
         getAuth,
         User,
         signOut,
         onAuthStateChanged,
         auth,
          };
