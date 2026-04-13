import { db } from "./firebase.js";
import { collection, onSnapshot, doc, updateDoc, getDoc, addDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

onSnapshot(collection(db,"withdraws"), snap=>{
let html="";

snap.forEach(d=>{
let w=d.data();

html+=`
<div class="card">
${w.uid} → ₹${w.amount}
<br>
${w.status}
<br>

${w.status==="pending" ? `
<button onclick="approve('${d.id}','${w.uid}',${w.amount})">Approve</button>
<button onclick="reject('${d.id}')">Reject</button>
`:""}

</div>
`;
});

document.getElementById("withdrawList").innerHTML=html;
});

window.approve=async(id,uid,amount)=>{

let ref=doc(db,"wallets",uid);
let snap=await getDoc(ref);

await updateDoc(ref,{balance:snap.data().balance-amount});
await updateDoc(doc(db,"withdraws",id),{status:"approved"});

await addDoc(collection(db,"transactions"),{
uid,amount,type:"withdraw"
});

alert("Approved");
};

window.reject=async(id)=>{
await updateDoc(doc(db,"withdraws",id),{status:"rejected"});
alert("Rejected");
};
