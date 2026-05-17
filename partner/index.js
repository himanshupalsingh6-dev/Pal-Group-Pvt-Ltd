/* =========================================================
FILE : partner/index.js
QUICKPRESS PARTNER HOME SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
query,
where,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
LOGIN CHECK
========================================================= */

const partnerLogin =
localStorage.getItem(
"quickpress_partner"
);

if(partnerLogin !== "true"){

window.location.href =
"login.html";

}

/* =========================================================
PARTNER DATA
========================================================= */

const partnerId =
localStorage.getItem(
"quickpress_partner_id"
);

const partnerName =
localStorage.getItem(
"quickpress_partner_name"
)
||
"Partner";

const partnerCity =
localStorage.getItem(
"quickpress_partner_city"
)
||
"City";

/* =========================================================
ELEMENTS
========================================================= */

const avatar =
document.getElementById(
"avatar"
);

const welcomeName =
document.getElementById(
"welcomeName"
);

const partnerNameText =
document.getElementById(
"partnerName"
);

const partnerCityText =
document.getElementById(
"partnerCity"
);

const todayOrders =
document.getElementById(
"todayOrders"
);

const completedOrders =
document.getElementById(
"completedOrders"
);

const revenue =
document.getElementById(
"revenue"
);

const activeRiders =
document.getElementById(
"activeRiders"
);

const ordersContainer =
document.getElementById(
"ordersContainer"
);

/* =========================================================
PROFILE
========================================================= */

avatar.innerHTML =
partnerName
.charAt(0)
.toUpperCase();

welcomeName.innerHTML =
partnerName;

partnerNameText.innerHTML =
partnerName;

partnerCityText.innerHTML =
partnerCity;

/* =========================================================
LIVE ORDERS
========================================================= */

onSnapshot(

query(
collection(db,"orders"),
where(
"partnerId",
"==",
partnerId
)
),

(snapshot)=>{

ordersContainer.innerHTML = "";

/* ========================================= */

let total = 0;

let completed = 0;

let totalRevenue = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const order = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

total++;

totalRevenue +=
Number(
order.amount || 0
);

/* ========================================= */

if(
order.status === "Completed"
){

completed++;

}

/* ========================================= */

renderOrder(
order
);

});

/* ========================================= */

todayOrders.innerHTML =
total;

completedOrders.innerHTML =
completed;

revenue.innerHTML =
`₹${totalRevenue}`;

}

/* END */

);

/* =========================================================
LIVE RIDERS
========================================================= */

onSnapshot(

query(
collection(db,"riders"),
where(
"partnerId",
"==",
partnerId
)
),

(snapshot)=>{

let active = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const rider =
docSnap.data();

/* ========================================= */

if(
rider.status === "Available"
||
rider.status === "On Delivery"
){

active++;

}

});

/* ========================================= */

activeRiders.innerHTML =
active;

}

/* END */

);

/* =========================================================
RENDER ORDER
========================================================= */

function renderOrder(
order
){

let badgeClass =
"pending";

/* ========================================= */

if(
order.status === "Completed"
){

badgeClass =
"completed";

}

/* ========================================= */

const row = `

<div class="orderRow">

<!-- ORDER -->

<div>

#${order.orderId || order.id}

</div>

<!-- CUSTOMER -->

<div>

<b>

${order.customerName || "--"}

</b>

<br>

${order.mobile || "--"}

</div>

<!-- AMOUNT -->

<div>

₹${order.amount || 0}

</div>

<!-- STATUS -->

<div>

<div class="badge ${badgeClass}">

${order.status || "Pending"}

</div>

</div>

</div>

`;

ordersContainer.innerHTML += row;

}

/* =========================================================
LOGOUT
========================================================= */

window.logoutPartner =
()=>{

const confirmLogout =
confirm(
"Logout Partner Panel?"
);

/* ========================================= */

if(!confirmLogout){

return;

}

/* ========================================= */

localStorage.removeItem(
"quickpress_partner"
);

localStorage.removeItem(
"quickpress_partner_id"
);

localStorage.removeItem(
"quickpress_partner_name"
);

localStorage.removeItem(
"quickpress_partner_email"
);

localStorage.removeItem(
"quickpress_partner_city"
);

/* ========================================= */

window.location.href =
"login.html";

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Partner Dashboard Active"
);