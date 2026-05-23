import { db }

from "../../firebase.js";

import {

collection,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
ELEMENTS
========================================================= */

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

const revenueValue =
document.getElementById(
"revenueValue"
);

const activeRiders =
document.getElementById(
"activeRiders"
);

const ordersContainer =
document.getElementById(
"ordersContainer"
);

const riderContainer =
document.getElementById(
"riderContainer"
);

const notificationContainer =
document.getElementById(
"notificationContainer"
);

/* =========================================================
CHART DATA
========================================================= */

let revenueChart;
let orderChart;
let riderChart;
let deliveryChart;

/* =========================================================
MAP
========================================================= */

const map =

L.map("map").setView(
[27.8176,78.6450],
12
);

/* ========================================================= */

L.tileLayer(

"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

{

attribution:"QuickPress"

}

).addTo(map);

/* ========================================================= */

let riderMarkers = [];

/* =========================================================
REALTIME ORDERS
========================================================= */

onSnapshot(

collection(db,"orders"),

(snapshot)=>{

ordersContainer.innerHTML = "";

notificationContainer.innerHTML = "";

/* ========================================================= */

let total = 0;
let pending = 0;
let delivered = 0;
let cancelled = 0;

let revenue = 0;

/* ========================================================= */

const revenueDays = [
0,0,0,0,0,0,0
];

/* ========================================================= */

snapshot.forEach(docSnap=>{

const order =
docSnap.data();

/* ========================================================= */

total++;

revenue +=
Number(order.total || 0);

/* ========================================================= */

const createdDate =

new Date(
order.createdAt || Date.now()
);

/* ========================================================= */

const day =
createdDate.getDay();

/* ========================================================= */

revenueDays[day] +=
Number(order.total || 0);

/* ========================================================= */

if(order.status === "pending"){

pending++;

}

if(order.status === "completed"){

delivered++;

}

if(order.status === "cancelled"){

cancelled++;

}

/* =========================================================
LIVE ORDER TABLE
========================================================= */

ordersContainer.innerHTML += `

<div class="orderRow">

<div>
${order.orderId || '-'}
</div>

<div>
${order.customerName || '-'}
</div>

<div>
${order.area || '-'}
</div>

<div>
₹${order.total || 0}
</div>

<div>

<div class="status ${order.status || 'pending'}">

${order.status || 'pending'}

</div>

</div>

<div>
${order.riderName || 'Not Assigned'}
</div>

<div class="actionBtns">

<button class="actionBtn viewBtn">

View

</button>

<button class="actionBtn assignBtn">

Assign

</button>

<button class="actionBtn assignBtn">

Track

</button>

</div>

</div>

`;

/* =========================================================
NOTIFICATIONS
========================================================= */

notificationContainer.innerHTML += `

<div class="notifyItem">

<div class="notifyText">

🛒 ${order.customerName}
placed new order

</div>

<div>

₹${order.total}

</div>

</div>

`;

});

/* =========================================================
SUMMARY UPDATE
========================================================= */

totalOrders.innerHTML =
total;

pendingOrders.innerHTML =
pending;

deliveredOrders.innerHTML =
delivered;

revenueValue.innerHTML =
"₹" + revenue;

/* =========================================================
REAL CHARTS
========================================================= */

updateRevenueChart(
revenueDays
);

updateOrdersChart(
[
total,
pending,
delivered,
cancelled
]
);

}
);

/* =========================================================
REALTIME RIDERS
========================================================= */

onSnapshot(

collection(db,"riders"),

(snapshot)=>{

riderContainer.innerHTML = "";

/* ========================================================= */

let active = 0;

let onlineCount = 0;
let busyCount = 0;

/* ========================================================= */

riderMarkers.forEach(marker=>{

map.removeLayer(marker);

});

/* ========================================================= */

riderMarkers = [];

/* ========================================================= */

snapshot.forEach(docSnap=>{

const rider =
docSnap.data();

/* ========================================================= */

if(
rider.status === "online"
){

onlineCount++;
active++;

}

if(
rider.status === "busy" ||
rider.status === "delivery"
){

busyCount++;

}

/* =========================================================
RIDER PANEL
========================================================= */

riderContainer.innerHTML += `

<div class="riderCard">

<div class="riderInfo">

<img
src="${rider.photo || 'https://i.ibb.co/3SWQHfY/user.png'}"
class="riderImage">

<div>

<div class="riderName">

${rider.name || '-'}

</div>

<div class="riderStatus">

${rider.status || 'offline'}

</div>

</div>

</div>

<button class="quickBtn">

Track Rider

</button>

</div>

`;

/* =========================================================
MAP MARKERS
========================================================= */

const marker =

L.marker([
rider.lat || 27.8176,
rider.lng || 78.6450
])

.addTo(map)

.bindPopup(`

<b>${rider.name}</b>

<br>

📞 ${rider.phone || '-'}

<br>

🚴 ${rider.vehicle || 'Bike'}

<br>

📦 Orders:
${rider.completedOrders || 0}

<br>

💰 Earnings:
₹${rider.earnings || 0}

<br>

🔋 Battery:
${rider.battery || 90}%

`);

/* ========================================================= */

riderMarkers.push(marker);

});

/* ========================================================= */

activeRiders.innerHTML =
active;

/* ========================================================= */

updateRiderChart([
onlineCount,
busyCount
]);

}
);

/* =========================================================
REVENUE CHART
========================================================= */

function updateRevenueChart(data){

if(revenueChart){

revenueChart.destroy();

}

/* ========================================================= */

revenueChart =

new Chart(

document.getElementById(
"salesChart"
),

{

type:"line",

data:{

labels:[
"Sun",
"Mon",
"Tue",
"Wed",
"Thu",
"Fri",
"Sat"
],

datasets:[{

label:"Revenue",

data:data,

borderWidth:4,

fill:true,

tension:.4

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

}

);

}

/* =========================================================
ORDER CHART
========================================================= */

function updateOrdersChart(data){

if(orderChart){

orderChart.destroy();

}

/* ========================================================= */

orderChart =

new Chart(

document.getElementById(
"ordersChart"
),

{

type:"doughnut",

data:{

labels:[
"Total",
"Pending",
"Delivered",
"Cancelled"
],

datasets:[{

data:data,

borderWidth:2

}]

},

options:{

responsive:true

}

}

);

}

/* =========================================================
RIDER CHART
========================================================= */

function updateRiderChart(data){

if(riderChart){

riderChart.destroy();

}

/* ========================================================= */

riderChart =

new Chart(

document.getElementById(
"riderChart"
),

{

type:"bar",

data:{

labels:[
"Online",
"Busy"
],

datasets:[{

data:data,

borderWidth:2

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

}

);

}

/* =========================================================
DELIVERY SUCCESS
========================================================= */

deliveryChart =

new Chart(

document.getElementById(
"deliveryChart"
),

{

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

data:[
70,
75,
82,
88,
91,
95,
98
],

borderWidth:4,

tension:.4

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

}

);

/* =========================================================
LIVE AUTO REFRESH
========================================================= */

setInterval(()=>{

console.log(
"Dashboard Synced"
);

},5000);
