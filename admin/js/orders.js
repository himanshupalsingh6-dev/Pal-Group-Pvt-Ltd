import { db } from "../firebase.js";
import {
collection,onSnapshot,doc,updateDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let orders=[], partners=[], riders=[];

onSnapshot(collection(db,"orders"), snap=>{
orders=[];
snap.forEach(d=>orders.push({...d.data(),docId:d.id}));
});

onSnapshot(collection(db,"partners"), snap=>{
partners=[];
snap.forEach(d=>partners.push(d.data()));
});

onSnapshot(collection(db,"delivery"), snap=>{
riders=[];
snap.forEach(d=>riders.push(d.data()));
});

export function loadOrders(){

let html="";

orders.forEach((o,i)=>{

let itemsHTML="";
o.items?.forEach(it=>{
itemsHTML+=`${it.name} x ${it.qty}<br>`;
});

html+=`
<div class="card">

<b>${o.name}</b><br>
₹${o.total}<br>

Partner: ${o.partner||"NA"}<br>
Rider: ${o.rider||"NA"}<br>

<button onclick="autoAssign('${o.docId}','${o.address}')">Auto</button>

<select onchange="assignPartner('${o.docId}',this.value)">
${partners.map(p=>`<option>${p.name}</option>`)}
</select>

<select onchange="assignRider('${o.docId}',this.value)">
${riders.map(r=>`<option>${r.name}</option>`)}
</select>

<button onclick="toggle(${i})">Details</button>

<div id="d${i}" class="details">${itemsHTML}</div>

</div>
`;
});

document.getElementById("content").innerHTML=html;
}

/* FUNCTIONS */
window.toggle=(i)=>{
let el=document.getElementById("d"+i);
el.style.display = el.style.display=="block"?"none":"block";
}

window.assignPartner=async(id,name)=>{
await updateDoc(doc(db,"orders",id),{partner:name});
}

window.assignRider=async(id,name)=>{
await updateDoc(doc(db,"orders",id),{rider:name});
}

window.autoAssign=async(id,area)=>{
let p=partners.find(x=>x.area?.includes(area));
let r=riders.find(x=>x.area?.includes(area));

await updateDoc(doc(db,"orders",id),{
partner:p?.name||"",
rider:r?.name||""
});
}
