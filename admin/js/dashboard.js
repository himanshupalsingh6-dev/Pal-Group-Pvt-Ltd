/* =========================================================
FILE : admin/js/dashboard.js
REALTIME ADMIN DASHBOARD
========================================================= */

import {

db

}

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

const todayOrders =
document.getElementById(
"todayOrders"
);

const pendingOrders =
document.getElementById(
"pendingOrders"
);

const completedOrders =
document.getElementById(
"completedOrders"
);

const cancelledOrders =
document.getElementById(
"cancelledOrders"
);

const totalEarnings =
document.getElementById(
"totalEarnings"
);

const walletBalance =
document.getElementById(
"walletBalance"
);

const activeRiders =
document.getElementById(
"activeRiders"
);

const activePartners =
document.getElementById(
"activePartners"
);

const liveUsers =
document.getElementById(
"liveUsers"
);

const activityContainer =
document.getElementById(
"activityContainer"
);

/* =========================================================
ORDERS REALTIME
========================================================= */

onSnapshot(

collection(db,"orders"),

(snapshot)=>{

let total = 0;
let today = 0;
let pending = 0;
let completed = 0;
let cancelled = 0;
let earnings = 0;

const todayDate =
new Date().toDateString();

/* ========================================================= */

activityContainer.innerHTML = "";

/* ========================================================= */

snapshot.forEach(docSnap=>{

const order =
docSnap.data();

/* ========================================================= */

total++;

earnings +=
order.total || 0;

/* ========================================================= */

const orderDate =

order.createdAt
?
new Date(
order.createdAt.seconds * 1000
).toDateString()
:
"";

/* ========================================================= */

if(orderDate === todayDate){

today++;

}

/* ========================================================= */

if(order.status === "pending"){

pending++;

}

if(order.status === "completed"){

completed++;

}

if(order.status === "cancelled"){

cancelled++;

}

/* =========================================================
ACTIVITY
========================================================= */

activityContainer.innerHTML += `

<div class="activityItem">

<div class="activityLeft">

<div class="activityIcon">

<i class="fa-solid fa-box"></i>

</div>

<div class="activityText">

<h4>
${order.customerName || 'Customer'}
</h4>

<p>
${order.status || 'pending'}
</p>

</div>

</div>

<div>

₹${order.total || 0}

</div>

</div>

`;

});

/* =========================================================
UPDATE UI
========================================================= */

totalOrders.innerHTML =
total;

todayOrders.innerHTML =
today;

pendingOrders.innerHTML =
pending;

completedOrders.innerHTML =
completed;

cancelledOrders.innerHTML =
cancelled;

totalEarnings.innerHTML =
"₹" + earnings;

walletBalance.innerHTML =
"₹" + earnings;

});

/* =========================================================
RIDERS
========================================================= */

onSnapshot(

collection(db,"riders"),

(snapshot)=>{

let online = 0;

snapshot.forEach(docSnap=>{

const rider =
docSnap.data();

if(rider.online){

online++;

}

});

/* ========================================================= */

activeRiders.innerHTML =
online;

}
);

/* =========================================================
PARTNERS
========================================================= */

onSnapshot(

collection(db,"partners"),

(snapshot)=>{

let online = 0;

snapshot.forEach(docSnap=>{

const partner =
docSnap.data();

if(partner.online){

online++;

}

});

/* ========================================================= */

activePartners.innerHTML =
online;

}
);

/* =========================================================
USERS
========================================================= */

onSnapshot(

collection(db,"users"),

(snapshot)=>{

liveUsers.innerHTML =
snapshot.size;

}
);

/* =========================================================
CHART
========================================================= */

const ctx =
document.getElementById(
"growthChart"
);

/* ========================================================= */

new Chart(ctx,{

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

label:"Orders",

data:[12,19,25,18,32,40,28],

borderWidth:4,

tension:.4

}]

},

options:{

responsive:true

}

});

/* =========================================================
OPEN ORDERS
========================================================= */

window.openOrders = (type)=>{

window.location.href =
`orders.html?filter=${type}`;

};
