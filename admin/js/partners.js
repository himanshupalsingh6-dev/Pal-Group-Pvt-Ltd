import { db } from "../firebase.js";
import {
collection,onSnapshot,addDoc,doc,deleteDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let partners=[];

onSnapshot(collection(db,"partners"), snap=>{
partners=[];
snap.forEach(d=>partners.push({...d.data(),id:d.id}));
});

/* LOAD UI */
export function loadPartners(){

let html=`
<div class="card">
<input id="pname" placeholder="Name">
<input id="parea" placeholder="Area">
<button onclick="addPartner()">Add Partner</button>
</div>

<div class="card">
<input id="searchP" placeholder="Search Area" oninput="searchPartner()">
</div>
`;

partners.forEach(p=>{
html+=`
<div class="card">
<b>${p.name}</b> (${p.area})

<button onclick="deletePartner('${p.id}')">Delete</button>
</div>
`;
});

document.getElementById("content").innerHTML=html;
}

/* ADD */
window.addPartner = async function(){
await addDoc(collection(db,"partners"),{
name:pname.value,
area:parea.value
});
}

/* DELETE */
window.deletePartner = async function(id){
await deleteDoc(doc(db,"partners",id));
}

/* SEARCH */
window.searchPartner = function(){
let val=searchP.value.toLowerCase();

let filtered=partners.filter(p=>p.area.toLowerCase().includes(val));

let html="";
filtered.forEach(p=>{
html+=`<div class="card">${p.name} (${p.area})</div>`;
});

content.innerHTML=html;
}
