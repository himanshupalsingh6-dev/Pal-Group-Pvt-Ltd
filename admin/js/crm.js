/* =========================================================
FILE : admin/js/crm.js
QUICKPRESS CRM SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
query,
orderBy,
onSnapshot,
updateDoc,
doc

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
ELEMENTS
========================================================= */

const customerContainer =
document.getElementById(
"customerContainer"
);

const totalCustomers =
document.getElementById(
"totalCustomers"
);

const vipCustomers =
document.getElementById(
"vipCustomers"
);

const blockedCustomers =
document.getElementById(
"blockedCustomers"
);

const activeCustomers =
document.getElementById(
"activeCustomers"
);

const searchInput =
document.getElementById(
"searchInput"
);

const statusFilter =
document.getElementById(
"statusFilter"
);

/* =========================================================
DATA
========================================================= */

let allCustomers = [];

/* =========================================================
REALTIME USERS
========================================================= */

onSnapshot(

query(
collection(db,"users"),
orderBy("createdAt","desc")
),

(snapshot)=>{

customerContainer.innerHTML = "";

allCustomers = [];

/* ========================================= */

let total = 0;
let vip = 0;
let blocked = 0;
let active = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const user = {

id:docSnap.id,
...docSnap.data()

};

allCustomers.push(user);

/* ========================================= */

total++;

/* ========================================= */

if(user.status === "VIP"){

vip++;

}

if(user.status === "Blocked"){

blocked++;

}

if(
user.status === "Active"
||
!user.status
){

active++;

}

/* ========================================= */

renderCustomer(user);

});

/* ========================================= */

totalCustomers.innerHTML =
total;

vipCustomers.innerHTML =
vip;

blockedCustomers.innerHTML =
blocked;

activeCustomers.innerHTML =
active;

}

/* END */

);

/* =========================================================
RENDER CUSTOMER
========================================================= */

function renderCustomer(user){

const search =
searchInput.value
.toLowerCase();

const filter =
statusFilter.value;

/* ========================================= */

if(
search &&
!(
(user.name || "")
.toLowerCase()
.includes(search)
)
){

return;

}

/* ========================================= */

if(
filter !== "All"
&&
(user.status || "Active") !== filter
){

return;

}

/* ========================================= */

let badgeClass = "active";

if(user.status === "VIP"){

badgeClass = "vip";

}

if(user.status === "Blocked"){

badgeClass = "blocked";

}

/* ========================================= */

const card = `

<div class="customerCard">

<!-- TOP -->

<div class="customerTop">

<div class="customerInfo">

<div class="avatar">

${(user.name || "U")
.charAt(0)
.toUpperCase()}

</div>

<div>

<h3>

${user.name || "Customer"}

</h3>

<p>

${user.mobile || "--"}

</p>

</div>

</div>

<div class="badge ${badgeClass}">

${user.status || "Active"}

</div>

</div>

<!-- DETAILS -->

<div class="detailsGrid">

<div class="detailBox">

<span>
Orders
</span>

<h4>

${user.orders || 0}

</h4>

</div>

<div class="detailBox">

<span>
Wallet
</span>

<h4>

₹${user.wallet || 0}

</h4>

</div>

<div class="detailBox">

<span>
City
</span>

<h4>

${user.city || "--"}

</h4>

</div>

<div class="detailBox">

<span>
Address
</span>

<h4>

${user.address || "--"}

</h4>

</div>

</div>

<!-- BUTTONS -->

<div class="buttonGrid">

<button
class="actionBtn viewBtn"
onclick="viewCustomer('${user.id}')">

View

</button>

<button
class="actionBtn callBtn"
onclick="callCustomer('${user.mobile}')">

Call

</button>

<button
class="actionBtn whatsappBtn"
onclick="whatsappCustomer('${user.mobile}')">

WhatsApp

</button>

<button
class="actionBtn blockBtn"
onclick="blockCustomer('${user.id}')">

Block

</button>

</div>

</div>

`;

customerContainer.innerHTML += card;

}

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"input",
reloadCustomers
);

statusFilter.addEventListener(
"change",
reloadCustomers
);

/* =========================================================
RELOAD
========================================================= */

function reloadCustomers(){

customerContainer.innerHTML = "";

allCustomers.forEach((user)=>{

renderCustomer(user);

});

}

/* =========================================================
VIEW CUSTOMER
========================================================= */

window.viewCustomer =
(id)=>{

alert(
"Customer ID : " + id
);

};

/* =========================================================
CALL CUSTOMER
========================================================= */

window.callCustomer =
(mobile)=>{

window.location.href =
`tel:${mobile}`;

};

/* =========================================================
WHATSAPP
========================================================= */

window.whatsappCustomer =
(mobile)=>{

window.open(

`https://wa.me/91${mobile}`,

"_blank"

);

};

/* =========================================================
BLOCK CUSTOMER
========================================================= */

window.blockCustomer =
async(id)=>{

const confirmBlock =
confirm(
"Block this customer?"
);

if(!confirmBlock){

return;

}

/* ========================================= */

await updateDoc(

doc(
db,
"users",
id
),

{

status:"Blocked"

}

);

/* ========================================= */

alert(
"Customer Blocked"
);

};

/* =========================================================
EXPORT CUSTOMERS
========================================================= */

window.exportCustomers =
()=>{

alert(
"Export System Coming Next"
);

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress CRM Active"
);
