import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace this with your actual Firebase configuration object
// You can get this from your Firebase Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyDhxClk-qupqAztSdZffnwnjoxQs-SeJ3E",
  authDomain: "treasurehunt-69626.firebaseapp.com",
  projectId: "treasurehunt-69626",
  storageBucket: "treasurehunt-69626.firebasestorage.app",
  messagingSenderId: "1076042340696",
  appId: "1:1076042340696:web:21ac4847fc997137136d2d",
  measurementId: "G-5XMX2F6Z4G",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
