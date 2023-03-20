// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATEkJ8Ay9DTYN20rvOf_2qzp0LyvFFG3A",
  authDomain: "react-authentication-ec3eb.firebaseapp.com",
  projectId: "react-authentication-ec3eb",
  storageBucket: "react-authentication-ec3eb.appspot.com",
  messagingSenderId: "28015029783",
  appId: "1:28015029783:web:5e80c066df47298b84f652",
  measurementId: "G-NYC62W8LJ2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export default app;
