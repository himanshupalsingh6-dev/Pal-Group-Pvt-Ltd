/* =========================================================
FILE : admin/js/payments.js
QUICKPRESS ENTERPRISE FINANCE PANEL
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot,
query,
orderBy

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
DESKTOP ONLY
========================================================= */

const isMobile =
/Android|iPhone|iPad|iPod/i
.test(
navigator.userAgent
);

if(
window.innerWidth < 1024
||
isMobile
){

document.body.innerHTML = `

<div
style="
height:100vh;
display:flex;
align-items:center;
justify-content:center;
background:#111827;
color:white;
font-family:Inter,sans-serif;
text-align:center;
padding:30px;
">

<div>

<div
style="
font-size:80px;
margin-bottom:20px;
">

🖥️

</div>

<h1
style="
font-size:42px;
font-weight:900;
">

Desktop Only

</h1>

<p
style="
margin-top:12px;
font-size:16px;
line-height:1.7;
color:#D1D5DB;
">

QuickPress Admin Panel only works on Laptop/Desktop

</p>

</div>

</div>

`;

}

/* =========================================================
ELEMENTS
========================================================= */

const paymentsContainer =
document.getElementById(
"paymentsContainer"
);

const searchInput =
document.getElementById(
"searchInput"
);

const totalRevenue =
document.getElementById(
"totalRevenue"
);

const onlineRevenue =
document.getElementById(
"onlineRevenue"
);

const codRevenue =
document.getElementById(
"codRevenue"
);

const walletRevenue =
document.getElementById(
"walletRevenue"
);

const partnerPayout =
document.getElementById(
"partnerPayout"
);

const adminProfit =
document.getElementById(
"adminProfit"
);

/* =========================================================
DATA
========================================================= */

let allPayments = [];

let financeChart;

/* =========================================================
REALTIME PAYMENTS
========================================================= */

onSnapshot(

query(
collection(db,"orders"),
orderBy("createdAt","desc")
),

(snapshot)=>{

allPayments = [];

let total = 0;

let online = 0;
let cod = 0;
let wallet = 0;

let payout = 0;

let admin = 0;

/* ========================================= */

paymentsContainer.innerHTML = "";

/* ========================================= */

snapshot.forEach((docSnap)=>{

const payment = {

id:docSnap.id,
...docSnap.data()

};

allPayments.push(payment);

/* ========================================= */

const amount =
Number(payment.total || 0);

total += amount;

/* =========================================
PAYMENT TYPES
========================================= */

if(payment.paymentMethod === "Online"){

online += amount;

}

if(payment.paymentMethod === "COD"){

cod += amount;

}

if(payment.paymentMethod === "Wallet"){

wallet += amount;

}

/* =========================================
PAYOUT
60 Partner
20 Rider
20 Admin
========================================= */

const partnerShare =
amount * 0.60;

const riderShare =
amount * 0.20;

const adminShare =
amount * 0.20;

payout +=
partnerShare + riderShare;

admin +=
adminShare;

/* =========================================
SEARCH
========================================= */

const search =
searchInput.value
.toLowerCase();

if(
search &&
!(
(payment.name || "")
.toLowerCase()
.includes(search)
)
){

return;

}

/* =========================================
STATUS
========================================= */

const statusClass =
payment.paymentStatus === "Paid"

?

"success"

:

"pending";

const statusText =
payment.paymentStatus || "Pending";

/* =========================================
ROW
========================================= */

const row = `

<div class="paymentRow">

<div>

#${payment.id.slice(0,6)}

</div>

<div>

<b>

${payment.name || "Customer"}

</b>

</div>

<div>

₹${amount}

</div>

<div>

₹${partnerShare.toFixed(0)}

</div>

<div>

₹${riderShare.toFixed(0)}

</div>

<div>

${payment.paymentMethod || "COD"}

</div>

<div>

<div class="status ${statusClass}">

${statusText}

</div>

</div>

</div>

`;

paymentsContainer.innerHTML += row;

});

/* =========================================
UPDATE STATS
========================================= */

totalRevenue.innerHTML =
`₹${total.toFixed(0)}`;

onlineRevenue.innerHTML =
`₹${online.toFixed(0)}`;

codRevenue.innerHTML =
`₹${cod.toFixed(0)}`;

walletRevenue.innerHTML =
`₹${wallet.toFixed(0)}`;

partnerPayout.innerHTML =
`₹${payout.toFixed(0)}`;

adminProfit.innerHTML =
`₹${admin.toFixed(0)}`;

/* =========================================
GRAPH
========================================= */

loadFinanceChart();

}

/* END */

);

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"input",
()=>{

paymentsContainer.innerHTML = "";

allPayments.forEach((payment)=>{

const search =
searchInput.value
.toLowerCase();

if(
search &&
!(
(payment.name || "")
.toLowerCase()
.includes(search)
)
){

return;

}

const amount =
Number(payment.total || 0);

const partnerShare =
amount * 0.60;

const riderShare =
amount * 0.20;

const statusClass =
payment.paymentStatus === "Paid"

?

"success"

:

"pending";

const statusText =
payment.paymentStatus || "Pending";

const row = `

<div class="paymentRow">

<div>

#${payment.id.slice(0,6)}

</div>

<div>

<b>

${payment.name || "Customer"}

</b>

</div>

<div>

₹${amount}

</div>

<div>

₹${partnerShare.toFixed(0)}

</div>

<div>

₹${riderShare.toFixed(0)}

</div>

<div>

${payment.paymentMethod || "COD"}

</div>

<div>

<div class="status ${statusClass}">

${statusText}

</div>

</div>

</div>

`;

paymentsContainer.innerHTML += row;

});

});

/* =========================================================
GRAPH
========================================================= */

function loadFinanceChart(){

const ctx =
document.getElementById(
"financeChart"
);

/* ========================================= */

if(financeChart){

financeChart.destroy();

}

/* ========================================= */

let online = 0;
let cod = 0;
let wallet = 0;

/* ========================================= */

allPayments.forEach((payment)=>{

const amount =
Number(payment.total || 0);

if(payment.paymentMethod === "Online"){

online += amount;

}

if(payment.paymentMethod === "COD"){

cod += amount;

}

if(payment.paymentMethod === "Wallet"){

wallet += amount;

}

});

/* ========================================= */

financeChart =
new Chart(ctx, {

type:'bar',

data:{

labels:[
'Online',
'COD',
'Wallet'
],

datasets:[{

label:'Revenue',

data:[
online,
cod,
wallet
],

borderWidth:2

}]

},

options:{

responsive:true,

plugins:{

legend:{
display:false
}

}

}

});

}
