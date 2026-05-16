/* =========================================================
FILE : admin/js/dashboard.js
QUICKPRESS MINIMAL ENTERPRISE DASHBOARD
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot,
query,
orderBy,
limit

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
DESKTOP ONLY
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

const todayRevenue =
document.getElementById(
"todayRevenue"
);

const adminProfit =
document.getElementById(
"adminProfit"
);

const totalUsers =
document.getElementById(
"totalUsers"
);

const totalPartners =
document.getElementById(
"totalPartners"
);

const activityFeed =
document.getElementById(
"activityFeed"
);

const citySelector =
document.getElementById(
"citySelector"
);

/* =========================================================
CITY FILTER
========================================================= */

let selectedCity = "All";

citySelector.addEventListener(
"change",
()=>{

selectedCity =
citySelector.value;

loadDashboard();

}
);

/* =========================================================
GRAPH
========================================================= */

let revenueChart;

/* =========================================================
LOAD DASHBOARD
========================================================= */

function loadDashboard(){

/* =========================================
LIVE ORDERS
========================================= */

onSnapshot(

query(
collection(db,"orders"),
orderBy("createdAt","desc"),
limit(20)
),

(snapshot)=>{

let total = 0;

let orderCount = 0;

let profit = 0;

let chartData = [];

let activityHTML = "";

/* =====================================
LOOP
===================================== */

snapshot.forEach((doc)=>{

const order =
doc.data();

const orderId =
doc.id;

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
TOTALS
===================================== */

orderCount++;

const orderTotal =
Number(order.total || 0);

total += orderTotal;

/* =====================================
ADMIN PROFIT
20%
===================================== */

const adminCommission =
(orderTotal * 20) / 100;

profit += adminCommission;

chartData.push(orderTotal);

/* =====================================
STATUS
===================================== */

let statusClass =
"pending";

if(order.status === "Delivered"){

statusClass =
"delivered";

}

if(
order.status ===
"Out For Delivery"
){

statusClass =
"delivery";

}

/* =====================================
LIVE ACTIVITY
===================================== */

activityHTML += `

<div
class="activityItem"
onclick="openOrder('${orderId}')">

<div class="activityTop">

<div class="activityLeft">

<div class="activityIcon">

📦

</div>

<div>

<h4>

${order.name || "Customer"}

</h4>

<p>

${order.city || "City"}

</p>

</div>

</div>

<div class="status ${statusClass}">

${order.status || "Pending"}

</div>

</div>

<div class="summary">

<div class="summaryBox">

<span>
Amount
</span>

<h5>

₹${orderTotal}

</h5>

</div>

<div class="summaryBox">

<span>
Items
</span>

<h5>

${order.items?.length || 0}

</h5>

</div>

<div class="summaryBox">

<span>
Payment
</span>

<h5>

${order.paymentMethod || "COD"}

</h5>

</div>

</div>

</div>

`;

});

/* =====================================
UPDATE UI
===================================== */

totalOrders.innerHTML =
orderCount;

todayRevenue.innerHTML =
`₹${total}`;

adminProfit.innerHTML =
`₹${Math.floor(profit)}`;

activityFeed.innerHTML =
activityHTML;

/* =====================================
GRAPH
===================================== */

loadRevenueChart(
chartData
);

}

/* END SNAPSHOT */

);

}

/* =========================================================
USERS
========================================================= */

onSnapshot(

collection(db,"users"),

(snapshot)=>{

totalUsers.innerHTML =
snapshot.size;

}

);

/* =========================================================
PARTNERS
========================================================= */

onSnapshot(

collection(db,"partners"),

(snapshot)=>{

totalPartners.innerHTML =
snapshot.size;

}

);

/* =========================================================
OPEN ORDER
========================================================= */

window.openOrder =
(id)=>{

window.location.href =
`orders.html?id=${id}`;

};

/* =========================================================
REVENUE GRAPH
========================================================= */

function loadRevenueChart(data){

const ctx =
document.getElementById(
"revenueChart"
);

/* =====================================
DESTROY OLD
===================================== */

if(revenueChart){

revenueChart.destroy();

}

/* =====================================
NEW CHART
===================================== */

revenueChart =
new Chart(ctx, {

type:"line",

data:{

labels:data.map((_,i)=>

`Order ${i+1}`

),

datasets:[{

label:"Revenue",

data:data,

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
