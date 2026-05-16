/* =========================================================
FILE : admin/js/dashboard.js
QUICKPRESS ENTERPRISE DASHBOARD V2
========================================================= */

/* =========================================================
IMPORT FIREBASE
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
LIVE ORDERS
========================================================= */

onSnapshot(

query(
collection(db,"orders"),
orderBy("createdAt","desc"),
limit(8)
),

(snapshot)=>{

let ordersHTML = "";

let total = 0;

let kasganj = 0;
let noida = 0;
let delhi = 0;
let mumbai = 0;

snapshot.forEach((doc)=>{

const order =
doc.data();

total +=
Number(order.total || 0);

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
STATUS CLASS
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
ORDER HTML
===================================== */

ordersHTML += `

<div class="liveItem">

<div class="liveLeft">

<h4>
${order.name || "Customer"}
</h4>

<p>
${order.city || ""}
• ₹${order.total || 0}
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
snapshot.size;

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

loadRevenueChart(total);

}

/* END SNAPSHOT */

);

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
ACTIVITY FEED
========================================================= */

onSnapshot(

query(
collection(db,"orders"),
orderBy("createdAt","desc"),
limit(5)
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
New Order From
${order.name || "Customer"}
</h4>

<p>

${order.city || ""}
• ₹${order.total || 0}
• ${order.status || "Pending"}

</p>

</div>

</div>

`;

});

activityFeed.innerHTML =
activityHTML;

}

/* END */

);

/* =========================================================
REVENUE GRAPH
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
2800,
4200,
5900,
7600,
10400,
total || 15000
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
LIVE CLOCK
========================================================= */

setInterval(()=>{

const now =
new Date();

console.log(now);

},1000);
