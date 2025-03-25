// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3caAzWy5nfY_G0kFAQE-0oIb52rIVnJE",
  authDomain: "usersapp-408f4.firebaseapp.com",
  projectId: "usersapp-408f4",
  storageBucket: "usersapp-408f4.firebasestorage.app",
  messagingSenderId: "380192306311",
  appId: "1:380192306311:web:cb44c6b960bcaf038ef422",
  measurementId: "G-3V60SW5KBY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);