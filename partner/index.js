/* =========================================================
FILE : partner/index.js
QUICKPRESS PARTNER LIVE SYSTEM
REAL FIREBASE DATA
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
PARTNER DATA
========================================================= */

const partnerId =
localStorage.getItem(
"quickpress_partner_id"
)
||
"demoPartner";

/* =========================================================
ELEMENTS
========================================================= */

const shopName =
document.querySelector(
".shopName"
);

const salesElement =
document.querySelectorAll(
".liveBox h2"
)[0];

const ordersElement =
document.querySelectorAll(
".liveBox h2"
)[1];

const emptyText =
document.querySelector(
".emptyText"
);

/* =========================================================
LIVE PARTNER INFO
========================================================= */

const partnerName =
localStorage.getItem(
"quickpress_partner_name"
)
||
"QuickPress Laundry";

shopName.innerHTML =
partnerName;

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

let totalOrders = 0;

let totalSales = 0;

let preparing = 0;

let ready = 0;

let delivered = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const order =
docSnap.data();

/* ========================================= */

totalOrders++;

totalSales +=
Number(
order.amount || 0
);

/* ========================================= */

if(
order.status === "Preparing"
){

preparing++;

}

/* ========================================= */

if(
order.status === "Ready"
){

ready++;

}

/* ========================================= */

if(
order.status === "Delivered"
){

delivered++;

}

});

/* =========================================
LIVE UPDATE
========================================= */

salesElement.innerHTML =
`₹${totalSales}`;

ordersElement.innerHTML =
totalOrders;

/* ========================================= */

emptyText.innerHTML = `

Preparing :
<b>
${preparing}
</b>

<br><br>

Ready :
<b>
${ready}
</b>

<br><br>

Delivered :
<b>
${delivered}
</b>

`;

/* ========================================= */

if(totalOrders <= 0){

emptyText.innerHTML =

"Orders will be coming your way soon 🚀";

}

}

/* END */

);

/* =========================================================
LIVE NAV COUNTS
========================================================= */

const navOrders =
document.querySelectorAll(
".navItem span"
)[1];

if(navOrders){

navOrders.innerHTML =
"Orders";

}

/* =========================================================
LIVE TIME
========================================================= */

function updateTime(){

const now =
new Date();

const hour =
now.getHours();

/* ========================================= */

const greeting =
document.querySelector(
".topLabel"
);

/* ========================================= */

if(hour < 12){

greeting.innerHTML =
"GOOD MORNING";

}

else if(hour < 18){

greeting.innerHTML =
"GOOD AFTERNOON";

}

else{

greeting.innerHTML =
"GOOD EVENING";

}

}

/* ========================================= */

updateTime();

/* =========================================================
LIVE QUICK ACTIONS
========================================================= */

const quickCards =
document.querySelectorAll(
".quickCard"
);

/* ========================================= */

quickCards[0]
.onclick =
()=>{

window.location.href =
"orders.html";

};

/* ========================================= */

quickCards[1]
.onclick =
()=>{

window.location.href =
"riders.html";

};

/* ========================================= */

quickCards[2]
.onclick =
()=>{

window.location.href =
"finance.html";

};

/* ========================================= */

quickCards[3]
.onclick =
()=>{

window.location.href =
"support.html";

};

/* =========================================================
ONLINE STATUS
========================================================= */

window.addEventListener(
"offline",
()=>{

alert(
"Internet Disconnected"
);

}
);

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Partner Live Dashboard Active"
);