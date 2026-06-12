/* ==========================================
QUICKPRESS ADMIN DASHBOARD
========================================== */

import { db }
from "../js/firebase.js";

import {

collection,
getDocs

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* ==========================================
LOGIN PROTECTION
========================================== */

if(

localStorage.getItem(
"adminLogin"
)

!==

"true"

){

window.location.href =
"admin-login.html";

}

/* ==========================================
GLOBAL DATA
========================================== */

let totalRevenue = 0;

let totalOrders = 0;

let activeOrders = 0;

let deliveredOrders = 0;

let cancelledOrders = 0;

let totalCustomers = 0;

let totalPartners = 0;

let totalDrivers = 0;

let totalCities = 0;

/* ==========================================
INIT
========================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

loadDashboard();

}

);

/* ==========================================
LOAD DASHBOARD
========================================== */

async function loadDashboard(){

try{

showLoader();

await Promise.all([

loadOrders(),

loadUsers(),

loadPartners(),

loadDrivers(),

loadCities()

]);

updateDashboardCards();

hideLoader();

}catch(error){

console.error(
error
);

hideLoader();

}

}

/* ==========================================
ORDERS
========================================== */

async function loadOrders(){

const snapshot =

await getDocs(

collection(
db,
"orders"
)

);

totalRevenue = 0;
totalOrders = 0;
activeOrders = 0;
deliveredOrders = 0;
cancelledOrders = 0;

snapshot.forEach(doc=>{

const order =
doc.data();

totalOrders++;

totalRevenue +=

Number(
order.grandTotal || 0
);

if(
order.status ===
"Delivered"
){

deliveredOrders++;

}
else if(
order.status ===
"Cancelled"
){

cancelledOrders++;

}
else{

activeOrders++;

}

});

}

/* ==========================================
USERS
========================================== */

async function loadUsers(){

const snapshot =

await getDocs(

collection(
db,
"users"
)

);

totalCustomers =
snapshot.size;

}

/* ==========================================
PARTNERS
========================================== */

async function loadPartners(){

const snapshot =

await getDocs(

collection(
db,
"partners"
)

);

totalPartners =
snapshot.size;

}

/* ==========================================
DRIVERS
========================================== */

async function loadDrivers(){

const snapshot =

await getDocs(

collection(
db,
"drivers"
)

);

totalDrivers =
snapshot.size;

}/* ==========================================
CITIES
========================================== */

async function loadCities(){

const snapshot =

await getDocs(

collection(
db,
"cities"
)

);

totalCities =
snapshot.size;

}

/* ==========================================
UPDATE KPI CARDS
========================================== */

function updateDashboardCards(){

setText(
"todayRevenue",
"₹" +
totalRevenue.toLocaleString(
"en-IN"
)
);

setText(
"todayOrders",
totalOrders
);

setText(
"activeOrders",
activeOrders
);

setText(
"deliveredOrders",
deliveredOrders
);

setText(
"cancelledOrders",
cancelledOrders
);

setText(
"totalCustomers",
totalCustomers
);

setText(
"totalPartners",
totalPartners
);

setText(
"totalDrivers",
totalDrivers
);

setText(
"totalCities",
totalCities
);

}

/* ==========================================
HELPER
========================================== */

function setText(
id,
value
){

const el =

document.getElementById(
id
);

if(el){

el.innerText =
value;

}

}

/* ==========================================
REVENUE CHART
========================================== */

function initRevenueChart(){

const canvas =

document.getElementById(
"revenueChart"
);

if(!canvas)
return;

new Chart(

canvas,

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

label:"Revenue",

data:[

12000,
18500,
15000,
24000,
21000,
28000,
32000

],

borderWidth:3,

tension:0.4,

fill:false

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

display:true

}

}

}

}

);

}

/* ==========================================
ORDERS CHART
========================================== */

function initOrdersChart(){

const canvas =

document.getElementById(
"ordersChart"
);

if(!canvas)
return;

new Chart(

canvas,

{

type:"doughnut",

data:{

labels:[

"Delivered",
"Active",
"Cancelled"

],

datasets:[{

data:[

deliveredOrders,
activeOrders,
cancelledOrders

]

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

position:"bottom"

}

}

}

}

);

}

/* ==========================================
LOAD CHARTS
========================================== */

function loadCharts(){

initRevenueChart();

initOrdersChart();

}/* ==========================================
LIVE ORDERS TABLE
========================================== */

async function loadLiveOrders(){

const table =

document.getElementById(
"liveOrdersTable"
);

if(!table)
return;

table.innerHTML = "";

const snapshot =

await getDocs(

collection(
db,
"orders"
)

);

let count = 0;

snapshot.forEach(doc=>{

if(count >= 10)
return;

const order =
doc.data();

table.innerHTML += `

<tr>

<td>

${order.orderId || doc.id}

</td>

<td>

${order.customerName || "Customer"}

</td>

<td>

${order.city || "-"}

</td>

<td>

₹${order.grandTotal || 0}

</td>

<td>

<span class="tableStatus">

${order.status || "Pending"}

</span>

</td>

<td>

<button
class="actionTableBtn">

View

</button>

</td>

</tr>

`;

count++;

});

}

/* ==========================================
RECENT ACTIVITY
========================================== */

function loadRecentActivities(){

const container =

document.getElementById(
"activityFeed"
);

if(!container)
return;

container.innerHTML = `

<div class="activityItem">

<div class="activityIcon green">

✓

</div>

<div>

<h4>

Dashboard Loaded

</h4>

<p>

System running normally

</p>

</div>

</div>

<div class="activityItem">

<div class="activityIcon blue">

📦

</div>

<div>

<h4>

Orders Synced

</h4>

<p>

Latest orders fetched

</p>

</div>

</div>

`;

}

/* ==========================================
LOADER
========================================== */

function showLoader(){

const loader =

document.getElementById(
"loaderScreen"
);

if(loader){

loader.style.display =
"flex";

}

}

function hideLoader(){

const loader =

document.getElementById(
"loaderScreen"
);

if(loader){

loader.style.display =
"none";

}

}

/* ==========================================
SIDEBAR TOGGLE
========================================== */

window.toggleSidebar =
function(){

const sidebar =

document.querySelector(
".sidebar"
);

const mainWrapper =

document.querySelector(
".mainWrapper"
);

if(

sidebar.classList.contains(
"collapsed"
)

){

sidebar.classList.remove(
"collapsed"
);

mainWrapper.classList.remove(
"expanded"
);

}else{

sidebar.classList.add(
"collapsed"
);

mainWrapper.classList.add(
"expanded"
);

}

};

/* ==========================================
LOGOUT
========================================== */

window.adminLogout =
function(){

const confirmLogout =

confirm(
"Logout from admin panel?"
);

if(!confirmLogout)
return;

localStorage.removeItem(
"adminLogin"
);

window.location.href =
"admin-login.html";

};

/* ==========================================
AUTO REFRESH
========================================== */

setInterval(

()=>{

loadDashboard();

},

300000

);

/* ==========================================
FINAL INITIALIZATION
========================================== */

async function initializeDashboard(){

try{

await loadDashboard();

await loadLiveOrders();

loadRecentActivities();

loadCharts();

}catch(error){

console.error(
"Dashboard Init Error",
error
);

}

}

initializeDashboard();

/* ==========================================
GLOBAL EXPORTS
========================================== */

window.dashboardApp = {

loadDashboard,
loadLiveOrders,
loadCharts,
toggleSidebar,
adminLogout

};

console.log(

"QuickPress Dashboard Ready 🚀"

);
