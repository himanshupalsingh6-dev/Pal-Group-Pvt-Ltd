/* =========================================================
FILE : admin/js/partners.js
ADVANCE PARTNER MANAGEMENT
========================================================= */

import {

db

}

from "../../firebase.js";

import {

collection,
onSnapshot,
doc,
updateDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
ELEMENTS
========================================================= */

const partnersTable =
document.getElementById(
"partnersTable"
);

const totalPartners =
document.getElementById(
"totalPartners"
);

const onlinePartners =
document.getElementById(
"onlinePartners"
);

const totalRevenue =
document.getElementById(
"totalRevenue"
);

const activeOrders =
document.getElementById(
"activeOrders"
);

const searchInput =
document.getElementById(
"searchInput"
);

const cityFilter =
document.getElementById(
"cityFilter"
);

const statusFilter =
document.getElementById(
"statusFilter"
);

/* =========================================================
LOAD PARTNERS
========================================================= */

onSnapshot(

collection(db,"partners"),

(snapshot)=>{

partnersTable.innerHTML = "";

/* ========================================================= */

let partnerCount = 0;
let onlineCount = 0;
let revenueCount = 0;
let orderCount = 0;

const cities = [];

/* ========================================================= */

snapshot.forEach(docSnap=>{

const partner =
docSnap.data();

const partnerId =
docSnap.id;

/* ========================================================= */

partnerCount++;

revenueCount +=
partner.earnings || 0;

orderCount +=
partner.orders || 0;

/* ========================================================= */

if(partner.online){

onlineCount++;

}

/* ========================================================= */

if(
partner.city &&
!cities.includes(
partner.city
)
){

cities.push(
partner.city
);

}

/* ========================================================= */

partnersTable.innerHTML += `

<tr class="partnerRow">

<td>

<div class="partnerBox">

<img
src="${partner.profile || 'https://i.ibb.co/3SWQHfY/user.png'}"
class="partnerImage">

<div class="partnerInfo">

<h4>
${partner.name || 'Partner'}
</h4>

<p>
${partner.shop || 'QuickPress'}
</p>

</div>

</div>

</td>

<td>
${partner.city || '-'}
</td>

<td>
₹${partner.earnings || 0}
</td>

<td>
${partner.orders || 0}
</td>

<td>
₹${partner.wallet || 0}
</td>

<td>

<div class="status ${partner.online ? 'active' : 'offline'}">

${partner.online ? 'Online' : 'Offline'}

</div>

</td>

<td>

<div class="actionButtons">

<button
class="actionBtn viewBtn"
onclick="viewPartner('${partnerId}')">

View

</button>

<button
class="actionBtn walletBtn"
onclick="walletPartner('${partnerId}')">

Wallet

</button>

<button
class="actionBtn disableBtn"
onclick="togglePartner(
'${partnerId}',
${partner.shopDisabled ? true : false}
)">

${partner.shopDisabled ? 'Enable' : 'Disable'}

</button>

</div>

</td>

</tr>

`;

});

/* =========================================================
UPDATE CARDS
========================================================= */

totalPartners.innerHTML =
partnerCount;

onlinePartners.innerHTML =
onlineCount;

totalRevenue.innerHTML =
"₹" + revenueCount;

activeOrders.innerHTML =
orderCount;

/* =========================================================
CITY FILTER
========================================================= */

cityFilter.innerHTML =
`<option value="">All Cities</option>`;

/* ========================================================= */

cities.forEach(city=>{

cityFilter.innerHTML += `

<option value="${city}">
${city}
</option>

`;

});

}
);

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"keyup",
filterPartners
);

cityFilter.addEventListener(
"change",
filterPartners
);

statusFilter.addEventListener(
"change",
filterPartners
);

/* =========================================================
FILTER
========================================================= */

function filterPartners(){

const search =
searchInput.value.toLowerCase();

const city =
cityFilter.value.toLowerCase();

const status =
statusFilter.value.toLowerCase();

/* ========================================================= */

document
.querySelectorAll(".partnerRow")
.forEach(row=>{

const text =
row.innerText.toLowerCase();

/* ========================================================= */

const showSearch =
text.includes(search);

const showCity =
city === "" || text.includes(city);

const showStatus =
status === "" || text.includes(status);

/* ========================================================= */

if(
showSearch &&
showCity &&
showStatus
){

row.style.display =
"table-row";

}

else{

row.style.display =
"none";

}

});

}

/* =========================================================
VIEW
========================================================= */

window.viewPartner = (id)=>{

window.location.href =
`partner-view.html?id=${id}`;

};

/* =========================================================
WALLET
========================================================= */

window.walletPartner = (id)=>{

window.location.href =
`partner-wallet.html?id=${id}`;

};

/* =========================================================
ENABLE DISABLE
========================================================= */

window.togglePartner =
async(id,status)=>{

try{

await updateDoc(

doc(
db,
"partners",
id
),

{

shopDisabled:!status,

updatedAt:new Date()

}

);

/* ========================================================= */

showToast(

status
?
"Partner Enabled"
:
"Partner Disabled"

);

}catch(error){

console.log(error);

}

};

/* =========================================================
TOAST
========================================================= */

function showToast(message){

const toast =
document.createElement(
"div"
);

/* ========================================================= */

toast.innerHTML =
message;

/* ========================================================= */

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
"18px";

toast.style.fontWeight =
"800";

toast.style.zIndex =
"999999";

/* ========================================================= */

document.body.appendChild(
toast
);

/* ========================================================= */

setTimeout(()=>{

toast.remove();

},3000);

}
