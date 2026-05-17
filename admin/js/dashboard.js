/* =========================================================
FILE : admin/js/dashboard.js
QUICKPRESS ENTERPRISE REALTIME DASHBOARD
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot,
query,
orderBy

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
AUTH CHECK
========================================================= */

const adminLogin =
localStorage.getItem(
"quickpress_admin"
);

if(adminLogin !== "true"){

window.location.href =
"login.html";

}

/* =========================================================
DESKTOP ONLY
========================================================= */

const isMobile =
/Android|iPhone|iPad|iPod/i
.test(
navigator.userAgent
);

if(
window.innerWidth < 1024
||
isMobile
){

document.body.innerHTML = `

<div
style="
height:100vh;
display:flex;
align-items:center;
justify-content:center;
background:#111827;
color:white;
font-family:Inter,sans-serif;
text-align:center;
padding:30px;
">

<div>

<div
style="
font-size:80px;
margin-bottom:20px;
">

🖥️

</div>

<h1
style="
font-size:42px;
font-weight:900;
">

Desktop Only

</h1>

<p
style="
margin-top:12px;
font-size:16px;
line-height:1.7;
color:#D1D5DB;
">

QuickPress Admin Panel only works on Laptop/Desktop

</p>

</div>

</div>

`;

}

/* =========================================================
ELEMENTS
========================================================= */

const ordersContainer =
document.getElementById(
"ordersContainer"
);

const totalOrders =
document.getElementById(
"totalOrders"
);

const pendingOrders =
document.getElementById(
"pendingOrders"
);

const preparingOrders =
document.getElementById(
"preparingOrders"
);

const deliveryOrders =
document.getElementById(
"deliveryOrders"
);

const deliveredOrders =
document.getElementById(
"deliveredOrders"
);

const revenue =
document.getElementById(
"revenue"
);

const notificationCount =
document.getElementById(
"notificationCount"
);

const cityFilter =
document.getElementById(
"cityFilter"
);

const statusFilter =
document.getElementById(
"statusFilter"
);

const searchInput =
document.getElementById(
"searchInput"
);

/* =========================================================
GLOBAL DATA
========================================================= */

let allOrders = [];

let revenueChart;

/* =========================================================
LOAD REALTIME ORDERS
========================================================= */

onSnapshot(

query(
collection(db,"orders"),
orderBy("createdAt","desc")
),

(snapshot)=>{

allOrders = [];

let totalRevenue = 0;

let pending = 0;
let preparing = 0;
let delivery = 0;
let delivered = 0;

let cities = new Set();

/* ========================================= */

snapshot.forEach((docSnap)=>{

const order = {

id:docSnap.id,
...docSnap.data()

};

allOrders.push(order);

/* ========================================= */

totalRevenue +=
Number(order.total || 0);

/* ========================================= */

if(order.city){

cities.add(order.city);

}

/* ========================================= */

if(order.status === "Pending"){

pending++;

}

if(
order.status === "Preparing"
||
order.status === "Ironing"
){

preparing++;

}

if(order.status === "Out For Delivery"){

delivery++;

}

if(order.status === "Delivered"){

delivered++;

}

});

/* =========================================
UPDATE STATS
========================================= */

totalOrders.innerHTML =
allOrders.length;

pendingOrders.innerHTML =
pending;

preparingOrders.innerHTML =
preparing;

deliveryOrders.innerHTML =
delivery;

deliveredOrders.innerHTML =
delivered;

revenue.innerHTML =
`₹${totalRevenue}`;

notificationCount.innerHTML =
pending;

/* =========================================
LOAD FILTERS
========================================= */

loadCities([...cities]);

/* =========================================
SHOW ORDERS
========================================= */

renderOrders();

/* =========================================
GRAPH
========================================= */

loadRevenueChart();

}

/* END SNAPSHOT */

);

/* =========================================================
LOAD CITY FILTER
========================================================= */

function loadCities(cities){

const current =
cityFilter.value;

cityFilter.innerHTML = `

<option value="All">
All Cities
</option>

`;

cities.forEach((city)=>{

cityFilter.innerHTML += `

<option value="${city}">
${city}
</option>

`;

});

cityFilter.value =
current;

}

/* =========================================================
RENDER ORDERS
========================================================= */

