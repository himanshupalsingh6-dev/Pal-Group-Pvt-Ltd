/* =========================================================
FILE : admin/js/analytics.js
QUICKPRESS ENTERPRISE ANALYTICS PANEL
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot

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
ELEMENTS
========================================================= */

const analyticsOrders =
document.getElementById(
"analyticsOrders"
);

const analyticsRevenue =
document.getElementById(
"analyticsRevenue"
);

const analyticsUsers =
document.getElementById(
"analyticsUsers"
);

const growthRate =
document.getElementById(
"growthRate"
);

/* =========================================================
CHARTS
========================================================= */

let revenueChart;
let ordersChart;
let paymentChart;
let cityChart;

/* =========================================================
REALTIME ANALYTICS
========================================================= */

onSnapshot(

collection(db,"orders"),

(orderSnapshot)=>{

let totalOrders = 0;

let totalRevenue = 0;

let online = 0;
let cod = 0;
let wallet = 0;

let delivered = 0;
let pending = 0;
let preparing = 0;

let cityMap = {};

let weekRevenue = [
0,0,0,0,0,0,0
];

/* ========================================= */

orderSnapshot.forEach((docSnap)=>{

const order =
docSnap.data();

totalOrders++;

const amount =
Number(order.total || 0);

totalRevenue += amount;

/* =========================================
PAYMENT
========================================= */

if(order.paymentMethod === "Online"){

online += amount;

}

if(order.paymentMethod === "COD"){

cod += amount;

}

if(order.paymentMethod === "Wallet"){

wallet += amount;

}

/* =========================================
STATUS
========================================= */

if(order.status === "Delivered"){

delivered++;

}

if(order.status === "Pending"){

pending++;

}

if(order.status === "Preparing"){

preparing++;

}

/* =========================================
CITY
========================================= */

const city =
order.city || "Unknown";

if(!cityMap[city]){

cityMap[city] = 0;

}

cityMap[city]++;

/* =========================================
WEEK GRAPH
========================================= */

if(order.createdAt?.seconds){

const date =
new Date(
order.createdAt.seconds * 1000
);

const day =
date.getDay();

weekRevenue[day] += amount;

}

});

/* =========================================
STATS
========================================= */

analyticsOrders.innerHTML =
totalOrders;

analyticsRevenue.innerHTML =
`₹${totalRevenue}`;

growthRate.innerHTML =
`${Math.floor(
(totalRevenue / 1000)
)}%`;

/* =========================================
REVENUE CHART
========================================= */

const revenueCtx =
document.getElementById(
"revenueChart"
);

if(revenueChart){

revenueChart.destroy();

}

revenueChart =
new Chart(revenueCtx, {

type:'line',

data:{

labels:[
'Sun',
'Mon',
'Tue',
'Wed',
'Thu',
'Fri',
'Sat'
],

datasets:[{

label:'Revenue',

data:weekRevenue,

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

/* =========================================
ORDERS CHART
========================================= */

const ordersCtx =
document.getElementById(
"ordersChart"
);

if(ordersChart){

ordersChart.destroy();

}

ordersChart =
new Chart(ordersCtx, {

type:'doughnut',

data:{

labels:[
'Delivered',
'Pending',
'Preparing'
],

datasets:[{

data:[
delivered,
pending,
preparing
]

}]

},

options:{

responsive:true

}

});

/* =========================================
PAYMENT CHART
========================================= */

const paymentCtx =
document.getElementById(
"paymentChart"
);

if(paymentChart){

paymentChart.destroy();

}

paymentChart =
new Chart(paymentCtx, {

type:'bar',

data:{

labels:[
'Online',
'COD',
'Wallet'
],

datasets:[{

label:'Payments',

data:[
online,
cod,
wallet
],

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

});

/* =========================================
CITY CHART
========================================= */

const cityCtx =
document.getElementById(
"cityChart"
);

if(cityChart){

cityChart.destroy();

}

cityChart =
new Chart(cityCtx, {

type:'pie',

data:{

labels:
Object.keys(cityMap),

datasets:[{

data:
Object.values(cityMap)

}]

},

options:{

responsive:true

}

});

}

/* END */

);

/* =========================================================
USERS ANALYTICS
========================================================= */

onSnapshot(

collection(db,"users"),

(snapshot)=>{

analyticsUsers.innerHTML =
snapshot.size;

}

/* END */

);
