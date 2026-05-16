/* =========================================================
FILE : admin/js/dashboard.js
QUICKPRESS ENTERPRISE DASHBOARD V3
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
AUTH
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

const totalUsers =
document.getElementById(
"totalUsers"
);

const totalPartners =
document.getElementById(
"totalPartners"
);

const onlineRiders =
document.getElementById(
"onlineRiders"
);

const liveOrders =
document.getElementById(
"liveOrders"
);

const activityFeed =
document.getElementById(
"activityFeed"
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

const mumbaiRevenue =
document.getElementById(
"mumbaiRevenue"
);

/* =========================================================
CARD REDIRECTS
========================================================= */

document.getElementById(
"totalOrders"
).onclick = ()=>{

window.location.href =
"orders.html";

};

document.getElementById(
"todayRevenue"
).onclick = ()=>{

window.location.href =
"payments.html";

};

document.getElementById(
"totalUsers"
).onclick = ()=>{

window.location.href =
"users.html";

};

document.getElementById(
"totalPartners"
).onclick = ()=>{

window.location.href =
"partners.html";

};

document.getElementById(
"onlineRiders"
).onclick = ()=>{

window.location.href =
"riders.html";

};

/* =========================================================
CITY SELECTOR
========================================================= */

const citySelector =
document.getElementById(
"citySelector"
);

let selectedCity = "All";

/* =========================================================
CITY CHANGE
========================================================= */

if(citySelector){

citySelector.addEventListener(
"change",
()=>{

selectedCity =
citySelector.value;

loadDashboard();

}
);

}

/* =========================================================
LOAD DASHBOARD
========================================================= */

function loadDashboard(){

/* =====================================
LIVE ORDERS
===================================== */

onSnapshot(

query(
collection(db,"orders"),
orderBy("createdAt","desc"),
limit(20)
),

(snapshot)=>{

let ordersHTML = "";

let total = 0;

let kasganj = 0;
let noida = 0;
let delhi = 0;
let mumbai = 0;

let orderCount = 0;

let chartData = [];

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

total +=
Number(order.total || 0);

chartData.push(
Number(order.total || 0)
);

/* =====================================
CITY REVENUE
===================================== */

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

if(order.city === "Mumbai"){

mumbai +=
Number(order.total || 0);

}

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
order.status === "Out For Delivery"
){

statusClass =
"delivery";

}

/* =====================================
LIVE ORDERS HTML
===================================== */

ordersHTML += `

<div
class="liveItem"
onclick="openOrder('${orderId}')"
style="cursor:pointer;">

<div class="liveLeft">

<h4>

${order.name || "Customer"}

</h4>

<p>

${order.city || ""}
•
₹${order.total || 0}
•
${order.items?.length || 0} Items

</p>

</div>

<div class="status ${statusClass}">

${order.status || "Pending"}

</div>

</div>

`;

});

/* =====================================
UPDATE UI
===================================== */

liveOrders.innerHTML =
ordersHTML;

totalOrders.innerHTML =
orderCount;

todayRevenue.innerHTML =
`₹${total}`;

kasganjRevenue.innerHTML =
`₹${kasganj}`;

noidaRevenue.innerHTML =
`₹${noida}`;

delhiRevenue.innerHTML =
`₹${delhi}`;

mumbaiRevenue.innerHTML =
`₹${mumbai}`;

/* =====================================
REAL GRAPH
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
RIDERS
========================================================= */

onSnapshot(

collection(db,"riders"),

(snapshot)=>{

onlineRiders.innerHTML =
snapshot.size;

}

);

/* =========================================================
LIVE ACTIVITY
========================================================= */

onSnapshot(

query(
collection(db,"orders"),
orderBy("createdAt","desc"),
limit(8)
),

(snapshot)=>{

let activityHTML = "";

snapshot.forEach((doc)=>{

const order =
doc.data();

activityHTML += `

<div class="activity">

<div class="activityIcon">

🟢

</div>

<div>

<h4>

${order.name || "Customer"}

Placed New Order

</h4>

<p>

${order.city || ""}
•
₹${order.total || 0}
•
${order.status || "Pending"}

</p>

</div>

</div>

`;

});

activityFeed.innerHTML =
activityHTML;

}

);

/* =========================================================
ORDER OPEN
========================================================= */

window.openOrder =
(id)=>{

window.location.href =
`orders.html?id=${id}`;

};

/* =========================================================
REAL REVENUE GRAPH
========================================================= */

let revenueChart;

function loadRevenueChart(data){

const ctx =
document.getElementById(
"revenueChart"
);

if(revenueChart){

revenueChart.destroy();

}

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
START
========================================================= */

loadDashboard();
