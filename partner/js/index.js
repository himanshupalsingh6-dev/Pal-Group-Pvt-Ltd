/* =========================================================
FILE : partner/js/index.js
QUICKPRESS PARTNER DASHBOARD
========================================================= */

import { db }

from "../../firebase.js";

import {

doc,
getDoc,
collection,
query,
where,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
SESSION
========================================================= */

const partnerSession =

JSON.parse(

localStorage.getItem(
"partner"
)

);

/* ========================================================= */

if(!partnerSession){

window.location.href =
"login.html";

}

/* =========================================================
ELEMENTS
========================================================= */

const partnerName =
document.getElementById(
"partnerName"
);

const partnerCity =
document.getElementById(
"partnerCity"
);

const todayOrders =
document.getElementById(
"todayOrders"
);

const todayRevenue =
document.getElementById(
"todayRevenue"
);

const processingOrders =
document.getElementById(
"processingOrders"
);

const walletBalance =
document.getElementById(
"walletBalance"
);

const ordersContainer =
document.getElementById(
"ordersContainer"
);

/* =========================================================
LOAD PARTNER
========================================================= */

async function loadPartner(){

const partnerRef =

await getDoc(

doc(

db,
"partners",
partnerSession.uid

)

);

/* ========================================================= */

if(!partnerRef.exists()){

showToast(
"Partner not found"
);

return;

}

/* ========================================================= */

const data =
partnerRef.data();

/* ========================================================= */

partnerName.innerHTML =
data.name || "Partner";

partnerCity.innerHTML =
data.city || "Kasganj";

walletBalance.innerHTML =

"₹" +

(data.wallet || 0);

}

/* =========================================================
LOAD ORDERS
========================================================= */

const ordersQuery =

query(

collection(db,"orders"),

where(
"partnerId",
"==",
partnerSession.uid
)

);

/* ========================================================= */

onSnapshot(
ordersQuery,
(snapshot)=>{

ordersContainer.innerHTML = "";

/* ========================================================= */

let totalOrders = 0;

let totalRevenue = 0;

let processing = 0;

/* ========================================================= */

snapshot.forEach(docSnap=>{

const order =
docSnap.data();

totalOrders++;

totalRevenue +=
order.total || 0;

/* ========================================================= */

if(
order.status === "Processing"
){

processing++;

}

/* ========================================================= */

ordersContainer.innerHTML += `

<div class="orderItem">

<div class="orderLeft">

<h3>
${order.orderId || "QP102"}
</h3>

<p>
${order.customerName || "Customer"}
</p>

</div>

<div class="orderStatus ${order.status === 'Ready' ? 'ready' : 'processing'}">

${order.status || "Processing"}

</div>

</div>

`;

});

/* ========================================================= */

todayOrders.innerHTML =
totalOrders;

todayRevenue.innerHTML =

"₹" +

totalRevenue;

processingOrders.innerHTML =
processing;

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
"99999";

document.body.appendChild(
toast
);

setTimeout(()=>{

toast.remove();

},3000);

}

/* ========================================================= */

loadPartner();
