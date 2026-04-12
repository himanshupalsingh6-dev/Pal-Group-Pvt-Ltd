import { db, auth } from "../firebase.js";

import {
collection,
onSnapshot,
addDoc,
doc,
deleteDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import {
createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import {
setDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let riders=[];

/* LOAD DATA */
onSnapshot(collection(db,"delivery"), snap=>{
riders=[];
snap.forEach(d=>riders.push({...d.data(),id:d.id}));
});

/* LOAD UI */
export function loadRiders(){

let html=`
<div class="card">
<input id="rname" placeholder="Name">
<input id="rarea" placeholder="Area">
<button onclick="addRider()">Add Rider</button>
</div>
`;

riders.forEach(r=>{
html+=`
<div class="card">

<b>${r.name}</b> (${r.area})<br>
Orders: ${r.orders||0}<br>
Status: ${r.status||"available"}<br>

<button onclick="toggleStatus('${r.id}','${r.status}')">
Toggle Status
</button>

<button onclick="deleteRider('${r.id}')">Delete</button>

</div>
`;
});

document.getElementById("content").innerHTML=html;
}

/* 🔥 ADD RIDER (LOGIN CREATE) */
window.addRider = async function(){

let name = document.getElementById("rname").value;
let area = document.getElementById("rarea").value;

if(!name || !area){
alert("Fill all fields");
return;
}

/* EMAIL + PASSWORD INPUT */
let email = prompt("Enter Rider Email");
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
role:"rider"
});

/* SAVE IN DELIVERY */
await addDoc(collection(db,"delivery"),{
name:name,
area:area,
orders:0,
status:"available"
});

alert("Rider Created ✅");

}catch(err){
alert(err.message);
}

};

/* DELETE */
window.deleteRider = async function(id){
await deleteDoc(doc(db,"delivery",id));
};

/* STATUS TOGGLE */
window.toggleStatus = async function(id,status){

let newStatus = status==="available" ? "busy" : "available";

await updateDoc(doc(db,"delivery",id),{
status:newStatus
});
};
