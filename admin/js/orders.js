/* =========================================================
FILE : admin/js/orders.js
QUICKPRESS ENTERPRISE ORDER SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot,
doc,
updateDoc,
query,
orderBy,
getDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import {

getAllStates,
getCitiesByState

}

from

"./all-india-cities.js";

/* =========================================================
ELEMENTS
========================================================= */

const orderGrid =
document.getElementById(
"orderGrid"
);

const stateFilter =
document.getElementById(
"stateFilter"
);

const cityFilter =
document.getElementById(
"cityFilter"
);

const statusFilter =
document.getElementById(
"statusFilter"
);

const searchInput =
document.getElementById(
"searchInput"
);

/* =========================================================
STATS
========================================================= */

const totalOrders =
document.getElementById(
"totalOrders"
);

const pendingOrders =
document.getElementById(
"pendingOrders"
);

const runningOrders =
document.getElementById(
"runningOrders"
);

const deliveredOrders =
document.getElementById(
"deliveredOrders"
);

const totalRevenue =
document.getElementById(
"totalRevenue"
);

/* =========================================================
FILTER VALUES
========================================================= */

let selectedState = "All";
let selectedCity = "All";
let selectedStatus = "All";
let searchValue = "";

/* =========================================================
LOAD STATES
========================================================= */

function loadStates(){

const states =
getAllStates();

states.forEach((state)=>{

stateFilter.innerHTML += `

<option value="${state}">
${state}
</option>

`;

});

}

/* =========================================================
LOAD CITIES
========================================================= */

function loadCities(state){

cityFilter.innerHTML = `

<option value="All">
All Cities
</option>

`;

if(state === "All") return;

const cities =
getCitiesByState(state);

cities.forEach((city)=>{

cityFilter.innerHTML += `

<option value="${city}">
${city}
</option>

`;

});

}

/* =========================================================
FILTER EVENTS
========================================================= */

stateFilter.addEventListener(
"change",
()=>{

selectedState =
stateFilter.value;

loadCities(selectedState);

loadOrders();

}
);

cityFilter.addEventListener(
"change",
()=>{

selectedCity =
cityFilter.value;

loadOrders();

}
);

statusFilter.addEventListener(
"change",
()=>{

selectedStatus =
statusFilter.value;

loadOrders();

}
);

searchInput.addEventListener(
"input",
()=>{

searchValue =
searchInput.value
.toLowerCase();

loadOrders();

}
);

/* =========================================================
LOAD ORDERS
========================================================= */

