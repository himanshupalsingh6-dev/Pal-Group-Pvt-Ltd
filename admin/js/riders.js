import { db } from "../firebase.js";
import {
collection,onSnapshot,addDoc,doc,deleteDoc,updateDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let riders=[];

onSnapshot(collection(db,"delivery"), snap=>{
riders=[];
snap.forEach(d=>riders.push({...d.data(),id:d.id}));
});

/* LOAD */
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
Status: ${r.status||"available"}

<button onclick="toggleStatus('${r.id}','${r.status}')">
Toggle Status
</button>

<button onclick="deleteRider('${r.id}')">Delete</button>

</div>
`;
});

document.getElementById("content").innerHTML=html;
}

/* ADD */
window.addRider = async function(){
await addDoc(collection(db,"delivery"),{
name:rname.value,
area:rarea.value,
orders:0,
status:"available"
});
}

/* DELETE */
window.deleteRider = async function(id){
await deleteDoc(doc(db,"delivery",id));
}

/* STATUS */
window.toggleStatus = async function(id,status){

let newStatus = status=="available"?"busy":"available";

await updateDoc(doc(db,"delivery",id),{
status:newStatus
});
}
