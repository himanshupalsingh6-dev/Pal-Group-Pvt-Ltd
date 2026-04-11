import { db } from "../firebase.js";
import {
collection,onSnapshot,doc,updateDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let orders=[], partners=[], riders=[];

/* LOAD */
onSnapshot(collection(db,"orders"), snap=>{
orders=[];
snap.forEach(d=>orders.push({...d.data(),docId:d.id}));
});

onSnapshot(collection(db,"partners"), snap=>{
partners=[];
snap.forEach(d=>partners.push({...d.data(),id:d.id}));
});

onSnapshot(collection(db,"delivery"), snap=>{
riders=[];
snap.forEach(d=>riders.push({...d.data(),id:d.id}));
});

/* UI */
export function loadOrders(){

let html="";

orders.forEach((o,i)=>{

let items="";
o.items?.forEach(it=>{
items+=`${it.name} x ${it.qty} = ₹${it.price*it.qty}<br>`;
});

html+=`
<div class="card">

<b>${o.name}</b><br>
₹${o.total}<br>

📍 ${o.address}<br>

💳 ${o.paymentMethod || "COD"} | ${o.paymentStatus || "Pending"}<br>

<button onclick="markPaid('${o.docId}')">Mark Paid</button><br>

Partner: ${o.partner||"NA"}<br>
Rider: ${o.rider||"NA"}<br>

<button onclick="autoAssign('${o.docId}','${o.address}')">🤖 AI Assign</button>

<select onchange="assignPartner('${o.docId}',this.value)">
${partners.map(p=>`<option>${p.name}</option>`)}
</select>

<select onchange="assignRider('${o.docId}',this.value)">
${riders.map(r=>`<option>${r.name}</option>`)}
</select>

<button onclick="toggle(${i})">Details</button>

<div id="d${i}" class="details">${items}</div>

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

window.markPaid=async(id)=>{
await updateDoc(doc(db,"orders",id),{
paymentStatus:"Paid"
});
alert("Payment Done");
}

/* MANUAL */
window.assignPartner=async(id,name)=>{
await updateDoc(doc(db,"orders",id),{partner:name});
}

window.assignRider=async(id,name)=>{
await updateDoc(doc(db,"orders",id),{rider:name});
}

/* 🤖 AI AUTO ASSIGN */
window.autoAssign=async(id,area)=>{

let areaRiders = riders.filter(r=>r.area?.toLowerCase().includes(area.toLowerCase()));

if(areaRiders.length==0){
alert("No rider found");
return;
}

areaRiders.sort((a,b)=>(a.orders||0)-(b.orders||0));

let best = areaRiders[0];

let partner = partners.find(p=>p.area?.includes(area));

await updateDoc(doc(db,"orders",id),{
rider:best.name,
partner:partner?.name||""
});

// update rider load
await updateDoc(doc(db,"delivery",best.id),{
orders:(best.orders||0)+1
});

alert("AI Assigned 🚀");
}
