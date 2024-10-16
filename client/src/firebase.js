// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-794a4.firebaseapp.com",
  projectId: "mern-estate-794a4",
  storageBucket: "mern-estate-794a4.appspot.com",
  messagingSenderId: "486723322964",
  appId: "1:486723322964:web:f6c2c44da2fdad0bdc19c1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);