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

const totalRevenue =
document.getElementById(
"totalRevenue"
);

const totalOrders =
document.getElementById(
"totalOrders"
);

const cancelledOrders =
document.getElementById(
"cancelledOrders"
);

const codCollection =
document.getElementById(
"codCollection"
);

const deliverySuccess =
document.getElementById(
"deliverySuccess"
);

const areaContainer =
document.getElementById(
"areaContainer"
);

const riderContainer =
document.getElementById(
"riderContainer"
);

const reportContainer =
document.getElementById(
"reportContainer"
);

/* =========================================================
REALTIME REPORTS
========================================================= */

onSnapshot(

collection(db,"orders"),

(snapshot)=>{

let revenue = 0;
let orders = 0;
let cancelled = 0;
let completed = 0;
let cod = 0;

const areaStats = {};

/* ========================================================= */

reportContainer.innerHTML = "";

/* ========================================================= */

snapshot.forEach(docSnap=>{

const order =
docSnap.data();

/* ========================================================= */

orders++;

revenue +=
order.total || 0;

/* ========================================================= */

if(order.status === "completed"){

completed++;

}

/* ========================================================= */

if(order.status === "cancelled"){

cancelled++;

}

/* ========================================================= */

if(order.paymentType === "cod"){

cod += order.total || 0;

}

/* =========================================================
AREA REPORT
========================================================= */

if(order.area){

if(!areaStats[order.area]){

areaStats[order.area] = 0;

}

areaStats[order.area]++;

}

/* =========================================================
LIVE REPORT
========================================================= */

reportContainer.innerHTML += `

<div class="tableRow">

<div>
${order.customerName || '-'}
</div>

<div>
₹${order.total || 0}
</div>

<div>

<div class="status ${order.status === 'completed' ? 'success' : 'warning'}">

${order.status}

</div>

</div>

<div>
${order.area || '-'}
</div>

</div>

`;

});

/* ========================================================= */

totalRevenue.innerHTML =
"₹" + revenue;

totalOrders.innerHTML =
orders;

cancelledOrders.innerHTML =
cancelled;

codCollection.innerHTML =
"₹" + cod;

/* ========================================================= */

const successRate =

orders
?
((completed / orders) * 100)
.toFixed(1)
:
0;

/* ========================================================= */

deliverySuccess.innerHTML =
successRate + "%";

/* =========================================================
AREA RENDER
========================================================= */

areaContainer.innerHTML = "";

/* ========================================================= */

Object.entries(areaStats)
.forEach(([area,count])=>{

areaContainer.innerHTML += `

<div class="tableRow">

<div>
${area}
</div>

<div>
${count}
Orders
</div>

<div>

<div class="status success">

Active

</div>

</div>

<div>
Top Area
</div>

</div>

`;

});

}
);

/* =========================================================
RIDER REPORT
========================================================= */

onSnapshot(

collection(db,"riders"),

(snapshot)=>{

riderContainer.innerHTML = "";

/* ========================================================= */

snapshot.forEach(docSnap=>{

const rider =
docSnap.data();

/* ========================================================= */

riderContainer.innerHTML += `

<div class="tableRow">

<div>
${rider.name || '-'}
</div>

<div>
${rider.completedOrders || 0}
Orders
</div>

<div>

<div class="status ${rider.online ? 'success' : 'danger'}">

${rider.online ? 'Online' : 'Offline'}

</div>

</div>

<div>
${rider.city || '-'}
</div>

</div>

`;

});

}
);

/* =========================================================
CHARTS
========================================================= */

function createLineChart(id,data){

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

/* ========================================================= */

function createPieChart(){

new Chart(

document.getElementById(
"pieChart"
),

{

type:"pie",

data:{

labels:[
"Completed",
"Pending",
"Cancelled"
],

datasets:[{

data:[60,25,15]

}]

}

}

);

}

/* ========================================================= */

createLineChart(
"revenueMiniChart",
[2000,3000,4500,5000,7000,8500,10000]
);

createLineChart(
"ordersMiniChart",
[12,18,20,30,45,60,72]
);

createLineChart(
"cancelMiniChart",
[5,4,4,3,3,2,1]
);

createLineChart(
"codMiniChart",
[1000,2000,3000,3500,4200,4800,5200]
);

createLineChart(
"deliveryMiniChart",
[70,75,80,85,90,94,97]
);

createLineChart(
"revenueChart",
[5000,7000,10000,12000,16000,22000,28000]
);

createPieChart();
