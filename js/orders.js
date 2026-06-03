/* =========================================================
FILE : orders.js
========================================================= */

import { db, auth }

from "./firebase.js";

import {

collection,
query,
where,
onSnapshot,
orderBy

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import {

onAuthStateChanged

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

/* =========================================================
DOM
========================================================= */

const ordersList =
document.getElementById(
"ordersList"
);

const emptyOrdersState =
document.getElementById(
"emptyOrdersState"
);

const totalOrders =
document.getElementById(
"totalOrders"
);

const pendingOrders =
document.getElementById(
"pendingOrders"
);

const processingOrders =
document.getElementById(
"processingOrders"
);

const deliveredOrders =
document.getElementById(
"deliveredOrders"
);

const cancelledOrders =
document.getElementById(
"cancelledOrders"
);

/* =========================================================
GLOBAL
========================================================= */

let allOrders = [];

/* =========================================================
LOGIN CHECK
========================================================= */

onAuthStateChanged(
auth,
(user)=>{

if(!user){

location.href =
"login.html";

return;

}

loadOrders(user);

}
);

/* =========================================================
LOAD ORDERS
========================================================= */

function loadOrders(user){

const phone =
user.phoneNumber;

const q = query(

collection(db,"orders"),

where(
"userPhone",
"==",
phone
)

);

onSnapshot(
q,
(snapshot)=>{

allOrders = [];

snapshot.forEach(
(doc)=>{

allOrders.push({

id:doc.id,

...doc.data()

});

});

renderOrders();

updateStats();

});

}

/* =========================================================
UPDATE STATS
========================================================= */

function updateStats(){

totalOrders.textContent =
allOrders.length;

pendingOrders.textContent =

allOrders.filter(
o=>o.status==="pending"
).length;

processingOrders.textContent =

allOrders.filter(
o=>

o.status==="processing" ||

o.status==="assigned" ||

o.status==="picked"

).length;

deliveredOrders.textContent =

allOrders.filter(
o=>o.status==="delivered"
).length;

cancelledOrders.textContent =

allOrders.filter(
o=>o.status==="cancelled"
).length;

}

/* =========================================================
RENDER ORDERS
========================================================= */

function renderOrders(){

if(allOrders.length===0){

ordersList.innerHTML = "";

emptyOrdersState.style.display =
"block";

return;

}

emptyOrdersState.style.display =
"none";

ordersList.innerHTML =

allOrders.map(order=>`

<div class="orderCard">

<div class="orderTop">

<div>

<div class="orderId">

#${order.id}

</div>

<div class="orderDate">

${formatDate(order.createdAt)}

</div>

</div>

<div class="statusBadge ${statusClass(order.status)}">

${order.status}

</div>

</div>

<div class="orderBody">

<div class="orderInfo">

<div class="infoLabel">

Customer

</div>

<div class="infoValue">

${order.name||"-"}

</div>

</div>

<div class="orderInfo">

<div class="infoLabel">

Amount

</div>

<div class="infoValue">

₹${order.total||0}

</div>

</div>

<div class="orderInfo">

<div class="infoLabel">

Pickup Date

</div>

<div class="infoValue">

${order.pickupDate||"-"}

</div>

</div>

<div class="orderInfo">

<div class="infoLabel">

Payment

</div>

<div class="infoValue">

${order.paymentMethod||"-"}

</div>

</div>

</div>

<div class="orderActions">

<button
class="trackBtn"
onclick="trackOrder('${order.id}')">

Track Order

</button>

<button
class="detailsBtn"
onclick="viewOrder('${order.id}')">

View Details

</button>

<button
class="invoiceBtn"
onclick="downloadInvoice('${order.id}')">

Invoice

</button>

<button
class="reorderBtn"
onclick="reorderOrder('${order.id}')">

Reorder

</button>

</div>

</div>

`).join("");

}

/* =========================================================
HELPERS
========================================================= */

function formatDate(timestamp){

if(!timestamp) return "-";

return new Date(

timestamp.seconds*1000

).toLocaleString();

}

function statusClass(status){

switch(status){

case "assigned":

return "processingStatus";

case "processing":

return "processingStatus";

case "delivered":

return "deliveredStatus";

case "cancelled":

return "cancelledStatus";

default:

return "pendingStatus";

}

}

/* =========================================================
WINDOW EXPORT
========================================================= */

window.trackOrder =
(id)=>{};

window.viewOrder =
(id)=>{};

window.downloadInvoice =
(id)=>{};

window.reorderOrder =
(id)=>{};/* =========================================================
TRACK ORDER
========================================================= */

window.trackOrder = (orderId)=>{

const order = allOrders.find(
o=>o.id===orderId
);

if(!order) return;

openTrackingModal(order);

};

/* =========================================================
TRACKING MODAL
========================================================= */

function openTrackingModal(order){

const modal =
document.getElementById(
"trackingModal"
);

if(!modal) return;

modal.style.display =
"flex";

/* STATUS */

const liveTitle =
modal.querySelector(
".liveStatusTitle"
);

const liveText =
modal.querySelector(
".liveStatusText"
);

if(liveTitle){

liveTitle.textContent =
order.tracking ||
"Order Processing";

}

if(liveText){

liveText.textContent =
getTrackingMessage(
order.status
);

}

/* DRIVER */

const driverName =
modal.querySelector(
".driverName"
);

const driverPhone =
modal.querySelector(
".driverPhone"
);

if(driverName){

driverName.textContent =

order.riderName ||

order.partnerName ||

"Not Assigned";

}

if(driverPhone){

driverPhone.textContent =

order.riderMobile ||

order.partnerMobile ||

"-";

}

/* TIMELINE */

renderTimeline(order);

}

/* =========================================================
TIMELINE
========================================================= */

function renderTimeline(order){

const timeline =
document.querySelector(
".timeline"
);

if(!timeline) return;

const currentStep =
Number(order.trackingStep || 0);

const steps = [

{
title:"Order Placed",
step:0
},

{
title:"Pickup Assigned",
step:1
},

{
title:"Picked Up",
step:2
},

{
title:"Processing",
step:3
},

{
title:"Ready",
step:4
},

{
title:"Out For Delivery",
step:5
},

{
title:"Delivered",
step:6
}

];

timeline.innerHTML =

steps.map(item=>{

let className = "";

if(item.step < currentStep){

className =
"completed";

}

else if(
item.step === currentStep
){

className =
"active";

}

return `

<div class="timelineItem ${className}">

<div class="timelineDot"></div>

<div class="timelineContent">

<h4>

${item.title}

</h4>

<p>

${getTimelineTime(order)}

</p>

</div>

</div>

`;

}).join("");

}

/* =========================================================
TIMELINE DATE
========================================================= */

function getTimelineTime(order){

if(!order.createdAt)
return "-";

return new Date(

order.createdAt.seconds*1000

).toLocaleString();

}

/* =========================================================
TRACKING MESSAGE
========================================================= */

function getTrackingMessage(status){

switch(status){

case "assigned":

return
"Rider has been assigned.";

case "picked":

return
"Laundry collected successfully.";

case "processing":

return
"Your clothes are being processed.";

case "ready":

return
"Order ready for dispatch.";

case "delivery":

return
"Order is out for delivery.";

case "delivered":

return
"Order delivered successfully.";

case "cancelled":

return
"Order cancelled.";

default:

return
"Waiting for pickup assignment.";

}

}

/* =========================================================
CLOSE TRACKING MODAL
========================================================= */

document
.querySelectorAll(
"#trackingModal .closeBtn"
)
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

document.getElementById(
"trackingModal"
).style.display =
"none";

});

});/* =========================================================
VIEW ORDER DETAILS
========================================================= */

