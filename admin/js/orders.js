/* =========================================================
FILE : admin/js/orders.js
FIXED FULL WORKING VERSION
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
FILTERS
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

const option =
document.createElement(
"option"
);

option.value = state;
option.innerText = state;

stateFilter.appendChild(
option
);

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

const option =
document.createElement(
"option"
);

option.value = city;
option.innerText = city;

cityFilter.appendChild(
option
);

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

renderOrders();

}
);

cityFilter.addEventListener(
"change",
()=>{

selectedCity =
cityFilter.value;

renderOrders();

}
);

statusFilter.addEventListener(
"change",
()=>{

selectedStatus =
statusFilter.value;

renderOrders();

}
);

searchInput.addEventListener(
"input",
()=>{

searchValue =
searchInput.value
.toLowerCase();

renderOrders();

}
);

/* =========================================================
GLOBAL DATA
========================================================= */

let allOrders = [];

/* =========================================================
REALTIME ORDERS
========================================================= */

onSnapshot(

query(
collection(db,"orders"),
orderBy("createdAt","desc")
),

(snapshot)=>{

allOrders = [];

snapshot.forEach((docSnap)=>{

allOrders.push({

id:docSnap.id,
...docSnap.data()

});

});

renderOrders();

}

/* END */

);

/* =========================================================
RENDER ORDERS
========================================================= */

function renderOrders(){

let html = "";

let total = 0;
let pending = 0;
let running = 0;
let delivered = 0;

/* =====================================
LOOP
===================================== */

allOrders.forEach((order)=>{

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
PLACED TIME
===================================== */

let placedTime = "";

if(order.createdAt?.seconds){

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

${placedTime || "--"}

</h4>

</div>

</div>

<!-- ASSIGN -->

<div class="section">

<div class="sectionTitle">

Assignment

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

</div>

</div>

<!-- BUTTONS -->

<div class="btnGrid">

<button
class="btn viewBtn"
onclick="viewOrder('${order.id}')">

Summary

</button>

<button
class="btn assignBtn"
onclick="assignOrder('${order.id}')">

Assign

</button>

<button
class="btn updateBtn"
onclick="updateStatus(
'${order.id}',
'${order.status || "Pending"}'
)">

Status

</button>

</div>

</div>

`;

});

/* =====================================
UPDATE STATS
===================================== */

totalOrders.innerHTML =
allOrders.length;

pendingOrders.innerHTML =
pending;

runningOrders.innerHTML =
running;

deliveredOrders.innerHTML =
delivered;

totalRevenue.innerHTML =
`₹${total}`;

/* =====================================
SHOW
===================================== */

orderGrid.innerHTML =
html;

}

/* =========================================================
LOAD STATES
========================================================= */

loadStates();
