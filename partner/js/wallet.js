/* =========================================================
FILE : partner/js/wallet.js
QUICKPRESS PARTNER WALLET SYSTEM
========================================================= */

import { db }

from "../../firebase.js";

import {

collection,
query,
where,
onSnapshot,
addDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
PARTNER SESSION
========================================================= */

const partner =

JSON.parse(

localStorage.getItem(
"partnerSession"
)

);

/* ========================================================= */

if(!partner){

window.location.href =
"login.html";

}

/* =========================================================
ELEMENTS
========================================================= */

const availableBalance =
document.getElementById(
"availableBalance"
);

const pendingSettlement =
document.getElementById(
"pendingSettlement"
);

const commissionAmount =
document.getElementById(
"commissionAmount"
);

const totalRevenue =
document.getElementById(
"totalRevenue"
);

const nextSettlement =
document.getElementById(
"nextSettlement"
);

const completedOrders =
document.getElementById(
"completedOrders"
);

const transactionsContainer =
document.getElementById(
"transactionsContainer"
);

const withdrawBtn =
document.getElementById(
"withdrawBtn"
);

/* =========================================================
SETTINGS
========================================================= */

const COMMISSION_RATE = 20;

const SETTLEMENT_DAYS = 7;

/* =========================================================
LOAD ORDERS
========================================================= */

const ordersQuery =

query(

collection(db,"orders"),

where(
"partnerId",
"==",
partner.uid
),

where(
"status",
"==",
"Completed"
)

);

/* ========================================================= */

onSnapshot(
ordersQuery,
(snapshot)=>{

transactionsContainer.innerHTML = "";

/* ========================================================= */

let total = 0;

let commission = 0;

let available = 0;

let pending = 0;

let orderCount = 0;

/* ========================================================= */

snapshot.forEach(docSnap=>{

const order =
docSnap.data();

orderCount++;

/* ========================================================= */

const amount =
order.total || 0;

const commissionCut =

(amount * COMMISSION_RATE)
/ 100;

const finalAmount =
amount - commissionCut;

/* ========================================================= */

total += amount;

commission += commissionCut;

/* =========================================================
7 DAYS SETTLEMENT
========================================================= */

const orderDate =

new Date(
order.updatedAt?.seconds * 1000
);

const now =
new Date();

const diffDays =

Math.floor(

(now - orderDate)

/

(1000 * 60 * 60 * 24)

);

/* ========================================================= */

if(diffDays >= 7){

available += finalAmount;

}

else{

pending += finalAmount;

}

/* =========================================================
TRANSACTION UI
========================================================= */

transactionsContainer.innerHTML += `

<div class="transactionItem">

<div class="transactionLeft">

<div class="transactionIcon">

<i class="fa-solid fa-wallet"></i>

</div>

<div class="transactionInfo">

<h3>
${order.orderId || "QP102"}
</h3>

<p>
Settlement after 7 days
</p>

</div>

</div>

<div class="transactionRight">

<div class="transactionAmount credit">

+ ₹${finalAmount}

</div>

<p>

Commission:
₹${commissionCut}

</p>

</div>

</div>

`;

});

/* =========================================================
UPDATE UI
========================================================= */

availableBalance.innerHTML =
"₹" + available;

pendingSettlement.innerHTML =
"₹" + pending;

commissionAmount.innerHTML =
"₹" + commission;

totalRevenue.innerHTML =
"₹" + total;

nextSettlement.innerHTML =
"₹" + pending;

completedOrders.innerHTML =
orderCount;

}
);

/* =========================================================
WITHDRAW REQUEST
========================================================= */

withdrawBtn.addEventListener(
"click",
async()=>{

try{

await addDoc(

collection(db,"settlements"),

{

partnerId:partner.uid,

partnerName:partner.name,

amount:

availableBalance.innerText
.replace("₹",""),

status:"Pending",

createdAt:new Date()

}

);

/* ========================================================= */

showToast(
"Settlement Request Sent"
);

}catch(error){

console.log(error);

showToast(
"Failed"
);

}

}
);

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
"16px";

toast.style.fontWeight =
"800";

toast.style.zIndex =
"999999";

document.body.appendChild(
toast
);

setTimeout(()=>{

toast.remove();

},3000);

}
