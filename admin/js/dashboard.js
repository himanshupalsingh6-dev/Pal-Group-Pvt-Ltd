import { db } from "../firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let orders=[];

onSnapshot(collection(db,"orders"), snap=>{
orders=[];
snap.forEach(d=>orders.push(d.data()));
});

export function loadDashboard(){

let total=0;
orders.forEach(o=>total+=o.total||0);

document.getElementById("content").innerHTML=`
<div class="card">💰 Revenue: ₹${total}</div>
<div class="card">📦 Orders: ${orders.length}</div>
`;
}
