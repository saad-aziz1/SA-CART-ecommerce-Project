import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "sa-cart-cf2fe.firebaseapp.com",
  projectId: "sa-cart-cf2fe",
  storageBucket: "sa-cart-cf2fe.firebasestorage.app",
  messagingSenderId: "948182300175",
  appId: "1:948182300175:web:4a6476f960d651b2a9557a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth,provider}