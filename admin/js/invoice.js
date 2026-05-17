/* =========================================================
FILE : admin/js/invoice.js
QUICKPRESS GST INVOICE SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

doc,
getDoc

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

const invoiceId =
document.getElementById(
"invoiceId"
);

const orderId =
document.getElementById(
"orderId"
);

const invoiceDate =
document.getElementById(
"invoiceDate"
);

const paymentMethod =
document.getElementById(
"paymentMethod"
);

const customerDetails =
document.getElementById(
"customerDetails"
);

const deliveryDetails =
document.getElementById(
"deliveryDetails"
);

const invoiceItems =
document.getElementById(
"invoiceItems"
);

const subTotal =
document.getElementById(
"subTotal"
);

const cgst =
document.getElementById(
"cgst"
);

const sgst =
document.getElementById(
"sgst"
);

const deliveryCharge =
document.getElementById(
"deliveryCharge"
);

const grandTotal =
document.getElementById(
"grandTotal"
);

const downloadBtn =
document.getElementById(
"downloadBtn"
);

/* =========================================================
GET ORDER ID
========================================================= */

const params =
new URLSearchParams(
window.location.search
);

const orderID =
params.get("id");

/* =========================================================
LOAD INVOICE
========================================================= */

async function loadInvoice(){

if(!orderID){

alert(
"Order ID Missing"
);

return;

}

/* ========================================= */

const orderRef =
doc(
db,
"orders",
orderID
);

const orderSnap =
await getDoc(
orderRef
);

/* ========================================= */

if(!orderSnap.exists()){

alert(
"Order Not Found"
);

return;

}

/* ========================================= */

const order =
orderSnap.data();

/* =====================================================
INVOICE INFO
===================================================== */

invoiceId.innerHTML =
`INV-${orderID.slice(0,6)}`;

orderId.innerHTML =
orderID;

invoiceDate.innerHTML =
new Date()
.toLocaleDateString();

paymentMethod.innerHTML =
order.paymentMethod || "COD";

/* =====================================================
CUSTOMER
===================================================== */

customerDetails.innerHTML = `

<b>
${order.name || "Customer"}
</b>

<br><br>

📞 ${order.mobile || "--"}

<br>

📧 ${order.email || "--"}

<br>

🏙 ${order.city || "--"}

`;

/* =====================================================
DELIVERY
===================================================== */

deliveryDetails.innerHTML = `

📍 ${order.address || "--"}

<br><br>

🏪 Partner :
${order.partnerName || "--"}

<br>

🛵 Rider :
${order.riderName || "--"}

<br>

📦 Status :
${order.status || "Pending"}

`;

/* =====================================================
ITEMS
===================================================== */

invoiceItems.innerHTML = "";

/* ========================================= */

let subtotalAmount = 0;

/* ========================================= */

const items =
order.items || [];

/* ========================================= */

items.forEach((item)=>{

const qty =
Number(item.qty || 1);

const price =
Number(item.price || 0);

const total =
qty * price;

/* ========================================= */

subtotalAmount += total;

/* ========================================= */

const row = `

<div class="tableRow">

<div>

${item.name || "Service"}

</div>

<div>

${qty}

</div>

<div>

₹${price}

</div>

<div>

₹${total}

</div>

</div>

`;

invoiceItems.innerHTML += row;

});

/* =====================================================
GST
===================================================== */

const cgstAmount =
subtotalAmount * 0.09;

const sgstAmount =
subtotalAmount * 0.09;

const deliveryAmount =
Number(
order.deliveryCharge || 20
);

const finalTotal =
subtotalAmount
+
cgstAmount
+
sgstAmount
+
deliveryAmount;

/* =====================================================
UPDATE TOTALS
===================================================== */

subTotal.innerHTML =
`₹${subtotalAmount.toFixed(2)}`;

cgst.innerHTML =
`₹${cgstAmount.toFixed(2)}`;

sgst.innerHTML =
`₹${sgstAmount.toFixed(2)}`;

deliveryCharge.innerHTML =
`₹${deliveryAmount.toFixed(2)}`;

grandTotal.innerHTML =
`₹${finalTotal.toFixed(2)}`;

}

/* =========================================================
DOWNLOAD PDF
========================================================= */

downloadBtn.addEventListener(
"click",
()=>{

window.print();

});

/* =========================================================
INIT
========================================================= */

loadInvoice();

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Invoice System Active"
);
