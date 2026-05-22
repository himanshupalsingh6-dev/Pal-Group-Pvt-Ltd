import { db }

from "../../firebase.js";

import {

collection,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* ========================================================= */

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
SUMMARY
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

/* =========================================================
ORDERS
========================================================= */

onSnapshot(

collection(db,"orders"),

(snapshot)=>{

ordersContainer.innerHTML = "";

notificationContainer.innerHTML = "";

let total = 0;
let pending = 0;
let delivered = 0;
let revenue = 0;

/* ========================================================= */

snapshot.forEach(docSnap=>{

const order =
docSnap.data();

/* ========================================================= */

total++;

revenue +=
order.total || 0;

/* ========================================================= */

if(order.status === "pending"){

pending++;

}

/* ========================================================= */

if(order.status === "completed"){

delivered++;

}

/* =========================================================
LIVE ORDERS
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

<div class="status ${order.status}">
${order.status}
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

</div>

</div>

`;

/* =========================================================
NOTIFICATIONS
========================================================= */

notificationContainer.innerHTML += `

<div class="notifyItem">

<div class="notifyText">

${order.customerName}
placed order

</div>

<div>

₹${order.total}

</div>

</div>

`;

});

/* ========================================================= */

totalOrders.innerHTML =
total;

pendingOrders.innerHTML =
pending;

deliveredOrders.innerHTML =
delivered;

revenueValue.innerHTML =
"₹" + revenue;

}
);

/* =========================================================
RIDERS
========================================================= */

onSnapshot(

collection(db,"riders"),

(snapshot)=>{

riderContainer.innerHTML = "";

let active = 0;

/* ========================================================= */

snapshot.forEach(docSnap=>{

const rider =
docSnap.data();

/* ========================================================= */

if(rider.online){

active++;

}

/* ========================================================= */

riderContainer.innerHTML += `

<div class="riderCard">

<div class="riderInfo">

<img
src="${rider.photo || 'https://i.ibb.co/3SWQHfY/user.png'}"
class="riderImage">

<div>

<div class="riderName">

${rider.name}

</div>

<div class="riderStatus">

${rider.online ? 'Online' : 'Offline'}

</div>

</div>

</div>

<button class="quickBtn">

View Rider

</button>

</div>

`;

});

/* ========================================================= */

activeRiders.innerHTML =
active;

}
);

/* =========================================================
MAP
========================================================= */

const map =

L.map("map").setView(
[28.8176,78.0653],
13
);

/* ========================================================= */

L.tileLayer(

"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

{

attribution:"QuickPress"

}

).addTo(map);

/* ========================================================= */

L.marker(
[28.8176,78.0653]
).addTo(map);

L.marker(
[28.8250,78.0550]
).addTo(map);

/* =========================================================
CHARTS
========================================================= */

function createChart(id,data){

new Chart(

document.getElementById(id),

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

data:data,

borderWidth:3,

tension:.4

}]

},

options:{

plugins:{
legend:{
display:false
}
},

responsive:true

}

}

);

}

/* ========================================================= */

createChart(
"ordersChart",
[10,20,30,25,40,55,70]
);

createChart(
"pendingChart",
[20,18,15,14,10,8,6]
);

createChart(
"deliveryChart",
[5,10,15,25,35,50,65]
);

createChart(
"revenueChart",
[2000,3000,4500,5000,6500,7000,9000]
);

createChart(
"riderChart",
[2,4,6,8,10,12,15]
);

createChart(
"salesChart",
[5000,7000,9000,11000,15000,18000,22000]
);
