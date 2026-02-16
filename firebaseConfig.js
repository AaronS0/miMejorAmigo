import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1cIttFWEJZtlXJSQdsuT8Ln3OOVA6SrM",
  authDomain: "app-mascotas-c2c65.firebaseapp.com",
  projectId: "app-mascotas-c2c65",
  storageBucket: "app-mascotas-c2c65.firebasestorage.app",
  messagingSenderId: "278175805660",
  appId: "1:278175805660:web:ddff6bced7691316b74419"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);