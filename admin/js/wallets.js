/* =========================================================
FILE : admin/js/wallets.js
QUICKPRESS WALLET HISTORY SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot,
query,
orderBy,
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
">

<div>

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
ELEMENTS
========================================================= */

const walletContainer =
document.getElementById(
"walletContainer"
);

const searchInput =
document.getElementById(
"searchInput"
);

const typeFilter =
document.getElementById(
"typeFilter"
);

const partnerWallet =
document.getElementById(
"partnerWallet"
);

const riderWallet =
document.getElementById(
"riderWallet"
);

const totalCredit =
document.getElementById(
"totalCredit"
);

const totalDebit =
document.getElementById(
"totalDebit"
);

/* =========================================================
DATA
========================================================= */

let allTransactions = [];

/* =========================================================
REALTIME WALLET
========================================================= */

onSnapshot(

query(
collection(db,"walletTransactions"),
orderBy("createdAt","desc")
),

(snapshot)=>{

walletContainer.innerHTML = "";

allTransactions = [];

/* ========================================= */

let partnerTotal = 0;

let riderTotal = 0;

let creditTotal = 0;

let debitTotal = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const tx = {

id:docSnap.id,
...docSnap.data()

};

allTransactions.push(tx);

/* ========================================= */

const amount =
Number(tx.amount || 0);

/* ========================================= */

if(tx.userType === "Partner"){

partnerTotal += amount;

}

if(tx.userType === "Rider"){

riderTotal += amount;

}

/* ========================================= */

if(tx.transactionType === "Credit"){

creditTotal += amount;

}

if(tx.transactionType === "Debit"){

debitTotal += amount;

}

/* ========================================= */

renderTransaction(tx);

});

/* ========================================= */

partnerWallet.innerHTML =
`₹${partnerTotal}`;

riderWallet.innerHTML =
`₹${riderTotal}`;

totalCredit.innerHTML =
`₹${creditTotal}`;

totalDebit.innerHTML =
`₹${debitTotal}`;

}

/* END */

);

/* =========================================================
RENDER TRANSACTION
========================================================= */

function renderTransaction(tx){

const search =
searchInput.value
.toLowerCase();

const filter =
typeFilter.value;

/* ========================================= */

if(
search &&
!(
(tx.name || "")
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
tx.userType !== filter
){

return;

}

/* ========================================= */

const statusClass =
tx.transactionType === "Credit"

?

"credit"

:

"debit";

/* ========================================= */

const date =
tx.createdAt?.seconds

?

new Date(
tx.createdAt.seconds * 1000
).toLocaleDateString()

:

"--";

/* ========================================= */

const row = `

<div class="walletRow">

<!-- USER -->

<div class="user">

<div class="avatar">

${(tx.name || "U")
.charAt(0)
.toUpperCase()}

</div>

<div>

<b>

${tx.name || "Unknown"}

</b>

</div>

</div>

<!-- TYPE -->

<div>

${tx.userType || "--"}

</div>

<!-- AMOUNT -->

<div>

₹${tx.amount || 0}

</div>

<!-- TRANSACTION -->

<div>

<div class="status ${statusClass}">

${tx.transactionType || "--"}

</div>

</div>

<!-- DATE -->

<div>

${date}

</div>

<!-- ACTION -->

<div>

<button
class="actionBtn"
onclick="viewWallet('${tx.id}')">

View

</button>

</div>

</div>

`;

walletContainer.innerHTML += row;

}

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"input",
reloadTable
);

typeFilter.addEventListener(
"change",
reloadTable
);

/* =========================================================
RELOAD TABLE
========================================================= */

function reloadTable(){

walletContainer.innerHTML = "";

allTransactions.forEach((tx)=>{

renderTransaction(tx);

});

}

/* =========================================================
VIEW WALLET
========================================================= */

window.viewWallet =
(id)=>{

alert(
`Wallet Transaction ID : ${id}`
);

};

/* =========================================================
ADD DEMO TRANSACTION
========================================================= */

window.addDemoTransaction =
async()=>{

await addDoc(

collection(
db,
"walletTransactions"
),

{

name:"Demo Rider",

userType:"Rider",

amount:250,

transactionType:"Credit",

createdAt:
new Date()

}

);

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Wallet System Active"
);
