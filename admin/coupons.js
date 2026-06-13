/* =========================================================
QUICKPRESS COUPONS PANEL
FILE: coupons.js
PART 1/5
========================================================= */

/* =========================================================
FIREBASE IMPORTS
========================================================= */

import { db } from "../js/firebase.js";

import {

collection,
getDocs,
addDoc,
updateDoc,
deleteDoc,
doc,
serverTimestamp,
orderBy,
query

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
GLOBAL STATE
========================================================= */

let coupons = [];

let couponUsage = [];

/* =========================================================
COLLECTIONS
========================================================= */

const COUPONS_COLLECTION =
"coupons";

const COUPON_USAGE_COLLECTION =
"couponUsage";

/* =========================================================
HELPERS
========================================================= */

function setText(
id,
value
){

const el =
document.getElementById(id);

if(el){

el.innerText =
value;

}

}

function formatCurrency(
amount = 0
){

return "₹" +

Number(amount)

.toLocaleString(
"en-IN"
);

}

function formatDate(
date
){

if(!date)
return "-";

try{

if(date.seconds){

return new Date(
date.seconds * 1000
)

.toLocaleDateString(
"en-IN"
);

}

return new Date(date)

.toLocaleDateString(
"en-IN"
);

}catch{

return "-";

}

}

/* =========================================================
LOAD COUPONS
========================================================= */

async function loadCoupons(){

try{

const snapshot =

await getDocs(

query(

collection(
db,
COUPONS_COLLECTION
),

orderBy(
"createdAt",
"desc"
)

)

);

coupons = [];

snapshot.forEach(docSnap=>{

coupons.push({

id:docSnap.id,

...docSnap.data()

});

});

console.log(
"Coupons Loaded:",
coupons.length
);

}catch(error){

console.error(
"Coupon Load Error",
error
);

}

}

/* =========================================================
LOAD COUPON USAGE
========================================================= */

async function loadCouponUsage(){

try{

const snapshot =

await getDocs(

collection(
db,
COUPON_USAGE_COLLECTION
)

);

couponUsage = [];

snapshot.forEach(docSnap=>{

couponUsage.push({

id:docSnap.id,

...docSnap.data()

});

});

console.log(
"Coupon Usage Loaded:",
couponUsage.length
);

}catch(error){

console.error(
error
);

}

}

/* =========================================================
ANALYTICS
========================================================= */

function updateCouponAnalytics(){

const totalCoupons =
coupons.length;

const activeCoupons =

coupons.filter(

coupon=>

coupon.status ===
"active"

).length;

const today = new Date();

const expiredCoupons =

coupons.filter(coupon=>{

if(!coupon.expiryDate)
return false;

const expiry =

coupon.expiryDate.seconds

?

new Date(
coupon.expiryDate.seconds * 1000
)

:

new Date(
coupon.expiryDate
);

return expiry < today;

}).length;

const totalUsage =

couponUsage.length;

setText(
"totalCoupons",
totalCoupons
);

setText(
"activeCoupons",
activeCoupons
);

setText(
"expiredCoupons",
expiredCoupons
);

setText(
"totalUsage",
totalUsage
);

}

/* =========================================================
MODALS
========================================================= */

window.openCouponModal =

function(){

document

.getElementById(
"couponModal"
)

.classList.add(
"active"
);

};

window.closeCouponModal =

function(){

document

.getElementById(
"couponModal"
)

.classList.remove(
"active"
);

};

/* =========================================================
CREATE COUPON
========================================================= */

window.saveCoupon =

async function(){

try{

const couponCode =

document.getElementById(
"couponCode"
).value

.trim()

.toUpperCase();

const couponType =

document.getElementById(
"couponType"
).value;

const discountValue =

Number(

document.getElementById(
"discountValue"
).value

);

const maxDiscount =

Number(

document.getElementById(
"maxDiscount"
).value

);

const minOrderValue =

Number(

document.getElementById(
"minOrderValue"
).value

);

const usageLimit =

Number(

document.getElementById(
"usageLimit"
).value

);

const perUserLimit =

Number(

document.getElementById(
"perUserLimit"
).value

);

const status =

document.getElementById(
"couponStatus"
).value;

const description =

document.getElementById(
"couponDescription"
).value;

if(!couponCode){

alert(
"Coupon Code Required"
);

return;

}

await addDoc(

collection(
db,
COUPONS_COLLECTION
),

{

code:couponCode,

type:couponType,

value:discountValue,

maxDiscount,

minOrderValue,

usageLimit,

perUserLimit,

status,

description,

firstOrderOnly:

document.getElementById(
"firstOrderOnly"
).checked,

referralCoupon:

document.getElementById(
"referralCoupon"
).checked,

festivalCoupon:

document.getElementById(
"festivalCoupon"
).checked,

freeDelivery:

document.getElementById(
"freeDelivery"
).checked,

usedCount:0,

createdAt:
serverTimestamp()

}

);

closeCouponModal();

await loadCoupons();

updateCouponAnalytics();

alert(
"Coupon Created Successfully"
);

}catch(error){

console.error(
error
);

alert(
"Coupon Create Failed"
);

}

};/* =========================================================
RENDER COUPONS TABLE
========================================================= */

function renderCouponsTable(){

const tbody =
document.getElementById(
"couponTableBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

coupons.forEach(coupon=>{

let statusClass =
"statusInactive";

if(coupon.status === "active"){

statusClass =
"statusActive";

}

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>

<strong>

${coupon.code || "-"}

</strong>

</td>

<td>

${coupon.type || "-"}

</td>

<td>

${coupon.type === "percentage"

? coupon.value + "%"

: formatCurrency(
coupon.value
)}

</td>

<td>

${formatCurrency(
coupon.minOrderValue || 0
)}

</td>

<td>

${coupon.usedCount || 0}

/

${coupon.usageLimit || 0}

</td>

<td>

${formatDate(
coupon.expiryDate
)}

</td>

<td>

<span class="${statusClass}">

${coupon.status || "inactive"}

</span>

</td>

<td>

<button
class="secondaryBtn"
onclick="editCoupon(
'${coupon.id}'
)">

Edit

</button>

<button
class="warningBtn"
onclick="toggleCouponStatus(
'${coupon.id}',
'${coupon.status}'
)">

${coupon.status === "active"
? "Disable"
: "Enable"}

</button>

<button
class="dangerBtn"
onclick="openDeleteCouponModal(
'${coupon.id}'
)">

Delete

</button>

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
EDIT COUPON
========================================================= */

window.editCoupon =
function(couponId){

const coupon =

coupons.find(

item=>item.id === couponId

);

if(!coupon)
return;

document.getElementById(
"couponId"
).value = coupon.id;

document.getElementById(
"couponCode"
).value = coupon.code || "";

document.getElementById(
"couponType"
).value = coupon.type || "percentage";

document.getElementById(
"discountValue"
).value = coupon.value || 0;

document.getElementById(
"maxDiscount"
).value = coupon.maxDiscount || 0;

document.getElementById(
"minOrderValue"
).value = coupon.minOrderValue || 0;

document.getElementById(
"usageLimit"
).value = coupon.usageLimit || 0;

document.getElementById(
"perUserLimit"
).value = coupon.perUserLimit || 1;

document.getElementById(
"couponStatus"
).value = coupon.status || "active";

document.getElementById(
"couponDescription"
).value = coupon.description || "";

document.getElementById(
"firstOrderOnly"
).checked =
coupon.firstOrderOnly || false;

document.getElementById(
"referralCoupon"
).checked =
coupon.referralCoupon || false;

document.getElementById(
"festivalCoupon"
).checked =
coupon.festivalCoupon || false;

document.getElementById(
"freeDelivery"
).checked =
coupon.freeDelivery || false;

openCouponModal();

};

/* =========================================================
UPDATE COUPON
========================================================= */

window.updateCoupon =
async function(){

try{

const couponId =

document.getElementById(
"couponId"
).value;

await updateDoc(

doc(
db,
COUPONS_COLLECTION,
couponId
),

{

code:

document.getElementById(
"couponCode"
).value

.toUpperCase(),

type:

document.getElementById(
"couponType"
).value,

value:Number(

document.getElementById(
"discountValue"
).value

),

maxDiscount:Number(

document.getElementById(
"maxDiscount"
).value

),

minOrderValue:Number(

document.getElementById(
"minOrderValue"
).value

),

usageLimit:Number(

document.getElementById(
"usageLimit"
).value

),

perUserLimit:Number(

document.getElementById(
"perUserLimit"
).value

),

status:

document.getElementById(
"couponStatus"
).value,

description:

document.getElementById(
"couponDescription"
).value

}

);

closeCouponModal();

await loadCoupons();

renderCouponsTable();

alert(
"Coupon Updated"
);

}catch(error){

console.error(
error
);

alert(
"Update Failed"
);

}

};

/* =========================================================
DELETE COUPON MODAL
========================================================= */

window.openDeleteCouponModal =
function(id){

document.getElementById(
"deleteCouponId"
).value = id;

document.getElementById(
"deleteCouponModal"
)

.classList.add(
"active"
);

};

window.closeDeleteCouponModal =
function(){

document.getElementById(
"deleteCouponModal"
)

.classList.remove(
"active"
);

};

/* =========================================================
DELETE COUPON
========================================================= */

window.confirmDeleteCoupon =
async function(){

try{

const couponId =

document.getElementById(
"deleteCouponId"
).value;

await deleteDoc(

doc(
db,
COUPONS_COLLECTION,
couponId
)

);

closeDeleteCouponModal();

await loadCoupons();

renderCouponsTable();

updateCouponAnalytics();

alert(
"Coupon Deleted"
);

}catch(error){

console.error(
error
);

alert(
"Delete Failed"
);

}

};

/* =========================================================
ACTIVATE / DEACTIVATE
========================================================= */

window.toggleCouponStatus =
async function(
couponId,
currentStatus
){

try{

const newStatus =

currentStatus === "active"

?

"inactive"

:

"active";

await updateDoc(

doc(
db,
COUPONS_COLLECTION,
couponId
),

{

status:newStatus

}

);

await loadCoupons();

renderCouponsTable();

updateCouponAnalytics();

}catch(error){

console.error(
error
);

}

};/* =========================================================
COUPON PERFORMANCE ANALYTICS
========================================================= */

function updateCouponPerformance(){

const analyticsBody =

document.getElementById(
"couponAnalyticsBody"
);

if(!analyticsBody)
return;

analyticsBody.innerHTML = "";

let totalDiscountGiven = 0;
let totalRevenueGenerated = 0;

let bestCoupon = "-";
let bestRevenue = 0;

let mostUsedCoupon = "-";
let mostUsedCount = 0;

coupons.forEach(coupon=>{

const usageRecords =

couponUsage.filter(

item=>

item.couponCode === coupon.code

);

const totalUses =

usageRecords.length;

const revenueGenerated =

usageRecords.reduce(

(sum,item)=>

sum +

Number(
item.orderAmount || 0
),

0

);

const discountGiven =

usageRecords.reduce(

(sum,item)=>

sum +

Number(
item.discountAmount || 0
),

0

);

const conversionRate =

coupon.usageLimit

?

(

totalUses /

coupon.usageLimit

*

100

).toFixed(1)

:

0;

totalDiscountGiven +=
discountGiven;

totalRevenueGenerated +=
revenueGenerated;

if(

revenueGenerated >

bestRevenue

){

bestRevenue =
revenueGenerated;

bestCoupon =
coupon.code;

}

if(

totalUses >

mostUsedCount

){

mostUsedCount =
totalUses;

mostUsedCoupon =
coupon.code;

}

const row =

document.createElement(
"tr"
);

row.innerHTML = `

<td>

${coupon.code}

</td>

<td>

${totalUses}

</td>

<td>

${formatCurrency(
revenueGenerated
)}

</td>

<td>

${formatCurrency(
discountGiven
)}

</td>

<td>

${conversionRate}%

</td>

<td>

${revenueGenerated > 50000

? "🔥 Excellent"

: revenueGenerated > 10000

? "📈 Good"

: "⚪ Average"

}

</td>

`;

analyticsBody.appendChild(
row
);

});

setText(
"bestCoupon",
bestCoupon
);

setText(
"mostUsedCoupon",
mostUsedCoupon
);

setText(
"totalDiscountGiven",
formatCurrency(
totalDiscountGiven
)
);

const avgConversion =

coupons.length

?

(

couponUsage.length

/

coupons.length

).toFixed(1)

:

0;

setText(
"conversionRate",
avgConversion + "%"
);

setText(
"couponRevenue",
formatCurrency(
totalRevenueGenerated
)
);

}

/* =========================================================
UNIQUE USERS
========================================================= */

function updateUniqueUsers(){

const users =

new Set();

couponUsage.forEach(item=>{

if(item.userId){

users.add(
item.userId
);

}

});

setText(
"uniqueUsers",
users.size
);

}

/* =========================================================
COUPON ORDERS
========================================================= */

function updateCouponOrders(){

setText(
"couponOrders",
couponUsage.length
);

}

/* =========================================================
AVERAGE DISCOUNT
========================================================= */

function updateAverageDiscount(){

const totalDiscount =

couponUsage.reduce(

(sum,item)=>

sum +

Number(
item.discountAmount || 0
),

0

);

const average =

couponUsage.length

?

totalDiscount /

couponUsage.length

:

0;

setText(
"avgDiscount",
formatCurrency(
average
)
);

}

/* =========================================================
EXPIRED COUPONS TABLE
========================================================= */

function renderExpiredCoupons(){

const tbody =

document.getElementById(
"expiredCouponsBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

const today =
new Date();

coupons.forEach(coupon=>{

if(!coupon.expiryDate)
return;

const expiry =

coupon.expiryDate.seconds

?

new Date(
coupon.expiryDate.seconds * 1000
)

:

new Date(
coupon.expiryDate
);

if(expiry > today)
return;

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${coupon.code}</td>

<td>${coupon.type}</td>

<td>

${coupon.type === "percentage"

? coupon.value + "%"

: formatCurrency(
coupon.value
)}

</td>

<td>

${coupon.usedCount || 0}

</td>

<td>

${formatDate(
coupon.expiryDate
)}

</td>

<td>

<span class="statusExpired">

Expired

</span>

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
REFRESH ANALYTICS
========================================================= */

function refreshCouponAnalytics(){

updateCouponPerformance();

updateUniqueUsers();

updateCouponOrders();

updateAverageDiscount();

renderExpiredCoupons();

console.log(
"Coupon Analytics Updated"
);

}/* =========================================================
COUPON HISTORY
========================================================= */

function renderCouponHistory(){

const tbody =

document.getElementById(
"couponHistoryBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

couponUsage

.sort((a,b)=>{

const aDate =
a.createdAt?.seconds || 0;

const bDate =
b.createdAt?.seconds || 0;

return bDate - aDate;

})

.forEach(item=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>

${item.couponCode || "-"}

</td>

<td>

${item.userName || "-"}

</td>

<td>

${item.orderId || "-"}

</td>

<td>

${formatCurrency(
item.discountAmount || 0
)}

</td>

<td>

${formatDate(
item.createdAt
)}

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
SEARCH FILTER
========================================================= */

function initCouponSearch(){

const searchInput =

document.getElementById(
"couponSearch"
);

if(!searchInput)
return;

searchInput.addEventListener(

"input",

e=>{

const value =

e.target.value
.toLowerCase();

document

.querySelectorAll(
"#couponTableBody tr"
)

.forEach(row=>{

row.style.display =

row.innerText

.toLowerCase()

.includes(value)

?

""

:

"none";

});

}

);

}

/* =========================================================
STATUS FILTER
========================================================= */

function initStatusFilter(){

const filter =

document.getElementById(
"statusFilter"
);

if(!filter)
return;

filter.addEventListener(

"change",

()=>{

const value =

filter.value;

document

.querySelectorAll(
"#couponTableBody tr"
)

.forEach(row=>{

if(!value){

row.style.display = "";

return;

}

row.style.display =

row.innerText

.toLowerCase()

.includes(value)

?

""

:

"none";

});

}

);

}

/* =========================================================
COUPON TYPE FILTER
========================================================= */

function initTypeFilter(){

const filter =

document.getElementById(
"couponTypeFilter"
);

if(!filter)
return;

filter.addEventListener(

"change",

()=>{

const value =

filter.value;

document

.querySelectorAll(
"#couponTableBody tr"
)

.forEach(row=>{

if(!value){

row.style.display = "";

return;

}

row.style.display =

row.innerText

.toLowerCase()

.includes(value)

?

""

:

"none";

});

}

);

}

/* =========================================================
WELCOME TEMPLATE
========================================================= */

window.createWelcomeCoupon =
function(){

document.getElementById(
"couponCode"
).value = "WELCOME50";

document.getElementById(
"couponType"
).value = "percentage";

document.getElementById(
"discountValue"
).value = 50;

document.getElementById(
"maxDiscount"
).value = 100;

document.getElementById(
"minOrderValue"
).value = 299;

document.getElementById(
"firstOrderOnly"
).checked = true;

openCouponModal();

};

/* =========================================================
REFERRAL TEMPLATE
========================================================= */

window.createReferralCoupon =
function(){

document.getElementById(
"couponCode"
).value = "REFER100";

document.getElementById(
"couponType"
).value = "flat";

document.getElementById(
"discountValue"
).value = 100;

document.getElementById(
"referralCoupon"
).checked = true;

openCouponModal();

};

/* =========================================================
FESTIVAL TEMPLATE
========================================================= */

window.createFestivalCoupon =
function(){

document.getElementById(
"couponCode"
).value = "FESTIVE30";

document.getElementById(
"couponType"
).value = "percentage";

document.getElementById(
"discountValue"
).value = 30;

document.getElementById(
"festivalCoupon"
).checked = true;

openCouponModal();

};

/* =========================================================
FREE DELIVERY TEMPLATE
========================================================= */

window.createFreeDeliveryCoupon =
function(){

document.getElementById(
"couponCode"
).value = "FREEDEL";

document.getElementById(
"freeDelivery"
).checked = true;

openCouponModal();

};

/* =========================================================
EXPORT CSV
========================================================= */

window.exportCouponsCSV =
function(){

let csv =

"Code,Type,Value,Status,Usage\n";

coupons.forEach(coupon=>{

csv +=

`${coupon.code},
${coupon.type},
${coupon.value},
${coupon.status},
${coupon.usedCount || 0}\n`;

});

const blob =

new Blob(

[csv],

{

type:"text/csv"

}

);

const url =

URL.createObjectURL(
blob
);

const a =
document.createElement(
"a"
);

a.href = url;

a.download =
"coupons-report.csv";

a.click();

URL.revokeObjectURL(
url

);

};

/* =========================================================
BULK ACTIONS
========================================================= */

window.activateSelectedCoupons =
function(){

alert(
"Bulk Activate Ready"
);

};

window.deactivateSelectedCoupons =
function(){

alert(
"Bulk Deactivate Ready"
);

};

window.deleteSelectedCoupons =
function(){

alert(
"Bulk Delete Ready"
);

};

/* =========================================================
REFRESH HISTORY
========================================================= */

function refreshCouponHistory(){

renderCouponHistory();

initCouponSearch();

initStatusFilter();

initTypeFilter();

console.log(
"Coupon History Updated"
);

}/* =========================================================
LOAD ALL DATA
========================================================= */

async function loadCouponsData(){

try{

await Promise.all([

loadCoupons(),
loadCouponUsage()

]);

console.log(
"Coupons Data Loaded"
);

}catch(error){

console.error(
"Coupon Load Error",
error
);

}

}

/* =========================================================
REFRESH DASHBOARD
========================================================= */

function refreshCouponsDashboard(){

updateCouponAnalytics();

renderCouponsTable();

refreshCouponAnalytics();

refreshCouponHistory();

console.log(
"Coupons Dashboard Refreshed"
);

}

/* =========================================================
AUTO REFRESH
========================================================= */

setInterval(

async ()=>{

await loadCouponsData();

refreshCouponsDashboard();

},

300000

);

/* =========================================================
SAVE OR UPDATE
========================================================= */

window.saveOrUpdateCoupon =
async function(){

const couponId =

document.getElementById(
"couponId"
).value;

if(couponId){

await updateCoupon();

}else{

await saveCoupon();

}

};

/* =========================================================
CLEAR FORM
========================================================= */

function resetCouponForm(){

document.getElementById(
"couponId"
).value = "";

document.getElementById(
"couponCode"
).value = "";

document.getElementById(
"couponType"
).value = "percentage";

document.getElementById(
"discountValue"
).value = "";

document.getElementById(
"maxDiscount"
).value = "";

document.getElementById(
"minOrderValue"
).value = "";

document.getElementById(
"usageLimit"
).value = "";

document.getElementById(
"perUserLimit"
).value = "1";

document.getElementById(
"couponStatus"
).value = "active";

document.getElementById(
"couponDescription"
).value = "";

document.getElementById(
"firstOrderOnly"
).checked = false;

document.getElementById(
"referralCoupon"
).checked = false;

document.getElementById(
"festivalCoupon"
).checked = false;

document.getElementById(
"freeDelivery"
).checked = false;

}

/* =========================================================
MODAL CLOSE OVERRIDE
========================================================= */

const originalCloseCouponModal =
window.closeCouponModal;

window.closeCouponModal =
function(){

resetCouponForm();

originalCloseCouponModal();

};

/* =========================================================
BUTTON EVENTS
========================================================= */

document.addEventListener(

"DOMContentLoaded",

()=>{

const searchInput =

document.getElementById(
"couponSearch"
);

if(searchInput){

searchInput.focus();

}

}

);

/* =========================================================
GLOBAL EXPORTS
========================================================= */

window.couponsApp = {

loadCoupons,
loadCouponUsage,

saveCoupon,
updateCoupon,

editCoupon,

confirmDeleteCoupon,

toggleCouponStatus,

renderCouponsTable,

renderCouponHistory,

refreshCouponsDashboard,

exportCouponsCSV,

createWelcomeCoupon,
createReferralCoupon,
createFestivalCoupon,
createFreeDeliveryCoupon

};

/* =========================================================
INITIALIZATION
========================================================= */

document.addEventListener(

"DOMContentLoaded",

async ()=>{

try{

console.log(
"QuickPress Coupons Starting..."
);

await loadCouponsData();

refreshCouponsDashboard();

console.log(
"QuickPress Coupons Ready 🚀"
);

}catch(error){

console.error(

"Coupons Initialization Error",

error

);

}

}

);

/* =========================================================
END OF FILE
QUICKPRESS COUPONS PANEL
========================================================= */
