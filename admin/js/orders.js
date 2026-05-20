/* =========================================================
FILE : orders.js
REALTIME ORDER MANAGEMENT
========================================================= */

import { db }

from "../firebase.js";

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

const exportBtn =
document.getElementById(
"exportBtn"
);

/* =========================================================
GLOBAL
========================================================= */

let ordersData = [];
let currentFilter = "All";

/* =========================================================
LOAD ORDERS
========================================================= */

const q =
query(

collection(db,"orders"),

orderBy("createdAt","desc")

);

/* ========================================================= */

onSnapshot(
q,
(snapshot)=>{

ordersData = [];

snapshot.forEach(docSnap=>{

ordersData.push({

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

let filtered =
ordersData;

/* ========================================================= */

if(currentFilter !== "All"){

filtered =
ordersData.filter(
item=>item.status === currentFilter
);

}

/* ========================================================= */

filtered.forEach(order=>{

ordersTable.innerHTML += `

<tr>

<td>
#${order.id.slice(0,6)}
</td>

<td>

<div class="customer">

<b>
${order.name || "Unknown"}
</b>

<span>
${order.phone || "No Number"}
</span>

</div>

</td>

<td>

${order.items?.length || 1}

Items

</td>

<td>

${order.address || "No Address"}

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

${formatDate(order.createdAt)}

</td>

<td>

<div class="actionWrap">

<button
class="actionBtn"
onclick="viewOrder('${order.id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="actionBtn"
style="background:#2563EB;"
onclick="changeStatus('${order.id}','Preparing')">

<i class="fa-solid fa-box"></i>

</button>

<button
class="actionBtn"
style="background:#16A34A;"
onclick="changeStatus('${order.id}','Delivered')">

<i class="fa-solid fa-check"></i>

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
FORMAT DATE
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

/* ========================================================= */

btn.classList.add(
"active"
);

/* ========================================================= */

currentFilter =
btn.dataset.filter;

/* ========================================================= */

renderOrders();

});

});

/* =========================================================
VIEW ORDER
========================================================= */

window.viewOrder =
function(id){

const order =
ordersData.find(
item=>item.id === id
);

/* ========================================================= */

if(!order){

return;

}

/* ========================================================= */

alert(

`Customer : ${order.name}

Phone : ${order.phone}

Amount : ₹${order.total}

Status : ${order.status}

Address : ${order.address}

Payment : ${order.payment}`

);

}

/* =========================================================
UPDATE STATUS
========================================================= */

window.changeStatus =
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
"OrderID,Customer,Phone,Amount,Status\n";

/* ========================================================= */

ordersData.forEach(order=>{

csv +=

`${order.id},
${order.name},
${order.phone},
${order.total},
${order.status}\n`;

});

/* ========================================================= */

const blob =
new Blob(
[csv],
{
type:"text/csv"
}
);

/* ========================================================= */

const url =
URL.createObjectURL(blob);

/* ========================================================= */

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

toast.style.bottom =
"20px";

toast.style.right =
"20px";

toast.style.background =
"#111827";

toast.style.color =
"#fff";

toast.style.padding =
"14px 20px";

toast.style.borderRadius =
"14px";

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
