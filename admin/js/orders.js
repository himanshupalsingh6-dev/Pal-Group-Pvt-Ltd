\import { db } from "../firebase.js";
import {
collection,onSnapshot,doc,updateDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let orders=[], partners=[], riders=[];

/* LOAD DATA */
onSnapshot(collection(db,"orders"), snap=>{
orders=[];
snap.forEach(d=>orders.push({...d.data(),docId:d.id}));
});

onSnapshot(collection(db,"partners"), snap=>{
partners=[];
snap.forEach(d=>partners.push({...d.data()}));
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
📍 Area: ${o.area || "N/A"}<br>
₹${o.total}<br>

💳 ${o.paymentMethod} | ${o.paymentStatus}<br>

<button onclick="markPaid('${o.docId}')">Mark Paid</button><br>

👨‍🔧 Partner: ${o.partner||"NA"}<br>
🚚 Rider: ${o.rider||"NA"}<br>

<button onclick="autoAssign('${o.docId}','${o.area}')">
🤖 AI Assign
</button>

<select onchange="assignPartner('${o.docId}',this.value)">
<option>Select Partner</option>
${partners.map(p=>`<option>${p.name}</option>`)}
</select>

<select onchange="assignRider('${o.docId}',this.value)">
<option>Select Rider</option>
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
alert("Payment Done ✅");
}

window.assignPartner=async(id,name)=>{
await updateDoc(doc(db,"orders",id),{partner:name});
}

window.assignRider=async(id,name)=>{
await updateDoc(doc(db,"orders",id),{rider:name});
}

/* 🤖 AI AUTO ASSIGN */
window.autoAssign=async(id,area)=>{

if(!area){
alert("No Area Found ❌");
return;
}

/* FILTER AREA RIDERS */
let areaRiders = riders.filter(r =>
r.area && r.area.toLowerCase() === area.toLowerCase()
);

if(areaRiders.length==0){
alert("No Rider Found in this Area ❌");
return;
}

/* SORT BY LEAST LOAD */
areaRiders.sort((a,b)=>(a.orders||0)-(b.orders||0));

let best = areaRiders[0];

/* FIND PARTNER */
let partner = partners.find(p =>
p.area && p.area.toLowerCase() === area.toLowerCase()
);

/* UPDATE ORDER */
await updateDoc(doc(db,"orders",id),{
rider:best.name,
partner:partner?.name || ""
});

/* UPDATE RIDER LOAD */
await updateDoc(doc(db,"delivery",best.id),{
orders:(best.orders||0)+1
});

alert("AI Assigned Successfully 🚀");
}
