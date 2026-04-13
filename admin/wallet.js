import { db } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

onSnapshot(collection(db,"wallets"), snap=>{
let html="";

snap.forEach(d=>{
html+=`<div class="card">${d.id} → ₹${d.data().balance}</div>`;
});

document.getElementById("walletList").innerHTML=html;

});
