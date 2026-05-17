/* =========================================================
FILE : admin/js/orders.js
QUICKPRESS ENTERPRISE ORDERS PANEL
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot,
query,
orderBy,
doc,
updateDoc,
getDocs

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
AUTH CHECK
========================================================= */

const adminLogin =
localStorage.getItem(
"quickpress_admin"
);

if(adminLogin !== "true"){

window.location.href =
"login.html";

}

/* =========================================================
ELEMENTS
========================================================= */
/* =========================================================
ADD THESE ELEMENTS
TOP OF orders.js
========================================================= */

const totalOrders =
document.getElementById(
"totalOrders"
);

const pendingOrders =
document.getElementById(
"pendingOrders"
);

const preparingOrders =
document.getElementById(
"preparingOrders"
);

const deliveryOrders =
document.getElementById(
"deliveryOrders"
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
INSIDE SNAPSHOT
ADD THIS
========================================================= */

let revenue = 0;

let pending = 0;
let preparing = 0;
let delivery = 0;
let delivered = 0;

/* =========================================================
INSIDE FOREACH
========================================================= */

revenue +=
Number(order.total || 0);

if(order.status === "Pending"){

pending++;

}

if(order.status === "Preparing"){

preparing++;

}

if(order.status === "Out For Delivery"){

delivery++;

}

if(order.status === "Delivered"){

delivered++;

}

/* =========================================================
AFTER FOREACH
========================================================= */

totalOrders.innerHTML =
allOrders.length;

pendingOrders.innerHTML =
pending;

preparingOrders.innerHTML =
preparing;

deliveryOrders.innerHTML =
delivery;

deliveredOrders.innerHTML =
delivered;

totalRevenue.innerHTML =
`₹${revenue}`;

/* =========================================================
REPLACE BUTTON GRID
========================================================= */

<div class="btnGrid">

<button
class="btn viewBtn"
onclick="viewOrder('${order.id}')">

View

</button>

<button
class="btn assignBtn"
onclick="assignOrder('${order.id}')">

Assign

</button>

<button
class="btn statusBtn"
onclick="updateStatus('${order.id}')">

Status

</button>

</div>

/* =========================================================
VIEW PAGE
========================================================= */

window.viewOrder =
(id)=>{

window.location.href =
`order-view.html?id=${id}`;

};

/* =========================================================
ASSIGN SYSTEM
========================================================= */

window.assignOrder =
async(id)=>{

const partner =
prompt(
"Enter Partner Name"
);

const rider =
prompt(
"Enter Rider Name"
);

if(!partner || !rider){

return;

}

await updateDoc(

doc(db,"orders",id),

{

partnerName:partner,
riderName:rider,
assigned:true

}

);

alert(
"Assigned Successfully"
);

};

/* =========================================================
STATUS UPDATE
========================================================= */

window.updateStatus =
async(id)=>{

const status =
prompt(

`Enter Status:

Pending
Preparing
Out For Delivery
Delivered`

);

if(!status){

return;

}

await updateDoc(

doc(db,"orders",id),

{
status:status
}

);

alert(
"Status Updated"
);

};
const ordersGrid =
document.getElementById(
"ordersGrid"
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

const notificationCount =
document.getElementById(
"notificationCount"
);

/* =========================================================
DATA
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

let pending = 0;

let cities = new Set();

/* ========================================= */

snapshot.forEach((docSnap)=>{

const order = {

id:docSnap.id,
...docSnap.data()

};

allOrders.push(order);

/* ========================================= */

if(order.city){

cities.add(order.city);

}

/* ========================================= */

if(order.status === "Pending"){

pending++;

}

});

/* ========================================= */

notificationCount.innerHTML =
pending;

/* ========================================= */

loadCities([...cities]);

/* ========================================= */

renderOrders();

}

/* END */

);

/* =========================================================
LOAD CITIES
========================================================= */

function loadCities(cities){

const current =
cityFilter.value;

cityFilter.innerHTML = `

<option value="All">
All Cities
</option>

`;

cities.forEach((city)=>{

cityFilter.innerHTML += `

<option value="${city}">
${city}
</option>

`;

});

cityFilter.value =
current;

}

