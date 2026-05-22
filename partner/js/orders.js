/* =========================================================
FILE : partner/js/orders.js
PARTNER ORDER SYSTEM
========================================================= */

import { db }

from "../../firebase.js";

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
SESSION
========================================================= */

const partner =

JSON.parse(
localStorage.getItem("partner")
);

/* ========================================================= */

if(!partner){

window.location.href =
"login.html";

}

/* =========================================================
ELEMENT
========================================================= */

const ordersGrid =
document.getElementById(
"ordersGrid"
);

/* =========================================================
LOAD ONLY ASSIGNED ORDERS
========================================================= */

const ordersQuery =

query(

collection(db,"orders"),

where(
"partnerId",
"==",
partner.uid
)

);

/* =========================================================
REALTIME ORDERS
========================================================= */

onSnapshot(
ordersQuery,
(snapshot)=>{

ordersGrid.innerHTML = "";

/* ========================================================= */

snapshot.forEach(docSnap=>{

const order =
docSnap.data();

const orderId =
docSnap.id;

/* ========================================================= */

ordersGrid.innerHTML += `

<div class="orderCard">

<div class="orderTop">

<div class="orderId">

#${order.orderId || "QP102"}

</div>

<div class="orderStatus ${getStatusClass(order.status)}">

${order.status || "Pending"}

</div>

</div>

<!-- =====================================================
CUSTOMER
===================================================== -->

<div class="customerBox">

<h3>
${order.customerName || "Customer"}
</h3>

<p>
📞 ${order.phone || ""}
</p>

<p>
📍 ${order.address || ""}
</p>

<p>
🏙 ${order.city || ""}
</p>

</div>

<!-- =====================================================
PRODUCTS
===================================================== -->

<div class="products">

${renderProducts(order.items || [])}

</div>

<!-- =====================================================
BOTTOM
===================================================== -->

<div class="orderBottom">

<div class="amount">

₹${order.total || 0}

</div>

<div class="actions">

<button
class="actionBtn"
onclick="updateOrderStatus('${orderId}','Pickup')">

Pickup

</button>

<button
class="actionBtn"
onclick="updateOrderStatus('${orderId}','Processing')">

Process

</button>

<button
class="actionBtn"
onclick="updateOrderStatus('${orderId}','Out For Delivery')">

Delivery

</button>

<button
class="actionBtn"
onclick="updateOrderStatus('${orderId}','Completed')">

Complete

</button>

</div>

</div>

<!-- =====================================================
TIMELINE
===================================================== -->

<div class="timeline">

<div class="step ${isStepActive(order.status,'Pending')}">

<div class="stepCircle">
1
</div>

<p>
Pending
</p>

</div>

<div class="step ${isStepActive(order.status,'Pickup')}">

<div class="stepCircle">
2
</div>

<p>
Pickup
</p>

</div>

<div class="step ${isStepActive(order.status,'Processing')}">

<div class="stepCircle">
3
</div>

<p>
Processing
</p>

</div>

<div class="step ${isStepActive(order.status,'Out For Delivery')}">

<div class="stepCircle">
4
</div>

<p>
Delivery
</p>

</div>

<div class="step ${isStepActive(order.status,'Completed')}">

<div class="stepCircle">
5
</div>

<p>
Done
</p>

</div>

</div>

</div>

`;

});

});

/* =========================================================
PRODUCTS
========================================================= */

function renderProducts(items){

let html = "";

items.forEach(item=>{

html += `

<div class="productItem">

<div class="productName">

${item.name}

</div>

<div class="productQty">

${item.qty} Qty

</div>

</div>

`;

});

return html;

}

/* =========================================================
STATUS CLASS
========================================================= */

function getStatusClass(status){

if(status === "Pending") return "pending";

if(status === "Pickup") return "pickup";

if(status === "Processing") return "processing";

if(status === "Out For Delivery") return "delivery";

if(status === "Completed") return "completed";

return "pending";

}

/* =========================================================
STEP ACTIVE
========================================================= */

function isStepActive(current,target){

const steps = [

"Pending",
"Pickup",
"Processing",
"Out For Delivery",
"Completed"

];

return

steps.indexOf(current)

>=

steps.indexOf(target)

?

"active"

:

"";

}

/* =========================================================
UPDATE STATUS
========================================================= */

window.updateOrderStatus =
async(orderId,status)=>{

try{

await updateDoc(

doc(db,"orders",orderId),

{

status:status,

updatedAt:new Date()

}

);

/* =========================================================
THIS UPDATE WILL SHOW IN:
========================================================= */

console.log(

"Updated in User App"
);

console.log(

"Updated in Admin Panel"
);

console.log(

"Updated in Partner Panel"
);

}catch(error){

console.log(error);

}

};
