/* ==========================================
QUICKPRESS SERVICES MANAGEMENT
PART 1/6
========================================== */

import { db }
from "../js/firebase.js";

import {

collection,
getDocs,
addDoc,
updateDoc,
deleteDoc,
doc,
serverTimestamp

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
/* ==========================================
LOGIN PROTECTION
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

let services = [];

let filteredServices = [];

let totalRevenue = 0;

let totalOrders = 0;

/* ==========================================
LOAD SERVICES
========================================== */

window.loadServices =
async function(){

try{

showLoading();

const snapshot =

await getDocs(

collection(
db,
"services"
)

);

services = [];

snapshot.forEach(docSnap=>{

services.push({

id:docSnap.id,

...docSnap.data()

});

});

filteredServices =
[...services];

renderServicesTable();

updateStatistics();

renderFeaturedServices();

hideLoading();

}catch(error){

console.error(
"Services Load Error",
error
);

hideLoading();

}

};

/* ==========================================
RENDER TABLE
========================================== */

function renderServicesTable(){

const tbody =

document.getElementById(
"servicesTableBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

if(
filteredServices.length === 0
){

tbody.innerHTML = `

<tr>

<td colspan="11"
style="text-align:center;padding:40px;">

No Services Found

</td>

</tr>

`;

return;

}

filteredServices.forEach(service=>{

tbody.innerHTML += `

<tr>

<td>

<img
src="${service.imageUrl || ''}"
class="serviceImage"
onerror="this.src='https://via.placeholder.com/60'">

</td>

<td>

<b>

${service.name || "-"}

</b>

</td>

<td>

${service.category || "-"}

</td>

<td>

${service.unit || "-"}

</td>

<td>

₹${service.price || 0}

</td>

<td>

₹${service.expressPrice || 0}

</td>

<td>

${service.ordersCount || 0}

</td>

<td>

₹${Number(
service.revenue || 0
).toLocaleString("en-IN")}

</td>

<td>

<span class="statusBadge
${service.active
? 'statusActive'
: 'statusDisabled'}">

${service.active
? 'Active'
: 'Disabled'}

</span>

</td>

<td>

${service.featured

?

'<span class="featuredBadge">Featured</span>'

:

'-'

}

</td>

<td>

<div class="actionButtons">

<button
class="viewBtn"
onclick="viewService('${service.id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="editBtn"
onclick="editService('${service.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="deleteBtn"
onclick="openDeleteModal('${service.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

});

}

/* ==========================================
STATISTICS
========================================== */

function updateStatistics(){

let active = 0;

let featured = 0;

totalRevenue = 0;

services.forEach(service=>{

if(service.active)
active++;

if(service.featured)
featured++;

totalRevenue +=

Number(
service.revenue || 0
);

});

setText(
"totalServices",
services.length
);

setText(
"activeServices",
active
);

setText(
"featuredServices",
featured
);

setText(
"totalRevenue",
"₹" +
totalRevenue.toLocaleString(
"en-IN"
)
);

}

/* ==========================================
FEATURED SERVICES
========================================== */

function renderFeaturedServices(){

const container =

document.getElementById(
"featuredServicesGrid"
);

if(!container)
return;

container.innerHTML = "";

const featuredList =

services.filter(

item => item.featured === true

);

featuredList.forEach(service=>{

container.innerHTML += `

<div class="featuredService">

<img
src="${service.imageUrl || ''}"
onerror="this.src='https://via.placeholder.com/300x160'">

<div class="featuredContent">

<h4>

${service.name}

</h4>

<p>

₹${service.price}

 / ${service.unit}

</p>

</div>

</div>

`;

});

}

/* ==========================================
HELPERS
========================================== */

function setText(
id,
value
){

const el =

document.getElementById(
id
);

if(el){

el.innerText =
value;

}

}

function showLoading(){

console.log(
"Loading Services..."
);

}

function hideLoading(){

console.log(
"Services Loaded"
);

}

/* ==========================================
INITIALIZE
========================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

loadServices();

}

);
/* ==========================================
ADD SERVICE MODAL
========================================== */

window.openAddServiceModal =
function(){

document
.getElementById(
"addServiceModal"
)
.classList.add(
"active"
);

};

window.closeAddServiceModal =
function(){

document
.getElementById(
"addServiceModal"
)
.classList.remove(
"active"
);

resetServiceForm();

};

/* ==========================================
RESET FORM
========================================== */

function resetServiceForm(){

document.getElementById(
"serviceName"
).value = "";

document.getElementById(
"serviceCategory"
).selectedIndex = 0;

document.getElementById(
"serviceUnit"
).selectedIndex = 0;

document.getElementById(
"servicePrice"
).value = "";

document.getElementById(
"expressPrice"
).value = "";

document.getElementById(
"serviceGST"
).value = "";

document.getElementById(
"serviceDescription"
).value = "";

document.getElementById(
"serviceImage"
).value = "";

document.getElementById(
"featuredService"
).checked = false;

document.getElementById(
"activeService"
).checked = true;

}

/* ==========================================
IMAGE UPLOAD
========================================== */

async function uploadServiceImage(file){

if(!file)
return "";

try{

/*
Future:
Firebase Storage Upload

return downloadURL
*/

return URL.createObjectURL(
file
);

}catch(error){

console.error(
"Image Upload Error",
error
);

return "";

}

}

/* ==========================================
SAVE SERVICE
========================================== */

window.saveService =
async function(){

try{

const name =

document.getElementById(
"serviceName"
).value.trim();

const category =

document.getElementById(
"serviceCategory"
).value;

const unit =

document.getElementById(
"serviceUnit"
).value;

const price =

Number(

document.getElementById(
"servicePrice"
).value

);

const expressPrice =

Number(

document.getElementById(
"expressPrice"
).value

);

const gst =

Number(

document.getElementById(
"serviceGST"
).value

);

const description =

document.getElementById(
"serviceDescription"
).value.trim();

const featured =

document.getElementById(
"featuredService"
).checked;

const active =

document.getElementById(
"activeService"
).checked;

const imageFile =

document.getElementById(
"serviceImage"
).files[0];

/* ==========================================
VALIDATION
========================================== */

if(!name){

alert(
"Enter Service Name"
);

return;

}

if(!price){

alert(
"Enter Service Price"
);

return;

}

const imageUrl =

await uploadServiceImage(
imageFile
);

/* ==========================================
SERVICE OBJECT
========================================== */

const serviceData = {

serviceId:

"SRV" +

Date.now(),

name,

category,

unit,

price,

expressPrice,

gst,

description,

imageUrl,

featured,

active,

ordersCount:0,

revenue:0,

createdAt:
serverTimestamp()

};

/* ==========================================
SAVE TO FIRESTORE
========================================== */

await addDoc(

collection(
db,
"services"
),

serviceData

);

alert(
"Service Added Successfully"
);

closeAddServiceModal();

await loadServices();

}catch(error){

console.error(
error
);

alert(
"Failed To Save Service"
);

}

};

/* ==========================================
LIVE PREVIEW IMAGE
========================================== */

const imageInput =

document.getElementById(
"serviceImage"
);

if(imageInput){

imageInput.addEventListener(

"change",

function(){

const file =

this.files[0];

if(!file)
return;

console.log(

"Selected Image:",

file.name

);

}

);

}/* ==========================================
VIEW SERVICE
========================================== */

window.viewService =
function(serviceId){

const service =

services.find(

item => item.id === serviceId

);

if(!service)
return;

document
.getElementById(
"viewServiceModal"
)
.classList.add(
"active"
);

document.getElementById(
"viewImage"
).src =

service.imageUrl ||

"https://via.placeholder.com/300";

document.getElementById(
"viewName"
).innerText =

service.name || "-";

document.getElementById(
"viewCategory"
).innerText =

service.category || "-";

document.getElementById(
"viewDescription"
).innerText =

service.description ||

"No Description Available";

document.getElementById(
"viewPrice"
).innerText =

"₹" +
(service.price || 0);

document.getElementById(
"viewExpressPrice"
).innerText =

"₹" +
(service.expressPrice || 0);

document.getElementById(
"viewUnit"
).innerText =

service.unit || "-";

document.getElementById(
"viewGST"
).innerText =

(service.gst || 0) + "%";

document.getElementById(
"viewOrders"
).innerText =

service.ordersCount || 0;

document.getElementById(
"viewRevenue"
).innerText =

"₹" +

Number(
service.revenue || 0
).toLocaleString(
"en-IN"
);

};

/* ==========================================
CLOSE VIEW MODAL
========================================== */

window.closeViewServiceModal =
function(){

document
.getElementById(
"viewServiceModal"
)
.classList.remove(
"active"
);

};

/* ==========================================
EDIT SERVICE
========================================== */

window.editService =
function(serviceId){

const service =

services.find(

item => item.id === serviceId

);

if(!service)
return;

document
.getElementById(
"editServiceModal"
)
.classList.add(
"active"
);

/* ID */

document.getElementById(
"editServiceId"
).value =

service.id;

/* NAME */

document.getElementById(
"editServiceName"
).value =

service.name || "";

/* CATEGORY */

document.getElementById(
"editServiceCategory"
).value =

service.category || "";

/* PRICE */

document.getElementById(
"editServicePrice"
).value =

service.price || 0;

/* EXPRESS */

document.getElementById(
"editExpressPrice"
).value =

service.expressPrice || 0;

/* FEATURED */

document.getElementById(
"editFeatured"
).checked =

service.featured || false;

/* ACTIVE */

document.getElementById(
"editActive"
).checked =

service.active !== false;

};

/* ==========================================
CLOSE EDIT MODAL
========================================== */

window.closeEditServiceModal =
function(){

document
.getElementById(
"editServiceModal"
)
.classList.remove(
"active"
);

};

/* ==========================================
UPDATE SERVICE
========================================== */

window.updateService =
async function(){

try{

const serviceId =

document.getElementById(
"editServiceId"
).value;

if(!serviceId){

alert(
"Service ID Missing"
);

return;

}

const name =

document.getElementById(
"editServiceName"
).value.trim();

const category =

document.getElementById(
"editServiceCategory"
).value;

const price =

Number(

document.getElementById(
"editServicePrice"
).value

);

const expressPrice =

Number(

document.getElementById(
"editExpressPrice"
).value

);

const featured =

document.getElementById(
"editFeatured"
).checked;

const active =

document.getElementById(
"editActive"
).checked;

if(!name){

alert(
"Service Name Required"
);

return;

}

await updateDoc(

doc(
db,
"services",
serviceId
),

{

name,

category,

price,

expressPrice,

featured,

active,

updatedAt:
serverTimestamp()

}

);

alert(
"Service Updated Successfully"
);

closeEditServiceModal();

await loadServices();

}catch(error){

console.error(
"Update Error",
error
);

alert(
"Failed To Update Service"
);

}

};/* ==========================================
DELETE MODAL
========================================== */

window.openDeleteModal =
function(serviceId){

document.getElementById(
"deleteServiceId"
).value = serviceId;

document
.getElementById(
"deleteModal"
)
.classList.add(
"active"
);

};

window.closeDeleteModal =
function(){

document
.getElementById(
"deleteModal"
)
.classList.remove(
"active"
);

};

/* ==========================================
DELETE SERVICE
========================================== */

window.deleteService =
async function(){

try{

const serviceId =

document.getElementById(
"deleteServiceId"
).value;

if(!serviceId){

alert(
"Service ID Missing"
);

return;

}

const confirmDelete =

confirm(
"Delete this service permanently?"
);

if(!confirmDelete)
return;

await deleteDoc(

doc(
db,
"services",
serviceId
)

);

alert(
"Service Deleted Successfully"
);

closeDeleteModal();

await loadServices();

}catch(error){

console.error(
"Delete Error",
error
);

alert(
"Failed To Delete Service"
);

}

};

/* ==========================================
TOGGLE ACTIVE STATUS
========================================== */

window.toggleServiceStatus =
async function(serviceId){

try{

const service =

services.find(

item => item.id === serviceId

);

if(!service)
return;

await updateDoc(

doc(
db,
"services",
serviceId
),

{

active:
!service.active,

updatedAt:
serverTimestamp()

}

);

await loadServices();

}catch(error){

console.error(
error
);

alert(
"Status Update Failed"
);

}

};

/* ==========================================
TOGGLE FEATURED
========================================== */

window.toggleFeaturedService =
async function(serviceId){

try{

const service =

services.find(

item => item.id === serviceId

);

if(!service)
return;

await updateDoc(

doc(
db,
"services",
serviceId
),

{

featured:
!service.featured,

updatedAt:
serverTimestamp()

}

);

await loadServices();

}catch(error){

console.error(
error
);

alert(
"Featured Update Failed"
);

}

};

/* ==========================================
SELECT ALL SERVICES
========================================== */

const selectAllBox =

document.getElementById(
"selectAllServices"
);

if(selectAllBox){

selectAllBox.addEventListener(

"change",

function(){

document
.querySelectorAll(
".serviceCheckbox"
)

.forEach(box=>{

box.checked =
this.checked;

});

updateSelectedServices();

}

);

}

/* ==========================================
UPDATE SELECT COUNT
========================================== */

window.updateSelectedServices =
function(){

const selected =

document.querySelectorAll(
".serviceCheckbox:checked"
);

const countBox =

document.getElementById(
"selectedServicesCount"
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

function getSelectedServiceIds(){

const ids = [];

document
.querySelectorAll(
".serviceCheckbox:checked"
)

.forEach(box=>{

ids.push(
box.value
);

});

return ids;

}

/* ==========================================
BULK DELETE
========================================== */

window.bulkDeleteServices =
async function(){

const ids =

getSelectedServiceIds();

if(ids.length === 0){

alert(
"Select Services First"
);

return;

}

const confirmDelete =

confirm(

`Delete ${ids.length} services?`

);

if(!confirmDelete)
return;

try{

for(const id of ids){

await deleteDoc(

doc(
db,
"services",
id
)

);

}

alert(
"Bulk Delete Completed"
);

await loadServices();

}catch(error){

console.error(
error
);

alert(
"Bulk Delete Failed"
);

}

};

/* ==========================================
BULK ACTIVATE
========================================== */

window.bulkActivateServices =
async function(){

const ids =
getSelectedServiceIds();

if(ids.length===0){

alert(
"Select Services First"
);

return;

}

for(const id of ids){

await updateDoc(

doc(
db,
"services",
id
),

{

active:true

}

);

}

await loadServices();

};

/* ==========================================
BULK DISABLE
========================================== */

window.bulkDisableServices =
async function(){

const ids =
getSelectedServiceIds();

if(ids.length===0){

alert(
"Select Services First"
);

return;

}

for(const id of ids){

await updateDoc(

doc(
db,
"services",
id
),

{

active:false

}

);

}

await loadServices();

};

/* ==========================================
BULK FEATURE
========================================== */

window.bulkFeatureServices =
async function(){

const ids =
getSelectedServiceIds();

if(ids.length===0){

alert(
"Select Services First"
);

return;

}

for(const id of ids){

await updateDoc(

doc(
db,
"services",
id
),

{

featured:true

}

);

}

await loadServices();

};/* ==========================================
SEARCH SERVICE
========================================== */

const searchInput =

document.getElementById(
"searchService"
);

if(searchInput){

searchInput.addEventListener(

"input",

function(){

applyFilters();

}

);

}

/* ==========================================
CATEGORY FILTER
========================================== */

const categoryFilter =

document.getElementById(
"categoryFilter"
);

if(categoryFilter){

categoryFilter.addEventListener(

"change",

function(){

applyFilters();

}

);

}

/* ==========================================
STATUS FILTER
========================================== */

const statusFilter =

document.getElementById(
"statusFilter"
);

if(statusFilter){

statusFilter.addEventListener(

"change",

function(){

applyFilters();

}

);

}

/* ==========================================
APPLY FILTERS
========================================== */

window.applyFilters =
function(){

const searchValue =

document
.getElementById(
"searchService"
)
?.value
.toLowerCase()
.trim() || "";

const categoryValue =

document
.getElementById(
"categoryFilter"
)
?.value || "";

const statusValue =

document
.getElementById(
"statusFilter"
)
?.value || "";

filteredServices =

services.filter(service=>{

/* SEARCH */

const matchesSearch =

!searchValue ||

(service.name || "")
.toLowerCase()
.includes(searchValue) ||

(service.category || "")
.toLowerCase()
.includes(searchValue);

/* CATEGORY */

const matchesCategory =

!categoryValue ||

service.category ===
categoryValue;

/* STATUS */

let matchesStatus = true;

if(statusValue === "true"){

matchesStatus =
service.active === true;

}

if(statusValue === "false"){

matchesStatus =
service.active === false;

}

return (

matchesSearch &&
matchesCategory &&
matchesStatus

);

});

renderServicesTable();

};

/* ==========================================
FEATURED SERVICES REFRESH
========================================== */

window.refreshFeaturedServices =
function(){

renderFeaturedServices();

};

/* ==========================================
SORT SERVICES
========================================== */

window.sortServicesByRevenue =
function(){

filteredServices.sort(

(a,b)=>

Number(
b.revenue || 0
)

-

Number(
a.revenue || 0
)

);

renderServicesTable();

};

window.sortServicesByOrders =
function(){

filteredServices.sort(

(a,b)=>

Number(
b.ordersCount || 0
)

-

Number(
a.ordersCount || 0
)

);

renderServicesTable();

};

window.sortServicesByPrice =
function(){

filteredServices.sort(

(a,b)=>

Number(
a.price || 0
)

-

Number(
b.price || 0
)

);

renderServicesTable();

};

/* ==========================================
RESET FILTERS
========================================== */

window.resetFilters =
function(){

document.getElementById(
"searchService"
).value = "";

document.getElementById(
"categoryFilter"
).value = "";

document.getElementById(
"statusFilter"
).value = "";

filteredServices =

[...services];

renderServicesTable();

};

/* ==========================================
LIVE TABLE UPDATE
========================================== */

window.refreshServicesTable =
function(){

applyFilters();

renderFeaturedServices();

updateStatistics();

};

/* ==========================================
AUTO REFRESH
========================================== */

setInterval(

()=>{

loadServices();

},

300000

);

/* ==========================================
FEATURED COUNTER
========================================== */

function updateFeaturedCounter(){

const featuredCount =

services.filter(

item => item.featured

).length;

const featuredEl =

document.getElementById(
"featuredServices"
);

if(featuredEl){

featuredEl.innerText =
featuredCount;

}

}

updateFeaturedCounter();/* ==========================================
EXPORT SERVICES CSV
========================================== */

window.exportServicesCSV =
function(){

if(services.length === 0){

alert(
"No Services Found"
);

return;

}

let csv =

"Service ID,Name,Category,Unit,Price,Express Price,GST,Orders,Revenue,Status,Featured\n";

services.forEach(service=>{

csv +=

`${service.serviceId || ""},
${service.name || ""},
${service.category || ""},
${service.unit || ""},
${service.price || 0},
${service.expressPrice || 0},
${service.gst || 0},
${service.ordersCount || 0},
${service.revenue || 0},
${service.active ? "Active" : "Disabled"},
${service.featured ? "Yes" : "No"}
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
"quickpress-services.csv";

document.body.appendChild(
a
);

a.click();

document.body.removeChild(
a
);

URL.revokeObjectURL(
url
);

};

/* ==========================================
CITY PRICING MODAL
========================================== */

window.openCityPricingModal =
function(serviceId){

document.getElementById(
"pricingServiceId"
).value =
serviceId;

document
.getElementById(
"cityPricingModal"
)
.classList.add(
"active"
);

};

window.closeCityPricingModal =
function(){

document
.getElementById(
"cityPricingModal"
)
.classList.remove(
"active"
);

};

/* ==========================================
SAVE CITY PRICING
========================================== */

window.saveCityPricing =
async function(){

try{

const serviceId =

document.getElementById(
"pricingServiceId"
).value;

if(!serviceId){

alert(
"Service Not Found"
);

return;

}

const rows =

document.querySelectorAll(
".cityPriceRow"
);

const cityPricing = {};

rows.forEach(row=>{

const city =

row.querySelector(
"span"
).innerText;

const price =

Number(

row.querySelector(
"input"
).value || 0

);

cityPricing[city] = price;

});

await updateDoc(

doc(
db,
"services",
serviceId
),

{

cityPricing,

updatedAt:
serverTimestamp()

}

);

alert(
"City Pricing Saved"
);

closeCityPricingModal();

await loadServices();

}catch(error){

console.error(error);

alert(
"Failed To Save Pricing"
);

}

};

/* ==========================================
ANALYTICS
========================================== */

function calculateServiceAnalytics(){

let totalOrders = 0;

let totalRevenue = 0;

let topService = null;

services.forEach(service=>{

totalOrders +=

Number(
service.ordersCount || 0
);

totalRevenue +=

Number(
service.revenue || 0
);

if(

!topService ||

(service.ordersCount || 0)

>

(topService.ordersCount || 0)

){

topService = service;

}

});

const topName =

topService

?

topService.name

:

"-";

setText(
"totalOrdersCount",
totalOrders
);

setText(
"totalServiceRevenue",
"₹" +
totalRevenue.toLocaleString(
"en-IN"
)
);

setText(
"topServiceName",
topName
);

setText(
"growthPercentage",
"+12%"
);

}

/* ==========================================
BULK BUTTON EVENTS
========================================== */

document
.querySelector(
".featureBtn"
)

?.addEventListener(

"click",

bulkFeatureServices

);

document
.querySelector(
".activateBtn"
)

?.addEventListener(

"click",

bulkActivateServices

);

document
.querySelector(
".deactivateBtn"
)

?.addEventListener(

"click",

bulkDisableServices

);

document
.querySelector(
".deleteBulkBtn"
)

?.addEventListener(

"click",

bulkDeleteServices

);

/* ==========================================
ENHANCED LOAD
========================================== */

const originalLoadServices =
loadServices;

window.loadServices =
async function(){

await originalLoadServices();

calculateServiceAnalytics();

};

/* ==========================================
ESC CLOSE MODALS
========================================== */

document.addEventListener(

"keydown",

function(e){

if(e.key === "Escape"){

closeAddServiceModal();

closeEditServiceModal();

closeViewServiceModal();

closeDeleteModal();

closeCityPricingModal();

}

}

);

/* ==========================================
WINDOW CLICK CLOSE
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
FINAL INITIALIZATION
========================================== */

document.addEventListener(

"DOMContentLoaded",

async ()=>{

try{

await loadServices();

calculateServiceAnalytics();

console.log(

"QuickPress Services Panel Ready 🚀"

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

window.servicesApp = {

loadServices,
saveService,
updateService,
deleteService,
viewService,
editService,
exportServicesCSV

};
