/* =========================================================
FILE : admin/js/ai-assignment.js
QUICKPRESS AI RIDER ASSIGNMENT SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
query,
where,
onSnapshot,
getDocs,
doc,
updateDoc

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

const ordersContainer =
document.getElementById(
"ordersContainer"
);

const pendingOrders =
document.getElementById(
"pendingOrders"
);

const availableRiders =
document.getElementById(
"availableRiders"
);

const assignedToday =
document.getElementById(
"assignedToday"
);

/* =========================================================
DATA
========================================================= */

let totalAssigned = 0;

/* =========================================================
LIVE ORDERS
========================================================= */

onSnapshot(

query(
collection(db,"orders"),
where("status","==","Pending")
),

(snapshot)=>{

ordersContainer.innerHTML = "";

/* ========================================= */

let pending = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const order = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

pending++;

/* ========================================= */

renderOrder(order);

});

/* ========================================= */

pendingOrders.innerHTML =
pending;

}

/* END */

);

/* =========================================================
LIVE RIDERS
========================================================= */

onSnapshot(

query(
collection(db,"riders"))
,

(snapshot)=>{

let available = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const rider =
docSnap.data();

/* ========================================= */

if(
rider.status === "Available"
){

available++;

}

});

/* ========================================= */

availableRiders.innerHTML =
available;

}

/* END */

);

/* =========================================================
RENDER ORDER
========================================================= */

function renderOrder(order){

let badgeClass =
"pending";

/* ========================================= */

if(order.assignedRider){

badgeClass =
"assigned";

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

<!-- CITY -->

<div>

${order.city || "--"}

</div>

<!-- RIDER -->

<div>

${order.assignedRider || "--"}

</div>

<!-- STATUS -->

<div>

<div class="badge ${badgeClass}">

${order.assignedRider
? "Assigned"
: "Pending"}

</div>

</div>

<!-- ACTION -->

<div>

<button
class="actionBtn"
onclick="assignRider('${order.id}')">

Assign

</button>

</div>

</div>

`;

ordersContainer.innerHTML += row;

}

/* =========================================================
MANUAL ASSIGN
========================================================= */

window.assignRider =
async(orderId)=>{

const riderName =
prompt(
"Enter Rider Name"
);

if(!riderName){

return;

}

/* ========================================= */

await updateDoc(

doc(
db,
"orders",
orderId
),

{

assignedRider:riderName,

status:"Assigned"

}

);

/* ========================================= */

totalAssigned++;

assignedToday.innerHTML =
totalAssigned;

/* ========================================= */

alert(
"Rider Assigned"
);

};

/* =========================================================
AI AUTO ASSIGN
========================================================= */

window.runAI =
async()=>{

/* =========================================
GET AVAILABLE RIDERS
========================================= */

const ridersSnapshot =
await getDocs(

query(
collection(db,"riders"),
where("status","==","Available")
)

);

/* ========================================= */

const riders = [];

ridersSnapshot.forEach((docSnap)=>{

riders.push({

id:docSnap.id,
...docSnap.data()

});

});

/* ========================================= */

if(riders.length === 0){

alert(
"No Available Riders"
);

return;

}

/* =========================================
GET PENDING ORDERS
========================================= */

const ordersSnapshot =
await getDocs(

query(
collection(db,"orders"),
where("status","==","Pending")
)

);

/* ========================================= */

let index = 0;

/* ========================================= */

for(const orderDoc of ordersSnapshot.docs){

const rider =
riders[index % riders.length];

/* ========================================= */

await updateDoc(

doc(
db,
"orders",
orderDoc.id
),

{

assignedRider:
rider.name,

assignedRiderId:
rider.id,

status:"Assigned"

}

);

/* ========================================= */

index++;

totalAssigned++;

}

/* ========================================= */

assignedToday.innerHTML =
totalAssigned;

/* ========================================= */

alert(
"AI Assignment Completed"
);

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress AI Assignment Active"
);
