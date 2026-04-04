import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore, collection, getDocs
} from
"https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyAWTOu3JBhg3JuZg6snAxhnf_XFhLhLkbc",
  authDomain: "quickpress-web.firebaseapp.com",
  projectId: "quickpress-web"
});

const db = getFirestore(app);
const snap = await getDocs(collection(db,"orders"));
snap.forEach(d=>{
  orders.innerHTML += `<div>${d.id}</div>`;
});
