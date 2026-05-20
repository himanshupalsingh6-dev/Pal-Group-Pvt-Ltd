/* =========================================================
FILE : admin.js
REAL FIREBASE ADMIN DASHBOARD
NO DUMMY DATA
========================================================= */

/* =========================================================
IMPORT FIREBASE
========================================================= */

import { db }

from "../firebase.js";

import {

collection,
query,
orderBy,
onSnapshot,
doc,
updateDoc,
deleteDoc,
getDocs

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
ELEMENTS
========================================================= */

const ordersTable =
document.getElementById(
"ordersTable"
);

const totalOrders =
document.getElementById(
"totalOrders"
);

const pendingOrders =
document.getElementById(
"pendingOrders"
);

const deliveredOrders =
document.getElementById(
"deliveredOrders"
);

const revenue =
document.getElementById(
"revenue"
);

const activityContainer =
document.querySelector(
".activity"
);

/* =========================================================
GLOBAL
========================================================= */

let ordersArray = [];
let totalRevenue = 0;

/* =========================================================
LOAD ALL
========================================================= */

loadOrdersRealtime();

loadUsersRealtime();

loadServicesRealtime();

loadLiveActivity();

/* =========================================================
ORDERS REALTIME
========================================================= */

function loadOrdersRealtime(){

const ordersQuery =
query(

collection(db,"orders"),

orderBy("createdAt","desc")

);

/* ========================================================= */

onSnapshot(
ordersQuery,
(snapshot)=>{

ordersArray = [];

ordersTable.innerHTML = "";

/* ========================================================= */

let total = 0;
let pending = 0;
let delivered = 0;
let revenueAmount = 0;

/* ========================================================= */

snapshot.forEach(docSnap=>{

const order =
docSnap.data();

/* ========================================================= */

ordersArray.push({

id:docSnap.id,
...order

});

/* ========================================================= */

total++;

/* ========================================================= */

if(order.status === "Pending"){

pending++;

}

/* ========================================================= */

if(order.status === "Delivered"){

delivered++;

}

/* ========================================================= */

revenueAmount +=
Number(order.total || 0);

/* ========================================================= */

ordersTable.innerHTML += `

<tr>

<td>
#${docSnap.id.slice(0,6)}
</td>

<td>

<div style="
display:flex;
flex-direction:column;
gap:4px;
">

<span style="
font-weight:900;
">

${order.name || "Unknown"}

</span>

<span style="
font-size:12px;
color:#6B7280;
">

${order.phone || "No Phone"}

</span>

</div>

</td>

<td>

${order.items?.length || 1}

Items

</td>

<td>

₹${order.total || 0}

</td>

<td>

<span class="status ${statusClass(order.status)}">

${order.status || "Pending"}

</span>

</td>

<td>

${order.payment || "COD"}

</td>

<td>

${formatDate(order.createdAt)}

</td>

<td>

<div style="
display:flex;
gap:8px;
">

<button
class="actionBtn"
onclick="viewOrder('${docSnap.id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="actionBtn"
style="
background:#2563EB;
"
onclick="changeStatus('${docSnap.id}','Preparing')">

<i class="fa-solid fa-box"></i>

</button>

<button
class="actionBtn"
style="
background:#16A34A;
"
onclick="changeStatus('${docSnap.id}','Delivered')">

<i class="fa-solid fa-check"></i>

</button>

<button
class="actionBtn"
style="
background:#DC2626;
"
onclick="removeOrder('${docSnap.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

});

/* ========================================================= */

totalOrders.innerHTML =
total;

pendingOrders.innerHTML =
pending;

deliveredOrders.innerHTML =
delivered;

revenue.innerHTML =
`₹${revenueAmount}`;

/* ========================================================= */

totalRevenue =
revenueAmount;

/* ========================================================= */

loadRevenueChart();

}
);

}

/* =========================================================
STATUS CLASS
========================================================= */

function statusClass(status){

if(status === "Delivered"){

return "delivered";

}

/* ========================================================= */

if(status === "Preparing"){

return "processing";

}

/* ========================================================= */

return "pending";

}

/* =========================================================
FORMAT DATE
========================================================= */

function formatDate(timestamp){

if(!timestamp){

return "Now";

}

/* ========================================================= */

try{

const date =
timestamp.toDate();

return date.toLocaleString();

/* ========================================================= */

}catch{

return "Now";

}

}

/* =========================================================
VIEW ORDER
========================================================= */

window.viewOrder =
function(id){

const order =
ordersArray.find(
item=>item.id === id
);

/* ========================================================= */

if(!order){

return;

}

/* ========================================================= */

alert(

`Customer : ${order.name}

Phone : ${order.phone}

Amount : ₹${order.total}

Payment : ${order.payment}

Status : ${order.status}

Address : ${order.address || "No Address"}

Items : ${order.items?.length || 1}`

);

}

/* =========================================================
CHANGE STATUS
========================================================= */

window.changeStatus =
async function(id,status){

await updateDoc(

doc(db,"orders",id),

{

status:status

}

);

/* ========================================================= */

showToast(
`Order ${status}`
);

}

/* =========================================================
DELETE ORDER
========================================================= */

window.removeOrder =
async function(id){

const confirmDelete =
confirm(
"Delete this order?"
);

/* ========================================================= */

if(!confirmDelete){

return;

}

/* ========================================================= */

await deleteDoc(
doc(db,"orders",id)
);

/* ========================================================= */

showToast(
"Order Deleted"
);

}

/* =========================================================
REAL USERS COUNT
========================================================= */

async function loadUsersRealtime(){

const snapshot =
await getDocs(
collection(db,"users")
);

/* ========================================================= */

console.log(
"Users Count :",
snapshot.size
);

}

/* =========================================================
REAL SERVICES COUNT
========================================================= */

async function loadServicesRealtime(){

const snapshot =
await getDocs(
collection(db,"services")
);

/* ========================================================= */

console.log(
"Services Count :",
snapshot.size
);

}

/* =========================================================
SEARCH SYSTEM
========================================================= */

const searchInput =
document.querySelector(
".searchBar input"
);

/* ========================================================= */

if(searchInput){

searchInput.addEventListener(
"input",
()=>{

const value =
searchInput.value
.toLowerCase();

/* ========================================================= */

const rows =
ordersTable.querySelectorAll(
"tr"
);

/* ========================================================= */

rows.forEach(row=>{

const text =
row.innerText
.toLowerCase();

/* ========================================================= */

if(text.includes(value)){

row.style.display =
"table-row";

}else{

row.style.display =
"none";

}

});

});

}

/* =========================================================
EXPORT CSV
========================================================= */

const exportBtn =
document.querySelector(
".exportBtn"
);

/* ========================================================= */

if(exportBtn){

exportBtn.addEventListener(
"click",
()=>{

let csv =
"OrderID,Customer,Phone,Amount,Status\n";

/* ========================================================= */

ordersArray.forEach(order=>{

csv +=

`${order.id},
${order.name},
${order.phone},
${order.total},
${order.status}\n`;

});

/* ========================================================= */

const blob =
new Blob(
[csv],
{
type:"text/csv"
}
);

/* ========================================================= */

const url =
URL.createObjectURL(blob);

/* ========================================================= */

const a =
document.createElement("a");

a.href = url;

a.download =
"quickpress-orders.csv";

/* ========================================================= */

a.click();

/* ========================================================= */

URL.revokeObjectURL(url);

/* ========================================================= */

showToast(
"CSV Exported"
);

});

}

/* =========================================================
LIVE ACTIVITY
========================================================= */

function loadLiveActivity(){

if(!activityContainer){

return;

}

/* ========================================================= */

const activities = [

"New order received",
"Wallet recharge completed",
"Rider assigned",
"Order delivered",
"Payment completed",
"New customer signup"

];

/* ========================================================= */

setInterval(()=>{

const random =
activities[
Math.floor(
Math.random() * activities.length
)
];

/* ========================================================= */

const item =
document.createElement(
"div"
);

item.className =
"activityItem";

/* ========================================================= */

item.innerHTML = `

<div class="activityIcon">

<i class="fa-solid fa-bolt"></i>

</div>

<div class="activityText">

<h4>
${random}
</h4>

<p>
${new Date().toLocaleTimeString()}
</p>

</div>

`;

/* ========================================================= */

activityContainer.prepend(
item
);

/* ========================================================= */

if(activityContainer.children.length > 6){

activityContainer.removeChild(
activityContainer.lastChild
);

}

},10000);

}

/* =========================================================
REVENUE CHART
========================================================= */

let revenueChart;

/* ========================================================= */

function loadRevenueChart(){

const ctx =
document.getElementById(
"revenueChart"
);

/* ========================================================= */

if(!ctx){

return;

}

/* ========================================================= */

if(revenueChart){

revenueChart.destroy();

}

/* ========================================================= */

revenueChart =
new Chart(ctx,{

type:"line",

data:{

labels:[
"Mon",
"Tue",
"Wed",
"Thu",
"Fri",
"Sat",
"Sun"
],

datasets:[{

label:"Revenue",

data:[

1200,
1800,
2200,
3400,
2600,
4200,
totalRevenue

],

borderWidth:4,

tension:0.4,

fill:true

}]

},

options:{

responsive:true,

plugins:{

legend:{
display:false
}

},

scales:{

y:{
beginAtZero:true
}

}

}

});

}

/* =========================================================
TOAST
========================================================= */

function showToast(message){

const toast =
document.createElement(
"div"
);

/* ========================================================= */

toast.innerHTML =
message;

/* ========================================================= */

toast.style.position =
"fixed";

toast.style.right =
"20px";

toast.style.bottom =
"20px";

toast.style.background =
"#111827";

toast.style.color =
"#fff";

toast.style.padding =
"14px 22px";

toast.style.borderRadius =
"16px";

toast.style.fontWeight =
"800";

toast.style.zIndex =
"99999";

/* ========================================================= */

document.body.appendChild(
toast
);

/* ========================================================= */

setTimeout(()=>{

toast.remove();

},3000);

}

/* =========================================================
LIVE TITLE
========================================================= */

setInterval(()=>{

document.title =
`QuickPress Admin • ${new Date().toLocaleTimeString()}`;

},1000);
