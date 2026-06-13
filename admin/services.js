/* =====================================================
QUICKPRESS SERVICES PANEL
SIMPLE FIREBASE VERSION
===================================================== */

import { db } from "../js/firebase.js";

import {
collection,
addDoc,
updateDoc,
deleteDoc,
doc,
getDoc,
onSnapshot,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =====================================================
COLLECTIONS
===================================================== */

const SERVICES = "services";
const PRICING = "servicePricing";
const ORDERS = "orders";

/* =====================================================
STATE
===================================================== */

let services = [];
let pricing = [];
let orders = [];

let editServiceId = null;
let editPricingId = null;

/* =====================================================
HELPERS
===================================================== */

function $(id){
return document.getElementById(id);
}

function money(value){
return "₹" + Number(value || 0).toLocaleString("en-IN");
}

/* =====================================================
MODALS
===================================================== */

$("openServiceModal")?.addEventListener(
"click",
()=>{
$("serviceModal").classList.add("active");
}
);

$("openPricingModal")?.addEventListener(
"click",
()=>{
$("pricingModal").classList.add("active");
loadServiceDropdown();
}
);

window.addEventListener(
"click",
(e)=>{

if(e.target.id==="serviceModal"){
$("serviceModal").classList.remove("active");
}

if(e.target.id==="pricingModal"){
$("pricingModal").classList.remove("active");
}

}
);

/* =====================================================
SERVICES
===================================================== */

async function saveService(){

const service = {

name:$("serviceName").value.trim(),

category:$("serviceCategory").value.trim(),

price:Number(
$("servicePrice").value || 0
),

image:$("serviceImage").value.trim(),

status:"active",

createdAt:serverTimestamp()

};

if(!service.name){

alert("Enter Service Name");
return;

}

await addDoc(

collection(
db,
SERVICES
),

service

);

$("serviceName").value="";
$("serviceCategory").value="";
$("servicePrice").value="";
$("serviceImage").value="";

$("serviceModal")
.classList.remove(
"active"
);

}

$("saveServiceBtn")
?.addEventListener(
"click",
saveService
);

/* =====================================================
LISTEN SERVICES
===================================================== */

function listenServices(){

onSnapshot(

collection(
db,
SERVICES
),

(snapshot)=>{

services=[];

snapshot.forEach(docSnap=>{

services.push({

id:docSnap.id,

...docSnap.data()

});

});

renderServices();

loadServiceDropdown();

updateStats();

}

);

}

/* =====================================================
RENDER SERVICES
===================================================== */

function renderServices(){

const table =
$("servicesTable");

if(!table) return;

table.innerHTML="";

services.forEach(service=>{

const tr =
document.createElement(
"tr"
);

tr.innerHTML = `

<td>

<img
src="${
service.image ||
'https://placehold.co/60'
}">

</td>

<td>

${service.name}

</td>

<td>

${service.category}

</td>

<td>

${money(
service.price
)}

</td>

<td>

<span class="statusActive">

${service.status}

</span>

</td>

<td>

<div class="actionButtons">

<button
class="btnEdit"
onclick="editService('${service.id}')">

Edit

</button>

<button
class="btnDelete"
onclick="deleteService('${service.id}')">

Delete

</button>

</div>

</td>

`;

table.appendChild(tr);

});

}

/* =====================================================
EDIT SERVICE
===================================================== */

window.editService =
async(id)=>{

const service =

services.find(
s=>s.id===id
);

if(!service) return;

const name =
prompt(
"Service Name",
service.name
);

if(!name) return;

const price =
prompt(
"Price",
service.price
);

await updateDoc(

doc(
db,
SERVICES,
id
),

{

name,

price:Number(
price
)

}

);

};

/* =====================================================
DELETE SERVICE
===================================================== */

window.deleteService =
async(id)=>{

const ok =
confirm(
"Delete Service?"
);

if(!ok) return;

await deleteDoc(

doc(
db,
SERVICES,
id
)

);

};

/* =====================================================
SERVICE DROPDOWN
===================================================== */

function loadServiceDropdown(){

const select =
$("pricingService");

if(!select) return;

select.innerHTML="";

services.forEach(service=>{

const option =
document.createElement(
"option"
);

option.value =
service.id;

option.textContent =
service.name;

select.appendChild(
option
);

});

}

/* =====================================================
CITY PRICING
===================================================== */

async function savePricing(){

const serviceId =
$("pricingService").value;

const city =
$("pricingCity").value;

const normalPrice =
Number(
$("normalPrice").value
);

const expressPrice =
Number(
$("expressPrice").value
);

await addDoc(

collection(
db,
PRICING
),

{

serviceId,
city,

normalPrice,
expressPrice,

createdAt:
serverTimestamp()

}

);

$("pricingModal")
.classList.remove(
"active"
);

}

$("savePricingBtn")
?.addEventListener(
"click",
savePricing
);

/* =====================================================
LISTEN PRICING
===================================================== */

function listenPricing(){

onSnapshot(

collection(
db,
PRICING
),

(snapshot)=>{

pricing=[];

snapshot.forEach(docSnap=>{

pricing.push({

id:docSnap.id,

...docSnap.data()

});

});

renderPricing();

}

);

}

/* =====================================================
RENDER PRICING
===================================================== */

function renderPricing(){

const table =
$("pricingTable");

if(!table) return;

table.innerHTML="";

pricing.forEach(item=>{

const service =

services.find(

s=>s.id===
item.serviceId

);

const tr =
document.createElement(
"tr"
);

tr.innerHTML = `

<td>

${item.city}

</td>

<td>

${service?.name || "-"}

</td>

<td>

${money(
item.normalPrice
)}

</td>

<td>

${money(
item.expressPrice
)}

</td>

<td>

<button
class="btnDelete"
onclick="deletePricing('${item.id}')">

Delete

</button>

</td>

`;

table.appendChild(tr);

});

}

/* =====================================================
DELETE PRICING
===================================================== */

window.deletePricing =
async(id)=>{

const ok =
confirm(
"Delete Pricing?"
);

if(!ok) return;

await deleteDoc(

doc(
db,
PRICING,
id
)

);

};

/* =====================================================
ORDERS ANALYTICS
===================================================== */

function listenOrders(){

onSnapshot(

collection(
db,
ORDERS
),

(snapshot)=>{

orders=[];

snapshot.forEach(docSnap=>{

orders.push({

id:docSnap.id,

...docSnap.data()

});

});

updateRevenue();

}

);

}

/* =====================================================
REVENUE
===================================================== */

function updateRevenue(){

let revenue = 0;

orders.forEach(order=>{

revenue +=
Number(
order.amount || 0
);

});

$("revenueValue").textContent =
money(revenue);

$("ordersValue").textContent =
orders.length;

let topService = "-";

const count = {};

orders.forEach(order=>{

count[
order.serviceName
] =

(count[
order.serviceName
] || 0) + 1;

});

let highest = 0;

Object.keys(count)
.forEach(service=>{

if(
count[service] >
highest
){

highest =
count[service];

topService =
service;

}

});

$("topService").textContent =
topService;

}

/* =====================================================
STATS
===================================================== */

function updateStats(){

$("totalServices")
.textContent =
services.length;

$("activeServices")
.textContent =

services.filter(

s=>

s.status ===
"active"

).length;

$("totalOrders")
.textContent =
orders.length;

}

/* =====================================================
INIT
===================================================== */

function init(){

listenServices();

listenPricing();

listenOrders();

console.log(
"Services Ready 🚀"
);

}

document.addEventListener(
"DOMContentLoaded",
init
);
