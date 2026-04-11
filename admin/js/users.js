import { db } from "../firebase.js";
import {
collection,onSnapshot,query,where,getDocs
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let users=[];

onSnapshot(collection(db,"users"), snap=>{
users=[];
snap.forEach(d=>users.push({...d.data(),id:d.id}));
});

export function loadUsers(){

let html="";

users.forEach(u=>{
html+=`
<div class="card">
${u.email}<br>
${u.phone||""}
<button onclick="view('${u.id}')">Orders</button>
</div>
`;
});

document.getElementById("content").innerHTML=html;
}

window.view=async(uid)=>{
let q=query(collection(db,"orders"),where("userId","==",uid));
let snap=await getDocs(q);

let html="";
snap.forEach(d=>{
let o=d.data();
html+=`<div class="card">${o.name} ₹${o.total}</div>`;
});

document.getElementById("content").innerHTML=html;
}
