/* =========================================================
FILE : admin/js/dashboard.js
========================================================= */

/* =========================================================
FIREBASE
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
getDocs

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
AUTH CHECK
========================================================= */

const adminSession =
localStorage.getItem(
"quickpress_admin"
);

if(adminSession !== "true"){

window.location.href =
"login.html";

}

/* =========================================================
MOBILE BLOCK
========================================================= */

const isTouch =
'ontouchstart'
in window;

const isMobileUA =
/Android|iPhone|iPad|iPod/i
.test(
navigator.userAgent
);

if(
window.innerWidth < 1024
||
isTouch
||
isMobileUA
){

document.body.innerHTML = `

<div
style="
height:100vh;
display:flex;
align-items:center;
justify-content:center;
background:#081028;
color:white;
font-family:Poppins,sans-serif;
padding:30px;
text-align:center;
">

<div>

<div
style="
font-size:90px;
margin-bottom:25px;
color:#FFD400;
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
margin-top:18px;
line-height:1.8;
color:#9CA3AF;
">

QuickPress Admin Panel only works on Laptop/Desktop.

</p>

</div>

</div>

`;

}

/* =========================================================
ELEMENTS
========================================================= */

const totalOrders =
document.getElementById(
"totalOrders"
);

const totalRevenue =
document.getElementById(
"totalRevenue"
);

const totalPartners =
document.getElementById(
"totalPartners"
);

const totalRiders =
document.getElementById(
"totalRiders"
);

const liveOrdersList =
document.getElementById(
"liveOrdersList"
);

const kasganjRevenue =
document.getElementById(
"kasganjRevenue"
);

const noidaRevenue =
document.getElementById(
"noidaRevenue"
);

const delhiRevenue =
document.getElementById(
"delhiRevenue"
);

/* =========================================================
LOAD DASHBOARD
========================================================= */

async function loadDashboard(){

/* =========================================
LOAD ORDERS
========================================= */

const ordersSnap =
await getDocs(
collection(db,"orders")
);

let orderCount = 0;
let revenue = 0;

let kasganj = 0;
let noida = 0;
let delhi = 0;

let liveHTML = "";

/* =========================================
ORDERS LOOP
========================================= */

ordersSnap.forEach((doc)=>{

const order = doc.data();

orderCount++;

revenue +=
Number(order.total || 0);

/* =========================================
CITY REVENUE
========================================= */

if(order.city === "Kasganj"){

kasganj +=
Number(order.total || 0);

}

if(order.city === "Noida"){

noida +=
Number(order.total || 0);

}

if(order.city === "Delhi"){

delhi +=
Number(order.total || 0);

}

/* =========================================
LIVE ORDERS
========================================= */

liveHTML += `

<div class="orderItem">

<div class="orderLeft">

<h4>
${order.name || "Customer"}
</h4>

<p>
${order.city || ""}
• ₹${order.total || 0}
</p>

</div>

<div class="orderStatus ${

(order.status === "Pending")
? "pending"

:

(order.status === "Delivered")
? "delivered"

:

"delivery"

}">

${order.status || "Pending"}

</div>

</div>

`;

});

/* =========================================
UPDATE UI
========================================= */

totalOrders.innerHTML =
orderCount;

totalRevenue.innerHTML =
`₹${revenue}`;

kasganjRevenue.innerHTML =
`₹${kasganj}`;

noidaRevenue.innerHTML =
`₹${noida}`;

delhiRevenue.innerHTML =
`₹${delhi}`;

liveOrdersList.innerHTML =
liveHTML;

/* =========================================
LOAD PARTNERS
========================================= */

const partnersSnap =
await getDocs(
collection(db,"partners")
);

totalPartners.innerHTML =
partnersSnap.size;

/* =========================================
LOAD RIDERS
========================================= */

const ridersSnap =
await getDocs(
collection(db,"riders")
);

totalRiders.innerHTML =
ridersSnap.size;

/* =========================================
LOAD GRAPH
========================================= */

loadRevenueChart(
revenue
);

}

/* =========================================================
GRAPH
========================================================= */

function loadRevenueChart(total){

const ctx =
document.getElementById(
"revenueChart"
);

new Chart(ctx, {

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
3800,
5200,
7100,
9400,
total || 12000
],

borderWidth:4,
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

}

/* =========================================================
AUTO REFRESH
========================================================= */

setInterval(()=>{

loadDashboard();

},10000);

/* =========================================================
START
========================================================= */

loadDashboard();
