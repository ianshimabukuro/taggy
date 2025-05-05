// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqF-a585_YprljyW65inNt1RH5ez63nww",
  authDomain: "taggy-d21ea.firebaseapp.com",
  projectId: "taggy-d21ea",
  storageBucket: "taggy-d21ea.firebasestorage.app",
  messagingSenderId: "955186504959",
  appId: "1:955186504959:web:6541cd8c2feca0bd9358ca",
  measurementId: "G-BNBGB07ZMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
