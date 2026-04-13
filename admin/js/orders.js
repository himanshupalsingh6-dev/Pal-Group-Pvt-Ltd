import { db } from "./firebase.js";
import { collection, onSnapshot, doc, updateDoc, increment, addDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* COMMISSION */
async function distribute(order){

let total=order.total||0;

let partner=total*0.7;
let rider=total*0.2;
let admin=total*0.1;

if(order.partnerUid){
await updateDoc(doc(db,"wallets",order.partnerUid),{balance:increment(partner)});
await addDoc(collection(db,"transactions"),{uid:order.partnerUid,amount:partner});
}

if(order.riderUid){
await updateDoc(doc(db,"wallets",order.riderUid),{balance:increment(rider)});
await addDoc(collection(db,"transactions"),{uid:order.riderUid,amount:rider});
}

await updateDoc(doc(db,"wallets","admin"),{balance:increment(admin)});
}

/* LOAD ORDERS */
onSnapshot(collection(db,"orders"), snap=>{
let html="";

snap.forEach(d=>{
let o=d.data();

html+=`
<div class="card">
${o.name} - ₹${o.total}
<br>
<button onclick='complete("${d.id}", ${JSON.stringify(o)})'>
Complete
</button>
</div>
`;
});

document.getElementById("ordersList").innerHTML=html;

});

/* COMPLETE */
window.complete=async(id,order)=>{
await updateDoc(doc(db,"orders",id),{status:"done"});
await distribute(order);
alert("Done");
};
