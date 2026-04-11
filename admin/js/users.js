import { db } from "../firebase.js";
import {
collection,onSnapshot
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let users=[];

onSnapshot(collection(db,"users"), snap=>{
users=[];
snap.forEach(d=>users.push(d.data()));
});

export function loadUsers(){

let html="";

users.forEach(u=>{
html+=`
<div class="card">
${u.email}<br>
${u.phone||""}
</div>
`;
});

document.getElementById("content").innerHTML=html;
}
