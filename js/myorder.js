import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth } from
"https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  getFirestore, collection, query, where, getDocs
} from
"https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyAWTOu3JBhg3JuZg6snAxhnf_XFhLhLkbc",
  authDomain: "quickpress-web.firebaseapp.com",
  projectId: "quickpress-web"
});

const auth = getAuth(app);
const db = getFirestore(app);

const q = query(
  collection(db,"orders"),
  where("userId","==",auth.currentUser.uid)
);

const snap = await getDocs(q);
snap.forEach(d=>{
  list.innerHTML += `<div>${d.data().status}</div>`;
});
