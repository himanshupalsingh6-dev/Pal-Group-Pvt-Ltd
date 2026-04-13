import { db } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

onSnapshot(collection(db,"orders"), snap=>{
let total=0,count=0;

snap.forEach(d=>{
count++;
total+=d.data().total||0;
});

document.getElementById("stats").innerHTML=`
<div class="card">Orders: ${count}</div>
<div class="card">Revenue: ₹${total}</div>
`;
});
