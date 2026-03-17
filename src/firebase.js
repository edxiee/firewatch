// 1. Change the imports at the top
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";      // Added this
import { getFirestore } from "firebase/firestore"; // Added this

const firebaseConfig = {
  apiKey: "AIzaSyBPtaCK8Rl3xAXdTXGmys83E0jCSP_HuFo",
  authDomain: "firewatch-dd069.firebaseapp.com",
  projectId: "firewatch-dd069",
  storageBucket: "firewatch-dd069.firebasestorage.app",
  messagingSenderId: "949827349667",
  appId: "1:949827349667:web:1a923fc4e968e5679f6316",
  measurementId: "G-SZN5JGKJWY"
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 3. Export these so Auth.jsx can use them
export const auth = getAuth(app);
export const db = getFirestore(app);