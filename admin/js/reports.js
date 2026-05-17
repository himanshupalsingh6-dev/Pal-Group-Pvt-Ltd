/* =========================================================
FILE : admin/js/reports.js
QUICKPRESS REPORTS PANEL
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

let revenueChart;
let ordersChart;

/* =========================================================
REPORTS
========================================================= */

onSnapshot(

collection(db,"orders"),

(snapshot)=>{

let revenueData = [
0,0,0,0,0,0,0
];

let orderData = [
0,0,0,0,0,0,0
];

/* ========================================= */

snapshot.forEach((docSnap)=>{

const order =
docSnap.data();

const amount =
Number(order.total || 0);

if(order.createdAt?.seconds){

const day =
new Date(
order.createdAt.seconds * 1000
).getDay();

revenueData[day] += amount;

orderData[day] += 1;

}

});

/* =========================================
REVENUE CHART
========================================= */

const revenueCtx =
document.getElementById(
"revenueReportChart"
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

data:revenueData,

borderWidth:3,
fill:true

}]

},

options:{

responsive:true

}

});

/* =========================================
ORDERS CHART
========================================= */

const ordersCtx =
document.getElementById(
"ordersReportChart"
);

if(ordersChart){

ordersChart.destroy();

}

ordersChart =
new Chart(ordersCtx, {

type:'bar',

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

label:'Orders',

data:orderData,

borderWidth:2

}]

},

options:{

responsive:true

}

});

}

/* END */

);
