/* ==========================================
QUICKPRESS DRIVERS MANAGEMENT
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

let drivers = [];

let filteredDrivers = [];

let totalEarnings = 0;

/* ==========================================
LOAD DRIVERS
========================================== */

window.loadDrivers =
async function(){

try{

showLoading();

const driversRef =

collection(
db,
"drivers"
);

const driversQuery =

query(

driversRef,

orderBy(
"createdAt",
"desc"
)

);

const snapshot =

await getDocs(
driversQuery
);

drivers = [];

snapshot.forEach(docSnap=>{

drivers.push({

id:docSnap.id,

...docSnap.data()

});

});

filteredDrivers =
[...drivers];

renderDriversTable();

updateDriverStats();

updateDriverAnalytics();

hideLoading();

}catch(error){

console.error(
"Driver Load Error",
error
);

hideLoading();

}

};

/* ==========================================
RENDER TABLE
========================================== */

function renderDriversTable(){

const tbody =

document.getElementById(
"driversTableBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

if(
filteredDrivers.length === 0
){

tbody.innerHTML = `

<tr>

<td colspan="10"
style="text-align:center;padding:40px;">

No Drivers Found

</td>

</tr>

`;

return;

}

filteredDrivers.forEach(driver=>{

const initials =

(driver.name || "D")
.charAt(0)
.toUpperCase();

let statusClass =
"offlineBadge";

if(driver.status === "Online"){

statusClass =
"onlineBadge";

}

if(driver.status === "Busy"){

statusClass =
"busyBadge";

}

if(driver.status === "Suspended"){

statusClass =
"suspendedBadge";

}

tbody.innerHTML += `

<tr>

<td>

<div class="driverInfo">

<div class="driverAvatar">

${initials}

</div>

<div>

<b>

${driver.name || "-"}

</b>

<br>

<small>

${driver.email || "-"}

</small>

</div>

</div>

</td>

<td>

${driver.phone || "-"}

</td>

<td>

${driver.city || "-"}

</td>

<td>

${driver.vehicleType || "-"}

</td>

<td>

${driver.vehicleNumber || "-"}

</td>

<td>

<span class="statusBadge ${statusClass}">

${driver.status || "Offline"}

</span>

</td>

<td>

${driver.totalOrders || 0}

</td>

<td>

⭐ ${driver.rating || 0}

</td>

<td>

₹${Number(
driver.totalEarnings || 0
).toLocaleString(
"en-IN"
)}

</td>

<td>

<div class="actionButtons">

<button
class="viewBtn"
onclick="viewDriver('${driver.id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="editBtn"
onclick="editDriver('${driver.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="deleteBtn"
onclick="openDeleteDriverModal('${driver.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

});

}

/* ==========================================
DASHBOARD STATS
========================================== */

function updateDriverStats(){

let online = 0;

let offline = 0;

let busy = 0;

drivers.forEach(driver=>{

if(driver.status === "Online"){

online++;

}
else if(driver.status === "Busy"){

busy++;

}
else{

offline++;

}

});

setText(
"totalDrivers",
drivers.length
);

setText(
"onlineDrivers",
online
);

setText(
"offlineDrivers",
offline
);

setText(
"busyDrivers",
busy
);

}

/* ==========================================
DRIVER ANALYTICS
========================================== */

function updateDriverAnalytics(){

let onlineCount = 0;

let topDriver = null;

totalEarnings = 0;

drivers.forEach(driver=>{

totalEarnings +=

Number(
driver.totalEarnings || 0
);

if(driver.status === "Online"){

onlineCount++;

}

if(

!topDriver ||

(driver.totalEarnings || 0)

>

(topDriver.totalEarnings || 0)

){

topDriver = driver;

}

});

const onlineRate =

drivers.length

?

Math.round(

(onlineCount / drivers.length)

* 100

)

:

0;

setText(
"totalDriverEarnings",
"₹" +
totalEarnings.toLocaleString(
"en-IN"
)
);

setText(
"topDriverName",
topDriver?.name || "-"
);

setText(
"topDriverOrders",
topDriver?.totalOrders || 0
);

setText(
"topDriverEarnings",
"₹" +

Number(
topDriver?.totalEarnings || 0
).toLocaleString(
"en-IN"
)
);

setText(
"onlineRate",
onlineRate + "%"
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
"Loading Drivers..."
);

}

function hideLoading(){

console.log(
"Drivers Loaded"
);

}

/* ==========================================
INITIALIZE
========================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

loadDrivers();

}

);
/* ==========================================
ADD DRIVER MODAL
========================================== */

window.openAddDriverModal =
function(){

document
.getElementById(
"addDriverModal"
)
.classList.add(
"active"
);

};

window.closeAddDriverModal =
function(){

document
.getElementById(
"addDriverModal"
)
.classList.remove(
"active"
);

resetDriverForm();

};

/* ==========================================
RESET FORM
========================================== */

function resetDriverForm(){

document.getElementById(
"driverName"
).value = "";

document.getElementById(
"driverPhone"
).value = "";

document.getElementById(
"driverEmail"
).value = "";

document.getElementById(
"vehicleNumber"
).value = "";

document.getElementById(
"licenseNumber"
).value = "";

document.getElementById(
"accountHolder"
).value = "";

document.getElementById(
"accountNumber"
).value = "";

document.getElementById(
"ifscCode"
).value = "";

document.getElementById(
"bankName"
).value = "";

}

/* ==========================================
DOCUMENT UPLOAD PLACEHOLDER
========================================== */

async function uploadDriverDocument(file){

if(!file)
return "";

try{

/*
Firebase Storage Upload
PART 6 ME KARENGE
*/

return URL.createObjectURL(
file
);

}catch(error){

console.error(
error
);

return "";

}

}

/* ==========================================
SAVE DRIVER
========================================== */

window.saveDriver =
async function(){

try{

const name =

document.getElementById(
"driverName"
).value.trim();

const phone =

document.getElementById(
"driverPhone"
).value.trim();

const email =

document.getElementById(
"driverEmail"
).value.trim();

const city =

document.getElementById(
"driverCity"
).value;

const vehicleType =

document.getElementById(
"vehicleType"
).value;

const vehicleNumber =

document.getElementById(
"vehicleNumber"
).value.trim();

const licenseNumber =

document.getElementById(
"licenseNumber"
).value.trim();

const status =

document.getElementById(
"driverStatus"
).value;

/* BANK */

const accountHolder =

document.getElementById(
"accountHolder"
).value.trim();

const accountNumber =

document.getElementById(
"accountNumber"
).value.trim();

const ifscCode =

document.getElementById(
"ifscCode"
).value.trim();

const bankName =

document.getElementById(
"bankName"
).value.trim();

/* VALIDATION */

if(!name){

alert(
"Enter Driver Name"
);

return;

}

if(phone.length < 10){

alert(
"Enter Valid Mobile Number"
);

return;

}

if(!vehicleNumber){

alert(
"Enter Vehicle Number"
);

return;

}

/* DOCUMENTS */

const aadhaarUrl =

await uploadDriverDocument(

document.getElementById(
"aadhaarDoc"
).files[0]

);

const panUrl =

await uploadDriverDocument(

document.getElementById(
"panDoc"
).files[0]

);

const licenseUrl =

await uploadDriverDocument(

document.getElementById(
"licenseDoc"
).files[0]

);

const rcUrl =

await uploadDriverDocument(

document.getElementById(
"rcDoc"
).files[0]

);

const insuranceUrl =

await uploadDriverDocument(

document.getElementById(
"insuranceDoc"
).files[0]

);

/* DRIVER OBJECT */

const driverData = {

driverId:

"DRV" +

Date.now(),

name,

phone,

email,

city,

vehicleType,

vehicleNumber,

licenseNumber,

status,

approved:true,

rating:5,

totalOrders:0,

todayEarnings:0,

monthlyEarnings:0,

totalEarnings:0,

pendingPayout:0,

paidPayout:0,

accountHolder,

accountNumber,

ifscCode,

bankName,

aadhaarUrl,

panUrl,

licenseUrl,

rcUrl,

insuranceUrl,

latitude:0,

longitude:0,

createdAt:
serverTimestamp()

};

/* SAVE TO FIRESTORE */

await addDoc(

collection(
db,
"drivers"
),

driverData

);

alert(
"Driver Added Successfully"
);

closeAddDriverModal();

await loadDrivers();

}catch(error){

console.error(
error
);

alert(
"Failed To Save Driver"
);

}

};

/* ==========================================
ESC KEY CLOSE
========================================== */

document.addEventListener(

"keydown",

function(e){

if(e.key === "Escape"){

closeAddDriverModal();

}

}

);/* ==========================================
VIEW DRIVER
========================================== */

window.viewDriver =
function(driverId){

const driver =

drivers.find(

item => item.id === driverId

);

if(!driver)
return;

document
.getElementById(
"viewDriverModal"
)
.classList.add(
"active"
);

/* PROFILE */

document.getElementById(
"driverAvatarLarge"
).innerText =

(driver.name || "D")
.charAt(0)
.toUpperCase();

document.getElementById(
"viewDriverName"
).innerText =

driver.name || "-";

document.getElementById(
"viewDriverPhone"
).innerText =

driver.phone || "-";

document.getElementById(
"viewDriverStatus"
).innerText =

driver.status || "Offline";

/* BASIC INFO */

setDriverValue(
"viewName",
driver.name
);

setDriverValue(
"viewPhone",
driver.phone
);

setDriverValue(
"viewCity",
driver.city
);

setDriverValue(
"viewVehicle",
driver.vehicleType
);

setDriverValue(
"viewVehicleNumber",
driver.vehicleNumber
);

setDriverValue(
"viewRating",
driver.rating || 0
);

/* DOCUMENTS */

document.getElementById(
"aadhaarLink"
).href =

driver.aadhaarUrl || "#";

document.getElementById(
"panLink"
).href =

driver.panUrl || "#";

document.getElementById(
"licenseLink"
).href =

driver.licenseUrl || "#";

document.getElementById(
"rcLink"
).href =

driver.rcUrl || "#";

document.getElementById(
"insuranceLink"
).href =

driver.insuranceUrl || "#";

/* LIVE TRACKING */

setDriverValue(
"driverLatitude",
driver.latitude || 0
);

setDriverValue(
"driverLongitude",
driver.longitude || 0
);

setDriverValue(
"driverLastSeen",
driver.lastSeen || "-"
);

/* EARNINGS */

setDriverValue(
"viewTotalOrders",
driver.totalOrders || 0
);

setDriverValue(
"viewTodayEarnings",

"₹" +

Number(
driver.todayEarnings || 0
).toLocaleString(
"en-IN"
)

);

setDriverValue(
"viewMonthlyEarnings",

"₹" +

Number(
driver.monthlyEarnings || 0
).toLocaleString(
"en-IN"
)

);

setDriverValue(
"viewTotalEarnings",

"₹" +

Number(
driver.totalEarnings || 0
).toLocaleString(
"en-IN"
)

);

/* ASSIGNED ORDERS */

const orderBox =

document.getElementById(
"assignedOrdersContainer"
);

if(orderBox){

if(

Array.isArray(
driver.assignedOrders
)

&&

driver.assignedOrders.length

){

orderBox.innerHTML =

driver.assignedOrders

.map(order=>`

<div class="assignedOrderItem">

📦 ${order}

</div>

`)

.join("");

}else{

orderBox.innerHTML =

"<p>No Orders Assigned</p>";

}

}

};

/* ==========================================
CLOSE VIEW MODAL
========================================== */

window.closeViewDriverModal =
function(){

document
.getElementById(
"viewDriverModal"
)
.classList.remove(
"active"
);

};

/* ==========================================
EDIT DRIVER
========================================== */

window.editDriver =
function(driverId){

const driver =

drivers.find(

item => item.id === driverId

);

if(!driver)
return;

document
.getElementById(
"editDriverModal"
)
.classList.add(
"active"
);

document.getElementById(
"editDriverId"
).value =
driver.id;

document.getElementById(
"editDriverName"
).value =

driver.name || "";

document.getElementById(
"editDriverPhone"
).value =

driver.phone || "";

document.getElementById(
"editDriverCity"
).value =

driver.city || "";

document.getElementById(
"editVehicleNumber"
).value =

driver.vehicleNumber || "";

};

/* ==========================================
CLOSE EDIT MODAL
========================================== */

window.closeEditDriverModal =
function(){

document
.getElementById(
"editDriverModal"
)
.classList.remove(
"active"
);

};

/* ==========================================
UPDATE DRIVER
========================================== */

window.updateDriver =
async function(){

try{

const driverId =

document.getElementById(
"editDriverId"
).value;

if(!driverId){

alert(
"Driver ID Missing"
);

return;

}

const name =

document.getElementById(
"editDriverName"
).value.trim();

const phone =

document.getElementById(
"editDriverPhone"
).value.trim();

const city =

document.getElementById(
"editDriverCity"
).value.trim();

const vehicleNumber =

document.getElementById(
"editVehicleNumber"
).value.trim();

if(!name){

alert(
"Driver Name Required"
);

return;

}

await updateDoc(

doc(
db,
"drivers",
driverId
),

{

name,

phone,

city,

vehicleNumber,

updatedAt:
serverTimestamp()

}

);

alert(
"Driver Updated Successfully"
);

closeEditDriverModal();

await loadDrivers();

}catch(error){

console.error(
error
);

alert(
"Failed To Update Driver"
);

}

};

/* ==========================================
HELPER
========================================== */

function setDriverValue(
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
APPROVE / SUSPEND / ACTIVATE DRIVER
========================================== */

window.openActivateDriverModal =
function(driverId){

const driver =

drivers.find(

item => item.id === driverId

);

if(!driver)
return;

document.getElementById(
"actionDriverId"
).value =
driverId;

document.getElementById(
"actionType"
).value =
"activate";

document.getElementById(
"actionIcon"
).innerHTML =
"🟢";

document.getElementById(
"actionTitle"
).innerText =
"Activate Driver";

document.getElementById(
"actionMessage"
).innerText =

`Activate ${driver.name}?`;

document
.getElementById(
"actionModal"
)
.classList.add(
"active"
);

};

window.openSuspendDriverModal =
function(driverId){

const driver =

drivers.find(

item => item.id === driverId

);

if(!driver)
return;

document.getElementById(
"actionDriverId"
).value =
driverId;

document.getElementById(
"actionType"
).value =
"suspend";

document.getElementById(
"actionIcon"
).innerHTML =
"⛔";

document.getElementById(
"actionTitle"
).innerText =
"Suspend Driver";

document.getElementById(
"actionMessage"
).innerText =

`Suspend ${driver.name}?`;

document
.getElementById(
"actionModal"
)
.classList.add(
"active"
);

};

window.openApproveDriverModal =
function(driverId){

const driver =

drivers.find(

item => item.id === driverId

);

if(!driver)
return;

document.getElementById(
"actionDriverId"
).value =
driverId;

document.getElementById(
"actionType"
).value =
"approve";

document.getElementById(
"actionIcon"
).innerHTML =
"✅";

document.getElementById(
"actionTitle"
).innerText =
"Approve Driver";

document.getElementById(
"actionMessage"
).innerText =

`Approve ${driver.name}?`;

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

const driverId =

document.getElementById(
"actionDriverId"
).value;

const action =

document.getElementById(
"actionType"
).value;

if(!driverId)
return;

let updateData = {};

if(action === "approve"){

updateData = {

approved:true,

status:"Offline",

approvedAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

};

}

if(action === "activate"){

updateData = {

status:"Online",

updatedAt:
serverTimestamp()

};

}

if(action === "suspend"){

updateData = {

status:"Suspended",

updatedAt:
serverTimestamp()

};

}

await updateDoc(

doc(
db,
"drivers",
driverId
),

updateData

);

alert(
"Driver Updated Successfully"
);

closeActionModal();

await loadDrivers();

}catch(error){

console.error(
error
);

alert(
"Failed To Update Driver"
);

}

}

);

/* ==========================================
ASSIGN ORDER TO DRIVER
========================================== */

window.assignOrderToDriver =
async function(

driverId,
orderId

){

try{

const driver =

drivers.find(

item => item.id === driverId

);

if(!driver)
return;

const assignedOrders =

driver.assignedOrders || [];

if(

assignedOrders.includes(
orderId
)

){

alert(
"Order Already Assigned"
);

return;

}

assignedOrders.push(
orderId
);

await updateDoc(

doc(
db,
"drivers",
driverId
),

{

assignedOrders,

status:"Busy",

updatedAt:
serverTimestamp()

}

);

alert(
"Order Assigned Successfully"
);

await loadDrivers();

}catch(error){

console.error(
error
);

alert(
"Failed To Assign Order"
);

}

};

/* ==========================================
REMOVE ASSIGNED ORDER
========================================== */

window.removeAssignedOrder =
async function(

driverId,
orderId

){

try{

const driver =

drivers.find(

item => item.id === driverId

);

if(!driver)
return;

const assignedOrders =

(driver.assignedOrders || [])

.filter(

item => item !== orderId

);

await updateDoc(

doc(
db,
"drivers",
driverId
),

{

assignedOrders,

status:

assignedOrders.length

?

"Busy"

:

"Online",

updatedAt:
serverTimestamp()

}

);

alert(
"Order Removed"
);

await loadDrivers();

}catch(error){

console.error(
error
);

alert(
"Failed To Remove Order"
);

}

};

/* ==========================================
DIRECT ACTIONS
========================================== */

window.activateDriver =
async function(driverId){

await updateDoc(

doc(
db,
"drivers",
driverId
),

{

status:"Online",

updatedAt:
serverTimestamp()

}

);

await loadDrivers();

};

window.suspendDriver =
async function(driverId){

await updateDoc(

doc(
db,
"drivers",
driverId
),

{

status:"Suspended",

updatedAt:
serverTimestamp()

}

);

await loadDrivers();

};

window.approveDriver =
async function(driverId){

await updateDoc(

doc(
db,
"drivers",
driverId
),

{

approved:true,

status:"Offline",

approvedAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

}

);

await loadDrivers();

/* ==========================================
DELETE DRIVER MODAL
========================================== */

window.openDeleteDriverModal =
function(driverId){

document.getElementById(
"deleteDriverId"
).value =
driverId;

document
.getElementById(
"deleteDriverModal"
)
.classList.add(
"active"
);

};

window.closeDeleteDriverModal =
function(){

document
.getElementById(
"deleteDriverModal"
)
.classList.remove(
"active"
);

};

/* ==========================================
DELETE DRIVER
========================================== */

window.deleteDriver =
async function(){

try{

const driverId =

document.getElementById(
"deleteDriverId"
).value;

if(!driverId){

alert(
"Driver ID Missing"
);

return;

}

await deleteDoc(

doc(
db,
"drivers",
driverId
)

);

alert(
"Driver Deleted Successfully"
);

closeDeleteDriverModal();

await loadDrivers();

}catch(error){

console.error(error);

alert(
"Delete Failed"
);

}

};

/* ==========================================
SELECT ALL DRIVERS
========================================== */

const selectAllDrivers =

document.getElementById(
"selectAllDrivers"
);

if(selectAllDrivers){

selectAllDrivers.addEventListener(

"change",

function(){

document
.querySelectorAll(
".driverCheckbox"
)

.forEach(box=>{

box.checked =
this.checked;

});

updateSelectedDrivers();

}

);

}

/* ==========================================
UPDATE SELECTED COUNT
========================================== */

window.updateSelectedDrivers =
function(){

const selected =

document.querySelectorAll(
".driverCheckbox:checked"
);

const countBox =

document.getElementById(
"selectedDriversCount"
);

if(countBox){

countBox.innerText =

selected.length +

" Selected";

}

};

/* ==========================================
GET SELECTED DRIVER IDS
========================================== */

function getSelectedDriverIds(){

const ids = [];

document
.querySelectorAll(
".driverCheckbox:checked"
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

window.bulkActivateDrivers =
async function(){

const ids =
getSelectedDriverIds();

if(ids.length===0){

alert(
"Select Drivers First"
);

return;

}

for(const id of ids){

await updateDoc(

doc(
db,
"drivers",
id
),

{

status:"Online",

updatedAt:
serverTimestamp()

}

);

}

alert(
"Drivers Activated"
);

await loadDrivers();

};

/* ==========================================
BULK SUSPEND
========================================== */

window.bulkSuspendDrivers =
async function(){

const ids =
getSelectedDriverIds();

if(ids.length===0){

alert(
"Select Drivers First"
);

return;

}

for(const id of ids){

await updateDoc(

doc(
db,
"drivers",
id
),

{

status:"Suspended",

updatedAt:
serverTimestamp()

}

);

}

alert(
"Drivers Suspended"
);

await loadDrivers();

};

/* ==========================================
BULK DELETE
========================================== */

window.bulkDeleteDrivers =
async function(){

const ids =
getSelectedDriverIds();

if(ids.length===0){

alert(
"Select Drivers First"
);

return;

}

if(
!confirm(
`Delete ${ids.length} drivers?`
)
)return;

for(const id of ids){

await deleteDoc(

doc(
db,
"drivers",
id
)

);

}

alert(
"Drivers Deleted"
);

await loadDrivers();

};

/* ==========================================
SEARCH FILTER
========================================== */

const searchDriver =

document.getElementById(
"searchDriver"
);

if(searchDriver){

searchDriver.addEventListener(

"input",

applyDriverFilters

);

}

/* ==========================================
CITY FILTER
========================================== */

document
.getElementById(
"cityFilter"
)

?.addEventListener(

"change",

applyDriverFilters

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

applyDriverFilters

);

/* ==========================================
VEHICLE FILTER
========================================== */

document
.getElementById(
"vehicleFilter"
)

?.addEventListener(

"change",

applyDriverFilters

);

/* ==========================================
APPLY FILTERS
========================================== */

window.applyDriverFilters =
function(){

const search =

document
.getElementById(
"searchDriver"
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

const vehicle =

document
.getElementById(
"vehicleFilter"
)
?.value || "";

filteredDrivers =

drivers.filter(driver=>{

const matchSearch =

!search ||

(driver.name || "")
.toLowerCase()
.includes(search)

||

(driver.phone || "")
.includes(search)

||

(driver.vehicleNumber || "")
.toLowerCase()
.includes(search);

const matchCity =

!city ||

driver.city === city;

const matchStatus =

!status ||

driver.status === status;

const matchVehicle =

!vehicle ||

driver.vehicleType === vehicle;

return (

matchSearch &&
matchCity &&
matchStatus &&
matchVehicle

);

});

renderDriversTable();

};
