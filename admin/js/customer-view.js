/* =========================================================
FILE : admin/js/customer-view.js
QUICKPRESS CUSTOMER PROFILE
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

doc,
getDoc,
collection,
query,
where,
onSnapshot,
updateDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
AUTH CHECK
========================================================= */

const adminLogin =
localStorage.getItem(
"quickpress_admin"
);

if(adminLogin !== "true"){

window.location.href =
"login.html";

}

/* =========================================================
GET CUSTOMER ID
========================================================= */

const params =
new URLSearchParams(
window.location.search
);

const customerId =
params.get("id");

/* =========================================================
ELEMENTS
========================================================= */

const customerAvatar =
document.getElementById(
"customerAvatar"
);

const customerName =
document.getElementById(
"customerName"
);

const customerMobile =
document.getElementById(
"customerMobile"
);

const customerStatus =
document.getElementById(
"customerStatus"
);

const customerWallet =
document.getElementById(
"customerWallet"
);

const customerOrders =
document.getElementById(
"customerOrders"
);

const customerCity =
document.getElementById(
"customerCity"
);

const customerAddress =
document.getElementById(
"customerAddress"
);

const adminNotes =
document.getElementById(
"adminNotes"
);

const ordersContainer =
document.getElementById(
"ordersContainer"
);

/* =========================================================
LOAD CUSTOMER
========================================================= */

async function loadCustomer(){

if(!customerId){

alert(
"Customer ID Missing"
);

return;

}

/* ========================================= */

const customerRef =
doc(
db,
"users",
customerId
);

const customerSnap =
await getDoc(
customerRef
);

/* ========================================= */

if(!customerSnap.exists()){

alert(
"Customer Not Found"
);

return;

}

/* ========================================= */

const user =
customerSnap.data();

/* ========================================= */

customerAvatar.innerHTML =
(user.name || "U")
.charAt(0)
.toUpperCase();

customerName.innerHTML =
user.name || "--";

customerMobile.innerHTML =
user.mobile || "--";

customerWallet.innerHTML =
`₹${user.wallet || 0}`;

customerOrders.innerHTML =
user.orders || 0;

customerCity.innerHTML =
user.city || "--";

customerAddress.innerHTML =
user.address || "--";

adminNotes.value =
user.notes || "";

/* ========================================= */

const status =
user.status || "Active";

customerStatus.innerHTML =
status;

/* ========================================= */

customerStatus.className =
"badge";

/* ========================================= */

if(status === "VIP"){

customerStatus.classList.add(
"vip"
);

}

else if(status === "Blocked"){

customerStatus.classList.add(
"blocked"
);

}

else{

customerStatus.classList.add(
"active"
);

}

}

/* =========================================================
LOAD ORDERS
========================================================= */

function loadOrders(){

const q =
query(

collection(
db,
"orders"
),

where(
"userId",
"==",
customerId
)

);

/* ========================================= */

onSnapshot(q,(snapshot)=>{

ordersContainer.innerHTML = "";

/* ========================================= */

snapshot.forEach((docSnap)=>{

const order = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

let statusClass =
"pending";

if(order.status === "Delivered"){

statusClass = "delivered";

}

if(order.status === "Out For Delivery"){

statusClass = "delivery";

}

/* ========================================= */

const row = `

<div class="orderRow">

<div>

#${order.orderId || docSnap.id}

</div>

<div>

${order.itemsCount || 0} Items

</div>

<div>

₹${order.total || 0}

</div>

<div>

<div class="status ${statusClass}">

${order.status || "Pending"}

</div>

</div>

<div>

${order.time || "--"}

</div>

</div>

`;

ordersContainer.innerHTML += row;

});

});

}

/* =========================================================
SAVE NOTES
========================================================= */

window.saveNotes =
async()=>{

await updateDoc(

doc(
db,
"users",
customerId
),

{

notes:
adminNotes.value

}

);

/* ========================================= */

alert(
"Notes Saved"
);

};

/* =========================================================
INIT
========================================================= */

loadCustomer();

loadOrders();

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Customer Profile Active"
);
