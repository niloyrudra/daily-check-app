import { initializeApp } from "@firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  // getReactNativePersistence,
  // initializeAuth,
  sendEmailVerification,
  signInWithEmailAndPassword
} from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from '@firebase/firestore';
import Constants from "expo-constants";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
// const auth = initializeAuth(app, {
//   persistence: browserSessionPersistence // getReactNativePersistence(AsyncStorage)
// });

const db = getFirestore(app);

export {
  auth, createUserWithEmailAndPassword, db, sendEmailVerification,
  signInWithEmailAndPassword
};

