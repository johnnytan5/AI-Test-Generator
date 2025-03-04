
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAIbkwl2W5O1MWWVqXnqdjaKcwkXxrFvS0",
  authDomain: "ai-test-50f45.firebaseapp.com",
  projectId: "ai-test-50f45",
  storageBucket: "ai-test-50f45.firebasestorage.app",
  messagingSenderId: "438634248433",
  appId: "1:438634248433:web:2ec24e20fe868f39e25150",
  measurementId: "G-QPBV76HT28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);  // Firebase Authentication
export const db = getFirestore(app);  // Firestore
export const storage = getStorage(app);  // Firebase Storage