function loadOrders(){

onSnapshot(

query(
collection(db,"orders"),
orderBy("createdAt","desc")
),

(snapshot)=>{

let html = "";

let total = 0;
let pending = 0;
let running = 0;
let delivered = 0;

/* =====================================
LOOP
===================================== */
/* =========================================================
REPLACE ITEMS LOOP
FILE : admin/js/orders.js
INSIDE viewOrder()
========================================================= */

let itemsHTML = "";

let itemsTotal = 0;

(order.items || [])
.forEach((item)=>{

const qty =
Number(item.qty || 1);

const price =
Number(item.price || 0);

const total =
qty * price;

itemsTotal += total;

itemsHTML += `

<div class="item">

<div>

${item.name}

<br>

<small>

Qty :
${qty}

</small>

</div>

<div>

₹${price}
x ${qty}

<br>

<b>

₹${total}

</b>

</div>

</div>

`;

});
/* =====================================
FILTERS
===================================== */

if(
selectedState !== "All"
&&
order.state !== selectedState
){

return;

}

if(
selectedCity !== "All"
&&
order.city !== selectedCity
){

return;

}

if(
selectedStatus !== "All"
&&
order.status !== selectedStatus
){

return;

}

if(
searchValue
&&
!order.name
?.toLowerCase()
.includes(searchValue)
){

return;

}

/* =====================================
STATS
===================================== */

total +=
Number(order.total || 0);

if(order.status === "Pending"){

pending++;

}

if(
order.status === "Pickup"
||
order.status === "Ironing"
||
order.status === "Out For Delivery"
){

running++;

}

if(order.status === "Delivered"){

delivered++;

}

/* =====================================
STATUS CLASS
===================================== */

let statusClass =
"pending";

if(order.status === "Pickup"){

statusClass =
"pickup";

}

if(order.status === "Ironing"){

statusClass =
"ironing";

}

if(order.status === "Out For Delivery"){

statusClass =
"delivery";

}

if(order.status === "Delivered"){

statusClass =
"delivered";

}

/* =====================================
LOCK SYSTEM
===================================== */

const locked =
order.locked === true;

/* =====================================
PLACED TIME
===================================== */

let placedTime = "";

if(order.createdAt){

const date =
new Date(
order.createdAt.seconds * 1000
);

placedTime =
date.toLocaleString();

}

/* =====================================
CARD
===================================== */

html += `

<div class="orderCard">

<!-- TOP -->

<div class="orderTop">

<div class="userInfo">

<div class="avatar">

📦

</div>

<div>

<h3>

${order.name || "Customer"}

</h3>

<p>

${order.city || ""}
•
${order.state || ""}

</p>

</div>

</div>

<div class="status ${statusClass}">

${order.status || "Pending"}

</div>

</div>

<!-- SUMMARY -->

<div class="summaryGrid">

<div class="summaryBox">

<span>
Amount
</span>

<h4>

₹${order.total || 0}

</h4>

</div>

<div class="summaryBox">

<span>
Items
</span>

<h4>

${order.items?.length || 0}

</h4>

</div>

<div class="summaryBox">

<span>
Payment
</span>

<h4>

${order.paymentMethod || "COD"}

</h4>

</div>

<div class="summaryBox">

<span>
Placed
</span>

<h4>

${placedTime}

</h4>

</div>

</div>

<!-- TRACK -->

<div class="section">

<div class="sectionTitle">

Assignment Details

</div>

<div class="track">

<div class="trackBox">

<span>
Partner
</span>

<h5>

${order.partnerName || "Not Assigned"}

</h5>

</div>

<div class="trackBox">

<span>
Rider
</span>

<h5>

${order.riderName || "Not Assigned"}

</h5>

</div>

<div class="trackBox">

<span>
Locked
</span>

<h5>

${locked ? "YES" : "NO"}

</h5>

</div>

<div class="trackBox">

<span>
Order ID
</span>

<h5>

${orderId}

</h5>

</div>

</div>

</div>

<!-- BUTTONS -->

<div class="btnGrid">

<button
class="btn callBtn"
onclick="window.open('tel:${order.mobile || ""}')">

Customer

</button>

<button
class="btn callBtn"
onclick="window.open('tel:${order.partnerMobile || ""}')">

Partner

</button>

<button
class="btn callBtn"
onclick="window.open('tel:${order.riderMobile || ""}')">

Rider

</button>

<button
class="btn viewBtn"
onclick="viewOrder('${orderId}')">

View

</button>

${
locked

?

`

<button
class="btn lockedBtn">

Locked

</button>

`

:

`

<button
class="btn assignBtn"
onclick="assignOrder('${orderId}')">

Assign

</button>

`

}

</div>

</div>

`;

});

/* =====================================
UPDATE STATS
===================================== */
/* =========================================================
REPLACE THIS FUNCTION
FILE : admin/js/orders.js
========================================================= */

/* =========================================================
ASSIGN ORDER ADVANCE SYSTEM
========================================================= */

window.assignOrder =
async(id)=>{

/* =====================================
FETCH PARTNERS
===================================== */

let partnerOptions = "";

const partnerSelect =
prompt(
"Enter Partner Name"
);

if(!partnerSelect){

return;

}

/* =====================================
FETCH RIDERS
===================================== */

const riderSelect =
prompt(
"Enter Rider Name"
);

if(!riderSelect){

return;

}

/* =====================================
PARTNER MOBILE
===================================== */

const partnerMobile =
prompt(
"Enter Partner Mobile"
);

/* =====================================
RIDER MOBILE
===================================== */

const riderMobile =
prompt(
"Enter Rider Mobile"
);

/* =====================================
UPDATE
===================================== */

const orderRef =
doc(db,"orders",id);

await updateDoc(orderRef,{

partnerName:
partnerSelect,

partnerMobile:
partnerMobile || "",

riderName:
riderSelect,

riderMobile:
riderMobile || "",

assigned:true,

locked:true,

status:"Pickup",

assignedAt:
new Date()
.toLocaleString()

});

alert(
"Order Assigned Successfully"
);

};
/* =====================================
UPDATE GRID
===================================== */

orderGrid.innerHTML =
html;

}

);

}

/* =========================================================
ASSIGN ORDER
========================================================= */

/* =========================================================
REPLACE THIS FUNCTION
FILE : admin/js/orders.js
========================================================= */

/* =========================================================
ASSIGN ORDER ADVANCE SYSTEM
========================================================= */

