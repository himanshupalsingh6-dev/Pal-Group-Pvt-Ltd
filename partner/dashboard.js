/* =====================================================
QUICKPRESS PARTNER DASHBOARD
PART 1/10
FIREBASE IMPORTS
===================================================== */

import { auth } from "../firebase/firebase-auth.js";

import { db } from "../firebase/firebase.js";

import {

onAuthStateChanged,
signOut

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import {

doc,
getDoc,
collection,
query,
where,
orderBy,
limit,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =====================================================
GLOBAL STATE
===================================================== */

let currentPartner = null;

let partnerId = null;

let orders = [];

let drivers = [];

let notifications = [];

let reviews = [];

let settlements = [];

let wallet = null;

/* =====================================================
HELPERS
===================================================== */

function $(id){

return document.getElementById(id);

}

function formatCurrency(value){

return "₹" +

Number(
value || 0
)

.toLocaleString("en-IN");

}

function formatDate(timestamp){

if(!timestamp)
return "-";

const date =

timestamp.toDate
?

timestamp.toDate()

:

new Date(timestamp);

return date.toLocaleDateString();

}

console.log(
"Dashboard JS Loaded 🚀"
);/* =====================================================
AUTH GUARD
===================================================== */

onAuthStateChanged(

auth,

async(user)=>{

if(!user){

window.location.href =
"login.html";

return;

}

await loadPartnerData(
user.uid
);

initializeRealtimeListeners();

}

);

/* =====================================================
LOAD PARTNER
===================================================== */

async function loadPartnerData(uid){

try{

const partnerRef =

doc(
db,
"partners",
uid
);

const partnerSnap =

await getDoc(
partnerRef
);

if(!partnerSnap.exists()){

alert(
"Partner Profile Not Found"
);

window.location.href =
"login.html";

return;

}

currentPartner = {

id:
partnerSnap.id,

...partnerSnap.data()

};

partnerId =
currentPartner.id;

renderPartnerProfile();

}catch(error){

console.error(
error
);

}

}

/* =====================================================
PROFILE
===================================================== */

function renderPartnerProfile(){

if(!currentPartner)
return;

$("partnerName").textContent =

currentPartner.shopName
||

"Partner Shop";

$("partnerEmail").textContent =

currentPartner.email
||

"-";

$("partnerCity").textContent =

currentPartner.city
||

"-";

}/* =====================================================
REALTIME LISTENERS
===================================================== */

function initializeRealtimeListeners(){

listenOrders();

listenDrivers();

listenNotifications();

listenWallet();

listenSettlements();

listenReviews();

}

/* =====================================================
ORDERS
===================================================== */

function listenOrders(){

const q = query(

collection(
db,
"orders"
),

where(
"partnerId",
"==",
partnerId
)

);

onSnapshot(

q,

(snapshot)=>{

orders = [];

snapshot.forEach(docSnap=>{

orders.push({

id:
docSnap.id,

...docSnap.data()

});

});

updateOrderCards();

renderRecentOrders();

updateRevenueCards();

}

);

}/* =====================================================
ORDER ANALYTICS
===================================================== */

function updateOrderCards(){

const newOrders =

orders.filter(

order=>

order.status ===/* =====================================================
ORDER ANALYTICS
PART 5
===================================================== */

function updateOrderCards(){

const newOrders =
orders.filter(
o=>o.status==="pending"
).length;

const processing =
orders.filter(
o=>o.status==="processing"
).length;

const completed =
orders.filter(
o=>o.status==="completed"
).length;

const cancelled =
orders.filter(
o=>o.status==="cancelled"
).length;

$("newOrdersCount").textContent =
newOrders;

$("processingOrdersCount").textContent =
processing;

$("completedOrdersCount").textContent =
completed;

$("cancelledOrdersCount").textContent =
cancelled;

$("todayOrders").textContent =
orders.length;

}

/* =====================================================
RECENT ORDERS
===================================================== */

function renderRecentOrders(){

const tbody =
$("recentOrdersTable");

if(!tbody) return;

tbody.innerHTML = "";

orders
.slice(0,20)
.forEach(order=>{

tbody.innerHTML += `

<tr>

<td>${order.orderId || "-"}</td>

<td>
${order.customerName || "-"}
</td>

<td>
${order.serviceName || "-"}
</td>

<td>
${formatCurrency(order.amount)}
</td>

<td>
<span class="statusBadge">
${order.status}
</span>
</td>

<td>
${order.driverName || "-"}
</td>

<td>
${order.pickupDate || "-"}
</td>

<td>

<div class="actionGroup">

<button
class="viewBtn"
onclick="viewOrder('${order.id}')">

View

</button>

</div>

</td>

</tr>

`;

});

}/* =====================================================
DRIVERS
PART 6
===================================================== */

function listenDrivers(){

const q = query(

collection(db,"drivers"),

where(
"partnerId",
"==",
partnerId
)

);

onSnapshot(

q,

(snapshot)=>{

drivers = [];

snapshot.forEach(docSnap=>{

drivers.push({

id:docSnap.id,

...docSnap.data()

});

});

updateDriverAnalytics();

renderDriversTable();

}

);

}

function updateDriverAnalytics(){

const onlineDrivers =

drivers.filter(
d=>d.online===true
).length;

$("activeDrivers").textContent =
onlineDrivers;

$("onlineDriversCount").textContent =
onlineDrivers;

}

function renderDriversTable(){

const tbody =
$("driverPerformanceTable");

if(!tbody) return;

tbody.innerHTML = "";

drivers.forEach(driver=>{

tbody.innerHTML += `

<tr>

<td>${driver.name}</td>

<td>

<span class="statusBadge active">

${driver.online
? "Online"
: "Offline"}

</span>

</td>

<td>${driver.totalOrders || 0}</td>

<td>${driver.completedOrders || 0}</td>

<td>${driver.rating || 0}</td>

<td>
${formatCurrency(
driver.earnings || 0
)}
</td>

<td>

<button
class="viewBtn">

View

</button>

</td>

</tr>

`;

});

}/* =====================================================
WALLET + SETTLEMENTS
PART 7
===================================================== */

function listenWallet(){

const walletRef =

doc(
db,
"partnerWallets",
partnerId
);

onSnapshot(

walletRef,

(snapshot)=>{

if(!snapshot.exists())
return;

wallet = snapshot.data();

$("walletBalance").textContent =

formatCurrency(
wallet.balance || 0
);

$("availableBalance").textContent =

formatCurrency(
wallet.balance || 0
);

}

);

}

function listenSettlements(){

const q = query(

collection(
db,
"settlements"
),

where(
"partnerId",
"==",
partnerId
)

);

onSnapshot(

q,

(snapshot)=>{

settlements=[];

snapshot.forEach(docSnap=>{

settlements.push({

id:docSnap.id,

...docSnap.data()

});

});

updateSettlementCards();

}

);

}

function updateSettlementCards(){

let pending = 0;
let paid = 0;

settlements.forEach(item=>{

if(item.status==="pending"){

pending +=
Number(item.amount||0);

}else{

paid +=
Number(item.amount||0);

}

});

$("pendingSettlement").textContent =

formatCurrency(pending);

$("pendingBalance").textContent =

formatCurrency(pending);

$("paidBalance").textContent =

formatCurrency(paid);

}/* =====================================================
REVIEWS + NOTIFICATIONS
PART 8
===================================================== */

function listenReviews(){

const q = query(

collection(
db,
"reviews"
),

where(
"partnerId",
"==",
partnerId
)

);

onSnapshot(

q,

(snapshot)=>{

reviews=[];

snapshot.forEach(docSnap=>{

reviews.push({

id:docSnap.id,

...docSnap.data()

});

});

updateRatings();

}

);

}

function updateRatings(){

if(!reviews.length){

$("partnerRating").textContent =
"0.0";

return;

}

const total =

reviews.reduce(
(sum,r)=>
sum + Number(r.rating||0),
0
);

const avg =

(total/reviews.length)
.toFixed(1);

$("partnerRating").textContent =
avg;

$("shopRating").textContent =
avg;

}

function listenNotifications(){

const q = query(

collection(
db,
"notifications"
),

where(
"userId",
"==",
partnerId
)

);

onSnapshot(

q,

(snapshot)=>{

notifications=[];

snapshot.forEach(docSnap=>{

notifications.push({

id:docSnap.id,

...docSnap.data()

});

});

renderNotifications();

}

);

}/* =====================================================
NOTIFICATION RENDER
PART 9
===================================================== */

function renderNotifications(){

const container =
$("notificationList");

if(!container) return;

container.innerHTML = "";

notifications
.slice(0,10)
.forEach(item=>{

container.innerHTML += `

<div class="notificationItem">

<div class="notificationDot"></div>

<div>

<h4>

${item.title || "Notification"}

</h4>

<p>

${item.message || ""}

</p>

</div>

<span>

${formatDate(item.createdAt)}

</span>

</div>

`;

});

}

/* =====================================================
REVENUE
===================================================== */

function updateRevenueCards(){

let revenue = 0;

orders.forEach(order=>{

revenue +=

Number(
order.amount || 0
);

});

$("todayRevenue").textContent =
formatCurrency(revenue);

$("revenueValue").textContent =
formatCurrency(revenue);

$("todayRevenueCard").textContent =
formatCurrency(revenue);

$("weeklyRevenueCard").textContent =
formatCurrency(revenue);

$("monthlyRevenueCard").textContent =
formatCurrency(revenue);

$("projectedRevenueCard").textContent =

formatCurrency(
Math.round(revenue*1.20)
);

}/* =====================================================
CHARTS + ACTIONS
PART 10
===================================================== */

window.viewOrder = function(id){

const order =

orders.find(
o=>o.id===id
);

if(!order) return;

alert(

`
Order ID:
${order.orderId}

Customer:
${order.customerName}

Amount:
₹${order.amount}

Status:
${order.status}
`

);

};

/* =====================================================
LOGOUT
===================================================== */

$("confirmLogout")
?.addEventListener(

"click",

async()=>{

await signOut(auth);

window.location.href =
"login.html";

}

);

/* =====================================================
CHARTS
===================================================== */

function initializeCharts(){

const revenueCanvas =
document.getElementById(
"revenueChart"
);

const ordersCanvas =
document.getElementById(
"ordersChart"
);

if(revenueCanvas){

new Chart(

revenueCanvas,

{
type:"bar",

data:{
labels:[
"Mon",
"Tue",
"Wed",
"Thu",
"Fri",
"Sat",
"Sun"
],

datasets:[{
label:"Revenue",
data:[
1200,
1800,
1500,
2200,
2500,
3100,
2800
]
}]
}

}

);

}

if(ordersCanvas){

new Chart(

ordersCanvas,

{
type:"line",

data:{
labels:[
"Mon",
"Tue",
"Wed",
"Thu",
"Fri",
"Sat",
"Sun"
],

datasets:[{
label:"Orders",
data:[
10,
15,
12,
18,
20,
28,
24
]
}]
}

}

);

}

}

/* =====================================================
INIT
===================================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

initializeCharts();

console.log(
"QuickPress Partner Dashboard Ready 🚀"
);

}

);

/* =====================================================
GLOBAL EXPORTS
===================================================== */

window.partnerDashboard = {

viewOrder

};

console.log(
"DASHBOARD.JS LOADED"
);
