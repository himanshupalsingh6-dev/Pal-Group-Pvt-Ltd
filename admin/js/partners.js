import { db, auth } from "../firebase.js";

import {
collection,
onSnapshot,
addDoc,
doc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import {
createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import {
setDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let partners=[];

/* LOAD DATA */
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

/* 🔥 ADD PARTNER (LOGIN CREATE) */
window.addPartner = async function(){

let name = document.getElementById("pname").value;
let area = document.getElementById("parea").value;

if(!name || !area){
alert("Fill all fields");
return;
}

/* EMAIL + PASSWORD PROMPT */
let email = prompt("Enter Partner Email");
let password = prompt("Enter Password");

if(!email || !password){
alert("Email & Password required");
return;
}

try{

/* CREATE AUTH USER */
let userCred = await createUserWithEmailAndPassword(auth,email,password);
let uid = userCred.user.uid;

/* SAVE IN USERS */
await setDoc(doc(db,"users",uid),{
name:name,
email:email,
role:"partner"
});

/* SAVE IN PARTNERS */
await addDoc(collection(db,"partners"),{
name:name,
area:area
});

alert("Partner Created ✅");

}catch(err){
alert(err.message);
}

};

/* DELETE */
window.deletePartner = async function(id){
await deleteDoc(doc(db,"partners",id));
};

/* SEARCH */
window.searchPartner = function(){

let val=document.getElementById("searchP").value.toLowerCase();

let filtered=partners.filter(p=>p.area.toLowerCase().includes(val));

let html="";

filtered.forEach(p=>{
html+=`<div class="card">${p.name} (${p.area})</div>`;
});

document.getElementById("content").innerHTML=html;
};
