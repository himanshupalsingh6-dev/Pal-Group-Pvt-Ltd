import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBaslH5QsahoyESYpo1nVtlYIUYfVJ2d4",
  authDomain: "quickpress-offical.firebaseapp.com",
  projectId: "quickpress-offical"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