/* =========================================================
RENDER ORDERS
========================================================= */

function renderOrders(){

ordersGrid.innerHTML = "";

/* ========================================= */

const search =
searchInput.value
.toLowerCase();

const selectedCity =
cityFilter.value;

const selectedStatus =
statusFilter.value;

/* ========================================= */

allOrders.forEach((order)=>{

/* =====================================
SEARCH
===================================== */
if(
search &&
!(
(order.name || "")
.toLowerCase()
.includes(search)
)
){

return;

}
/* =====================================
CITY
===================================== */

if(
selectedCity !== "All"
&&
order.city !== selectedCity
){

return;

}

/* =====================================
STATUS
===================================== */

if(
selectedStatus !== "All"
&&
order.status !== selectedStatus
){

return;

}

/* =====================================
STATUS CLASS
===================================== */

let statusClass =
"pending";

if(order.status === "Preparing"){

statusClass =
"preparing";

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
ITEMS
===================================== */

let itemsHTML = "";

let totalItems = 0;

(order.items || [])
.forEach((item)=>{

totalItems +=
Number(item.qty || 1);

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
TIME
===================================== */

let orderTime = "--";

if(order.createdAt?.seconds){

orderTime =
new Date(
order.createdAt.seconds * 1000
).toLocaleString();

}

/* =====================================
CARD
===================================== */

const card = `

<div class="orderCard">

<!-- TOP -->

<div class="cardTop">

<div class="customer">

<div class="avatar">

${order.name
?.charAt(0)
|| "U"}

</div>

<div>

<h3>

${order.name || "Customer"}

</h3>

<p>

${order.city || ""}

</p>

</div>

</div>

<div class="status ${statusClass}">

${order.status || "Pending"}

</div>

</div>

<!-- INFO -->

<div class="infoGrid">

<div class="infoBox">

<span>
Order Amount
</span>

<h4>

₹${order.total || 0}

</h4>

</div>

<div class="infoBox">

<span>
Items
</span>

<h4>

${totalItems}

</h4>

</div>

<div class="infoBox">

<span>
Payment
</span>

<h4>

${order.paymentMethod || "COD"}

</h4>

</div>

<div class="infoBox">

<span>
Order Time
</span>

<h4>

${orderTime}

</h4>

</div>

</div>

<!-- ITEMS -->

<div class="itemsBox">

<h4>
Order Items
</h4>

${itemsHTML}

</div>

<!-- ASSIGN -->

<div class="assignBox">

<h4>
Assignment
</h4>

<div class="assignGrid">

<div class="assignCard">

<span>
Partner
</span>

<h5>

${order.partnerName || "Not Assigned"}

</h5>

</div>

<div class="assignCard">

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

View

</button>

<button
class="btn assignBtn"
onclick="assignOrder('${order.id}')">

Assign

</button>

<button
class="btn statusBtn"
onclick="updateStatus('${order.id}')">

Status

</button>

</div>

</div>

`;

ordersGrid.innerHTML += card;

});

}

/* =========================================================
SEARCH EVENTS
========================================================= */

searchInput.addEventListener(
"input",
renderOrders
);

cityFilter.addEventListener(
"change",
renderOrders
);

statusFilter.addEventListener(
"change",
renderOrders
);

/* =========================================================
VIEW ORDER
========================================================= */

window.viewOrder =
(id)=>{

window.location.href =
`order-view.html?id=${id}`;

};

/* =========================================================
ASSIGN ORDER
========================================================= */

window.assignOrder =
async(id)=>{

const partner =
prompt(
"Enter Partner Name"
);

const rider =
prompt(
"Enter Rider Name"
);

if(!partner || !rider){

return;

}

await updateDoc(

doc(db,"orders",id),

{

partnerName:partner,
riderName:rider,

assigned:true

}

);

alert(
"Order Assigned"
);

};

/* =========================================================
UPDATE STATUS
========================================================= */

window.updateStatus =
async(id)=>{

const status =
prompt(

`Enter Status:

Pending
Preparing
Out For Delivery
Delivered`

);

if(!status){

return;

}

await updateDoc(

doc(db,"orders",id),

{

status:status

}

);

alert(
"Status Updated"
);

};
