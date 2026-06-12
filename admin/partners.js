/* ==========================================
QUICKPRESS PARTNERS MANAGEMENT
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

let partners = [];

let filteredPartners = [];

let totalRevenue = 0;

let totalOrders = 0;

/* ==========================================
LOAD PARTNERS
========================================== */

window.loadPartners =
async function(){

try{

showLoading();

const partnersRef =

collection(
db,
"partners"
);

const partnersQuery =

query(

partnersRef,

orderBy(
"createdAt",
"desc"
)

);

const snapshot =

await getDocs(
partnersQuery
);

partners = [];

snapshot.forEach(docSnap=>{

partners.push({

id:docSnap.id,

...docSnap.data()

});

});

filteredPartners =
[...partners];

renderPartnersTable();

updateDashboardStats();

updateAnalytics();

hideLoading();

}catch(error){

console.error(
"Partner Load Error",
error
);

hideLoading();

}

};

/* ==========================================
RENDER TABLE
========================================== */

function renderPartnersTable(){

const tbody =

document.getElementById(
"partnersTableBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

if(
filteredPartners.length === 0
){

tbody.innerHTML = `

<tr>

<td colspan="10"
style="text-align:center;padding:40px;">

No Partners Found

</td>

</tr>

`;

return;

}

filteredPartners.forEach(partner=>{

const initials =

(partner.ownerName || "P")

.charAt(0)
.toUpperCase();

const statusClass =

partner.status === "Active"

?

"activeBadge"

:

partner.status === "Suspended"

?

"suspendedBadge"

:

"pendingBadge";

const approvalBadge =

partner.approved

?

'<span class="statusBadge approvedBadge">Approved</span>'

:

'<span class="statusBadge pendingBadge">Pending</span>';

tbody.innerHTML += `

<tr>

<td>

<div class="partnerInfo">

<div class="partnerAvatar">

${initials}

</div>

<div>

<b>

${partner.ownerName || "-"}

</b>

<br>

<small>

${partner.email || "-"}

</small>

</div>

</div>

</td>

<td>

${partner.businessName || "-"}

</td>

<td>

${partner.phone || "-"}

</td>

<td>

${partner.city || "-"}

</td>

<td>

${Array.isArray(partner.services)

?

partner.services.length

:

0}

 Services

</td>

<td>

${partner.totalOrders || 0}

</td>

<td>

₹${Number(
partner.totalRevenue || 0
).toLocaleString(
"en-IN"
)}

</td>

<td>

<span class="statusBadge ${statusClass}">

${partner.status || "Pending"}

</span>

</td>

<td>

${approvalBadge}

</td>

<td>

<div class="actionButtons">

<button
class="viewBtn"
onclick="viewPartner('${partner.id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="editBtn"
onclick="editPartner('${partner.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="approveBtn"
onclick="openApprovalModal('${partner.id}')">

<i class="fa-solid fa-check"></i>

</button>

<button
class="deleteBtn"
onclick="openDeletePartnerModal('${partner.id}')">

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

function updateDashboardStats(){

let active = 0;

let pending = 0;

let suspended = 0;

partners.forEach(partner=>{

if(
partner.status === "Active"
){

active++;

}
else if(
partner.status === "Suspended"
){

suspended++;

}
else{

pending++;

}

});

setText(
"totalPartners",
partners.length
);

setText(
"activePartners",
active
);

setText(
"pendingPartners",
pending
);

setText(
"suspendedPartners",
suspended
);

}

/* ==========================================
ANALYTICS
========================================== */

function updateAnalytics(){

totalRevenue = 0;
totalOrders = 0;

let approvedCount = 0;

let topPartner = null;

partners.forEach(partner=>{

totalRevenue +=

Number(
partner.totalRevenue || 0
);

totalOrders +=

Number(
partner.totalOrders || 0
);

if(
partner.approved
){

approvedCount++;

}

if(

!topPartner ||

(partner.totalRevenue || 0)

>

(topPartner.totalRevenue || 0)

){

topPartner = partner;

}

});

const approvalRate =

partners.length

?

Math.round(

(approvedCount / partners.length)

* 100

)

:

0;

setText(
"totalPartnerRevenue",
"₹" +
totalRevenue.toLocaleString(
"en-IN"
)
);

setText(
"topPartnerName",
topPartner?.businessName || "-"
);

setText(
"topPartnerRevenue",
"₹" +

Number(
topPartner?.totalRevenue || 0
).toLocaleString(
"en-IN"
)
);

setText(
"topPartnerOrders",
topPartner?.totalOrders || 0
);

setText(
"approvalRate",
approvalRate + "%"
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
"Loading Partners..."
);

}

function hideLoading(){

console.log(
"Partners Loaded"
);

}

/* ==========================================
INITIALIZE
========================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

loadPartners();

}

);
/* ==========================================
ADD PARTNER MODAL
========================================== */

window.openAddPartnerModal =
function(){

document
.getElementById(
"addPartnerModal"
)
.classList.add(
"active"
);

};

window.closeAddPartnerModal =
function(){

document
.getElementById(
"addPartnerModal"
)
.classList.remove(
"active"
);

resetPartnerForm();

};

/* ==========================================
RESET FORM
========================================== */

function resetPartnerForm(){

document.getElementById(
"ownerName"
).value = "";

document.getElementById(
"businessName"
).value = "";

document.getElementById(
"partnerPhone"
).value = "";

document.getElementById(
"partnerEmail"
).value = "";

document.getElementById(
"gstNumber"
).value = "";

document.getElementById(
"panNumber"
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

};

/* ==========================================
GET SERVICES
========================================== */

function getSelectedServices(){

const services = [];

document
.querySelectorAll(
".servicesSelection input[type='checkbox']:checked"
)

.forEach(item=>{

services.push(
item.value
);

});

return services;

}

/* ==========================================
DOCUMENT UPLOAD PLACEHOLDER
========================================== */

async function uploadPartnerDocument(file){

if(!file)
return "";

try{

/*
Future Firebase Storage
*/

return URL.createObjectURL(
file
);

}catch(error){

console.error(error);

return "";

}

}

/* ==========================================
SAVE PARTNER
========================================== */

window.savePartner =
async function(){

try{

const ownerName =

document.getElementById(
"ownerName"
).value.trim();

const businessName =

document.getElementById(
"businessName"
).value.trim();

const phone =

document.getElementById(
"partnerPhone"
).value.trim();

const email =

document.getElementById(
"partnerEmail"
).value.trim();

const city =

document.getElementById(
"partnerCity"
).value;

const status =

document.getElementById(
"partnerStatus"
).value;

const gstNumber =

document.getElementById(
"gstNumber"
).value.trim();

const panNumber =

document.getElementById(
"panNumber"
).value.trim();

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

const services =

getSelectedServices();

/* VALIDATION */

if(!ownerName){

alert(
"Enter Owner Name"
);

return;

}

if(!businessName){

alert(
"Enter Business Name"
);

return;

}

if(phone.length < 10){

alert(
"Enter Valid Mobile Number"
);

return;

}

/* DOCUMENTS */

const gstDocUrl =

await uploadPartnerDocument(

document.getElementById(
"gstDoc"
).files[0]

);

const panDocUrl =

await uploadPartnerDocument(

document.getElementById(
"panDoc"
).files[0]

);

const aadhaarDocUrl =

await uploadPartnerDocument(

document.getElementById(
"aadhaarDoc"
).files[0]

);

const shopDocUrl =

await uploadPartnerDocument(

document.getElementById(
"shopDoc"
).files[0]

);

/* PARTNER OBJECT */

const partnerData = {

partnerId:

"PTN" +

Date.now(),

ownerName,

businessName,

phone,

email,

city,

status,

approved:

status === "Active",

services,

gstNumber,

panNumber,

accountHolder,

accountNumber,

ifscCode,

bankName,

gstDocUrl,

panDocUrl,

aadhaarDocUrl,

shopDocUrl,

totalOrders:0,

totalRevenue:0,

pendingSettlement:0,

paidSettlement:0,

createdAt:
serverTimestamp()

};

/* SAVE */

await addDoc(

collection(
db,
"partners"
),

partnerData

);

alert(
"Partner Added Successfully"
);

closeAddPartnerModal();

await loadPartners();

}catch(error){

console.error(
error
);

alert(
"Failed To Save Partner"
);

}

};

/* ==========================================
ESC CLOSE
========================================== */

document.addEventListener(

"keydown",

function(e){

if(e.key === "Escape"){

closeAddPartnerModal();

}

}

);
/* ==========================================
VIEW PARTNER
========================================== */

window.viewPartner =
function(partnerId){

const partner =

partners.find(

item => item.id === partnerId

);

if(!partner)
return;

document
.getElementById(
"viewPartnerModal"
)
.classList.add(
"active"
);

/* PROFILE */

document.getElementById(
"partnerAvatarLarge"
).innerText =

(partner.ownerName || "P")
.charAt(0)
.toUpperCase();

document.getElementById(
"viewOwnerName"
).innerText =

partner.ownerName || "-";

document.getElementById(
"viewBusinessName"
).innerText =

partner.businessName || "-";

/* STATUS */

const badge =

document.getElementById(
"viewStatusBadge"
);

badge.innerText =
partner.status || "Pending";

badge.className =
"partnerStatusLarge";

/* BUSINESS */

setValue(
"viewOwner",
partner.ownerName
);

setValue(
"viewBusiness",
partner.businessName
);

setValue(
"viewPhone",
partner.phone
);

setValue(
"viewEmail",
partner.email
);

setValue(
"viewCity",
partner.city
);

setValue(
"viewServices",

Array.isArray(
partner.services
)

?

partner.services.join(", ")

:

"-"

);

/* GST + PAN */

setValue(
"viewGST",
partner.gstNumber
);

setValue(
"viewPAN",
partner.panNumber
);

/* BANK */

setValue(
"viewAccountHolder",
partner.accountHolder
);

setValue(
"viewAccountNumber",
partner.accountNumber
);

setValue(
"viewIFSC",
partner.ifscCode
);

setValue(
"viewBankName",
partner.bankName
);

/* DOCUMENTS */

document.getElementById(
"gstDocLink"
).href =

partner.gstDocUrl || "#";

document.getElementById(
"panDocLink"
).href =

partner.panDocUrl || "#";

document.getElementById(
"aadhaarDocLink"
).href =

partner.aadhaarDocUrl || "#";

document.getElementById(
"shopDocLink"
).href =

partner.shopDocUrl || "#";

/* SETTLEMENT */

setValue(
"viewTotalOrders",
partner.totalOrders || 0
);

setValue(
"viewRevenue",

"₹" +

Number(
partner.totalRevenue || 0
).toLocaleString(
"en-IN"
)

);

setValue(
"viewPendingSettlement",

"₹" +

Number(
partner.pendingSettlement || 0
).toLocaleString(
"en-IN"
)

);

setValue(
"viewPaidSettlement",

"₹" +

Number(
partner.paidSettlement || 0
).toLocaleString(
"en-IN"
)

);

};

/* ==========================================
CLOSE VIEW MODAL
========================================== */

window.closeViewPartnerModal =
function(){

document
.getElementById(
"viewPartnerModal"
)
.classList.remove(
"active"
);

};

/* ==========================================
EDIT PARTNER
========================================== */

window.editPartner =
function(partnerId){

const partner =

partners.find(

item => item.id === partnerId

);

if(!partner)
return;

document
.getElementById(
"editPartnerModal"
)
.classList.add(
"active"
);

document.getElementById(
"editPartnerId"
).value =
partner.id;

document.getElementById(
"editOwnerName"
).value =

partner.ownerName || "";

document.getElementById(
"editBusinessName"
).value =

partner.businessName || "";

document.getElementById(
"editPhone"
).value =

partner.phone || "";

document.getElementById(
"editCity"
).value =

partner.city || "";

};

/* ==========================================
CLOSE EDIT
========================================== */

window.closeEditPartnerModal =
function(){

document
.getElementById(
"editPartnerModal"
)
.classList.remove(
"active"
);

};

/* ==========================================
UPDATE PARTNER
========================================== */

window.updatePartner =
async function(){

try{

const partnerId =

document.getElementById(
"editPartnerId"
).value;

if(!partnerId){

alert(
"Partner ID Missing"
);

return;

}

const ownerName =

document.getElementById(
"editOwnerName"
).value.trim();

const businessName =

document.getElementById(
"editBusinessName"
).value.trim();

const phone =

document.getElementById(
"editPhone"
).value.trim();

const city =

document.getElementById(
"editCity"
).value.trim();

if(!ownerName){

alert(
"Owner Name Required"
);

return;

}

await updateDoc(

doc(
db,
"partners",
partnerId
),

{

ownerName,

businessName,

phone,

city,

updatedAt:
serverTimestamp()

}

);

alert(
"Partner Updated Successfully"
);

closeEditPartnerModal();

await loadPartners();

}catch(error){

console.error(
error
);

alert(
"Failed To Update Partner"
);

}

};

/* ==========================================
HELPER
========================================== */

function setValue(
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
APPROVE / SUSPEND MODAL
========================================== */

window.openApprovalModal =
function(partnerId){

const partner =

partners.find(

item => item.id === partnerId

);

if(!partner)
return;

document.getElementById(
"actionPartnerId"
).value =
partnerId;

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
"Approve Partner";

document.getElementById(
"actionMessage"
).innerText =

`Approve ${partner.businessName}?`;

document
.getElementById(
"actionModal"
)
.classList.add(
"active"
);

};

window.openSuspendModal =
function(partnerId){

const partner =

partners.find(

item => item.id === partnerId

);

if(!partner)
return;

document.getElementById(
"actionPartnerId"
).value =
partnerId;

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
"Suspend Partner";

document.getElementById(
"actionMessage"
).innerText =

`Suspend ${partner.businessName}?`;

document
.getElementById(
"actionModal"
)
.classList.add(
"active"
);

};

window.openActivateModal =
function(partnerId){

const partner =

partners.find(

item => item.id === partnerId

);

if(!partner)
return;

document.getElementById(
"actionPartnerId"
).value =
partnerId;

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
"Activate Partner";

document.getElementById(
"actionMessage"
).innerText =

`Activate ${partner.businessName}?`;

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

const confirmBtn =

document.getElementById(
"confirmActionBtn"
);

if(confirmBtn){

confirmBtn.addEventListener(

"click",

async ()=>{

try{

const partnerId =

document.getElementById(
"actionPartnerId"
).value;

const action =

document.getElementById(
"actionType"
).value;

if(!partnerId)
return;

let updateData = {};

if(action === "approve"){

updateData = {

approved:true,

status:"Active",

approvedAt:
serverTimestamp(),

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

if(action === "activate"){

updateData = {

status:"Active",

updatedAt:
serverTimestamp()

};

}

await updateDoc(

doc(
db,
"partners",
partnerId
),

updateData

);

alert(
"Partner Updated Successfully"
);

closeActionModal();

await loadPartners();

}catch(error){

console.error(
error
);

alert(
"Action Failed"
);

}

}

);

}

/* ==========================================
SETTLEMENT STATUS UPDATE
========================================== */

window.markSettlementPaid =
async function(

partnerId,
amount = 0

){

try{

const partner =

partners.find(

item => item.id === partnerId

);

if(!partner)
return;

const pendingAmount =

Number(
partner.pendingSettlement || 0
);

const paidAmount =

Number(
partner.paidSettlement || 0
);

await updateDoc(

doc(
db,
"partners",
partnerId
),

{

pendingSettlement:

Math.max(
0,
pendingAmount - amount
),

paidSettlement:

paidAmount + amount,

lastSettlementAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

}

);

alert(
"Settlement Updated"
);

await loadPartners();

}catch(error){

console.error(
error
);

alert(
"Settlement Update Failed"
);

}

};

/* ==========================================
APPROVE DIRECT
========================================== */

window.approvePartner =
async function(partnerId){

try{

await updateDoc(

doc(
db,
"partners",
partnerId
),

{

approved:true,

status:"Active",

approvedAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

}

);

await loadPartners();

}catch(error){

console.error(error);

}

};

/* ==========================================
SUSPEND DIRECT
========================================== */

window.suspendPartner =
async function(partnerId){

try{

await updateDoc(

doc(
db,
"partners",
partnerId
),

{

status:"Suspended",

updatedAt:
serverTimestamp()

}

);

await loadPartners();

}catch(error){

console.error(error);

}

};

/* ==========================================
ACTIVATE DIRECT
========================================== */

window.activatePartner =
async function(partnerId){

try{

await updateDoc(

doc(
db,
"partners",
partnerId
),

{

status:"Active",

updatedAt:
serverTimestamp()

}

);

await loadPartners();

}catch(error){

console.error(error);

}

};/* ==========================================
DELETE PARTNER MODAL
========================================== */

window.openDeletePartnerModal =
function(partnerId){

document.getElementById(
"deletePartnerId"
).value =
partnerId;

document
.getElementById(
"deletePartnerModal"
)
.classList.add(
"active"
);

};

window.closeDeletePartnerModal =
function(){

document
.getElementById(
"deletePartnerModal"
)
.classList.remove(
"active"
);

};

/* ==========================================
DELETE PARTNER
========================================== */

window.deletePartner =
async function(){

try{

const partnerId =

document.getElementById(
"deletePartnerId"
).value;

if(!partnerId){

alert(
"Partner ID Missing"
);

return;

}

await deleteDoc(

doc(
db,
"partners",
partnerId
)

);

alert(
"Partner Deleted Successfully"
);

closeDeletePartnerModal();

await loadPartners();

}catch(error){

console.error(error);

alert(
"Delete Failed"
);

}

};

/* ==========================================
SELECT ALL PARTNERS
========================================== */

const selectAllPartners =

document.getElementById(
"selectAllPartners"
);

if(selectAllPartners){

selectAllPartners.addEventListener(

"change",

function(){

document
.querySelectorAll(
".partnerCheckbox"
)

.forEach(box=>{

box.checked =
this.checked;

});

updateSelectedPartners();

}

);

}

/* ==========================================
UPDATE SELECT COUNT
========================================== */

window.updateSelectedPartners =
function(){

const selected =

document.querySelectorAll(
".partnerCheckbox:checked"
);

const countBox =

document.getElementById(
"selectedPartnersCount"
);

if(countBox){

countBox.innerText =

selected.length +

" Selected";

}

};

/* ==========================================
GET SELECTED IDS
========================================== */

function getSelectedPartnerIds(){

const ids = [];

document
.querySelectorAll(
".partnerCheckbox:checked"
)

.forEach(box=>{

ids.push(
box.value
);

});

return ids;

}

/* ==========================================
BULK APPROVE
========================================== */

window.bulkApprovePartners =
async function(){

const ids =
getSelectedPartnerIds();

if(ids.length===0){

alert(
"Select Partners First"
);

return;

}

for(const id of ids){

await updateDoc(

doc(
db,
"partners",
id
),

{

approved:true,

status:"Active",

updatedAt:
serverTimestamp()

}

);

}

alert(
"Partners Approved"
);

await loadPartners();

};

/* ==========================================
BULK ACTIVATE
========================================== */

window.bulkActivatePartners =
async function(){

const ids =
getSelectedPartnerIds();

if(ids.length===0){

alert(
"Select Partners First"
);

return;

}

for(const id of ids){

await updateDoc(

doc(
db,
"partners",
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
"Partners Activated"
);

await loadPartners();

};

/* ==========================================
BULK SUSPEND
========================================== */

window.bulkSuspendPartners =
async function(){

const ids =
getSelectedPartnerIds();

if(ids.length===0){

alert(
"Select Partners First"
);

return;

}

for(const id of ids){

await updateDoc(

doc(
db,
"partners",
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
"Partners Suspended"
);

await loadPartners();

};

/* ==========================================
BULK DELETE
========================================== */

window.bulkDeletePartners =
async function(){

const ids =
getSelectedPartnerIds();

if(ids.length===0){

alert(
"Select Partners First"
);

return;

}

if(

!confirm(
`Delete ${ids.length} partners?`
)

)return;

for(const id of ids){

await deleteDoc(

doc(
db,
"partners",
id
)

);

}

alert(
"Partners Deleted"
);

await loadPartners();

};

/* ==========================================
SEARCH FILTER
========================================== */

const searchPartner =

document.getElementById(
"searchPartner"
);

if(searchPartner){

searchPartner.addEventListener(

"input",

applyPartnerFilters

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

applyPartnerFilters

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

applyPartnerFilters

);

/* ==========================================
SERVICE FILTER
========================================== */

document
.getElementById(
"serviceFilter"
)

?.addEventListener(

"change",

applyPartnerFilters

);

/* ==========================================
APPLY FILTERS
========================================== */

window.applyPartnerFilters =
function(){

const search =

document
.getElementById(
"searchPartner"
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

const service =

document
.getElementById(
"serviceFilter"
)
?.value || "";

filteredPartners =

partners.filter(partner=>{

const matchSearch =

!search ||

(partner.ownerName || "")
.toLowerCase()
.includes(search)

||

(partner.businessName || "")
.toLowerCase()
.includes(search)

||

(partner.phone || "")
.includes(search);

const matchCity =

!city ||

partner.city === city;

const matchStatus =

!status ||

partner.status === status;

const matchService =

!service ||

(
Array.isArray(
partner.services
)

&&

partner.services.includes(
service
)

);

return (

matchSearch &&
matchCity &&
matchStatus &&
matchService

);

});

renderPartnersTable();

};/* ==========================================
EXPORT PARTNERS CSV
========================================== */

window.exportPartnersCSV =
function(){

if(partners.length === 0){

alert(
"No Partners Found"
);

return;

}

let csv =

"Partner ID,Owner,Business,Phone,City,Orders,Revenue,Status,Approved\n";

partners.forEach(partner=>{

csv +=

`${partner.partnerId || ""},
${partner.ownerName || ""},
${partner.businessName || ""},
${partner.phone || ""},
${partner.city || ""},
${partner.totalOrders || 0},
${partner.totalRevenue || 0},
${partner.status || ""},
${partner.approved ? "Yes" : "No"}
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
"quickpress-partners.csv";

a.click();

URL.revokeObjectURL(
url
);

};

/* ==========================================
RENDER SETTLEMENT TABLE
========================================== */

function renderSettlementTable(){

const tbody =

document.getElementById(
"settlementTableBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

partners.forEach(partner=>{

const revenue =

Number(
partner.totalRevenue || 0
);

const commission =

Math.round(
revenue * 0.20
);

const payable =

revenue - commission;

tbody.innerHTML += `

<tr>

<td>

${partner.businessName || "-"}

</td>

<td>

₹${revenue.toLocaleString("en-IN")}

</td>

<td>

₹${commission.toLocaleString("en-IN")}

</td>

<td>

₹${payable.toLocaleString("en-IN")}

</td>

<td>

<span class="statusBadge activeBadge">

${partner.pendingSettlement > 0

? "Pending"

: "Paid"}

</span>

</td>

<td>

${partner.lastSettlementAt

?

new Date(
partner.lastSettlementAt.seconds * 1000
).toLocaleDateString()

:

"-"}

</td>

<td>

<button
class="approveBtn"
onclick="markSettlementPaid('${partner.id}', ${partner.pendingSettlement || 0})">

Pay

</button>

</td>

</tr>

`;

});

}

/* ==========================================
EARNINGS ANALYTICS
========================================== */

function updateEarningsAnalytics(){

let totalRevenue = 0;

let pending = 0;

let paid = 0;

partners.forEach(partner=>{

totalRevenue +=

Number(
partner.totalRevenue || 0
);

pending +=

Number(
partner.pendingSettlement || 0
);

paid +=

Number(
partner.paidSettlement || 0
);

});

const average =

partners.length

?

Math.round(
totalRevenue /
partners.length
)

:

0;

setText(
"totalPartnerRevenue",
"₹" +
totalRevenue.toLocaleString(
"en-IN"
)
);

setText(
"pendingSettlements",
"₹" +
pending.toLocaleString(
"en-IN"
)
);

setText(
"paidSettlements",
"₹" +
paid.toLocaleString(
"en-IN"
)
);

setText(
"avgPartnerRevenue",
"₹" +
average.toLocaleString(
"en-IN"
)
);

}

/* ==========================================
BULK BUTTON EVENTS
========================================== */

document
.querySelector(
".approveBulkBtn"
)

?.addEventListener(

"click",

bulkApprovePartners

);

document
.querySelector(
".activateBulkBtn"
)

?.addEventListener(

"click",

bulkActivatePartners

);

document
.querySelector(
".suspendBulkBtn"
)

?.addEventListener(

"click",

bulkSuspendPartners

);

document
.querySelector(
".deleteBulkBtn"
)

?.addEventListener(

"click",

bulkDeletePartners

);

/* ==========================================
EXPORT BUTTON
========================================== */

document
.querySelector(
".exportBtn"
)

?.addEventListener(

"click",

exportPartnersCSV

);

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
ESC KEY CLOSE
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

loadPartners();

},

300000

);

/* ==========================================
ENHANCED LOAD
========================================== */

const originalLoadPartners =
loadPartners;

window.loadPartners =
async function(){

await originalLoadPartners();

renderSettlementTable();

updateEarningsAnalytics();

};

/* ==========================================
FINAL INITIALIZATION
========================================== */

document.addEventListener(

"DOMContentLoaded",

async ()=>{

try{

await loadPartners();

renderSettlementTable();

updateEarningsAnalytics();

console.log(

"QuickPress Partner Panel Ready 🚀"

);

}catch(error){

console.error(

"Initialization Error",

error

);

}

}

);

/* ==========================================
GLOBAL EXPORTS
========================================== */

window.partnersApp = {

loadPartners,
savePartner,
updatePartner,
deletePartner,
viewPartner,
editPartner,
approvePartner,
suspendPartner,
activatePartner,
exportPartnersCSV

};
