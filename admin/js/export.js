/* =========================================================
FILE : admin/js/export.js
QUICKPRESS EXPORT CENTER
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
getDocs

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
">

<div style="text-align:center;">

<div style="
font-size:90px;
margin-bottom:20px;
">

🖥️

</div>

<h1 style="
font-size:42px;
font-weight:900;
margin-bottom:10px;
">

Desktop Only

</h1>

<p style="
font-size:15px;
color:#D1D5DB;
">

QuickPress Admin Panel only works on Desktop

</p>

</div>

</div>

`;

}

/* =========================================================
CSV DOWNLOAD
========================================================= */

function downloadCSV(
filename,
rows
){

const processRow =
(row)=>{

return row.map((value)=>{

const escaped =
String(value || "")
.replace(/"/g,'""');

return `"${escaped}"`;

}).join(",");

};

/* ========================================= */

const csvContent =
rows.map(processRow)
.join("\n");

/* ========================================= */

const blob =
new Blob(
[csvContent],
{
type:"text/csv"
}
);

/* ========================================= */

const url =
window.URL.createObjectURL(blob);

const a =
document.createElement("a");

a.href = url;

a.download = filename;

a.click();

window.URL.revokeObjectURL(url);

}

/* =========================================================
EXPORT ORDERS CSV
========================================================= */

window.exportOrdersCSV =
async()=>{

const snapshot =
await getDocs(
collection(db,"orders")
);

/* ========================================= */

const rows = [

[
"Order ID",
"Customer",
"Mobile",
"City",
"Amount",
"Status",
"Partner",
"Rider"
]

];

/* ========================================= */

snapshot.forEach((docSnap)=>{

const order =
docSnap.data();

rows.push([

docSnap.id,

order.name || "",

order.mobile || "",

order.city || "",

order.total || 0,

order.status || "",

order.partnerName || "",

order.riderName || ""

]);

});

/* ========================================= */

downloadCSV(
"quickpress_orders.csv",
rows
);

};

/* =========================================================
EXPORT USERS CSV
========================================================= */

window.exportUsersCSV =
async()=>{

const snapshot =
await getDocs(
collection(db,"users")
);

/* ========================================= */

const rows = [

[
"User ID",
"Name",
"Mobile",
"City",
"Wallet",
"Orders"
]

];

/* ========================================= */

snapshot.forEach((docSnap)=>{

const user =
docSnap.data();

rows.push([

docSnap.id,

user.name || "",

user.mobile || "",

user.city || "",

user.wallet || 0,

user.orders || 0

]);

});

/* ========================================= */

downloadCSV(
"quickpress_users.csv",
rows
);

};

/* =========================================================
EXPORT FINANCE CSV
========================================================= */

window.exportFinanceCSV =
async()=>{

const snapshot =
await getDocs(
collection(db,"payments")
);

/* ========================================= */

const rows = [

[
"Payment ID",
"Order ID",
"Amount",
"Method",
"Status",
"Date"
]

];

/* ========================================= */

snapshot.forEach((docSnap)=>{

const pay =
docSnap.data();

rows.push([

docSnap.id,

pay.orderId || "",

pay.amount || 0,

pay.method || "",

pay.status || "",

pay.date || ""

]);

});

/* ========================================= */

downloadCSV(
"quickpress_finance.csv",
rows
);

};

/* =========================================================
EXPORT PARTNERS CSV
========================================================= */

window.exportPartnersCSV =
async()=>{

const snapshot =
await getDocs(
collection(db,"partners")
);

/* ========================================= */

const rows = [

[
"Partner ID",
"Name",
"City",
"Earnings",
"Orders"
]

];

/* ========================================= */

snapshot.forEach((docSnap)=>{

const partner =
docSnap.data();

rows.push([

docSnap.id,

partner.name || "",

partner.city || "",

partner.earnings || 0,

partner.orders || 0

]);

});

/* ========================================= */

downloadCSV(
"quickpress_partners.csv",
rows
);

};

/* =========================================================
EXPORT RIDERS CSV
========================================================= */

window.exportRidersCSV =
async()=>{

const snapshot =
await getDocs(
collection(db,"riders")
);

/* ========================================= */

const rows = [

[
"Rider ID",
"Name",
"City",
"Earnings",
"Trips",
"Online"
]

];

/* ========================================= */

snapshot.forEach((docSnap)=>{

const rider =
docSnap.data();

rows.push([

docSnap.id,

rider.name || "",

rider.city || "",

rider.earnings || 0,

rider.trips || 0,

rider.online || false

]);

});

/* ========================================= */

downloadCSV(
"quickpress_riders.csv",
rows
);

};

/* =========================================================
EXPORT WALLET CSV
========================================================= */

window.exportWalletCSV =
async()=>{

const snapshot =
await getDocs(
collection(db,"walletTransactions")
);

/* ========================================= */

const rows = [

[
"Transaction ID",
"Name",
"Type",
"Amount",
"Transaction"
]

];

/* ========================================= */

snapshot.forEach((docSnap)=>{

const tx =
docSnap.data();

rows.push([

docSnap.id,

tx.name || "",

tx.userType || "",

tx.amount || 0,

tx.transactionType || ""

]);

});

/* ========================================= */

downloadCSV(
"quickpress_wallets.csv",
rows
);

};

/* =========================================================
EXCEL PLACEHOLDER
========================================================= */

window.exportOrdersExcel =
()=>{

alert(
"Excel Export Coming Next Update"
);

};

window.exportUsersExcel =
()=>{

alert(
"Excel Export Coming Next Update"
);

};

window.exportFinanceExcel =
()=>{

alert(
"Excel Export Coming Next Update"
);

};

window.exportPartnersExcel =
()=>{

alert(
"Excel Export Coming Next Update"
);

};

window.exportRidersExcel =
()=>{

alert(
"Excel Export Coming Next Update"
);

};

window.exportWalletExcel =
()=>{

alert(
"Excel Export Coming Next Update"
);

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Export Center Active"
);
