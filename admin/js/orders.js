/* =========================================================
FILE : admin.js
FULL REALTIME FIREBASE ADMIN PANEL
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
orderBy

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

const serviceList =
document.getElementById(
"serviceList"
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

const searchInput =
document.getElementById(
"searchInput"
);

const statusFilter =
document.getElementById(
"statusFilter"
);

/* =========================================================
GLOBAL DATA
========================================================= */

let allOrders = [];
let totalRevenue = 0;

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

allOrders = [];

let pending = 0;
let delivered = 0;
let revenueAmount = 0;

/* ========================================= */

snapshot.forEach(docSnap=>{

const data =
docSnap.data();

/* ========================================= */

allOrders.push({

id:docSnap.id,
...data

});

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

});

/* ========================================= */

totalOrders.innerHTML =
snapshot.size;

pendingOrders.innerHTML =
pending;

deliveredOrders.innerHTML =
delivered;

revenue.innerHTML =
`₹${revenueAmount}`;

/* ========================================= */

totalRevenue =
revenueAmount;

/* ========================================= */

renderOrders(
allOrders
);

}
);

/* =========================================================
RENDER ORDERS
========================================================= */

function renderOrders(data){

ordersTable.innerHTML = "";

/* ========================================= */

if(data.length === 0){

ordersTable.innerHTML = `

<tr>

<td colspan="7"
style="
text-align:center;
padding:40px;
font-weight:800;
">

No Orders Found

</td>

</tr>

`;

return;

}

/* ========================================= */

data.forEach(order=>{

const statusClass =

order.status === "Delivered"

? "delivered"

:

order.status === "Preparing"

? "processing"

:

"pending";

/* ========================================= */

ordersTable.innerHTML += `

<tr>

<td>
#${order.id.slice(0,5)}
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

${order.name || "Customer"}

</span>

<span style="
font-size:12px;
color:#6B7280;
">

${order.phone || "No Number"}

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

<span class="status ${statusClass}">

${order.status || "Pending"}

</span>

</td>

<td>

${formatDate(order.createdAt)}

</td>

<td>

<div style="
display:flex;
gap:10px;
">

<button
class="actionBtn"
onclick="updateStatus('${order.id}','Preparing')">

<i class="fa-solid fa-box"></i>

</button>

<button
class="actionBtn"
onclick="updateStatus('${order.id}','Delivered')">

<i class="fa-solid fa-check"></i>

</button>

<button
class="actionBtn"
style="
background:#DC2626;
"
onclick="deleteOrder('${order.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

});

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

alert(
"Order Deleted"
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

alert(
`Order marked as ${status}`
);

}

/* =========================================================
LIVE SERVICES
========================================================= */

const servicesRef =
collection(db,"services");

onSnapshot(
servicesRef,
(snapshot)=>{

serviceList.innerHTML = "";

/* ========================================= */

snapshot.forEach(docSnap=>{

const data =
docSnap.data();

/* ========================================= */

serviceList.innerHTML += `

<div class="serviceItem">

<div class="serviceLeft">

<img
src="${data.image}"
class="serviceImg">

<div class="serviceInfo">

<h3>
${data.name}
</h3>

<p>
₹${data.price}
</p>

</div>

</div>

<div style="
display:flex;
gap:10px;
">

<button
class="actionBtn"
onclick="editService(
'${docSnap.id}',
'${data.name}',
'${data.price}'
)">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="deleteBtn"
onclick="deleteService('${docSnap.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</div>

`;

});

}
);

/* =========================================================
DELETE SERVICE
========================================================= */

window.deleteService =
async function(id){

const confirmDelete =
confirm(
"Delete this service?"
);

/* ========================================= */

if(!confirmDelete){

return;

}

/* ========================================= */

await deleteDoc(
doc(db,"services",id)
);

alert(
"Service Deleted"
);

}

/* =========================================================
EDIT SERVICE
========================================================= */

window.editService =
async function(id,name,price){

const newName =
prompt(
"Edit Service Name",
name
);

/* ========================================= */

const newPrice =
prompt(
"Edit Price",
price
);

/* ========================================= */

if(!newName || !newPrice){

return;

}

/* ========================================= */

await updateDoc(

doc(db,"services",id),

{

name:newName,
price:newPrice

}

);

/* ========================================= */

alert(
"Service Updated"
);

}

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"input",
filterOrders
);

/* =========================================================
FILTER
========================================================= */

statusFilter.addEventListener(
"change",
filterOrders
);

/* =========================================================
FILTER FUNCTION
========================================================= */

function filterOrders(){

const search =
searchInput.value.toLowerCase();

const status =
statusFilter.value;

/* ========================================= */

const filtered =
allOrders.filter(order=>{

const matchesSearch =

(order.name || "")
.toLowerCase()
.includes(search)

||

(order.phone || "")
.toLowerCase()
.includes(search);

/* ========================================= */

const matchesStatus =

status === ""

||

order.status === status;

/* ========================================= */

return matchesSearch && matchesStatus;

});

/* ========================================= */

renderOrders(
filtered
);

}

/* =========================================================
EXPORT CSV
========================================================= */

document.getElementById(
"exportBtn"
).addEventListener(
"click",
()=>{

let csv =
"Order ID,Customer,Phone,Items,Amount,Status\n";

/* ========================================= */

allOrders.forEach(order=>{

csv +=

`${order.id},
${order.name || ""},
${order.phone || ""},
${order.items?.length || 1},
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

});

/* =========================================================
REVENUE CHART
========================================================= */

const ctx =
document.getElementById(
"revenueChart"
);

/* ========================================= */

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
2400,
1800,
3000,
4200,
3800,
5200
],

borderWidth:4,

fill:true,

tension:0.4

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
