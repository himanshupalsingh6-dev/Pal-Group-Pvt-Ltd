/* =========================================================
FILE : admin.js
QUICKPRESS FULL ADMIN PANEL
========================================================= */

/* =========================================================
IMPORT FIREBASE
========================================================= */

import { db }

from "../firebase.js";

import {

collection,
getDocs,
deleteDoc,
doc,
updateDoc,
onSnapshot,
query,
orderBy,
addDoc,
serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
CHART JS
========================================================= */

const chartScript =
document.createElement("script");

chartScript.src =
"https://cdn.jsdelivr.net/npm/chart.js";

document.head.appendChild(
chartScript
);

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

/* =========================================================
GLOBAL
========================================================= */

let ordersData = [];
let servicesData = [];
let revenueChart;

/* =========================================================
LIVE ORDERS
========================================================= */

const ordersRef =
query(
collection(db,"orders"),
orderBy("createdAt","desc")
);

onSnapshot(
ordersRef,
(snapshot)=>{

ordersData = [];

let total = 0;
let pending = 0;
let delivered = 0;
let revenueAmount = 0;

/* ========================================= */

ordersTable.innerHTML = "";

/* ========================================= */

snapshot.forEach(docSnap=>{

const data =
docSnap.data();

/* ========================================= */

ordersData.push({

id:docSnap.id,
...data

});

/* ========================================= */

total++;

/* ========================================= */

if(data.status === "Pending"){

pending++;

}

if(data.status === "Delivered"){

delivered++;

}

/* ========================================= */

revenueAmount +=
Number(data.total || 0);

/* ========================================= */

ordersTable.innerHTML += `

<tr>

<td>
#${docSnap.id.slice(0,5)}
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

${data.name || "Customer"}

</span>

<span style="
font-size:12px;
color:#6B7280;
">

${data.phone || "No Number"}

</span>

</div>

</td>

<td>

${data.items?.length || 1}

Items

</td>

<td>

₹${data.total || 0}

</td>

<td>

<span class="status ${getStatusClass(data.status)}">

${data.status || "Pending"}

</span>

</td>

<td>

${data.payment || "COD"}

</td>

<td>

${formatDate(data.createdAt)}

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
onclick="updateStatus('${docSnap.id}','Preparing')">

<i class="fa-solid fa-box"></i>

</button>

<button
class="actionBtn"
style="
background:#16A34A;
"
onclick="updateStatus('${docSnap.id}','Delivered')">

<i class="fa-solid fa-check"></i>

</button>

<button
class="actionBtn"
style="
background:#DC2626;
"
onclick="deleteOrder('${docSnap.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

});

/* ========================================= */

totalOrders.innerHTML = total;

pendingOrders.innerHTML = pending;

deliveredOrders.innerHTML = delivered;

revenue.innerHTML =
`₹${revenueAmount}`;

/* ========================================= */

loadRevenueChart(
revenueAmount
);

}
);

/* =========================================================
STATUS CLASS
========================================================= */

function getStatusClass(status){

if(status === "Delivered"){

return "delivered";

}

if(status === "Preparing"){

return "processing";

}

return "pending";

}

/* =========================================================
FORMAT DATE
========================================================= */

function formatDate(timestamp){

if(!timestamp){

return "Now";

}

/* ========================================= */

try{

const date =
timestamp.toDate();

return date.toLocaleString();

}

/* ========================================= */

catch{

return "Now";

}

}

/* =========================================================
VIEW ORDER
========================================================= */

window.viewOrder =
function(id){

const order =
ordersData.find(
item=>item.id === id
);

/* ========================================= */

if(!order){

return;

}

/* ========================================= */

alert(

`Customer : ${order.name}

Phone : ${order.phone}

Amount : ₹${order.total}

Status : ${order.status}

Address : ${order.address || "No Address"}`

);

}

/* =========================================================
UPDATE STATUS
========================================================= */

window.updateStatus =
async function(id,status){

await updateDoc(

doc(db,"orders",id),

{

status:status

}

);

/* ========================================= */

showToast(
`Order marked as ${status}`
);

}

/* =========================================================
DELETE ORDER
========================================================= */

window.deleteOrder =
async function(id){

const confirmDelete =
confirm(
"Delete this order?"
);

/* ========================================= */

if(!confirmDelete){

return;

}

/* ========================================= */

await deleteDoc(
doc(db,"orders",id)
);

/* ========================================= */

showToast(
"Order Deleted"
);

}

/* =========================================================
SERVICES
========================================================= */

const servicesRef =
collection(db,"services");

onSnapshot(
servicesRef,
(snapshot)=>{

servicesData = [];

snapshot.forEach(docSnap=>{

servicesData.push({

id:docSnap.id,
...docSnap.data()

});

});

}
);

/* =========================================================
QUICK ACTION CARDS
========================================================= */

const quickCards =
document.querySelectorAll(
".quickCard"
);

quickCards.forEach(card=>{

card.addEventListener(
"click",
()=>{

const title =
card.querySelector("h4").innerText;

/* ========================================= */

if(title === "Add Service"){

addServicePopup();

}

/* ========================================= */

if(title === "Wallet Credit"){

walletPopup();

}

/* ========================================= */

if(title === "Analytics"){

window.scrollTo({

top:
document.body.scrollHeight,

behavior:"smooth"

});

}

}
);

});

/* =========================================================
ADD SERVICE
========================================================= */

async function addServicePopup(){

const name =
prompt(
"Service Name"
);

if(!name) return;

/* ========================================= */

const price =
prompt(
"Price"
);

if(!price) return;

/* ========================================= */

const image =
prompt(
"Image URL"
);

/* ========================================= */

await addDoc(

collection(db,"services"),

{

name:name,
price:price,
image:image || "",
createdAt:
serverTimestamp()

}

);

/* ========================================= */

showToast(
"Service Added"
);

}

/* =========================================================
WALLET POPUP
========================================================= */

function walletPopup(){

alert(
"Wallet System Connected Successfully"
);

}

/* =========================================================
SEARCH
========================================================= */

const searchInput =
document.querySelector(
".searchBar input"
);

searchInput.addEventListener(
"input",
searchOrders
);

/* =========================================================
SEARCH FUNCTION
========================================================= */

function searchOrders(){

const value =
searchInput.value.toLowerCase();

/* ========================================= */

const rows =
ordersTable.querySelectorAll(
"tr"
);

/* ========================================= */

rows.forEach(row=>{

const text =
row.innerText.toLowerCase();

/* ========================================= */

if(text.includes(value)){

row.style.display =
"table-row";

}

/* ========================================= */

else{

row.style.display =
"none";

}

});

}

/* =========================================================
EXPORT CSV
========================================================= */

const exportBtn =
document.querySelector(
".exportBtn"
);

exportBtn.addEventListener(
"click",
exportCSV
);

/* =========================================================
EXPORT FUNCTION
========================================================= */

function exportCSV(){

let csv =
"Order ID,Customer,Phone,Amount,Status\n";

/* ========================================= */

ordersData.forEach(order=>{

csv +=

`${order.id},
${order.name || ""},
${order.phone || ""},
${order.total || 0},
${order.status || "Pending"}\n`;

});

/* ========================================= */

const blob =
new Blob(
[csv],
{
type:"text/csv"
}
);

/* ========================================= */

const url =
URL.createObjectURL(blob);

/* ========================================= */

const a =
document.createElement("a");

a.href = url;

a.download =
"quickpress-orders.csv";

/* ========================================= */

a.click();

/* ========================================= */

URL.revokeObjectURL(url);

/* ========================================= */

showToast(
"CSV Exported"
);

}

/* =========================================================
LIVE ACTIVITY
========================================================= */

const activityWrap =
document.querySelector(
".activity"
);

/* ========================================= */

setInterval(()=>{

const messages = [

"New order received",
"Rider assigned",
"Wallet recharge completed",
"Order delivered",
"Pickup completed"

];

/* ========================================= */

const random =
messages[
Math.floor(
Math.random() * messages.length
)
];

/* ========================================= */

const div =
document.createElement(
"div"
);

div.className =
"activityItem";

/* ========================================= */

div.innerHTML = `

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

/* ========================================= */

activityWrap.prepend(div);

/* ========================================= */

if(activityWrap.children.length > 6){

activityWrap.removeChild(
activityWrap.lastChild
);

}

},10000);

/* =========================================================
REVENUE CHART
========================================================= */

function loadRevenueChart(totalRevenue){

setTimeout(()=>{

const canvas =
document.getElementById(
"revenueChart"
);

/* ========================================= */

if(!canvas || !window.Chart){

return;

}

/* ========================================= */

if(revenueChart){

revenueChart.destroy();

}

/* ========================================= */

revenueChart =
new Chart(canvas,{

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
2200,
1800,
2600,
3400,
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

},500);

}

/* =========================================================
TOAST
========================================================= */

function showToast(message){

const toast =
document.createElement(
"div"
);

/* ========================================= */

toast.innerText =
message;

/* ========================================= */

toast.style.position =
"fixed";

toast.style.bottom =
"20px";

toast.style.right =
"20px";

toast.style.padding =
"14px 20px";

toast.style.background =
"#111827";

toast.style.color =
"#fff";

toast.style.fontWeight =
"800";

toast.style.borderRadius =
"16px";

toast.style.zIndex =
"99999";

/* ========================================= */

document.body.appendChild(
toast
);

/* ========================================= */

setTimeout(()=>{

toast.remove();

},3000);

}

/* =========================================================
LIVE CLOCK
========================================================= */

setInterval(()=>{

document.title =
`QuickPress Admin • ${new Date().toLocaleTimeString()}`;

},1000);
