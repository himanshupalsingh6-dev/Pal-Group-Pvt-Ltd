/* =========================================================
FILE : admin/js/partner-view.js
PARTNER DETAILS SYSTEM
========================================================= */

import {

db

}

from "../../firebase.js";

import {

doc,
getDoc,
updateDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
GET ID
========================================================= */

const params =
new URLSearchParams(
window.location.search
);

const partnerId =
params.get("id");

/* =========================================================
LOAD PARTNER
========================================================= */

async function loadPartner(){

try{

const partnerRef =

await getDoc(

doc(
db,
"partners",
partnerId
)

);

/* ========================================================= */

if(!partnerRef.exists()){

alert(
"Partner Not Found"
);

return;

}

/* ========================================================= */

const partner =
partnerRef.data();

/* =========================================================
PROFILE
========================================================= */

document.getElementById(
"profileImage"
).src =

partner.profile ||
"https://i.ibb.co/3SWQHfY/user.png";

/* ========================================================= */

document.getElementById(
"partnerName"
).innerHTML =

partner.name || "Partner";

/* ========================================================= */

document.getElementById(
"partnerShop"
).innerHTML =

partner.shop || "QuickPress";

/* =========================================================
CARDS
========================================================= */

document.getElementById(
"partnerRevenue"
).innerHTML =

"₹" + (partner.earnings || 0);

/* ========================================================= */

document.getElementById(
"partnerOrders"
).innerHTML =

partner.orders || 0;

/* ========================================================= */

document.getElementById(
"partnerWallet"
).innerHTML =

"₹" + (partner.wallet || 0);

/* ========================================================= */

document.getElementById(
"partnerRiders"
).innerHTML =

partner.riders || 0;

/* =========================================================
DETAILS
========================================================= */

document.getElementById(
"ownerName"
).innerHTML =

partner.name || "-";

/* ========================================================= */

document.getElementById(
"ownerPhone"
).innerHTML =

partner.phone || "-";

/* ========================================================= */

document.getElementById(
"ownerEmail"
).innerHTML =

partner.email || "-";

/* ========================================================= */

document.getElementById(
"ownerCity"
).innerHTML =

partner.city || "-";

/* ========================================================= */

document.getElementById(
"gstNumber"
).innerHTML =

partner.gst || "-";

/* ========================================================= */

document.getElementById(
"joinDate"
).innerHTML =

new Date(
partner.createdAt?.seconds * 1000
).toLocaleDateString();

/* =========================================================
DISABLE BTN
========================================================= */

const disableBtn =
document.getElementById(
"disableBtn"
);

/* ========================================================= */

if(partner.shopDisabled){

disableBtn.innerHTML =
"Enable";

}

/* ========================================================= */

disableBtn.addEventListener(

"click",

async()=>{

await togglePartner(
partner.shopDisabled
);

}

);

/* =========================================================
NAVIGATION
========================================================= */

document
.getElementById(
"walletBtn"
)
.addEventListener(
"click",
()=>{

window.location.href =
`partner-wallet.html?id=${partnerId}`;

}
);

/* ========================================================= */

document
.getElementById(
"analyticsBtn"
)
.addEventListener(
"click",
()=>{

window.location.href =
`partner-analytics.html?id=${partnerId}`;

}
);

/* ========================================================= */

document
.getElementById(
"viewOrdersBtn"
)
.addEventListener(
"click",
()=>{

window.location.href =
`orders.html?partner=${partnerId}`;

}
);

}catch(error){

console.log(error);

}

}

/* =========================================================
DISABLE ENABLE
========================================================= */

async function togglePartner(status){

try{

await updateDoc(

doc(
db,
"partners",
partnerId
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

/* ========================================================= */

setTimeout(()=>{

location.reload();

},1000);

}catch(error){

console.log(error);

}

}

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

/* ========================================================= */

loadPartner();
