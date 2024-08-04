// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyXVenbqBiBHoAnZDlhov23AT4dkjiffQ",
  authDomain: "inventory-management-9f772.firebaseapp.com",
  projectId: "inventory-management-9f772",
  storageBucket: "inventory-management-9f772.appspot.com",
  messagingSenderId: "274298351309",
  appId: "1:274298351309:web:1ffc6946726d4a34a58384",
  measurementId: "G-2JW57HGEMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

export {firestore};