function renderOrders(){

ordersContainer.innerHTML = "";

/* ========================================= */

const search =
searchInput.value
.toLowerCase();

const selectedCity =
cityFilter.value;

const selectedStatus =
statusFilter.value;

/* ========================================= */

allOrders.forEach((order)=>{

/* =====================================
SEARCH FILTER
===================================== */

if(
search &&
!(
order.name || ""
)
.toLowerCase()
.includes(search)
&&
!(
order.mobile || ""
)
.includes(search)
){

return;

}

/* =====================================
CITY FILTER
===================================== */

if(
selectedCity !== "All"
&&
order.city !== selectedCity
){

return;

}

/* =====================================
STATUS FILTER
===================================== */

if(
selectedStatus !== "All"
&&
order.status !== selectedStatus
){

return;

}

/* =====================================
STATUS CLASS
===================================== */

let statusClass =
"pending";

if(order.status === "Delivered"){

statusClass =
"delivered";

}

if(order.status === "Out For Delivery"){

statusClass =
"delivery";

}

if(
order.status === "Preparing"
||
order.status === "Ironing"
){

statusClass =
"preparing";

}

/* =====================================
TIME
===================================== */

let orderTime = "--";

if(order.createdAt?.seconds){

orderTime =
new Date(
order.createdAt.seconds * 1000
).toLocaleTimeString();

}

/* =====================================
ROW
===================================== */

const row = `

<div class="orderRow">

<div>

#${order.id.slice(0,6)}

</div>

<div class="customer">

<div class="customerAvatar">

${order.name
?.charAt(0)
|| "U"}

</div>

<div>

<b>

${order.name || "Customer"}

</b>

<br>

<small>

${order.city || ""}

</small>

</div>

</div>

<div>

${order.items?.length || 0}
Items

</div>

<div>

₹${order.total || 0}

</div>

<div>

${order.paymentMethod || "COD"}

</div>

<div>

<div class="status ${statusClass}">

${order.status || "Pending"}

</div>

</div>

<div>

${orderTime}

</div>

<div>

<button
class="actionBtn"
onclick="openOrder('${order.id}')">

View

</button>

</div>

</div>

`;

ordersContainer.innerHTML += row;

});

}

/* =========================================================
OPEN ORDER
========================================================= */

window.openOrder =
(id)=>{

window.location.href =
`orders.html?id=${id}`;

};

/* =========================================================
SEARCH EVENTS
========================================================= */

searchInput.addEventListener(
"input",
renderOrders
);

cityFilter.addEventListener(
"change",
renderOrders
);

statusFilter.addEventListener(
"change",
renderOrders
);

/* =========================================================
REVENUE GRAPH
========================================================= */

function loadRevenueChart(){

const ctx =
document.getElementById(
"revenueChart"
);

/* ========================================= */

if(revenueChart){

revenueChart.destroy();

}

/* ========================================= */

let monday = 0;
let tuesday = 0;
let wednesday = 0;
let thursday = 0;
let friday = 0;
let saturday = 0;
let sunday = 0;

/* ========================================= */

allOrders.forEach((order)=>{

if(!order.createdAt?.seconds){

return;

}

const amount =
Number(order.total || 0);

const date =
new Date(
order.createdAt.seconds * 1000
);

const day =
date.getDay();

/* ========================================= */

if(day === 1){

monday += amount;

}

if(day === 2){

tuesday += amount;

}

if(day === 3){

wednesday += amount;

}

if(day === 4){

thursday += amount;

}

if(day === 5){

friday += amount;

}

if(day === 6){

saturday += amount;

}

if(day === 0){

sunday += amount;

}

});

/* ========================================= */

revenueChart =
new Chart(ctx, {

type:'line',

data:{

labels:[
'Mon',
'Tue',
'Wed',
'Thu',
'Fri',
'Sat',
'Sun'
],

datasets:[{

label:'Revenue',

data:[

monday,
tuesday,
wednesday,
thursday,
friday,
saturday,
sunday

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

}

}

});

}

/* =========================================================
EXPORT CSV
========================================================= */

window.exportOrders =
()=>{

let csv =
"OrderID,Customer,City,Amount,Status,Payment\n";

/* ========================================= */

allOrders.forEach((order)=>{

csv +=

`${order.id},
${order.name},
${order.city},
${order.total},
${order.status},
${order.paymentMethod}

`;

});

/* ========================================= */

const blob =
new Blob(
[csv],
{
type:"text/csv"
}
);

const link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"quickpress-orders.csv";

link.click();

};
