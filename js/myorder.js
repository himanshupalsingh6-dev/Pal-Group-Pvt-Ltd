import { auth, db } from "./firebase.js";   // ✅ NEW Firebase

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const q = query(
  collection(db,"orders"),
  where("userId","==",auth.currentUser.uid)
);

const snap = await getDocs(q);
snap.forEach(d=>{
  list.innerHTML += `<div>${d.data().status}</div>`;
});
