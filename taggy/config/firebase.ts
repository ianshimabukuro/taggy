// config/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"; // 👈
import AsyncStorage from "@react-native-async-storage/async-storage";

// 👇 Safely access getReactNativePersistence with TS workaround
const getReactNativePersistence = (require("firebase/auth") as any).getReactNativePersistence;

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "", // 🔧 fixed incorrect domain
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// ✅ Initialize Firebase app
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  //persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const realtimeDb = getDatabase(app); // 👈
const storage = getStorage(app);

export { app, auth, db, realtimeDb, storage };