window.viewOrder = (orderId)=>{

const order = allOrders.find(
o => o.id === orderId
);

if(!order) return;

openOrderDetails(order);

};

/* =========================================================
OPEN DETAILS MODAL
========================================================= */

function openOrderDetails(order){

const modal =
document.getElementById(
"orderDetailsModal"
);

if(!modal) return;

modal.style.display =
"flex";

/* ORDER ID */

const orderIdText =
modal.querySelector(
".modalHeader p"
);

if(orderIdText){

orderIdText.textContent =
`#${order.id}`;

}

/* CUSTOMER DETAILS */

updateDetailCard(
modal,
0,
order.name || "-"
);

updateDetailCard(
modal,
1,
order.phone || "-"
);

updateDetailCard(
modal,
2,
order.pickupDate || "-"
);

updateDetailCard(
modal,
3,
getDeliveryDate(order)
);

/* ADDRESS */

const addressBox =
modal.querySelector(
".addressBox"
);

if(addressBox){

addressBox.textContent =
order.address || "-";

}

/* ITEMS */

renderOrderItems(
modal,
order.items || []
);

/* BILL */

renderBillSummary(
modal,
order
);

/* PARTNER INFO */

renderPartnerInfo(
modal,
order
);

}

/* =========================================================
DETAIL CARD UPDATE
========================================================= */

function updateDetailCard(
modal,
index,
value
){

const cards =
modal.querySelectorAll(
".detailValue"
);

if(cards[index]){

cards[index].textContent =
value;

}

}

