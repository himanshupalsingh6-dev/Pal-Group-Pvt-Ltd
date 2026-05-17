/* =========================================================
FILE : admin/js/settlements.js
QUICKPRESS ENTERPRISE SETTLEMENT PANEL
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot,
query,
orderBy,
doc,
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
ELEMENTS
========================================================= */

const settlementContainer =
document.getElementById(
"settlementContainer"
);

const totalSettlement =
document.getElementById(
"totalSettlement"
);

const partnerSettlement =
document.getElementById(
"partnerSettlement"
);

const riderSettlement =
document.getElementById(
"riderSettlement"
);

const adminSettlement =
document.getElementById(
"adminSettlement"
);

const pendingSettlement =
document.getElementById(
"pendingSettlement"
);

/* =========================================================
DATA
========================================================= */

let allOrders = [];

/* =========================================================
REALTIME DATA
========================================================= */

onSnapshot(

query(
collection(db,"orders"),
orderBy("createdAt","desc")
),

(snapshot)=>{

allOrders = [];

snapshot.forEach((docSnap)=>{

allOrders.push({

id:docSnap.id,
...docSnap.data()

});

});

/* ========================================= */

loadSettlements();

}

/* END */

);

/* =========================================================
LOAD SETTLEMENTS
========================================================= */

function loadSettlements(){

settlementContainer.innerHTML = "";

/* =========================================
GROUP BY PARTNER
========================================= */

let partnerMap = {};

let total = 0;

let partnerTotal = 0;

let riderTotal = 0;

let adminTotal = 0;

let pending = 0;

/* ========================================= */

allOrders.forEach((order)=>{

const partner =
order.partnerName || "Unassigned";

/* ========================================= */

if(!partnerMap[partner]){

partnerMap[partner] = {

orders:0,
revenue:0,
partnerPayout:0,
riderPayout:0,
adminProfit:0,
status:"Pending"

};

}

/* ========================================= */

const amount =
Number(order.total || 0);

const partnerShare =
amount * 0.60;

const riderShare =
amount * 0.20;

const adminShare =
amount * 0.20;

/* ========================================= */

partnerMap[partner].orders += 1;

partnerMap[partner].revenue += amount;

partnerMap[partner].partnerPayout += partnerShare;

partnerMap[partner].riderPayout += riderShare;

partnerMap[partner].adminProfit += adminShare;

/* ========================================= */

total += amount;

partnerTotal += partnerShare;

riderTotal += riderShare;

adminTotal += adminShare;

/* ========================================= */

if(order.settlementPaid !== true){

pending += partnerShare;

}

});

/* =========================================
UPDATE STATS
========================================= */

totalSettlement.innerHTML =
`₹${total.toFixed(0)}`;

partnerSettlement.innerHTML =
`₹${partnerTotal.toFixed(0)}`;

riderSettlement.innerHTML =
`₹${riderTotal.toFixed(0)}`;

adminSettlement.innerHTML =
`₹${adminTotal.toFixed(0)}`;

pendingSettlement.innerHTML =
`₹${pending.toFixed(0)}`;

/* =========================================
RENDER ROWS
========================================= */

Object.keys(partnerMap)
.forEach((partner)=>{

const data =
partnerMap[partner];

/* =====================================
STATUS
===================================== */

const statusClass =
data.status === "Paid"

?

"paid"

:

"pending";

/* =====================================
ROW
===================================== */

const row = `

<div class="row">

<!-- PARTNER -->

<div class="partner">

<div class="avatar">

${partner
.charAt(0)}

</div>

<div>

<b>

${partner}

</b>

</div>

</div>

<!-- ORDERS -->

<div>

${data.orders}

</div>

<!-- REVENUE -->

<div>

₹${data.revenue.toFixed(0)}

</div>

<!-- PAYOUT -->

<div>

₹${data.partnerPayout.toFixed(0)}

</div>

<!-- STATUS -->

<div>

<div class="status ${statusClass}">

${data.status}

</div>

</div>

<!-- ACTION -->

<div>

<button
class="payBtn"
onclick="paySettlement('${partner}')">

Pay Now

</button>

</div>

</div>

`;

settlementContainer.innerHTML += row;

});

}

/* =========================================================
PAY SETTLEMENT
========================================================= */

window.paySettlement =
async(partner)=>{

const confirmPay =
confirm(

`Pay settlement to ${partner}?`

);

if(!confirmPay){

return;

}

/* =========================================
UPDATE ORDERS
========================================= */

allOrders.forEach(async(order)=>{

if(order.partnerName === partner){

await updateDoc(

doc(db,"orders",order.id),

{

settlementPaid:true,
settlementDate:new Date()

}

);

}

});

/* ========================================= */

alert(
"Settlement Paid Successfully"
);

};
