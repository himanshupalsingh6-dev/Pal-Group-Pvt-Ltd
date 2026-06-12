/* ==========================================
QUICKPRESS CUSTOMERS MANAGEMENT
PART 1/6
========================================== */

import { db }
from "../js/firebase.js";

import {

collection,
getDocs,
query,
orderBy,
addDoc,
updateDoc,
deleteDoc,
doc,
serverTimestamp

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";


/* ==========================================
ADMIN LOGIN CHECK
========================================== */

if(

localStorage.getItem(
"adminLogin"
)

!==

"true"

){

window.location.href =
"admin-login.html";

}

/* ==========================================
GLOBAL VARIABLES
========================================== */

let customers = [];

let filteredCustomers = [];

let totalRevenue = 0;

/* ==========================================
LOAD CUSTOMERS
========================================== */

window.loadCustomers =
async function(){

try{

showLoading();

const customersRef =

collection(
db,
"customers"
);

const customersQuery =

query(

customersRef,

orderBy(
"createdAt",
"desc"
)

);

const snapshot =

await getDocs(
customersQuery
);

customers = [];

snapshot.forEach(docSnap=>{

customers.push({

id:docSnap.id,

...docSnap.data()

});

});

filteredCustomers =
[...customers];

renderCustomersTable();

updateCustomerStats();

updateCustomerAnalytics();

hideLoading();

}catch(error){

console.error(
"Customer Load Error",
error
);

hideLoading();

}

};

/* ==========================================
RENDER CUSTOMERS TABLE
========================================== */

function renderCustomersTable(){

const tbody =

document.getElementById(
"customersTableBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

if(
filteredCustomers.length === 0
){

tbody.innerHTML = `

<tr>

<td colspan="10"
style="text-align:center;padding:40px;">

No Customers Found

</td>

</tr>

`;

return;

}

filteredCustomers.forEach(customer=>{

const initials =

(customer.name || "C")
.charAt(0)
.toUpperCase();

let membershipClass =
"regularBadge";

if(customer.membership === "Premium"){

membershipClass =
"premiumBadge";

}

if(customer.membership === "Gold"){

membershipClass =
"goldBadge";

}

let statusClass =
"inactiveBadge";

if(customer.status === "Active"){

statusClass =
"activeBadge";

}

if(customer.status === "Blocked"){

statusClass =
"blockedBadge";

}

tbody.innerHTML += `

<tr>

<td>

<div class="customerInfo">

<div class="customerAvatar">

${initials}

</div>

<div>

<b>

${customer.name || "-"}

</b>

<br>

<small>

${customer.email || "-"}

</small>

</div>

</div>

</td>

<td>

${customer.phone || "-"}

</td>

<td>

${customer.city || "-"}

</td>

<td>

<span class="membershipBadge ${membershipClass}">

${customer.membership || "Regular"}

</span>

</td>

<td>

${customer.totalOrders || 0}

</td>

<td>

₹${Number(
customer.totalSpent || 0
).toLocaleString(
"en-IN"
)}

</td>

<td>

${customer.loyaltyPoints || 0}

</td>

<td>

<span class="statusBadge ${statusClass}">

${customer.status || "Inactive"}

</span>

</td>

<td>

${customer.joinedDate || "-"}

</td>

<td>

<div class="actionButtons">

<button
class="viewBtn"
onclick="viewCustomer('${customer.id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="editBtn"
onclick="editCustomer('${customer.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="deleteBtn"
onclick="openDeleteCustomerModal('${customer.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

});

}

/* ==========================================
CUSTOMER STATS
========================================== */

function updateCustomerStats(){

let active = 0;

let premium = 0;

let blocked = 0;

customers.forEach(customer=>{

if(customer.status === "Active"){

active++;

}

if(

customer.membership === "Premium"

||

customer.membership === "Gold"

){

premium++;

}

if(customer.status === "Blocked"){

blocked++;

}

});

setText(
"totalCustomers",
customers.length
);

setText(
"activeCustomers",
active
);

setText(
"premiumCustomers",
premium
);

setText(
"blockedCustomers",
blocked
);

}

/* ==========================================
CUSTOMER ANALYTICS
========================================== */

function updateCustomerAnalytics(){

let topCustomer = null;

let totalOrders = 0;

totalRevenue = 0;

customers.forEach(customer=>{

totalRevenue +=

Number(
customer.totalSpent || 0
);

totalOrders +=

Number(
customer.totalOrders || 0
);

if(

!topCustomer ||

(customer.totalSpent || 0)

>

(topCustomer.totalSpent || 0)

){

topCustomer = customer;

}

});

const averageOrderValue =

totalOrders

?

Math.round(
totalRevenue / totalOrders
)

:

0;

setText(
"totalCustomerRevenue",
"₹" +
totalRevenue.toLocaleString(
"en-IN"
)
);

setText(
"totalCustomerOrders",
totalOrders
);

setText(
"topCustomerName",
topCustomer?.name || "-"
);

setText(
"highestSpent",
"₹" +

Number(
topCustomer?.totalSpent || 0
).toLocaleString(
"en-IN"
)
);

setText(
"avgOrderValue",
"₹" +

averageOrderValue.toLocaleString(
"en-IN"
)
);

}

/* ==========================================
HELPERS
========================================== */

function setText(
id,
value
){

const element =

document.getElementById(
id
);

if(element){

element.innerText =
value;

}

}

function showLoading(){

console.log(
"Loading Customers..."
);

}

function hideLoading(){

console.log(
"Customers Loaded"
);

}

/* ==========================================
INITIALIZE
========================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

loadCustomers();

}

);

window.openAddCustomerModal =
function(){

document
.getElementById(
"addCustomerModal"
)
.classList.add(
"active"
);

};

window.closeAddCustomerModal =
function(){

document
.getElementById(
"addCustomerModal"
)
.classList.remove(
"active"
);

resetCustomerForm();

};

/* ==========================================
RESET FORM
========================================== */

function resetCustomerForm(){

document.getElementById(
"customerName"
).value = "";

document.getElementById(
"customerPhone"
).value = "";

document.getElementById(
"customerEmail"
).value = "";

document.getElementById(
"customerAddress"
).value = "";

document.getElementById(
"customerPincode"
).value = "";

document.getElementById(
"availablePoints"
).value = 0;

document.getElementById(
"redeemedPoints"
).value = 0;

}

/* ==========================================
SAVE CUSTOMER
========================================== */

window.saveCustomer =
async function(){

try{

const name =

document.getElementById(
"customerName"
).value.trim();

const phone =

document.getElementById(
"customerPhone"
).value.trim();

const email =

document.getElementById(
"customerEmail"
).value.trim();

const city =

document.getElementById(
"customerCity"
).value;

const membership =

document.getElementById(
"membershipPlan"
).value;

const membershipStatus =

document.getElementById(
"membershipStatus"
).value;

const membershipExpiry =

document.getElementById(
"membershipExpiry"
).value;

const loyaltyPoints =

Number(

document.getElementById(
"availablePoints"
).value

|| 0

);

const redeemedPoints =

Number(

document.getElementById(
"redeemedPoints"
).value

|| 0

);

const address =

document.getElementById(
"customerAddress"
).value.trim();

const pincode =

document.getElementById(
"customerPincode"
).value.trim();

/* VALIDATION */

if(!name){

alert(
"Enter Customer Name"
);

return;

}

if(phone.length < 10){

alert(
"Enter Valid Mobile Number"
);

return;

}

if(!email){

alert(
"Enter Email Address"
);

return;

}

/* CUSTOMER OBJECT */

const customerData = {

customerId:

"CUS" +

Date.now(),

name,

phone,

email,

city,

membership,

membershipStatus,

membershipExpiry,

loyaltyPoints,

redeemedPoints,

rewardValue:

loyaltyPoints * 0.5,

status:"Active",

address,

pincode,

totalOrders:0,

totalSpent:0,

averageOrder:0,

subscriptionPlan:
membership,

subscriptionStatus:
membershipStatus,

joinedDate:

new Date()
.toLocaleDateString(),

createdAt:
serverTimestamp()

};

/* SAVE */

await addDoc(

collection(
db,
"customers"
),

customerData

);

alert(
"Customer Added Successfully"
);

closeAddCustomerModal();

await loadCustomers();

}catch(error){

console.error(
error
);

alert(
"Failed To Save Customer"
);

}

};

/* ==========================================
MEMBERSHIP AUTO STATUS
========================================== */

const membershipPlan =

document.getElementById(
"membershipPlan"
);

if(membershipPlan){

membershipPlan.addEventListener(

"change",

function(){

const pointsBox =

document.getElementById(
"availablePoints"
);

if(!pointsBox)
return;

if(this.value === "Premium"){

pointsBox.value = 500;

}

else if(
this.value === "Gold"
){

pointsBox.value = 1000;

}

else{

pointsBox.value = 100;

}

}

);

}

/* ==========================================
LOYALTY POINT CALCULATOR
========================================== */

document
.getElementById(
"availablePoints"
)

?.addEventListener(

"input",

function(){

const points =

Number(
this.value || 0
);

console.log(

"Reward Value ₹",

points * 0.5

);

}

);

/* ==========================================
ESC KEY CLOSE
========================================== */

document.addEventListener(

"keydown",

function(e){

if(e.key === "Escape"){

closeAddCustomerModal();

}

}

);

window.viewCustomer =
function(customerId){

const customer =

customers.find(

item => item.id === customerId

);

if(!customer)
return;

document
.getElementById(
"viewCustomerModal"
)
.classList.add(
"active"
);

/* PROFILE */

document.getElementById(
"customerAvatarLarge"
).innerText =

(customer.name || "C")
.charAt(0)
.toUpperCase();

document.getElementById(
"viewCustomerName"
).innerText =

customer.name || "-";

document.getElementById(
"viewCustomerPhone"
).innerText =

customer.phone || "-";

document.getElementById(
"viewCustomerStatus"
).innerText =

customer.status || "Inactive";

/* BASIC INFO */

setCustomerValue(
"viewName",
customer.name
);

setCustomerValue(
"viewPhone",
customer.phone
);

setCustomerValue(
"viewEmail",
customer.email
);

setCustomerValue(
"viewCity",
customer.city
);

setCustomerValue(
"viewMembership",
customer.membership
);

setCustomerValue(
"viewJoinedDate",
customer.joinedDate
);

/* LOYALTY */

setCustomerValue(
"viewPoints",
customer.loyaltyPoints || 0
);

setCustomerValue(
"viewRedeemedPoints",
customer.redeemedPoints || 0
);

setCustomerValue(
"viewRewardValue",

"₹" +

Number(
customer.rewardValue || 0
).toLocaleString(
"en-IN"
)

);

/* SUBSCRIPTION */

setCustomerValue(
"subscriptionPlan",
customer.subscriptionPlan || "Regular"
);

setCustomerValue(
"subscriptionExpiry",
customer.membershipExpiry || "-"
);

const subStatus =

document.getElementById(
"subscriptionStatus"
);

if(subStatus){

subStatus.innerText =

customer.subscriptionStatus

||

"Inactive";

}

/* ADDRESS */

const addressBox =

document.getElementById(
"customerAddresses"
);

if(addressBox){

addressBox.innerHTML =

`

<div class="savedAddress">

📍

${customer.address || "-"}

<br>

${customer.city || ""}

-

${customer.pincode || ""}

</div>

`;

}

/* ORDER HISTORY */

const ordersBody =

document.getElementById(
"customerOrdersBody"
);

if(ordersBody){

ordersBody.innerHTML = "";

if(

Array.isArray(
customer.orders
)

&&

customer.orders.length

){

customer.orders.forEach(order=>{

ordersBody.innerHTML += `

<tr>

<td>

${order.orderId || "-"}

</td>

<td>

${order.date || "-"}

</td>

<td>

${order.service || "-"}

</td>

<td>

₹${Number(
order.amount || 0
).toLocaleString("en-IN")}

</td>

<td>

${order.status || "-"}

</td>

</tr>

`;

});

}else{

ordersBody.innerHTML =

`

<tr>

<td colspan="5">

No Orders Found

</td>

</tr>

`;

}

}

/* SUMMARY */

setCustomerValue(
"viewTotalOrders",
customer.totalOrders || 0
);

setCustomerValue(
"viewTotalSpent",

"₹" +

Number(
customer.totalSpent || 0
).toLocaleString(
"en-IN"
)

);

setCustomerValue(
"viewAverageOrder",

"₹" +

Number(
customer.averageOrder || 0
).toLocaleString(
"en-IN"
)

);

setCustomerValue(
"viewLastOrder",

customer.lastOrderDate || "-"

);

};

/* ==========================================
CLOSE VIEW MODAL
========================================== */

window.closeViewCustomerModal =
function(){

document
.getElementById(
"viewCustomerModal"
)
.classList.remove(
"active"
);

};

/* ==========================================
EDIT CUSTOMER
========================================== */

window.editCustomer =
function(customerId){

const customer =

customers.find(

item => item.id === customerId

);

if(!customer)
return;

document
.getElementById(
"editCustomerModal"
)
.classList.add(
"active"
);

document.getElementById(
"editCustomerId"
).value =
customer.id;

document.getElementById(
"editCustomerName"
).value =

customer.name || "";

document.getElementById(
"editCustomerPhone"
).value =

customer.phone || "";

document.getElementById(
"editCustomerEmail"
).value =

customer.email || "";

document.getElementById(
"editMembershipPlan"
).value =

customer.membership || "Regular";

};

/* ==========================================
CLOSE EDIT MODAL
========================================== */

window.closeEditCustomerModal =
function(){

document
.getElementById(
"editCustomerModal"
)
.classList.remove(
"active"
);

};

/* ==========================================
UPDATE CUSTOMER
========================================== */

window.updateCustomer =
async function(){

try{

const customerId =

document.getElementById(
"editCustomerId"
).value;

if(!customerId){

alert(
"Customer ID Missing"
);

return;

}

const name =

document.getElementById(
"editCustomerName"
).value.trim();

const phone =

document.getElementById(
"editCustomerPhone"
).value.trim();

const email =

document.getElementById(
"editCustomerEmail"
).value.trim();

const membership =

document.getElementById(
"editMembershipPlan"
).value;

if(!name){

alert(
"Customer Name Required"
);

return;

}

await updateDoc(

doc(
db,
"customers",
customerId
),

{

name,

phone,

email,

membership,

subscriptionPlan:
membership,

updatedAt:
serverTimestamp()

}

);

alert(
"Customer Updated Successfully"
);

closeEditCustomerModal();

await loadCustomers();

}catch(error){

console.error(
error
);

alert(
"Failed To Update Customer"
);

}

};

/* ==========================================
HELPER
========================================== */

function setCustomerValue(
id,
value
){

const el =

document.getElementById(
id
);

if(el){

el.innerText =
value || "-";

}

}/* ==========================================
BLOCK / ACTIVATE / MEMBERSHIP UPGRADE
========================================== */

window.openBlockCustomerModal =
function(customerId){

const customer =

customers.find(
item => item.id === customerId
);

if(!customer)
return;

document.getElementById(
"actionCustomerId"
).value =
customerId;

document.getElementById(
"actionType"
).value =
"block";

document.getElementById(
"actionIcon"
).innerHTML =
"🚫";

document.getElementById(
"actionTitle"
).innerText =
"Block Customer";

document.getElementById(
"actionMessage"
).innerText =

`Block ${customer.name}?`;

document
.getElementById(
"actionModal"
)
.classList.add(
"active"
);

};

window.openActivateCustomerModal =
function(customerId){

const customer =

customers.find(
item => item.id === customerId
);

if(!customer)
return;

document.getElementById(
"actionCustomerId"
).value =
customerId;

document.getElementById(
"actionType"
).value =
"activate";

document.getElementById(
"actionIcon"
).innerHTML =
"✅";

document.getElementById(
"actionTitle"
).innerText =
"Activate Customer";

document.getElementById(
"actionMessage"
).innerText =

`Activate ${customer.name}?`;

document
.getElementById(
"actionModal"
)
.classList.add(
"active"
);

};

window.openUpgradeCustomerModal =
function(customerId){

const customer =

customers.find(
item => item.id === customerId
);

if(!customer)
return;

document.getElementById(
"actionCustomerId"
).value =
customerId;

document.getElementById(
"actionType"
).value =
"upgrade";

document.getElementById(
"actionIcon"
).innerHTML =
"💎";

document.getElementById(
"actionTitle"
).innerText =
"Upgrade Membership";

document.getElementById(
"actionMessage"
).innerText =

`Upgrade ${customer.name} to Premium?`;

document
.getElementById(
"actionModal"
)
.classList.add(
"active"
);

};

/* ==========================================
CLOSE ACTION MODAL
========================================== */

window.closeActionModal =
function(){

document
.getElementById(
"actionModal"
)
.classList.remove(
"active"
);

};

/* ==========================================
CONFIRM ACTION
========================================== */

document
.getElementById(
"confirmActionBtn"
)

?.addEventListener(

"click",

async ()=>{

try{

const customerId =

document.getElementById(
"actionCustomerId"
).value;

const action =

document.getElementById(
"actionType"
).value;

if(!customerId)
return;

let updateData = {};

if(action === "block"){

updateData = {

status:"Blocked",

blockedAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

};

}

if(action === "activate"){

updateData = {

status:"Active",

updatedAt:
serverTimestamp()

};

}

if(action === "upgrade"){

updateData = {

membership:"Premium",

subscriptionPlan:"Premium",

subscriptionStatus:"Active",

loyaltyPoints:500,

updatedAt:
serverTimestamp()

};

}

await updateDoc(

doc(
db,
"customers",
customerId
),

updateData

);

alert(
"Customer Updated Successfully"
);

closeActionModal();

await loadCustomers();

}catch(error){

console.error(error);

alert(
"Failed To Update Customer"
);

}

}

);

/* ==========================================
DIRECT ACTIONS
========================================== */

window.blockCustomer =
async function(customerId){

try{

await updateDoc(

doc(
db,
"customers",
customerId
),

{

status:"Blocked",

blockedAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

}

);

await loadCustomers();

}catch(error){

console.error(error);

}

};

window.activateCustomer =
async function(customerId){

try{

await updateDoc(

doc(
db,
"customers",
customerId
),

{

status:"Active",

updatedAt:
serverTimestamp()

}

);

await loadCustomers();

}catch(error){

console.error(error);

}

};

window.upgradeCustomerMembership =
async function(customerId){

try{

await updateDoc(

doc(
db,
"customers",
customerId
),

{

membership:"Premium",

subscriptionPlan:"Premium",

subscriptionStatus:"Active",

loyaltyPoints:500,

updatedAt:
serverTimestamp()

}

);

await loadCustomers();

}catch(error){

console.error(error);

}

};

/* ==========================================
SEND MESSAGE PLACEHOLDER
========================================== */

window.sendCustomerMessage =
function(customerId){

const customer =

customers.find(
item => item.id === customerId
);

if(!customer)
return;

alert(

`Message feature will open for ${customer.name}`

);

};

/* ==========================================
CUSTOMER STATUS COLOR HELPER
========================================== */

function getCustomerStatusClass(status){

switch(status){

case "Active":
return "activeBadge";

case "Blocked":
return "blockedBadge";

default:
return "inactiveBadge";

}

}

/* ==========================================
MEMBERSHIP HELPER
========================================== */

function getMembershipClass(membership){

switch(membership){

case "Premium":
return "premiumBadge";

case "Gold":
return "goldBadge";

default:
return "regularBadge";

}

}/* ==========================================
EXPORT CUSTOMERS CSV
========================================== */

window.exportCustomersCSV =
function(){

if(customers.length === 0){

alert(
"No Customers Found"
);

return;

}

let csv =

"Customer ID,Name,Phone,Email,City,Membership,Status,Orders,Spent,Points\n";

customers.forEach(customer=>{

csv +=

`${customer.customerId || ""},
${customer.name || ""},
${customer.phone || ""},
${customer.email || ""},
${customer.city || ""},
${customer.membership || ""},
${customer.status || ""},
${customer.totalOrders || 0},
${customer.totalSpent || 0},
${customer.loyaltyPoints || 0}
\n`;

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
"quickpress-customers.csv";

a.click();

URL.revokeObjectURL(
url);

};

/* ==========================================
TOP CUSTOMERS TABLE
========================================== */

function renderTopCustomers(){

const tbody =

document.getElementById(
"topCustomersBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

const sortedCustomers =

[...customers]

.sort(

(a,b)=>

(b.totalSpent || 0)

-

(a.totalSpent || 0)

)

.slice(0,10);

sortedCustomers.forEach(

(customer,index)=>{

tbody.innerHTML += `

<tr>

<td>

${customer.name || "-"}

</td>

<td>

${customer.totalOrders || 0}

</td>

<td>

₹${Number(
customer.totalSpent || 0
).toLocaleString("en-IN")}

</td>

<td>

${customer.membership || "Regular"}

</td>

<td>

${customer.loyaltyPoints || 0}

</td>

<td>

#${index + 1}

</td>

</tr>

`;

}

);

}

/* ==========================================
ADVANCED ANALYTICS
========================================== */

function updateAdvancedAnalytics(){

let premiumRevenue = 0;

let rewardPoints = 0;

let regularCount = 0;

let premiumCount = 0;

let goldCount = 0;

let inactiveCount = 0;

customers.forEach(customer=>{

rewardPoints +=

Number(
customer.loyaltyPoints || 0
);

if(

customer.membership === "Premium"

||

customer.membership === "Gold"

){

premiumRevenue +=

Number(
customer.totalSpent || 0
);

}

if(
customer.membership === "Regular"
){

regularCount++;

}

if(
customer.membership === "Premium"
){

premiumCount++;

}

if(
customer.membership === "Gold"
){

goldCount++;

}

if(
customer.status !== "Active"
){

inactiveCount++;

}

});

setText(
"premiumRevenue",
"₹" +

premiumRevenue.toLocaleString(
"en-IN"
)
);

setText(
"totalRewardPoints",
rewardPoints
);

setText(
"regularCustomersCount",
regularCount
);

setText(
"premiumCustomersCount",
premiumCount
);

setText(
"goldCustomersCount",
goldCount
);

setText(
"inactiveCustomersCount",
inactiveCount
);

const retentionRate =

customers.length

?

Math.round(

((customers.length - inactiveCount)

/

customers.length)

*100

)

:

0;

setText(
"retentionRate",
retentionRate + "%"
);

}
/* ==========================================
BULK PREMIUM UPGRADE
========================================== */

window.bulkUpgradePremium =
async function(){

const ids =
getSelectedCustomerIds();

if(ids.length === 0){

alert(
"Select Customers First"
);

return;

}

for(const id of ids){

await updateDoc(

doc(
db,
"customers",
id
),

{
membership:"Premium",
subscriptionPlan:"Premium",
subscriptionStatus:"Active",
loyaltyPoints:500,
updatedAt:serverTimestamp()
}

);

}

alert(
"Premium Upgrade Complete"
);

await loadCustomers();

};
/* ==========================================
BULK BUTTON EVENTS
========================================== */
/* ==========================================
BULK BUTTON EVENTS FIXED
========================================== */

document
.querySelector(".premiumBtn")
?.addEventListener(
"click",
() => {

if(typeof window.bulkUpgradePremium === "function"){

window.bulkUpgradePremium();

}else{

console.error(
"bulkUpgradePremium not found"
);

}

}
);

document
.querySelector(".blockBtn")
?.addEventListener(
"click",
() => {

if(typeof window.bulkBlockCustomers === "function"){

window.bulkBlockCustomers();

}else{

console.error(
"bulkBlockCustomers not found"
);

}

}
);

document
.querySelector(".activateBtn")
?.addEventListener(
"click",
() => {

if(typeof window.bulkActivateCustomers === "function"){

window.bulkActivateCustomers();

}else{

console.error(
"bulkActivateCustomers not found"
);

}

}
);

document
.querySelector(".deleteBtnBulk")
?.addEventListener(
"click",
() => {

if(typeof window.bulkDeleteCustomers === "function"){

window.bulkDeleteCustomers();

}else{

console.error(
"bulkDeleteCustomers not found"
);

}

}
);
/* ==========================================
EXPORT BUTTONS
========================================== */

document
.querySelectorAll(
".exportBtn"
)

.forEach(btn=>{

btn.addEventListener(

"click",

exportCustomersCSV

);

});

/* ==========================================
MODAL BACKDROP CLOSE
========================================== */

document
.querySelectorAll(
".adminModal"
)

.forEach(modal=>{

modal.addEventListener(

"click",

function(e){

if(
e.target === modal
){

modal.classList.remove(
"active"
);

}

}

);

});

/* ==========================================
ESC CLOSE
========================================== */

document.addEventListener(

"keydown",

function(e){

if(e.key === "Escape"){

document
.querySelectorAll(
".adminModal"
)

.forEach(modal=>{

modal.classList.remove(
"active"
);

});

}

}

);

/* ==========================================
AUTO REFRESH
========================================== */

setInterval(

()=>{

loadCustomers();

},

300000

);

/* ==========================================
ENHANCED LOAD CUSTOMERS
========================================== */

const originalLoadCustomers =
loadCustomers;

window.loadCustomers =
async function(){

await originalLoadCustomers();

renderTopCustomers();

updateAdvancedAnalytics();

};

/* ==========================================
FINAL INITIALIZATION
========================================== */

document.addEventListener(

"DOMContentLoaded",

async ()=>{

try{

await loadCustomers();

renderTopCustomers();

updateAdvancedAnalytics();

console.log(

"QuickPress Customers Panel Ready 🚀"

);

}catch(error){

console.error(

"Customer Initialization Error",

error

);

}

}

);

/* ==========================================
GLOBAL EXPORTS
========================================== */

window.customersApp = {

loadCustomers,
saveCustomer,
updateCustomer,

viewCustomer,
editCustomer,

blockCustomer,
activateCustomer,

upgradeCustomerMembership,

exportCustomersCSV

};

window.openDeleteCustomerModal =
function(customerId){

document.getElementById(
"deleteCustomerId"
).value =
customerId;

document
.getElementById(
"deleteCustomerModal"
)
.classList.add(
"active"
);

};

window.closeDeleteCustomerModal =
function(){

document
.getElementById(
"deleteCustomerModal"
)
.classList.remove(
"active"
);

};

/* ==========================================
DELETE CUSTOMER
========================================== */

/* ==========================================
DELETE CUSTOMER
========================================== */

window.deleteCustomer = async function(){

try{

const customerId =
document.getElementById(
"deleteCustomerId"
)?.value;

if(!customerId){

alert("Customer ID Missing");
return;

}

await deleteDoc(
doc(
db,
"customers",
customerId
)
);

alert(
"Customer Deleted Successfully"
);

const modal =
document.getElementById(
"deleteCustomerModal"
);

if(modal){
modal.classList.remove(
"active"
);
}

await loadCustomers();

}catch(error){

console.error(
"Delete Error",
error
);

alert(
"Failed To Delete Customer"
);

}

};

/* ==========================================
SELECT ALL CUSTOMERS
========================================== */

const selectAllCustomers =

document.getElementById(
"selectAllCustomers"
);

if(selectAllCustomers){

selectAllCustomers.addEventListener(

"change",

function(){

document
.querySelectorAll(
".customerCheckbox"
)

.forEach(box=>{

box.checked =
this.checked;

});

updateSelectedCustomers();

}

);

}

/* ==========================================
UPDATE SELECTED COUNT
========================================== */

window.updateSelectedCustomers =
function(){

const selected =

document.querySelectorAll(
".customerCheckbox:checked"
);

const countBox =

document.getElementById(
"selectedCustomersCount"
);

if(countBox){

countBox.innerText =

selected.length +

" Selected";

}

};

/* ==========================================
GET SELECTED CUSTOMER IDS
========================================== */

function getSelectedCustomerIds(){

const ids = [];

document
.querySelectorAll(
".customerCheckbox:checked"
)

.forEach(box=>{

ids.push(
box.value
);

});

return ids;

}

/* ==========================================
BULK ACTIVATE
========================================== */

window.bulkActivateCustomers =
async function(){

const ids =
getSelectedCustomerIds();

if(ids.length === 0){

alert(
"Select Customers First"
);

return;

}

for(const id of ids){

await updateDoc(

doc(
db,
"customers",
id
),

{

status:"Active",

updatedAt:
serverTimestamp()

}

);

}

alert(
"Customers Activated"
);

await loadCustomers();

};

/* ==========================================
BULK BLOCK
========================================== */

window.bulkBlockCustomers =
async function(){

const ids =
getSelectedCustomerIds();

if(ids.length === 0){

alert(
"Select Customers First"
);

return;

}

for(const id of ids){

await updateDoc(

doc(
db,
"customers",
id
),

{

status:"Blocked",

updatedAt:
serverTimestamp()

}

);

}

alert(
"Customers Blocked"
);

await loadCustomers();

};

/* ==========================================
BULK PREMIUM UPGRADE
========================================== */

window.bulkUpgradePremium =
async function(){

const ids =
getSelectedCustomerIds();

if(ids.length === 0){

alert(
"Select Customers First"
);

return;

}

for(const id of ids){

await updateDoc(

doc(
db,
"customers",
id
),

{

membership:"Premium",

subscriptionPlan:"Premium",

subscriptionStatus:"Active",

loyaltyPoints:500,

updatedAt:
serverTimestamp()

}

);

}

alert(
"Premium Upgrade Complete"
);

await loadCustomers();

};

/* ==========================================
BULK DELETE
========================================== */

window.bulkDeleteCustomers =
async function(){

const ids =
getSelectedCustomerIds();

if(ids.length === 0){

alert(
"Select Customers First"
);

return;

}

if(
!confirm(
`Delete ${ids.length} customers?`
)
)return;

for(const id of ids){

await deleteDoc(

doc(
db,
"customers",
id
)

);

}

alert(
"Customers Deleted"
);

await loadCustomers();

};

/* ==========================================
SEARCH FILTER
========================================== */

document
.getElementById(
"searchFilter"
)

?.addEventListener(

"change",

applySearchFilters

);

/* ==========================================
CITY FILTER
========================================== */

document
.getElementById("cityFilter")
?.addEventListener(
"change",
() => window.applyCustomerFilters()
);

document
.getElementById("statusFilter")
?.addEventListener(
"change",
() => window.applyCustomerFilters()
);

document
.getElementById("membershipFilter")
?.addEventListener(
"change",
() => window.applyCustomerFilters()
);
/* ==========================================
STATUS FILTER
========================================== */

document
.getElementById(
"statusFilter"
)

?.addEventListener(

"change",

applyCustomerFilters

);

/* ==========================================
MEMBERSHIP FILTER
========================================== */

document
.getElementById(
"membershipFilter"
)

?.addEventListener(

"change",

applyCustomerFilters

);

/* ==========================================
APPLY FILTERS
========================================== */

window.applyCustomerFilters =
function(){

const search =

document
.getElementById(
"searchCustomer"
)
?.value
.toLowerCase()
.trim() || "";

const city =

document
.getElementById(
"cityFilter"
)
?.value || "";

const status =

document
.getElementById(
"statusFilter"
)
?.value || "";

const membership =

document
.getElementById(
"membershipFilter"
)
?.value || "";

filteredCustomers =

customers.filter(customer=>{

const matchSearch =

!search ||

(customer.name || "")
.toLowerCase()
.includes(search)

||

(customer.phone || "")
.includes(search)

||

(customer.email || "")
.toLowerCase()
.includes(search);

const matchCity =

!city ||

customer.city === city;

const matchStatus =

!status ||

customer.status === status;

const matchMembership =

!membership ||

customer.membership === membership;

return (

matchSearch &&
matchCity &&
matchStatus &&
matchMembership

);

});

renderCustomersTable();

};
