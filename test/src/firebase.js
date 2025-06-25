import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDuAOuZVkvGaj_koEcjKf3Xj4A8T2tety4",
  authDomain: "vanana-project.firebaseapp.com",
  projectId: "vanana-project",
  storageBucket: "vanana-project.firebasestorage.app",
  messagingSenderId: "40114144312",
  appId: "1:40114144312:web:a808f5ee52708bc27a12cd",
  measurementId: "G-4HZLDZDSRR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
