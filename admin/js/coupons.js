/* =========================================================
FILE : admin/js/coupons.js
QUICKPRESS COUPON MANAGEMENT SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
query,
orderBy,
onSnapshot,
addDoc,
updateDoc,
doc

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

const couponContainer =
document.getElementById(
"couponContainer"
);

const couponCode =
document.getElementById(
"couponCode"
);

const discount =
document.getElementById(
"discount"
);

const usageLimit =
document.getElementById(
"usageLimit"
);

const expiryDate =
document.getElementById(
"expiryDate"
);

/* =========================================================
REALTIME COUPONS
========================================================= */

onSnapshot(

query(
collection(db,"coupons"),
orderBy("createdAt","desc")
),

(snapshot)=>{

couponContainer.innerHTML = "";

/* ========================================= */

snapshot.forEach((docSnap)=>{

const coupon = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

renderCoupon(
coupon
);

});

}

/* END */

);

/* =========================================================
RENDER COUPON
========================================================= */

function renderCoupon(
coupon
){

let badgeClass =
"active";

/* ========================================= */

if(
coupon.status === "Expired"
){

badgeClass =
"expired";

}

/* ========================================= */

const row = `

<div class="couponRow">

<!-- CODE -->

<div>

<b>

${coupon.code || "--"}

</b>

</div>

<!-- DISCOUNT -->

<div>

${coupon.discount || 0}%

</div>

<!-- USED -->

<div>

${coupon.used || 0}

</div>

<!-- LIMIT -->

<div>

${coupon.limit || 0}

</div>

<!-- STATUS -->

<div>

<div class="badge ${badgeClass}">

${coupon.status || "Active"}

</div>

</div>

<!-- ACTION -->

<div>

<button
class="actionBtn"
onclick="expireCoupon('${coupon.id}')">

Expire

</button>

</div>

</div>

`;

couponContainer.innerHTML += row;

}

/* =========================================================
CREATE COUPON
========================================================= */

window.createCoupon =
async()=>{

const code =
couponCode.value.trim()
.toUpperCase();

const discountValue =
Number(
discount.value
);

const limit =
Number(
usageLimit.value
);

const expiry =
expiryDate.value;

/* ========================================= */

if(
!code
||
!discountValue
||
!limit
||
!expiry
){

alert(
"Fill all fields"
);

return;

}

/* ========================================= */

await addDoc(

collection(
db,
"coupons"
),

{

code,

discount:
discountValue,

limit,

used:0,

expiryDate:
expiry,

status:"Active",

createdAt:
new Date()

}

);

/* ========================================= */

couponCode.value = "";

discount.value = "";

usageLimit.value = "";

expiryDate.value = "";

/* ========================================= */

alert(
"Coupon Created"
);

};

/* =========================================================
EXPIRE COUPON
========================================================= */

window.expireCoupon =
async(id)=>{

await updateDoc(

doc(
db,
"coupons",
id
),

{

status:"Expired"

}

);

/* ========================================= */

alert(
"Coupon Expired"
);

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Coupon System Active"
);