/* =========================================================
RENDER ITEMS
========================================================= */

function renderOrderItems(
modal,
items
){

const tbody =
modal.querySelector(
"tbody"
);

if(!tbody) return;

tbody.innerHTML =

items.map(item=>`

<tr>

<td>

${item.name || "-"}

</td>

<td>

${item.qty || 0}

</td>

<td>

₹${item.price || 0}

</td>

</tr>

`).join("");

}

/* =========================================================
BILL SUMMARY
========================================================= */

function renderBillSummary(
modal,
order
){

const rows =
modal.querySelectorAll(
".billRow strong"
);

if(rows.length < 4)
return;

/* subtotal */

rows[0].textContent =
`₹${order.subtotal || 0}`;

/* delivery */

rows[1].textContent =
`₹${order.deliveryCharge || 0}`;

/* coupon */

rows[2].textContent =
`₹0`;

/* handling */

rows[3].textContent =
`₹${order.handlingFee || 0}`;

const total =
modal.querySelector(
".billTotal strong"
);

if(total){

total.textContent =
`₹${order.total || 0}`;

}

}

/* =========================================================
PARTNER INFO
========================================================= */

function renderPartnerInfo(
modal,
order
){

let partnerBox =
document.getElementById(
"partnerInfoBox"
);

if(!partnerBox){

partnerBox =
document.createElement(
"div"
);

partnerBox.id =
"partnerInfoBox";

partnerBox.className =
"cardSection";

modal
.querySelector(
".orderModal"
)
.appendChild(
partnerBox
);

}

partnerBox.innerHTML =

`

<div class="sectionHeading">

Assigned Team

</div>

<div class="detailsGrid">

<div class="detailCard">

<div class="detailTitle">

Partner

</div>

<div class="detailValue">

${order.partnerName || "-"}

</div>

</div>

<div class="detailCard">

<div class="detailTitle">

Partner Mobile

</div>

<div class="detailValue">

${order.partnerMobile || "-"}

</div>

</div>

<div class="detailCard">

<div class="detailTitle">

Rider

</div>

<div class="detailValue">

${order.riderName || "-"}

</div>

</div>

<div class="detailCard">

<div class="detailTitle">

Rider Mobile

</div>

<div class="detailValue">

${order.riderMobile || "-"}

</div>

</div>

</div>

`;

}

/* =========================================================
ESTIMATED DELIVERY
========================================================= */

function getDeliveryDate(order){

if(order.deliveryDate){

return order.deliveryDate;

}

if(!order.pickupDate){

return "-";

}

return "Expected Soon";

}

/* =========================================================
CLOSE DETAILS MODAL
========================================================= */

document
.querySelectorAll(
"#orderDetailsModal .closeBtn"
)
.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

document.getElementById(
"orderDetailsModal"
).style.display =
"none";

});

});/* =========================================================
IMPORT ADD
========================================================= */

