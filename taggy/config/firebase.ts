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
  apiKey: "AIzaSyBqF-a585_YprljyW65inNt1RH5ez63nww",
  authDomain: "taggy-d21ea.firebaseapp.com",
  projectId: "taggy-d21ea",
  storageBucket: "taggy-d21ea.appspot.com", // 🔧 fixed incorrect domain
  messagingSenderId: "955186504959",
  appId: "1:955186504959:web:6541cd8c2feca0bd9358ca",
  measurementId: "G-BNBGB07ZMP"
};

// ✅ Initialize Firebase app
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const realtimeDb = getDatabase(app); // 👈
const storage = getStorage(app);

export { app, auth, db, realtimeDb, storage };
