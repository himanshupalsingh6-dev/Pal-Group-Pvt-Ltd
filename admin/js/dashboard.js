/* =========================================================
FILE : admin/js/dashboard.js
QUICKPRESS ENTERPRISE DASHBOARD
REALTIME FIREBASE SYSTEM
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

const searchInput =
document.getElementById(
"searchInput"
);

const cityFilter =
document.getElementById(
"cityFilter"
);

const statusFilter =
document.getElementById(
"statusFilter"
);

/* =========================================================
DATA STORAGE
========================================================= */

let allOrders = [];

let revenueChart = null;

/* =========================================================
LOAD ORDERS
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

let citySet =
new Set();

/* =========================================
CLEAR
========================================= */

ordersContainer.innerHTML = "";

/* =========================================
LOOP
========================================= */

snapshot.forEach((docSnap)=>{

const order = {

id:docSnap.id,
...docSnap.data()

};

allOrders.push(order);

/* =========================================
CITYS
========================================= */

if(order.city){

citySet.add(order.city);

}

/* =========================================
STATS
========================================= */

totalRevenue +=
Number(order.total || 0);

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

/* =========================================
SEARCH FILTER
========================================= */

const search =
searchInput.value
.toLowerCase();

const selectedCity =
cityFilter.value;

const selectedStatus =
statusFilter.value;

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

if(
selectedCity !== "All"
&&
order.city !== selectedCity
){

return;

}

if(
selectedStatus !== "All"
&&
order.status !== selectedStatus
){

return;

}

/* =========================================
STATUS CLASS
========================================= */

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

/* =========================================
TIME
========================================= */

let orderTime = "--";

if(order.createdAt?.seconds){

orderTime =
new Date(
order.createdAt.seconds * 1000
).toLocaleTimeString();

}

/* =========================================
ROW
========================================= */

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
onclick="window.location.href='orders.html?id=${order.id}'">

View

</button>

</div>

</div>

`;

ordersContainer.innerHTML += row;

});

/* =========================================
UPDATE STATS
========================================= */

totalOrders.innerHTML =
snapshot.size;

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

/* =========================================
NOTIFICATION COUNT
========================================= */

notificationCount.innerHTML =
pending;

/* =========================================
LOAD CITIES
========================================= */

loadCities([...citySet]);

/* =========================================
GRAPH
========================================= */

loadRevenueChart();

}

/* END */

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

cityFilter.value = current;

}

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"input",
()=>{

reloadOrders();

}
);

cityFilter.addEventListener(
"change",
()=>{

reloadOrders();

}
);

statusFilter.addEventListener(
"change",
()=>{

reloadOrders();

}
);

/* =========================================================
RELOAD
========================================================= */

function reloadOrders(){

ordersContainer.innerHTML = "";

allOrders.forEach((order)=>{

const search =
searchInput.value
.toLowerCase();

const selectedCity =
cityFilter.value;

const selectedStatus =
statusFilter.value;

/* ========================================= */

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

if(
selectedCity !== "All"
&&
order.city !== selectedCity
){

return;

}

if(
selectedStatus !== "All"
&&
order.status !== selectedStatus
){

return;

}

/* ========================================= */

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

/* ========================================= */

let orderTime = "--";

if(order.createdAt?.seconds){

orderTime =
new Date(
order.createdAt.seconds * 1000
).toLocaleTimeString();

}

/* ========================================= */

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
onclick="window.location.href='orders.html?id=${order.id}'">

View

</button>

</div>

</div>

`;

ordersContainer.innerHTML += row;

});

}

/* =========================================================
REVENUE GRAPH
========================================================= */

function loadRevenueChart(){

const ctx =
document.getElementById(
"revenueChart"
);

/* =========================================
DESTROY OLD
========================================= */

if(revenueChart){

revenueChart.destroy();

}

/* =========================================
WEEK DATA
========================================= */

let monday = 0;
let tuesday = 0;
let wednesday = 0;
let thursday = 0;
let friday = 0;
let saturday = 0;
let sunday = 0;

/* ========================================= */

allOrders.forEach((order)=>{

const amount =
Number(order.total || 0);

if(!order.createdAt?.seconds) return;

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

/* =========================================
GRAPH
========================================= */

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
"OrderID,Customer,City,Amount,Status\n";

allOrders.forEach((order)=>{

csv += `

${order.id},
${order.name},
${order.city},
${order.total},
${order.status}

`;

});

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
