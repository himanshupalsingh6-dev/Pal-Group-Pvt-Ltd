import { db }

from "../../firebase.js";

import {

collection,
onSnapshot,
doc,
updateDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* ========================================================= */

const ordersContainer =
document.getElementById(
"ordersContainer"
);

const totalOrders =
document.getElementById(
"totalOrders"
);

const pendingOrders =
document.getElementById(
"pendingOrders"
);

const assignedOrders =
document.getElementById(
"assignedOrders"
);

const deliveredOrders =
document.getElementById(
"deliveredOrders"
);

const cancelledOrders =
document.getElementById(
"cancelledOrders"
);

const codCollection =
document.getElementById(
"codCollection"
);

const activeRiders =
document.getElementById(
"activeRiders"
);

/* ========================================================= */

let allOrders = [];
let allRiders = [];

/* =========================================================
RIDER REALTIME
========================================================= */

onSnapshot(

collection(db,"riders"),

(snapshot)=>{

allRiders = [];

let active = 0;

snapshot.forEach(docSnap=>{

const rider = docSnap.data();

rider.id = docSnap.id;

allRiders.push(rider);

if(rider.online){

active++;

}

});

activeRiders.innerHTML =
active;

}
);

/* =========================================================
ORDERS REALTIME
========================================================= */

onSnapshot(

collection(db,"orders"),

(snapshot)=>{

allOrders = [];

ordersContainer.innerHTML = "";

/* ========================================================= */

let pending = 0;
let assigned = 0;
let completed = 0;
let cancelled = 0;
let cod = 0;

/* ========================================================= */

snapshot.forEach(docSnap=>{

const order =
docSnap.data();

order.id = docSnap.id;

allOrders.push(order);

/* ========================================================= */

if(order.status === "pending"){
pending++;
}

if(order.status === "assigned"){
assigned++;
}

if(order.status === "completed"){
completed++;
}

if(order.status === "cancelled"){
cancelled++;
}

if(order.paymentType === "cod"){
cod += order.total || 0;
}

});

/* ========================================================= */

totalOrders.innerHTML =
allOrders.length;

pendingOrders.innerHTML =
pending;

assignedOrders.innerHTML =
assigned;

deliveredOrders.innerHTML =
completed;

cancelledOrders.innerHTML =
cancelled;

codCollection.innerHTML =
"₹" + cod;

/* ========================================================= */

renderOrders(allOrders);

}
);

/* =========================================================
RENDER
========================================================= */

function renderOrders(data){

ordersContainer.innerHTML = "";

/* ========================================================= */

data.forEach(order=>{

ordersContainer.innerHTML += `

<div class="orderRow">

<div>
${order.orderId || order.id}
</div>

<div>
${order.customerName || '-'}
</div>

<div>
${order.address || '-'}
</div>

<div>
${order.area || '-'}
</div>

<div>
₹${order.total || 0}
</div>

<div>

<div class="status ${order.status}">
${order.status}
</div>

</div>

<div>
${order.riderName || 'Not Assigned'}
</div>

<div class="actions">

<button
class="actionBtn viewBtn"
onclick="viewOrder('${order.id}')">

View

</button>

<button
class="actionBtn assignBtn"
onclick="openAssign('${order.id}')">

Assign Rider

</button>

<button
class="actionBtn trackBtn"
onclick="trackOrder('${order.id}')">

Track Rider

</button>

</div>

</div>

`;

});

}

/* =========================================================
VIEW ORDER
========================================================= */

window.viewOrder = (id)=>{

const order =
allOrders.find(o=>o.id === id);

if(!order) return;

/* ========================================================= */

document.getElementById(
"viewModal"
).style.display = "flex";

/* ========================================================= */

document.getElementById(
"orderDetails"
).innerHTML = `

<div class="detailRow">

<div>
Customer
</div>

<div>
${order.customerName}
</div>

</div>

<div class="detailRow">

<div>
Phone
</div>

<div>
${order.phone}
</div>

</div>

<div class="detailRow">

<div>
Address
</div>

<div>
${order.address}
</div>

</div>

<div class="detailRow">

<div>
Area
</div>

<div>
${order.area}
</div>

</div>

<div class="detailRow">

<div>
Amount
</div>

<div>
₹${order.total}
</div>

</div>

<div class="detailRow">

<div>
Payment
</div>

<div>
${order.paymentType}
</div>

</div>

<div class="detailRow">

<div>
Status
</div>

<div>
${order.status}
</div>

</div>

<div class="detailRow">

<div>
Assigned Rider
</div>

<div>
${order.riderName || 'Not Assigned'}
</div>

</div>

`;

};

/* =========================================================
ASSIGN MODAL
========================================================= */

window.openAssign = (orderId)=>{

document.getElementById(
"assignModal"
).style.display = "flex";

/* ========================================================= */

const ridersList =
document.getElementById(
"ridersList"
);

ridersList.innerHTML = "";

/* ========================================================= */

allRiders.forEach(rider=>{

ridersList.innerHTML += `

<div class="riderCard">

<div>

<div style="
font-size:18px;
font-weight:900;
margin-bottom:8px;
">

${rider.name}

</div>

<div>

${rider.vehicle || 'Bike'}

</div>

<div>

${rider.currentOrders || 0}
Current Orders

</div>

</div>

<button
class="assignNowBtn"
onclick="assignRider('${orderId}','${rider.id}','${rider.name}')">

Assign

</button>

</div>

`;

});

};

/* =========================================================
ASSIGN RIDER
========================================================= */

window.assignRider =
async(orderId,riderId,riderName)=>{

await updateDoc(

doc(db,"orders",orderId),

{

riderId,
riderName,
status:"assigned"

}

);

/* ========================================================= */

document.getElementById(
"assignModal"
).style.display = "none";

};

/* =========================================================
AI AUTO ASSIGN
========================================================= */

window.autoAssignOrders =
async()=>{

const pendingOrders =

allOrders.filter(
o=>o.status === "pending"
);

/* ========================================================= */

pendingOrders.forEach(async(order)=>{

const onlineRider =

allRiders.find(
r=>r.online
);

if(onlineRider){

await updateDoc(

doc(db,"orders",order.id),

{

riderId:onlineRider.id,
riderName:onlineRider.name,
status:"assigned"

}

);

}

});

};

/* =========================================================
TRACK ORDER
========================================================= */

window.trackOrder = (id)=>{

window.location.href =
`tracking.html?order=${id}`;

};

/* =========================================================
SEARCH
========================================================= */

document.getElementById(
"searchInput"
).addEventListener(
"keyup",
filterOrders
);

document.getElementById(
"statusFilter"
).addEventListener(
"change",
filterOrders
);

/* ========================================================= */

function filterOrders(){

const search =

document.getElementById(
"searchInput"
).value.toLowerCase();

const status =

document.getElementById(
"statusFilter"
).value;

/* ========================================================= */

const filtered =

allOrders.filter(order=>{

const matchSearch =

(order.orderId || '')
.toLowerCase()
.includes(search);

const matchStatus =

status
?
order.status === status
:
true;

return (
matchSearch &&
matchStatus
);

});

/* ========================================================= */

renderOrders(filtered);

}

/* =========================================================
CLOSE MODAL
========================================================= */

window.onclick = (e)=>{

if(e.target.id === "viewModal"){

document.getElementById(
"viewModal"
).style.display = "none";

}

if(e.target.id === "assignModal"){

document.getElementById(
"assignModal"
).style.display = "none";

}

};
