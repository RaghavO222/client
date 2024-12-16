import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAjve2IxC5qh-4HoM_hEL3unkqO5zGHNG0",
  authDomain: "unai-eb40e.firebaseapp.com",
  projectId: "unai-eb40e",
  storageBucket: "unai-eb40e.appspot.com",
  messagingSenderId: "886047825192",
  appId: "1:886047825192:web:1308489dc8d2bc9e0fc41d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, doc, getDoc, storage };