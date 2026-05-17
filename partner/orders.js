/* =========================================================
FILE : partner/orders.js
QUICKPRESS PARTNER ORDERS SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
query,
where,
onSnapshot,
doc,
updateDoc

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

/* =========================================================
ELEMENTS
========================================================= */

const ordersContainer =
document.getElementById(
"ordersContainer"
);

const searchInput =
document.getElementById(
"searchInput"
);

/* =========================================================
DATA
========================================================= */

let allOrders = [];

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

allOrders = [];

/* ========================================= */

snapshot.forEach((docSnap)=>{

const order = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

allOrders.push(
order
);

/* ========================================= */

renderOrder(
order
);

});

}

/* END */

);

/* =========================================================
RENDER ORDER
========================================================= */

function renderOrder(
order
){

const search =
searchInput.value
.toLowerCase();

/* ========================================= */

if(
search
&&
!(
(order.customerName || "")
.toLowerCase()
.includes(search)
)
){

return;

}

/* ========================================= */

let badgeClass =
"pending";

/* ========================================= */

if(
order.status === "Processing"
){

badgeClass =
"processing";

}

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

<!-- DATE -->

<div>

${order.date || "--"}

</div>

<!-- ACTION -->

<div>

<button
class="actionBtn"
onclick="updateStatus('${order.id}')">

Update

</button>

</div>

</div>

`;

ordersContainer.innerHTML += row;

}

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"input",
()=>{

ordersContainer.innerHTML = "";

allOrders.forEach((order)=>{

renderOrder(order);

});

}
);

/* =========================================================
UPDATE STATUS
========================================================= */

window.updateStatus =
async(id)=>{

const status =
prompt(
"Update Status : Pending / Processing / Completed"
);

/* ========================================= */

if(!status){

return;

}

/* ========================================= */

await updateDoc(

doc(
db,
"orders",
id
),

{

status

}

);

/* ========================================= */

alert(
"Order Updated"
);

};

/* =========================================================
LOGOUT
========================================================= */

window.logoutPartner =
()=>{

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
"QuickPress Partner Orders Active"
);