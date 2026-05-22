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

const orderList =
document.getElementById(
"orderList"
);

const detailContent =
document.getElementById(
"detailContent"
);

const detailStatus =
document.getElementById(
"detailStatus"
);

const searchInput =
document.getElementById(
"searchInput"
);

/* ========================================================= */

let allOrders = [];

/* =========================================================
REALTIME ORDERS
========================================================= */

onSnapshot(

collection(db,"orders"),

(snapshot)=>{

allOrders = [];

orderList.innerHTML = "";

/* ========================================================= */

snapshot.forEach(docSnap=>{

const order = docSnap.data();

order.id = docSnap.id;

allOrders.push(order);

});

/* ========================================================= */

renderOrders(allOrders);

}
);

/* =========================================================
RENDER
========================================================= */

function renderOrders(data){

orderList.innerHTML = "";

/* ========================================================= */

data.forEach(order=>{

orderList.innerHTML += `

<div
class="orderCard"
onclick="viewOrder('${order.id}')">

<div class="orderTop">

<div class="status ${order.status}">
${order.status}
</div>

<div>

${new Date(
order.createdAt?.seconds * 1000
).toLocaleDateString()}

</div>

</div>

<div class="orderId">

ID:
${order.orderId || order.id}

</div>

<div class="orderItems">

${order.items?.length || 0}
Items

</div>

<div class="orderPrice">

₹${order.total || 0}

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
allOrders.find(
o=>o.id === id
);

/* ========================================================= */

if(!order) return;

/* ========================================================= */

detailStatus.innerHTML =
order.status;

detailStatus.className =
`status ${order.status}`;

/* ========================================================= */

let itemsHtml = "";

/* ========================================================= */

order.items?.forEach(item=>{

itemsHtml += `

<div class="detailItem">

<div>
${item.name}
</div>

<div>
₹${item.price}
</div>

</div>

`;

});

/* ========================================================= */

detailContent.innerHTML = `

<div class="detailBox">

<div class="detailItem">

<div>
Customer
</div>

<div>
${order.customerName || 'Customer'}
</div>

</div>

<div class="detailItem">

<div>
Phone
</div>

<div>
${order.phone || '-'}
</div>

</div>

<div class="detailItem">

<div>
Address
</div>

<div>
${order.address || '-'}
</div>

</div>

</div>

<div class="timeline">

<div class="step">

<div class="stepCircle">

<i class="fa-solid fa-check"></i>

</div>

<div class="stepText">
Placed
</div>

</div>

<div class="step">

<div class="stepCircle">

<i class="fa-solid fa-box"></i>

</div>

<div class="stepText">
Pickup
</div>

</div>

<div class="step">

<div class="stepCircle">

<i class="fa-solid fa-motorcycle"></i>

</div>

<div class="stepText">
Delivery
</div>

</div>

<div class="step">

<div class="stepCircle">

<i class="fa-solid fa-check"></i>

</div>

<div class="stepText">
Completed
</div>

</div>

</div>

<div class="detailBox">

${itemsHtml}

<div class="detailItem">

<div>
Total
</div>

<div>
₹${order.total || 0}
</div>

</div>

</div>

<div class="actionButtons">

<button
class="actionBtn acceptBtn"
onclick="updateStatus('${order.id}','completed')">

Complete

</button>

<button
class="actionBtn rejectBtn"
onclick="updateStatus('${order.id}','cancelled')">

Cancel

</button>

</div>

`;

};

/* =========================================================
UPDATE STATUS
========================================================= */

window.updateStatus =
async(id,status)=>{

await updateDoc(

doc(db,"orders",id),

{

status

}

);

};

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"keyup",
()=>{

const value =
searchInput.value.toLowerCase();

/* ========================================================= */

const filtered =

allOrders.filter(order=>{

return (

order.orderId?.toLowerCase().includes(value)

);

});

/* ========================================================= */

renderOrders(filtered);

});
