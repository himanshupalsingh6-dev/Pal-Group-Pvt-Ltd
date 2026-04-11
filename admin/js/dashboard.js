import { db } from "../firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let orders=[];

onSnapshot(collection(db,"orders"), snap=>{
orders=[];
snap.forEach(d=>orders.push(d.data()));
});

export function loadDashboard(){

let total=0;
orders.forEach(o=>total+=o.total||0);

document.getElementById("content").innerHTML=`
<div class="card">💰 Revenue: ₹${total}</div>
<div class="card">📦 Orders: ${orders.length}</div>
<canvas id="chart"></canvas>
`;

drawChart();
}

function drawChart(){

let map={};

orders.forEach(o=>{
let d=new Date(o.time).toLocaleDateString();
if(!map[d]) map[d]=0;
map[d]+=o.total||0;
});

new Chart(document.getElementById("chart"),{
type:"line",
data:{
labels:Object.keys(map),
datasets:[{label:"Revenue",data:Object.values(map)}]
}
});
}