import {

addDoc,
getDocs,
serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
REORDER
========================================================= */

window.reorderOrder = async(orderId)=>{

try{

const order = allOrders.find(
o=>o.id===orderId
);

if(!order){

alert(
"Order not found"
);

return;

}

if(
!order.items ||
!order.items.length
){

alert(
"No items found"
);

return;

}

const confirmReorder =

confirm(
"Add all items to cart?"
);

if(!confirmReorder)
return;

/* ADD ITEMS */

for(
const item of order.items
){

await addDoc(

collection(
db,
"cart"
),

{

userPhone:

order.userPhone ||

order.phone ||

"",

serviceId:

item.id || "",

name:

item.name || "",

price:

Number(
item.price || 0
),

qty:

Number(
item.qty || 1
),

city:

item.city || "",

description:

item.description || "",

createdAt:

serverTimestamp()

}

);

}

alert(
"Items added to cart"
);

window.location.href =
"cart.html";

}

catch(error){

console.error(error);

alert(
"Failed to reorder"
);

}

};import {

addDoc,
serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";/* =========================================================
CONTACT SUPPORT
========================================================= */

window.contactSupport = async(orderId)=>{

try{

const order = allOrders.find(
o=>o.id===orderId
);

if(!order){

alert("Order not found");
return;

}

const message = prompt(
"Describe your issue"
);

if(!message) return;

await addDoc(

collection(
db,
"support_tickets"
),

{

orderId:order.id,

userPhone:
order.userPhone ||

order.phone ||

"",

customerName:
order.name ||

"",

message,

status:"open",

createdAt:
serverTimestamp()

}

);

alert(
"Support ticket submitted successfully"
);

}

catch(error){

console.error(error);

alert(
"Failed to submit ticket"
);

}

};/* =========================================================
RAISE COMPLAINT
========================================================= */

window.raiseComplaint = async(orderId)=>{

try{

const order = allOrders.find(
o=>o.id===orderId
);

if(!order){

alert("Order not found");
return;

}

const reason = prompt(

`Complaint Reason

1 Quality Issue
2 Pickup Delay
3 Delivery Delay
4 Missing Item
5 Other`

);

if(!reason) return;

const description = prompt(
"Complaint Details"
);

await addDoc(

collection(
db,
"complaints"
),

{

orderId:order.id,

userPhone:
order.userPhone ||

order.phone ||

"",

customerName:
order.name ||

"",

reason,

description,

status:"pending",

createdAt:
serverTimestamp()

}

);

alert(
"Complaint submitted successfully"
);

}

catch(error){

console.error(error);

alert(
"Complaint submit failed"
);

}

};/* =========================================================
DOWNLOAD INVOICE
========================================================= */

window.downloadInvoice = (orderId)=>{

const order = allOrders.find(
o=>o.id===orderId
);

if(!order){

alert("Order not found");
return;

}

generateInvoice(
order,
"invoice"
);

};

/* =========================================================
GST INVOICE
========================================================= */

window.downloadGSTInvoice = (orderId)=>{

const order = allOrders.find(
o=>o.id===orderId
);

if(!order){

alert("Order not found");
return;

}

generateInvoice(
order,
"gst"
);

};

/* =========================================================
PAYMENT RECEIPT
========================================================= */

window.downloadReceipt = (orderId)=>{

const order = allOrders.find(
o=>o.id===orderId
);

if(!order){

alert("Order not found");
return;

}

generateInvoice(
order,
"receipt"
);

};/* =========================================================
GENERATE DOCUMENT
========================================================= */

function generateInvoice(
order,
type
){

const itemsHtml =

(order.items || [])
.map(item=>`

<tr>

<td>${item.name}</td>

<td>${item.qty}</td>

<td>₹${item.price}</td>

<td>₹${item.qty * item.price}</td>

</tr>

`).join("");

const title =

type==="gst"
? "GST INVOICE"

: type==="receipt"
? "PAYMENT RECEIPT"

: "INVOICE";

const html = `

<html>

<head>

<title>

${title}

</title>

<style>

body{

font-family:Arial;
padding:30px;
color:#111;

}

.header{

display:flex;
justify-content:space-between;
margin-bottom:25px;

}

.logo{

font-size:32px;
font-weight:900;
color:#F4B400;

}

.title{

font-size:24px;
font-weight:900;

}

table{

width:100%;
border-collapse:collapse;
margin-top:20px;

}

table th,
table td{

border:1px solid #ddd;
padding:10px;

}

.summary{

margin-top:20px;

}

.summary div{

display:flex;
justify-content:space-between;
padding:6px 0;

}

.total{

font-size:22px;
font-weight:900;

}

</style>

</head>

<body>

<div class="header">

<div>

<div class="logo">

QuickPress

</div>

<div>

Professional Laundry Service

</div>

</div>

<div>

<div class="title">

${title}

</div>

<div>

Order ID:
${order.id}

</div>

</div>

</div>

<hr>

<h3>

Customer Details

</h3>

<p>

<b>Name:</b>
${order.name || ""}

</p>

<p>

<b>Phone:</b>
${order.phone || ""}

</p>

<p>

<b>Address:</b>
${order.address || ""}

</p>

<p>

<b>Pickup Date:</b>
${order.pickupDate || ""}

</p>

<p>

<b>Payment:</b>
${order.paymentMethod || ""}

</p>

<table>

<thead>

<tr>

<th>

Item

</th>

<th>

Qty

</th>

<th>

Price

</th>

<th>

Amount

</th>

</tr>

</thead>

<tbody>

${itemsHtml}

</tbody>

</table>

<div class="summary">

<div>

<span>

Subtotal

</span>

<span>

₹${order.subtotal || 0}

</span>

</div>

<div>

<span>

Delivery Charge

</span>

<span>

₹${order.deliveryCharge || 0}

</span>

</div>

<div>

<span>

Handling Fee

</span>

<span>

₹${order.handlingFee || 0}

</span>

</div>

<div class="total">

<span>

Total

</span>

<span>

₹${order.total || 0}

</span>

</div>

</div>

<br>

<hr>

<p>

Generated by QuickPress

</p>

<p>

Status:
${order.status || ""}

</p>

</body>

</html>

`;

const win =

window.open(
"",
"_blank"
);

win.document.write(
html
);

win.document.close();

setTimeout(()=>{

win.print();

},500);

}
