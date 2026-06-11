/* ==========================================
QUICKPRESS ORDERS JS
PART 5
========================================== */

import { auth, db }
from "../js/firebase.js";

import {

collection,
query,
where,
orderBy,
getDocs

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* ==========================================
GLOBAL
========================================== */

let allOrders = [];

let currentFilter = "all";

const loader =

document.getElementById(
"pageLoader"
);

const ordersContainer =

document.getElementById(
"ordersContainer"
);

const emptyState =

document.getElementById(
"emptyState"
);

/* ==========================================
LOGIN PROTECTION
========================================== */

auth.onAuthStateChanged(

async(user)=>{

if(!user){

window.location.href =
"auth.html";

return;

}

await loadOrders(
user.uid
);

loader.style.display =
"none";

}

);

/* ==========================================
LOAD ORDERS
========================================== */

async function loadOrders(uid){

try{

const ordersRef =

collection(
db,
"orders"
);

const q = query(

ordersRef,

where(
"uid",
"==",
uid
)

);

const snapshot =

await getDocs(q);

allOrders = [];

snapshot.forEach(doc=>{

allOrders.push({

id:doc.id,

...doc.data()

});

});

/* NEWEST FIRST */

allOrders.sort((a,b)=>{

const aTime =
a.createdAt?.seconds || 0;

const bTime =
b.createdAt?.seconds || 0;

return bTime - aTime;

});

updateStats();

renderOrders(
allOrders
);

}catch(error){

console.error(
error
);

showEmptyState();

}

}

/* ==========================================
STATS
========================================== */

function updateStats(){

const total =

allOrders.length;

const active =

allOrders.filter(order=>

[
"Order Received",
"Assigned",
"Picked Up",
"Cleaning",
"Quality Check",
"Ready",
"Out For Delivery"

].includes(
order.status
)

).length;

const completed =

allOrders.filter(order=>

order.status ===
"Delivered"

).length;

document.getElementById(
"totalOrders"
).innerText =
total;

document.getElementById(
"activeOrders"
).innerText =
active;

document.getElementById(
"completedOrders"
).innerText =
completed;

}

/* ==========================================
EMPTY STATE
========================================== */

function showEmptyState(){

ordersContainer.innerHTML = "";

emptyState.style.display =
"block";

}
/* ==========================================
RENDER ORDERS
========================================== */

function renderOrders(orders){

ordersContainer.innerHTML = "";

if(orders.length === 0){

showEmptyState();

return;

}

emptyState.style.display =
"none";

orders.forEach(order=>{

const statusClass =
getStatusClass(
order.status
);

const timeline =
generateTimeline(
order.status
);

const itemCount =
order.items?.length || 0;

const card = `

<div class="orderCard">

<div class="orderTop">

<div>

<h3 class="orderId">

#${order.orderId || order.id}

</h3>

<p class="orderDate">

${formatDate(
order.createdAt
)}

</p>

</div>

<div class="statusBadge ${statusClass}">

${order.status || "Pending"}

</div>

</div>

<div class="orderMiddle">

<div class="orderInfo">

<span>

🧺 ${itemCount} Items

</span>

<span>

₹${order.grandTotal || 0}

</span>

</div>

<div class="orderInfo">

<span>

📅 Pickup:
${order.pickupDate || "-"}

</span>

<span>

🚚 Delivery:
${order.deliveryDate || "-"}

</span>

</div>

</div>

${timeline}

<div class="orderActions">

<button
class="trackBtn"
onclick="trackOrder('${order.id}')">

Track Order

</button>

<button
class="detailsBtn"
onclick="viewOrderDetails('${order.id}')">

View Details

</button>

</div>

</div>

`;

ordersContainer.innerHTML += card;

});

}

/* ==========================================
STATUS CLASS
========================================== */

function getStatusClass(status){

switch(status){

case "Delivered":
return "completedStatus";

case "Cancelled":
return "cancelledStatus";

case "Order Received":
return "pendingStatus";

default:
return "activeStatus";

}

}

/* ==========================================
TIMELINE
========================================== */

function generateTimeline(status){

const steps = [

"Order Received",

"Picked Up",

"Cleaning",

"Delivered"

];

let activeIndex = 0;

if(status === "Order Received")
activeIndex = 0;

else if(
status === "Picked Up"
||
status === "Assigned"
)
activeIndex = 1;

else if(
status === "Cleaning"
||
status === "Quality Check"
||
status === "Ready"
)
activeIndex = 2;

else if(
status === "Delivered"
)
activeIndex = 3;

return `

<div class="miniTimeline">

${steps.map((step,index)=>{

let cls = "";

if(index < activeIndex){

cls = "completed";

}else if(index === activeIndex){

cls = "active";

}

return `

<div class="timelineStep ${cls}">

<span></span>

<p>

${step}

</p>

</div>

${index < steps.length-1 ?

'<div class="timelineLine"></div>'

:

''}

`;

}).join("")}

</div>

`;

}

/* ==========================================
DATE FORMAT
========================================== */

function formatDate(timestamp){

if(!timestamp?.seconds)
return "Recently";

const date =

new Date(
timestamp.seconds * 1000
);

return date.toLocaleDateString(
"en-IN",
{
day:"numeric",
month:"short",
year:"numeric"
}
);

}/* ==========================================
SEARCH ORDERS
========================================== */

const searchInput =

document.getElementById(
"searchInput"
);

if(searchInput){

searchInput.addEventListener(

"input",

(event)=>{

const value =

event.target.value
.toLowerCase()
.trim();

const filtered =

allOrders.filter(order=>{

const orderId =

String(
order.orderId || order.id
)
.toLowerCase();

return orderId.includes(
value
);

});

renderOrders(
filtered
);

}

);

}

/* ==========================================
FILTER BUTTONS
========================================== */

const filterButtons =

document.querySelectorAll(
".filterBtn"
);

filterButtons.forEach(btn=>{

btn.addEventListener(

"click",

()=>{

filterButtons.forEach(item=>{

item.classList.remove(
"active"
);

});

btn.classList.add(
"active"
);

currentFilter =

btn.dataset.filter;

applyFilters();

}

);

});

/* ==========================================
APPLY FILTERS
========================================== */

function applyFilters(){

let filtered =
[...allOrders];

switch(currentFilter){

case "active":

filtered =

filtered.filter(order=>

[
"Order Received",
"Assigned",
"Picked Up",
"Cleaning",
"Quality Check",
"Ready",
"Out For Delivery"

].includes(
order.status
)

);

break;

case "completed":

filtered =

filtered.filter(order=>

order.status ===
"Delivered"

);

break;

case "cancelled":

filtered =

filtered.filter(order=>

order.status ===
"Cancelled"

);

break;

default:

filtered = allOrders;

}

/* SEARCH + FILTER COMBINED */

const searchValue =

document.getElementById(
"searchInput"
)
.value
.toLowerCase()
.trim();

if(searchValue){

filtered =

filtered.filter(order=>{

const orderId =

String(
order.orderId || order.id
)
.toLowerCase();

return orderId.includes(
searchValue
);

});

}

renderOrders(
filtered
);

}

/* ==========================================
AUTO REFRESH
========================================== */

function refreshOrders(){

const user =
auth.currentUser;

if(!user)
return;

loadOrders(
user.uid
);

}

/* Refresh every 30 seconds */

setInterval(

()=>{

if(auth.currentUser){

refreshOrders();

}

},

30000

);

/* ==========================================
ORDER COUNTERS
========================================== */

function updateFilterCounts(){

const activeCount =

allOrders.filter(order=>

[
"Order Received",
"Assigned",
"Picked Up",
"Cleaning",
"Quality Check",
"Ready",
"Out For Delivery"

].includes(
order.status
)

).length;

const completedCount =

allOrders.filter(order=>

order.status ===
"Delivered"

).length;

const cancelledCount =

allOrders.filter(order=>

order.status ===
"Cancelled"

).length;

document.querySelector(
'[data-filter="active"]'
).innerHTML =

`Active (${activeCount})`;

document.querySelector(
'[data-filter="completed"]'
).innerHTML =

`Completed (${completedCount})`;

document.querySelector(
'[data-filter="cancelled"]'
).innerHTML =

`Cancelled (${cancelledCount})`;

}

/* ==========================================
UPDATE AFTER LOAD
========================================== */

const originalLoadOrders =
loadOrders;

loadOrders = async function(uid){

await originalLoadOrders(
uid
);

updateFilterCounts();

applyFilters();

};/* ==========================================
VIEW ORDER DETAILS
========================================== */

window.viewOrderDetails =
function(orderId){

const order =

allOrders.find(item=>

item.id === orderId

||

item.orderId === orderId

);

if(!order)
return;

const modal =

document.getElementById(
"orderModal"
);

const modalBody =

document.getElementById(
"modalBody"
);

const itemsHtml =

(order.items || [])

.map(item=>`

<div class="detailRow">

<span>

${item.name}

×

${item.qty || 1}

</span>

<b>

₹${

(item.price || 0)

*

(item.qty || 1)

}

</b>

</div>

`)

.join("");

modalBody.innerHTML = `

<!-- ORDER INFO -->

<div class="detailSection">

<h3>

📦 Order Information

</h3>

<div class="detailRow">

<span>

Order ID

</span>

<b>

#${order.orderId || order.id}

</b>

</div>

<div class="detailRow">

<span>

Status

</span>

<b>

${order.status || "Pending"}

</b>

</div>

<div class="detailRow">

<span>

Created

</span>

<b>

${formatDate(
order.createdAt
)}

</b>

</div>

</div>

<!-- ADDRESS -->

<div class="detailSection">

<h3>

📍 Delivery Address

</h3>

<div class="detailRow">

<span>

Type

</span>

<b>

${order.address?.type || "-"}

</b>

</div>

<div class="detailRow">

<span>

Address

</span>

<b>

${order.address?.address || "-"}

</b>

</div>

<div class="detailRow">

<span>

City

</span>

<b>

${order.address?.city || "-"}

</b>

</div>

<div class="detailRow">

<span>

State

</span>

<b>

${order.address?.state || "-"}

</b>

</div>

</div>

<!-- ITEMS -->

<div class="detailSection">

<h3>

🧺 Order Items

</h3>

${itemsHtml || "<p>No Items Found</p>"}

</div>

<!-- PAYMENT -->

<div class="detailSection">

<h3>

💳 Payment Details

</h3>

<div class="detailRow">

<span>

Payment Method

</span>

<b>

${order.paymentMethod || "COD"}

</b>

</div>

<div class="detailRow">

<span>

Payment Status

</span>

<b>

${order.paymentStatus || "Pending"}

</b>

</div>

<div class="detailRow">

<span>

Subtotal

</span>

<b>

₹${order.subtotal || 0}

</b>

</div>

<div class="detailRow">

<span>

Discount

</span>

<b>

-₹${order.discount || 0}

</b>

</div>

<div class="detailRow">

<span>

Grand Total

</span>

<b>

₹${order.grandTotal || 0}

</b>

</div>

</div>

<!-- SCHEDULE -->

<div class="detailSection">

<h3>

📅 Schedule

</h3>

<div class="detailRow">

<span>

Pickup Date

</span>

<b>

${order.pickupDate || "-"}

</b>

</div>

<div class="detailRow">

<span>

Pickup Slot

</span>

<b>

${order.pickupSlot || "-"}

</b>

</div>

<div class="detailRow">

<span>

Delivery Date

</span>

<b>

${order.deliveryDate || "-"}

</b>

</div>

<div class="detailRow">

<span>

Delivery Slot

</span>

<b>

${order.deliverySlot || "-"}

</b>

</div>

</div>

`;

modal.classList.add(
"active"
);

};

/* ==========================================
CLOSE MODAL
========================================== */

const closeBtn =

document.querySelector(
".closeModal"
);

if(closeBtn){

closeBtn.addEventListener(

"click",

()=>{

document
.getElementById(
"orderModal"
)
.classList.remove(
"active"
);

}

);

}

/* ==========================================
CLICK OUTSIDE CLOSE
========================================== */

const orderModal =

document.getElementById(
"orderModal"
);

if(orderModal){

orderModal.addEventListener(

"click",

(event)=>{

if(

event.target === orderModal

){

orderModal.classList.remove(
"active"
);

}

}

);

}/* ==========================================
TRACK ORDER
========================================== */

window.trackOrder =
function(orderId){

const order =

allOrders.find(item=>

item.id === orderId

||

item.orderId === orderId

);

if(!order)
return;

const modal =

document.getElementById(
"orderModal"
);

const modalBody =

document.getElementById(
"modalBody"
);

const steps = [

"Order Received",
"Assigned",
"Picked Up",
"Cleaning",
"Quality Check",
"Ready",
"Out For Delivery",
"Delivered"

];

const currentIndex =

steps.indexOf(
order.status
);

const timelineHtml =

steps.map((step,index)=>{

let statusClass =
"pendingStep";

if(index < currentIndex){

statusClass =
"completedStep";

}

if(index === currentIndex){

statusClass =
"activeStep";

}

return `

<div class="trackStep">

<div class="trackIcon ${statusClass}">

${index + 1}

</div>

<div class="trackContent">

<h4>

${step}

</h4>

<p>

${index <= currentIndex

?

"Completed"

:

"Pending"

}

</p>

</div>

</div>

`;

}).join("");

modalBody.innerHTML = `

<div class="detailSection">

<h3>

🚚 Track Order

</h3>

<div class="detailRow">

<span>

Order ID

</span>

<b>

#${order.orderId || order.id}

</b>

</div>

<div class="detailRow">

<span>

Current Status

</span>

<b>

${order.status}

</b>

</div>

</div>

<div class="trackingTimeline">

${timelineHtml}

</div>

<div class="actionButtons">

<button
class="supportBtn"
onclick="contactSupport('${order.id}')">

🎧 Contact Support

</button>

<button
class="repeatBtn"
onclick="repeatOrder('${order.id}')">

🔄 Repeat Order

</button>

</div>

`;

modal.classList.add(
"active"
);

};

/* ==========================================
CONTACT SUPPORT
========================================== */

window.contactSupport =
function(orderId){

localStorage.setItem(
"supportOrderId",
orderId
);

window.location.href =
"support.html";

};

/* ==========================================
REPEAT ORDER
========================================== */

window.repeatOrder =
function(orderId){

const order =

allOrders.find(item=>

item.id === orderId

||

item.orderId === orderId

);

if(!order)
return;

localStorage.setItem(

"qp_cart",

JSON.stringify(
order.items || []
)

);

alert(
"Items added to cart successfully"
);

window.location.href =
"cart.html";

};

/* ==========================================
TRACKING STYLES
========================================== */

const trackingStyle =

document.createElement(
"style"
);

trackingStyle.innerHTML = `

.trackingTimeline{

margin-top:20px;

display:flex;

flex-direction:column;

gap:18px;

}

.trackStep{

display:flex;

align-items:flex-start;

gap:14px;

}

.trackIcon{

width:42px;
height:42px;

border-radius:50%;

display:flex;

align-items:center;

justify-content:center;

font-weight:900;

font-size:14px;

flex-shrink:0;

}

.completedStep{

background:#DCFCE7;

color:#16A34A;

}

.activeStep{

background:#FEF3C7;

color:#D97706;

}

.pendingStep{

background:#F3F4F6;

color:#9CA3AF;

}

.trackContent h4{

font-size:15px;

font-weight:800;

margin-bottom:4px;

}

.trackContent p{

font-size:13px;

color:#6B7280;

}

.actionButtons{

display:grid;

grid-template-columns:1fr 1fr;

gap:12px;

margin-top:24px;

}

.supportBtn{

height:52px;

border:none;

border-radius:14px;

background:#2563EB;

color:white;

font-weight:800;

cursor:pointer;

}

.repeatBtn{

height:52px;

border:none;

border-radius:14px;

background:#16A34A;

color:white;

font-weight:800;

cursor:pointer;

}

@media(max-width:768px){

.actionButtons{

grid-template-columns:1fr;

}

}

`;

document.head.appendChild(
trackingStyle
);/* ==========================================
DOWNLOAD INVOICE
========================================== */

window.downloadInvoice =
function(orderId){

const order =

allOrders.find(item=>

item.id === orderId

||

item.orderId === orderId

);

if(!order)
return;

const invoiceData = `

QUICKPRESS INVOICE

--------------------------------

Order ID:
${order.orderId || order.id}

Status:
${order.status}

Customer:
${order.customerName || "Customer"}

--------------------------------

Total:
₹${order.grandTotal || 0}

Payment:
${order.paymentMethod || "COD"}

--------------------------------

Thank You For Choosing
QuickPress

`;

const blob =

new Blob(

[invoiceData],

{
type:"text/plain"
}

);

const url =
URL.createObjectURL(
blob
);

const a =
document.createElement(
"a"
);

a.href = url;

a.download =

`Invoice_${
order.orderId || order.id
}.txt`;

a.click();

URL.revokeObjectURL(
url
);

};

/* ==========================================
CANCEL ORDER
========================================== */

window.cancelOrder =
async function(orderId){

const order =

allOrders.find(item=>

item.id === orderId

||

item.orderId === orderId

);

if(!order)
return;

if(

order.status ===
"Delivered"

){

alert(
"Delivered orders cannot be cancelled"
);

return;

}

const confirmCancel =

confirm(
"Are you sure you want to cancel this order?"
);

if(!confirmCancel)
return;

try{

alert(
"Cancellation request submitted"
);

}catch(error){

console.error(error);

alert(
"Unable to cancel order"
);

}

};

/* ==========================================
REFRESH ORDERS
========================================== */

window.refreshOrders =
function(){

const user =
auth.currentUser;

if(!user)
return;

loadOrders(
user.uid
);

};

/* ==========================================
PULL TO REFRESH
========================================== */

let startY = 0;

document.addEventListener(

"touchstart",

(event)=>{

startY =
event.touches[0].clientY;

}

);

document.addEventListener(

"touchend",

(event)=>{

const endY =

event.changedTouches[0]
.clientY;

if(

window.scrollY === 0

&&

(endY - startY) > 120

){

refreshOrders();

}

}

);

/* ==========================================
ORDER ACTIONS
========================================== */

window.showOrderActions =
function(orderId){

const modal =

document.getElementById(
"orderModal"
);

const modalBody =

document.getElementById(
"modalBody"
);

modalBody.innerHTML += `

<div class="actionButtons">

<button
class="repeatBtn"
onclick="downloadInvoice('${orderId}')">

📄 Download Invoice

</button>

<button
class="supportBtn"
onclick="cancelOrder('${orderId}')">

❌ Cancel Order

</button>

</div>

`;

modal.classList.add(
"active"
);

};

/* ==========================================
NETWORK STATUS
========================================== */

window.addEventListener(

"offline",

()=>{

alert(
"You're offline. Some features may not work."
);

}

);

window.addEventListener(

"online",

()=>{

refreshOrders();

}

);

/* ==========================================
FINAL INIT
========================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

console.log(

"QuickPress Orders Ready 🚀"

);

const modal =

document.getElementById(
"orderModal"
);

if(modal){

modal.classList.remove(
"active"
);

}

}

);

/* ==========================================
GLOBAL EXPORTS
========================================== */

window.ordersApp = {

refreshOrders,
trackOrder,
viewOrderDetails,
repeatOrder,
downloadInvoice,
cancelOrder

};

console.log(
"User Orders V2 Loaded Successfully ✅"
);
