/* =========================================================
FILE : js/orders.js
ADVANCE REALTIME ORDERS SYSTEM
========================================================= */

import { db }

from "../../firebase.js";

import {

collection,
query,
orderBy,
onSnapshot,
doc,
updateDoc,
deleteDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
ELEMENTS
========================================================= */

const ordersTable =
document.getElementById(
"ordersTable"
);

const filterBtns =
document.querySelectorAll(
".filterBtn"
);

const searchInput =
document.getElementById(
"searchInput"
);

const cityFilter =
document.getElementById(
"cityFilter"
);

const exportBtn =
document.getElementById(
"exportBtn"
);

/* =========================================================
GLOBAL
========================================================= */

let allOrders = [];

let currentFilter = "All";

/* =========================================================
LOAD ORDERS
========================================================= */

const ordersQuery =
query(

collection(db,"orders"),

orderBy("createdAt","desc")

);

/* ========================================================= */

onSnapshot(
ordersQuery,
(snapshot)=>{

allOrders = [];

/* ========================================================= */

snapshot.forEach(docSnap=>{

allOrders.push({

id:docSnap.id,
...docSnap.data()

});

});

/* ========================================================= */

renderOrders();

}
);

/* =========================================================
RENDER
========================================================= */

function renderOrders(){

ordersTable.innerHTML = "";

/* ========================================================= */

let filteredOrders =
allOrders;

/* =========================================================
STATUS FILTER
========================================================= */

if(currentFilter !== "All"){

filteredOrders =
filteredOrders.filter(
item=>

(item.status || "")
.toLowerCase()

===

currentFilter.toLowerCase()

);

}

/* =========================================================
CITY FILTER
========================================================= */

if(cityFilter.value !== "All"){

filteredOrders =
filteredOrders.filter(
item=>

(item.city || "")
.toLowerCase()

===

cityFilter.value.toLowerCase()

);

}

/* =========================================================
SEARCH FILTER
========================================================= */

const keyword =
searchInput.value.toLowerCase();

if(keyword){

filteredOrders =
filteredOrders.filter(item=>

(item.name || "")
.toLowerCase()
.includes(keyword)

||

(item.phone || "")
.toLowerCase()
.includes(keyword)

||

(item.id || "")
.toLowerCase()
.includes(keyword)

);

}

/* =========================================================
EMPTY
========================================================= */

if(filteredOrders.length === 0){

ordersTable.innerHTML = `

<tr>

<td colspan="11"
style="padding:80px;text-align:center;">

<i
class="fa-solid fa-box-open"
style="
font-size:70px;
color:#D1D5DB;
margin-bottom:20px;
display:block;
"></i>

<h2
style="
font-size:30px;
font-weight:900;
margin-bottom:10px;
">

No Orders Found

</h2>

<p
style="
font-size:14px;
font-weight:700;
color:#6B7280;
">

Realtime orders will appear here

</p>

</td>

</tr>

`;

return;

}

/* =========================================================
RENDER ROWS
========================================================= */

filteredOrders.forEach(order=>{

ordersTable.innerHTML += `

<tr>

<td>

#${order.id.slice(0,6)}

</td>

<td>

<div class="customer">

<b>
${order.name || "Customer"}
</b>

<span>
${order.phone || "No Number"}
</span>

</div>

</td>

<td>

${order.items?.length || 1} Items

</td>

<td>

${order.address || "No Address"}

</td>

<td>

${order.city || "Kasganj"}

</td>

<td>

₹${order.total || 0}

</td>

<td>

${order.payment || "COD"}

</td>

<td>

<span class="status ${getStatusClass(order.status)}">

${order.status || "Pending"}

</span>

</td>

<td>

<div class="trackBox">

<i class="fa-solid fa-location-dot"></i>

${order.tracking || "Order Received"}

</div>

</td>

<td>

${formatDate(order.createdAt)}

</td>

<td>

<div class="actionWrap">

<button
class="actionBtn"
style="background:#2563EB;"
onclick="viewOrder('${order.id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="actionBtn"
style="background:#7C3AED;"
onclick="updateStatus('${order.id}','Preparing')">

<i class="fa-solid fa-box"></i>

</button>

<button
class="actionBtn"
style="background:#16A34A;"
onclick="updateStatus('${order.id}','Delivered')">

<i class="fa-solid fa-check"></i>

</button>

<button
class="actionBtn"
style="background:#F97316;"
onclick="updateTracking('${order.id}')">

<i class="fa-solid fa-location-dot"></i>

</button>

<button
class="actionBtn"
style="background:#DC2626;"
onclick="deleteOrder('${order.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

});

}

/* =========================================================
STATUS CLASS
========================================================= */

function getStatusClass(status){

if(status === "Delivered"){

return "delivered";

}

if(status === "Preparing"){

return "processing";

}

if(status === "Cancelled"){

return "cancelled";

}

return "pending";

}

/* =========================================================
DATE
========================================================= */

function formatDate(timestamp){

if(!timestamp){

return "Now";

}

try{

return timestamp
.toDate()
.toLocaleString();

}catch{

return "Now";

}

}

/* =========================================================
FILTER BUTTONS
========================================================= */

filterBtns.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

filterBtns.forEach(item=>{

item.classList.remove(
"active"
);

});

btn.classList.add(
"active"
);

currentFilter =
btn.dataset.filter;

renderOrders();

});

});

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"input",
renderOrders
);

cityFilter.addEventListener(
"change",
renderOrders
);

/* =========================================================
VIEW ORDER
========================================================= */

window.viewOrder =
function(id){

const order =
allOrders.find(
item=>item.id === id
);

if(!order){

return;

}

/* ========================================================= */

alert(

`Customer : ${order.name}

Phone : ${order.phone}

Amount : ₹${order.total}

Payment : ${order.payment}

Status : ${order.status}

Tracking : ${order.tracking || "Order Received"}

Address : ${order.address}`

);

}

/* =========================================================
UPDATE STATUS
========================================================= */

window.updateStatus =
async function(id,status){

await updateDoc(

doc(db,"orders",id),

{

status:status

}

);

showToast(
`Order ${status}`
);

}

/* =========================================================
LIVE TRACKING
========================================================= */

window.updateTracking =
async function(id){

const tracking =
prompt(

"Update Tracking",

"Rider On The Way"

);

if(!tracking){

return;

}

/* ========================================================= */

await updateDoc(

doc(db,"orders",id),

{

tracking:tracking

}

);

showToast(
"Tracking Updated"
);

}

/* =========================================================
DELETE ORDER
========================================================= */

window.deleteOrder =
async function(id){

const confirmDelete =
confirm(
"Delete this order?"
);

if(!confirmDelete){

return;

}

/* ========================================================= */

await deleteDoc(
doc(db,"orders",id)
);

showToast(
"Order Deleted"
);

}

/* =========================================================
EXPORT CSV
========================================================= */

exportBtn.addEventListener(
"click",
()=>{

let csv =
"OrderID,Customer,Phone,Amount,Status,City\n";

/* ========================================================= */

allOrders.forEach(order=>{

csv +=

`${order.id},
${order.name},
${order.phone},
${order.total},
${order.status},
${order.city}\n`;

});

/* ========================================================= */

const blob =
new Blob(
[csv],
{
type:"text/csv"
}
);

const url =
URL.createObjectURL(blob);

const a =
document.createElement("a");

a.href = url;

a.download =
"quickpress-orders.csv";

a.click();

URL.revokeObjectURL(url);

showToast(
"CSV Exported"
);

});

/* =========================================================
TOAST
========================================================= */

function showToast(message){

const toast =
document.createElement(
"div"
);

toast.innerHTML =
message;

toast.style.position =
"fixed";

toast.style.right =
"20px";

toast.style.bottom =
"20px";

toast.style.background =
"#111827";

toast.style.color =
"#fff";

toast.style.padding =
"14px 20px";

toast.style.borderRadius =
"16px";

toast.style.fontWeight =
"800";

toast.style.zIndex =
"99999";

document.body.appendChild(
toast
);

setTimeout(()=>{

toast.remove();

},3000);

}
