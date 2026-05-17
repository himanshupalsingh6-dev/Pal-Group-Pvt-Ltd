/* =========================================================
FILE : admin/js/subscriptions.js
QUICKPRESS SUBSCRIPTION SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
query,
orderBy,
onSnapshot,
addDoc

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

const subscriberContainer =
document.getElementById(
"subscriberContainer"
);

const totalSubscribers =
document.getElementById(
"totalSubscribers"
);

const monthlyRevenue =
document.getElementById(
"monthlyRevenue"
);

const activePlans =
document.getElementById(
"activePlans"
);

const expiredPlans =
document.getElementById(
"expiredPlans"
);

/* =========================================================
REALTIME SUBSCRIPTIONS
========================================================= */

onSnapshot(

query(
collection(db,"subscriptions"),
orderBy("createdAt","desc")
),

(snapshot)=>{

subscriberContainer.innerHTML = "";

/* ========================================= */

let total = 0;
let revenue = 0;
let active = 0;
let expired = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const sub = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

total++;

revenue +=
Number(
sub.amount || 0
);

/* ========================================= */

if(sub.status === "Expired"){

expired++;

}

else{

active++;

}

/* ========================================= */

renderSubscriber(
sub
);

});

/* ========================================= */

totalSubscribers.innerHTML =
total;

monthlyRevenue.innerHTML =
`₹${revenue}`;

activePlans.innerHTML =
active;

expiredPlans.innerHTML =
expired;

}

/* END */

);

/* =========================================================
RENDER SUBSCRIBER
========================================================= */

function renderSubscriber(sub){

let badgeClass =
"active";

/* ========================================= */

if(sub.status === "Expired"){

badgeClass =
"expired";

}

/* ========================================= */

const row = `

<div class="userRow">

<!-- CUSTOMER -->

<div>

<b>

${sub.customerName || "--"}

</b>

<br>

${sub.mobile || "--"}

</div>

<!-- PLAN -->

<div>

${sub.plan || "--"}

</div>

<!-- START -->

<div>

${sub.startDate || "--"}

</div>

<!-- EXPIRY -->

<div>

${sub.expiryDate || "--"}

</div>

<!-- STATUS -->

<div>

<div class="badge ${badgeClass}">

${sub.status || "Active"}

</div>

</div>

</div>

`;

subscriberContainer.innerHTML += row;

}

/* =========================================================
ADD PLAN
========================================================= */

window.addPlan =
async()=>{

const customerName =
prompt(
"Customer Name"
);

if(!customerName){

return;

}

/* ========================================= */

const mobile =
prompt(
"Mobile Number"
);

const plan =
prompt(
"Plan Name"
);

const amount =
prompt(
"Amount"
);

const expiryDate =
prompt(
"Expiry Date"
);

/* ========================================= */

await addDoc(

collection(
db,
"subscriptions"
),

{

customerName,
mobile,
plan,

amount:
Number(amount),

startDate:
new Date()
.toLocaleDateString(),

expiryDate,

status:"Active",

createdAt:
new Date()

}

);

/* ========================================= */

alert(
"Subscription Added"
);

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Subscription System Active"
);
