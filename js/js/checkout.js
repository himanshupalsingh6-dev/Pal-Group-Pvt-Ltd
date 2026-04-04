import { auth, db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

window.place = async ()=>{
  await addDoc(collection(db,"orders"),{
    userId: auth.currentUser.uid,
    items:[{name:"Shirt",qty:2}],
    grandTotal:100,
    status:"Placed",
    createdAt: serverTimestamp()
  });
  location.href="myorders.html";
};
