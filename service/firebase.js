// firebase.js
import firebase from 'firebase/compat/app';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; // Import Firebase Authentication (and others like firestore, storage, etc., if needed)

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPZaCEEvSFVbrWxIStudjlGIkHzDPTSFU",
  authDomain: "wave-aid-ccb91.firebaseapp.com",
  projectId: "wave-aid-ccb91",
  storageBucket: "wave-aid-ccb91.appspot.com",
  messagingSenderId: "213720546417",
  appId: "1:213720546417:web:80070a88c93d65b594efd0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});;

export { app, db, auth };