window.assignOrder =
async(id)=>{

/* =====================================
FETCH PARTNERS
===================================== */

let partnerOptions = "";

const partnerSelect =
prompt(
"Enter Partner Name"
);

if(!partnerSelect){

return;

}

/* =====================================
FETCH RIDERS
===================================== */

const riderSelect =
prompt(
"Enter Rider Name"
);

if(!riderSelect){

return;

}

/* =====================================
PARTNER MOBILE
===================================== */

const partnerMobile =
prompt(
"Enter Partner Mobile"
);

/* =====================================
RIDER MOBILE
===================================== */

const riderMobile =
prompt(
"Enter Rider Mobile"
);

/* =====================================
UPDATE
===================================== */

const orderRef =
doc(db,"orders",id);

await updateDoc(orderRef,{

partnerName:
partnerSelect,

partnerMobile:
partnerMobile || "",

riderName:
riderSelect,

riderMobile:
riderMobile || "",

assigned:true,

locked:true,

status:"Pickup",

assignedAt:
new Date()
.toLocaleString()

});

alert(
"Order Assigned Successfully"
);

};
/* =====================================
LOCK ORDER
===================================== */

await updateDoc(orderRef,{

partnerName,
partnerMobile,

riderName,
riderMobile,

assigned:true,
locked:true,

assignedAt:
new Date()
.toLocaleString()

});

alert(
"Order Assigned Successfully"
);

};

/* =========================================================
VIEW ORDER
========================================================= */

window.viewOrder =
async(id)=>{

const modal =
document.getElementById(
"summaryModal"
);

const content =
document.getElementById(
"summaryContent"
);

const orderRef =
doc(db,"orders",id);

const orderSnap =
await getDoc(orderRef);

const order =
orderSnap.data();

/* =====================================
ITEMS
===================================== */

let itemsHTML = "";

(order.items || [])
.forEach((item)=>{

itemsHTML += `

<div class="item">

<div>

${item.name}

</div>

<div>

${item.qty || 1}
x ₹${item.price || 0}

</div>

</div>

`;

});

/* =====================================
SUMMARY
===================================== */

content.innerHTML = `

<div class="section">

<div class="sectionTitle">

Customer Details

</div>

<div class="track">

<div class="trackBox">

<span>
Customer Name
</span>

<h5>

${order.name || ""}

</h5>

</div>

<div class="trackBox">

<span>
Mobile
</span>

<h5>

${order.mobile || ""}

</h5>

</div>

<div class="trackBox">

<span>
State
</span>

<h5>

${order.state || ""}

</h5>

</div>

<div class="trackBox">

<span>
City
</span>

<h5>

${order.city || ""}

</h5>

</div>

</div>

</div>

<div class="section">

<div class="sectionTitle">

Address

</div>

<p>

${order.address || ""}

</p>

</div>

<div class="section">

<div class="sectionTitle">

Order Items

</div>

${itemsHTML}

</div>

<div class="section">

<div class="sectionTitle">

Assignment Details

</div>

<div class="track">

<div class="trackBox">

<span>
Partner
</span>

<h5>

${order.partnerName || ""}

</h5>

</div>

<div class="trackBox">

<span>
Partner Mobile
</span>

<h5>

${order.partnerMobile || ""}

</h5>

</div>

<div class="trackBox">

<span>
Rider
</span>

<h5>

${order.riderName || ""}

</h5>

</div>

<div class="trackBox">

<span>
Rider Mobile
</span>

<h5>

${order.riderMobile || ""}

</h5>

</div>

</div>

</div>

<div class="section">

<div class="sectionTitle">

Payment Summary

</div>

<div class="summaryGrid">

<div class="summaryBox">

<span>
Subtotal
</span>

<h4>

₹${order.subtotal || 0}

</h4>

</div>

<div class="summaryBox">

<span>
Delivery Charge
</span>

<h4>

₹${order.deliveryCharge || 0}

</h4>

</div>

<div class="summaryBox">

<span>
GST
</span>

<h4>

₹${order.gst || 0}

</h4>

</div>

<div class="summaryBox">

<span>
Total
</span>

<h4>

₹${order.total || 0}

</h4>

</div>

</div>

</div>

<div class="section">

<div class="sectionTitle">

Timeline

</div>

<div class="track">

<div class="trackBox">

<span>
Placed At
</span>

<h5>

${order.placedAt || ""}

</h5>

</div>

<div class="trackBox">

<span>
Assigned At
</span>

<h5>

${order.assignedAt || ""}

</h5>

</div>

<div class="trackBox">

<span>
Pickup Time
</span>

<h5>

${order.pickupTime || ""}

</h5>

</div>

<div class="trackBox">

<span>
Delivered Time
</span>

<h5>

${order.deliveredTime || ""}

</h5>

</div>

</div>

</div>

`;

modal.style.display =
"flex";

};

/* =========================================================
CLOSE MODAL
========================================================= */

window.closeSummary =
()=>{

document.getElementById(
"summaryModal"
).style.display = "none";

};

/* =========================================================
START
========================================================= */

loadStates();

loadOrders();
