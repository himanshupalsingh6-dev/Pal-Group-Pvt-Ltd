import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBaslH5QsahoyESYpo1nVtlYIUYfVJ2d4",
  authDomain: "quickpress-offical.firebaseapp.com",
  projectId: "quickpress-offical",
  storageBucket: "quickpress-offical.firebasestorage.app",
  messagingSenderId: "939286557961",
  appId: "1:939286557961:web:ddac64f197e14877718fd8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
