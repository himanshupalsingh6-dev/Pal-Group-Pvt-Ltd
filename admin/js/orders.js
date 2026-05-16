/* =========================================================
FILE : admin/js/orders.js
QUICKPRESS ADVANCED ORDER SYSTEM
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
orderBy

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

snapshot.forEach((docSnap)=>{

const order =
docSnap.data();

const orderId =
docSnap.id;

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
STATUS
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
ORDER TIMER
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
LOCK SYSTEM
===================================== */

const locked =
order.locked === true;

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
Timer
</span>

<h4>

${order.deliveryTime || "0h"}

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
Placed Time
</span>

<h5>

${placedTime}

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

<button
class="btn updateBtn"
onclick="assignOrder('${orderId}')">

Assign

</button>

</div>

</div>

`;

});

orderGrid.innerHTML =
html;

}

);

}

/* =========================================================
VIEW ORDER
========================================================= */

window.viewOrder =
(id)=>{

window.location.href =
`orders.html?id=${id}`;

};

/* =========================================================
ASSIGN SYSTEM
========================================================= */

window.assignOrder =
async(id)=>{

const partnerId =
prompt("Enter Partner ID");

const riderId =
prompt("Enter Rider ID");

if(!partnerId || !riderId){

return;

}

const orderRef =
doc(db,"orders",id);

/* =====================================
LOCK ORDER
===================================== */

await updateDoc(orderRef,{

partnerId:partnerId,

riderId:riderId,

assigned:true,

locked:true,

assignedAt:new Date()

});

alert(
"Order Assigned Successfully"
);

};

/* =========================================================
START
========================================================= */

loadStates();

loadOrders();
