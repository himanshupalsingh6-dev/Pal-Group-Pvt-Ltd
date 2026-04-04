import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const snap = await getDocs(collection(db,"orders"));
snap.forEach(d=>{
  orders.innerHTML += `<div>${d.id}</div>`;
});
