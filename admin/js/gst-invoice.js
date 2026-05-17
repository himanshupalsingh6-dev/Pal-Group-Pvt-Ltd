/* =========================================================
FILE : admin/js/gst-invoice.js
QUICKPRESS GST INVOICE SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
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

const customerName =
document.getElementById(
"customerName"
);

const serviceName =
document.getElementById(
"serviceName"
);

const amount =
document.getElementById(
"amount"
);

const gst =
document.getElementById(
"gst"
);

/* ========================================= */

const invoiceDate =
document.getElementById(
"invoiceDate"
);

const invoiceNumber =
document.getElementById(
"invoiceNumber"
);

const previewCustomer =
document.getElementById(
"previewCustomer"
);

const invoiceItems =
document.getElementById(
"invoiceItems"
);

const subtotal =
document.getElementById(
"subtotal"
);

const gstAmount =
document.getElementById(
"gstAmount"
);

const grandTotal =
document.getElementById(
"grandTotal"
);

/* =========================================================
INVOICE ID
========================================================= */

function generateInvoiceId(){

return "INV-"

+

Math.floor(
1000 + Math.random() * 9000
);

}

/* =========================================================
GENERATE INVOICE
========================================================= */

window.generateInvoice =
async()=>{

const customer =
customerName.value.trim();

const service =
serviceName.value.trim();

const price =
Number(
amount.value
);

const gstPercent =
Number(
gst.value
);

/* ========================================= */

if(
!customer
||
!service
||
!price
){

alert(
"Fill all fields"
);

return;

}

/* ========================================= */

const gstValue =
(price * gstPercent) / 100;

const total =
price + gstValue;

/* ========================================= */

const invoiceId =
generateInvoiceId();

/* ========================================= */

invoiceDate.innerHTML =
new Date()
.toLocaleDateString();

invoiceNumber.innerHTML =
invoiceId;

previewCustomer.innerHTML =
customer;

/* ========================================= */

invoiceItems.innerHTML = `

<div class="itemRow">

<div>
${service}
</div>

<div>
₹${price}
</div>

<div>
₹${gstValue.toFixed(2)}
</div>

<div>
₹${total.toFixed(2)}
</div>

</div>

`;

/* ========================================= */

subtotal.innerHTML =
`₹${price}`;

gstAmount.innerHTML =
`₹${gstValue.toFixed(2)}`;

grandTotal.innerHTML =
`₹${total.toFixed(2)}`;

/* =========================================
SAVE FIREBASE
========================================= */

await addDoc(

collection(
db,
"invoices"
),

{

invoiceId,

customer,

service,

amount:price,

gst:gstPercent,

gstAmount:gstValue,

grandTotal:total,

date:
new Date()
.toLocaleString(),

createdAt:
new Date()

}

);

/* ========================================= */

alert(
"GST Invoice Generated"
);

};

/* =========================================================
DOWNLOAD INVOICE
========================================================= */

window.downloadInvoice =
()=>{

window.print();

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress GST Invoice Active"
);
