/* =========================================================
QUICKPRESS SERVICES PANEL
PART 1/10
========================================================= */

/* =========================================================
FIREBASE IMPORTS
========================================================= */

import { db }

from "../js/firebase.js";

import {

collection,
getDocs,
addDoc,
updateDoc,
deleteDoc,
doc,
getDoc,
serverTimestamp,
query,
orderBy

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
COLLECTIONS
========================================================= */

const SERVICES_COLLECTION =
"services";

const CATEGORIES_COLLECTION =
"serviceCategories";

const CITY_PRICING_COLLECTION =
"cityServicePricing";

const BUNDLES_COLLECTION =
"serviceBundles";

const ANALYTICS_COLLECTION =
"serviceAnalytics";

const INVENTORY_COLLECTION =
"serviceInventory";

/* =========================================================
GLOBAL STATE
========================================================= */

let services = [];

let categories = [];

let cityPricing = [];

let bundles = [];

let analytics = [];

let inventory = [];

let selectedServices = [];

/* =========================================================
HELPERS
========================================================= */

function setText(
id,
value
){

const element =

document.getElementById(id);

if(element){

element.innerText =
value;

}

}

function formatCurrency(
amount
){

return "₹" +

Number(
amount || 0
)

.toLocaleString(
"en-IN"
);

}

function showToast(
message
){

console.log(
message
);

}

/* =========================================================
LOAD SERVICES
========================================================= */

async function loadServices(){

try{

const snapshot =

await getDocs(

query(

collection(
db,
SERVICES_COLLECTION
),

orderBy(
"createdAt",
"desc"
)

)

);

services = [];

snapshot.forEach(docSnap=>{

services.push({

id:docSnap.id,

...docSnap.data()

});

});

console.log(
"Services Loaded:",
services.length
);

}catch(error){

console.error(
error
);

}

}

/* =========================================================
LOAD CATEGORIES
========================================================= */

async function loadCategories(){

try{

const snapshot =

await getDocs(

collection(
db,
CATEGORIES_COLLECTION
)

);

categories = [];

snapshot.forEach(docSnap=>{

categories.push({

id:docSnap.id,

...docSnap.data()

});

});

}catch(error){

console.error(
error
);

}

}

/* =========================================================
LOAD CITY PRICING
========================================================= */

async function loadCityPricing(){

try{

const snapshot =

await getDocs(

collection(
db,
CITY_PRICING_COLLECTION
)

);

cityPricing = [];

snapshot.forEach(docSnap=>{

cityPricing.push({

id:docSnap.id,

...docSnap.data()

});

});

}catch(error){

console.error(
error
);

}

}

/* =========================================================
LOAD BUNDLES
========================================================= */

async function loadBundles(){

try{

const snapshot =

await getDocs(

collection(
db,
BUNDLES_COLLECTION
)

);

bundles = [];

snapshot.forEach(docSnap=>{

bundles.push({

id:docSnap.id,

...docSnap.data()

});

});

}catch(error){

console.error(
error
);

}

}

/* =========================================================
LOAD INVENTORY
========================================================= */

async function loadInventory(){

try{

const snapshot =

await getDocs(

collection(
db,
INVENTORY_COLLECTION
)

);

inventory = [];

snapshot.forEach(docSnap=>{

inventory.push({

id:docSnap.id,

...docSnap.data()

});

});

}catch(error){

console.error(
error
);

}

}

/* =========================================================
SERVICE ANALYTICS
========================================================= */

function updateServiceAnalytics(){

const totalServices =
services.length;

const activeServices =

services.filter(

service=>

service.status ===
"active"

).length;

const featuredServices =

services.filter(

service=>

service.featured === true

).length;

const totalRevenue =

services.reduce(

(sum,service)=>

sum +

Number(
service.revenue || 0
),

0

);

setText(
"totalServices",
totalServices
);

setText(
"activeServices",
activeServices
);

setText(
"featuredServices",
featuredServices
);

setText(
"servicesRevenue",
formatCurrency(
totalRevenue
)
);

}

/* =========================================================
TOP SERVICE
========================================================= */

function updateTopService(){

if(!services.length)
return;

const sorted =

[...services]

.sort(

(a,b)=>

Number(
b.revenue || 0
)

-

Number(
a.revenue || 0
)

);

setText(

"topService",

sorted[0]?.name ||

"-"

);

}

/* =========================================================
POPULATE CATEGORY FILTER
========================================================= */

function populateCategoryFilter(){

const select =

document.getElementById(
"categoryFilter"
);

if(!select)
return;

categories.forEach(category=>{

const option =

document.createElement(
"option"
);

option.value =
category.name;

option.innerText =
category.name;

select.appendChild(
option
);

});

}/* =========================================================
RENDER SERVICES TABLE
========================================================= */

function renderServicesTable(data = services){

const tableBody =

document.getElementById(
"servicesTableBody"
);

if(!tableBody)
return;

tableBody.innerHTML = "";

data.forEach(service=>{

const row =

document.createElement("tr");

row.innerHTML = `

<td>

<input
type="checkbox"
class="serviceCheckbox"
value="${service.id}">

</td>

<td>

<img
src="${service.image || ''}"
width="50"
height="50"
style="
border-radius:10px;
object-fit:cover;
">

</td>

<td>

${service.name || "-"}

</td>

<td>

${service.category || "-"}

</td>

<td>

${service.unit || "KG"}

</td>

<td>

${formatCurrency(
service.price
)}

</td>

<td>

${formatCurrency(
service.expressPrice
)}

</td>

<td>

${service.orders || 0}

</td>

<td>

${formatCurrency(
service.revenue
)}

</td>

<td>

<span class="${
service.status === "active"
? "statusActive"
: "statusDisabled"
}">

${service.status || "disabled"}

</span>

</td>

<td>

${service.featured
? "⭐"
: "-"}

</td>

<td>

<div class="actionButtons">

<button
class="btnView"
onclick="viewService('${service.id}')">

View

</button>

<button
class="btnEdit"
onclick="editService('${service.id}')">

Edit

</button>

<button
class="btnFeature"
onclick="toggleFeatured('${service.id}')">

Feature

</button>

<button
class="btnDelete"
onclick="deleteService('${service.id}')">

Delete

</button>

</div>

</td>

`;

tableBody.appendChild(
row
);

});

}

/* =========================================================
SEARCH SERVICES
========================================================= */

function searchServices(){

const keyword =

document
.getElementById(
"serviceSearch"
)
.value
.toLowerCase();

const filtered =

services.filter(service=>

(service.name || "")
.toLowerCase()
.includes(keyword)

||

(service.category || "")
.toLowerCase()
.includes(keyword)

);

renderServicesTable(
filtered
);

}

/* =========================================================
FILTER SERVICES
========================================================= */

function filterServices(){

const category =

document.getElementById(
"categoryFilter"
).value;

const status =

document.getElementById(
"statusFilter"
).value;

let filtered =
[...services];

if(category){

filtered = filtered.filter(

item=>

item.category ===
category

);

}

if(status){

filtered = filtered.filter(

item=>

item.status ===
status

);

}

renderServicesTable(
filtered
);

}

/* =========================================================
SELECT ALL SERVICES
========================================================= */

function setupSelectAll(){

const selectAll =

document.getElementById(
"selectAllServices"
);

if(!selectAll)
return;

selectAll.addEventListener(

"change",

e=>{

document
.querySelectorAll(
".serviceCheckbox"
)

.forEach(box=>{

box.checked =
e.target.checked;

});

updateSelectedServices();

}

);

}

/* =========================================================
UPDATE SELECTED SERVICES
========================================================= */

function updateSelectedServices(){

selectedServices = [];

document
.querySelectorAll(
".serviceCheckbox:checked"
)

.forEach(box=>{

selectedServices.push(
box.value
);

});

}

/* =========================================================
FEATURE SELECTED
========================================================= */

async function featureSelectedServices(){

for(const id of selectedServices){

await updateDoc(

doc(
db,
SERVICES_COLLECTION,
id
),

{
featured:true
}

);

}

await refreshServices();

showToast(
"Featured Updated"
);

}

/* =========================================================
ACTIVATE SELECTED
========================================================= */

async function activateSelectedServices(){

for(const id of selectedServices){

await updateDoc(

doc(
db,
SERVICES_COLLECTION,
id
),

{
status:"active"
}

);

}

await refreshServices();

}

/* =========================================================
DISABLE SELECTED
========================================================= */

async function disableSelectedServices(){

for(const id of selectedServices){

await updateDoc(

doc(
db,
SERVICES_COLLECTION,
id
),

{
status:"disabled"
}

);

}

await refreshServices();

}

/* =========================================================
DELETE SELECTED
========================================================= */

async function deleteSelectedServices(){

const confirmDelete =

confirm(
"Delete Selected Services?"
);

if(!confirmDelete)
return;

for(const id of selectedServices){

await deleteDoc(

doc(
db,
SERVICES_COLLECTION,
id
)

);

}

await refreshServices();

}

/* =========================================================
REFRESH SERVICES
========================================================= */

async function refreshServices(){

await loadServices();

renderServicesTable();

updateServiceAnalytics();

updateTopService();

}/* =========================================================
ADD SERVICE
========================================================= */

async function saveService(){

try{

const serviceName =

document.getElementById(
"serviceName"
)?.value;

const servicePrice =

Number(

document.getElementById(
"servicePrice"
)?.value || 0

);

const serviceCategory =

document.getElementById(
"serviceCategory"
)?.value;

if(!serviceName){

alert(
"Service Name Required"
);

return;

}

await addDoc(

collection(
db,
SERVICES_COLLECTION
),

{

name:serviceName,

price:servicePrice,

category:serviceCategory,

unit:"KG",

status:"active",

featured:false,

orders:0,

revenue:0,

createdAt:
serverTimestamp()

}

);

closeServiceModal();

await refreshServices();

showToast(
"Service Added Successfully"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
VIEW SERVICE
========================================================= */

async function viewService(id){

try{

const docRef =

doc(
db,
SERVICES_COLLECTION,
id
);

const snap =

await getDoc(
docRef
);

if(!snap.exists()){

alert(
"Service Not Found"
);

return;

}

const service =
snap.data();

alert(

`
Service:
${service.name}

Category:
${service.category}

Price:
${formatCurrency(service.price)}

Orders:
${service.orders || 0}

Revenue:
${formatCurrency(service.revenue)}

Status:
${service.status}
`

);

}catch(error){

console.error(error);

}

}

/* =========================================================
EDIT SERVICE
========================================================= */

async function editService(id){

try{

const snap =

await getDoc(

doc(
db,
SERVICES_COLLECTION,
id
)

);

if(!snap.exists())
return;

const service =
snap.data();

document.getElementById(
"serviceName"
).value =

service.name || "";

document.getElementById(
"servicePrice"
).value =

service.price || 0;

document.getElementById(
"serviceCategory"
).value =

service.category || "";

openServiceModal();

const saveBtn =

document.getElementById(
"saveServiceBtn"
);

if(saveBtn){

saveBtn.onclick =
()=>updateService(id);

}

}catch(error){

console.error(error);

}

}

/* =========================================================
UPDATE SERVICE
========================================================= */

async function updateService(id){

try{

await updateDoc(

doc(
db,
SERVICES_COLLECTION,
id
),

{

name:

document.getElementById(
"serviceName"
).value,

price:Number(

document.getElementById(
"servicePrice"
).value

),

category:

document.getElementById(
"serviceCategory"
).value,

updatedAt:
serverTimestamp()

}

);

closeServiceModal();

await refreshServices();

showToast(
"Service Updated"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
DELETE SERVICE
========================================================= */

async function deleteService(id){

const allow =

confirm(
"Delete this service?"
);

if(!allow)
return;

try{

await deleteDoc(

doc(
db,
SERVICES_COLLECTION,
id
)

);

await refreshServices();

showToast(
"Service Deleted"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
TOGGLE FEATURED
========================================================= */

async function toggleFeatured(id){

try{

const snap =

await getDoc(

doc(
db,
SERVICES_COLLECTION,
id
)

);

if(!snap.exists())
return;

const service =
snap.data();

await updateDoc(

doc(
db,
SERVICES_COLLECTION,
id
),

{

featured:
!service.featured

}

);

await refreshServices();

}catch(error){

console.error(error);

}

}

/* =========================================================
CHANGE STATUS
========================================================= */

async function changeServiceStatus(
id,
status
){

try{

await updateDoc(

doc(
db,
SERVICES_COLLECTION,
id
),

{
status
}

);

await refreshServices();

}catch(error){

console.error(error);

}

}

/* =========================================================
SERVICE MODAL
========================================================= */

function openServiceModal(){

const modal =

document.getElementById(
"addServiceModal"
);

if(modal){

modal.classList.add(
"active"
);

}

}

function closeServiceModal(){

const modal =

document.getElementById(
"addServiceModal"
);

if(modal){

modal.classList.remove(
"active"
);

}

}

/* =========================================================
ADD SERVICE BUTTON
========================================================= */

function initializeServiceButtons(){

const addBtn =

document.getElementById(
"addServiceBtn"
);

if(addBtn){

addBtn.addEventListener(

"click",

()=>{

openServiceModal();

}

);

}

}

/* =========================================================
SERVICE IMAGE PLACEHOLDER
========================================================= */

function getServiceImage(
service
){

return service.image ||

"https://via.placeholder.com/60";

}/* =========================================================
CATEGORY MANAGEMENT
========================================================= */

function renderCategories(){

const categoryGrid =

document.getElementById(
"categoryGrid"
);

if(!categoryGrid)
return;

categoryGrid.innerHTML = "";

categories.forEach(category=>{

const totalServices =

services.filter(

service=>

service.category ===
category.name

).length;

const card =

document.createElement("div");

card.className =
"categoryCard";

card.innerHTML = `

<div class="flexBetween">

<h3>

${category.name}

</h3>

<div class="actionButtons">

<button
class="btnEdit"
onclick="editCategory('${category.id}')">

Edit

</button>

<button
class="btnDelete"
onclick="deleteCategory('${category.id}')">

Delete

</button>

</div>

</div>

<p>

${category.description || "No Description"}

</p>

<br>

<strong>

Services:
${totalServices}

</strong>

`;

categoryGrid.appendChild(
card
);

});

}

/* =========================================================
ADD CATEGORY
========================================================= */

async function addCategory(){

const name =

prompt(
"Category Name"
);

if(!name)
return;

try{

await addDoc(

collection(
db,
CATEGORIES_COLLECTION
),

{

name,

description:"",

createdAt:
serverTimestamp()

}

);

await loadCategories();

renderCategories();

populateCategoryFilter();

showToast(
"Category Added"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
EDIT CATEGORY
========================================================= */

async function editCategory(id){

try{

const category =

categories.find(

item=>

item.id === id

);

if(!category)
return;

const updatedName =

prompt(

"Edit Category",

category.name

);

if(!updatedName)
return;

await updateDoc(

doc(
db,
CATEGORIES_COLLECTION,
id
),

{

name:updatedName,

updatedAt:
serverTimestamp()

}

);

await loadCategories();

renderCategories();

populateCategoryFilter();

showToast(
"Category Updated"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
DELETE CATEGORY
========================================================= */

async function deleteCategory(id){

const allow =

confirm(
"Delete Category?"
);

if(!allow)
return;

try{

await deleteDoc(

doc(
db,
CATEGORIES_COLLECTION,
id
)

);

await loadCategories();

renderCategories();

populateCategoryFilter();

showToast(
"Category Deleted"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
CATEGORY ANALYTICS
========================================================= */

function updateCategoryAnalytics(){

const categoryCount =

categories.length;

const mostUsedCategory =

getMostUsedCategory();

console.log({

categoryCount,

mostUsedCategory

});

}

/* =========================================================
MOST USED CATEGORY
========================================================= */

function getMostUsedCategory(){

const categoryMap = {};

services.forEach(service=>{

const category =

service.category || "Other";

categoryMap[category] =

(categoryMap[category] || 0) + 1;

});

let winner = "-";
let max = 0;

Object.keys(categoryMap)

.forEach(category=>{

if(

categoryMap[category] > max

){

winner = category;

max = categoryMap[category];

}

});

return winner;

}

/* =========================================================
CATEGORY FILTER RESET
========================================================= */

function resetCategoryFilter(){

const select =

document.getElementById(
"categoryFilter"
);

if(select){

select.innerHTML = `

<option value="">

All Categories

</option>

`;

}

}

/* =========================================================
RELOAD CATEGORY UI
========================================================= */

async function reloadCategoryModule(){

resetCategoryFilter();

await loadCategories();

populateCategoryFilter();

renderCategories();

updateCategoryAnalytics();

}

/* =========================================================
CATEGORY BUTTON EVENTS
========================================================= */

function initializeCategoryEvents(){

const addCategoryBtn =

document.getElementById(
"addCategoryBtn"
);

if(addCategoryBtn){

addCategoryBtn.addEventListener(

"click",

addCategory

);

}

}

/* =========================================================
CATEGORY SERVICE COUNTS
========================================================= */

function getCategoryServiceCount(
categoryName
){

return services.filter(

service=>

service.category ===
categoryName

).length;

}

/* =========================================================
CATEGORY REVENUE
========================================================= */

function getCategoryRevenue(
categoryName
){

return services

.filter(

service=>

service.category ===
categoryName

)

.reduce(

(sum,service)=>

sum +

Number(
service.revenue || 0
),

0

);

}/* =========================================================
BULK PRICING MANAGEMENT
========================================================= */

let bulkPricing = {

tier1:0,
tier2:0,
tier3:0,
tier4:0

};

function loadBulkPricing(){

bulkPricing.tier1 =
Number(
localStorage.getItem("tier1Price")
|| 0
);

bulkPricing.tier2 =
Number(
localStorage.getItem("tier2Price")
|| 0
);

bulkPricing.tier3 =
Number(
localStorage.getItem("tier3Price")
|| 0
);

bulkPricing.tier4 =
Number(
localStorage.getItem("tier4Price")
|| 0
);

const tier1 =
document.getElementById(
"tier1Price"
);

const tier2 =
document.getElementById(
"tier2Price"
);

const tier3 =
document.getElementById(
"tier3Price"
);

const tier4 =
document.getElementById(
"tier4Price"
);

if(tier1)
tier1.value = bulkPricing.tier1;

if(tier2)
tier2.value = bulkPricing.tier2;

if(tier3)
tier3.value = bulkPricing.tier3;

if(tier4)
tier4.value = bulkPricing.tier4;

}

function saveBulkPricing(){

bulkPricing = {

tier1:Number(
document.getElementById(
"tier1Price"
)?.value || 0
),

tier2:Number(
document.getElementById(
"tier2Price"
)?.value || 0
),

tier3:Number(
document.getElementById(
"tier3Price"
)?.value || 0
),

tier4:Number(
document.getElementById(
"tier4Price"
)?.value || 0
)

};

localStorage.setItem(
"tier1Price",
bulkPricing.tier1
);

localStorage.setItem(
"tier2Price",
bulkPricing.tier2
);

localStorage.setItem(
"tier3Price",
bulkPricing.tier3
);

localStorage.setItem(
"tier4Price",
bulkPricing.tier4
);

showToast(
"Bulk Pricing Saved"
);

}

/* =========================================================
CITY PRICING TABLE
========================================================= */

function renderCityPricing(){

const table =

document.getElementById(
"cityPricingTableBody"
);

if(!table)
return;

table.innerHTML = "";

cityPricing.forEach(item=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${item.city || "-"}</td>

<td>${item.service || "-"}</td>

<td>${formatCurrency(item.price)}</td>

<td>${formatCurrency(item.expressPrice)}</td>

<td>${formatCurrency(item.bulkPrice)}</td>

<td>

<span class="statusActive">

${item.status || "active"}

</span>

</td>

<td>

<div class="actionButtons">

<button
class="btnEdit"
onclick="editCityPricing('${item.id}')">

Edit

</button>

<button
class="btnDelete"
onclick="deleteCityPricing('${item.id}')">

Delete

</button>

</div>

</td>

`;

table.appendChild(row);

});

}

/* =========================================================
ADD CITY PRICING
========================================================= */

async function addCityPricing(){

const city =
prompt("City Name");

if(!city)
return;

const service =
prompt("Service Name");

const price =
Number(
prompt("Normal Price")
);

try{

await addDoc(

collection(
db,
CITY_PRICING_COLLECTION
),

{

city,
service,

price,

expressPrice:
price + 20,

bulkPrice:
price - 10,

status:"active",

createdAt:
serverTimestamp()

}

);

await loadCityPricing();

renderCityPricing();

showToast(
"City Pricing Added"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
EDIT CITY PRICING
========================================================= */

async function editCityPricing(id){

const item =

cityPricing.find(

city=>city.id === id

);

if(!item)
return;

const newPrice =
prompt(

"Update Price",

item.price

);

if(!newPrice)
return;

try{

await updateDoc(

doc(
db,
CITY_PRICING_COLLECTION,
id
),

{

price:Number(
newPrice
),

updatedAt:
serverTimestamp()

}

);

await loadCityPricing();

renderCityPricing();

}catch(error){

console.error(error);

}

}

/* =========================================================
DELETE CITY PRICING
========================================================= */

async function deleteCityPricing(id){

const allow =

confirm(
"Delete City Pricing?"
);

if(!allow)
return;

try{

await deleteDoc(

doc(
db,
CITY_PRICING_COLLECTION,
id
)

);

await loadCityPricing();

renderCityPricing();

showToast(
"City Pricing Deleted"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
DYNAMIC PRICING RULES
========================================================= */

function saveDynamicPricing(){

const rules = {

rain:

Number(

document.getElementById(
"rainSurge"
)?.value || 0

),

express:

Number(

document.getElementById(
"expressSurge"
)?.value || 0

),

peak:

Number(

document.getElementById(
"peakHourSurge"
)?.value || 0

),

festival:

Number(

document.getElementById(
"festivalSurge"
)?.value || 0

)

};

localStorage.setItem(

"dynamicPricing",

JSON.stringify(rules)

);

showToast(
"Pricing Rules Saved"
);

}

function loadDynamicPricing(){

const rules =

JSON.parse(

localStorage.getItem(
"dynamicPricing"
)

||

"{}"

);

if(document.getElementById("rainSurge"))
document.getElementById("rainSurge").value =
rules.rain || 0;

if(document.getElementById("expressSurge"))
document.getElementById("expressSurge").value =
rules.express || 0;

if(document.getElementById("peakHourSurge"))
document.getElementById("peakHourSurge").value =
rules.peak || 0;

if(document.getElementById("festivalSurge"))
document.getElementById("festivalSurge").value =
rules.festival || 0;

}

/* =========================================================
CITY ANALYTICS
========================================================= */

function updateCityAnalytics(){

const totalCities =

new Set(

cityPricing.map(
item=>item.city
)

).size;

setText(
"activeCities",
totalCities
);

}

/* =========================================================
CITY EVENTS
========================================================= */

function initializeCityPricingEvents(){

const addBtn =

document.getElementById(
"addCityPricingBtn"
);

if(addBtn){

addBtn.addEventListener(

"click",

addCityPricing

);

}

}/* =========================================================
SERVICE BUNDLES
========================================================= */

function renderBundles(){

const table =

document.getElementById(
"bundleTableBody"
);

if(!table)
return;

table.innerHTML = "";

bundles.forEach(bundle=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${bundle.name || "-"}</td>

<td>
${(bundle.services || [])
.join(", ")}
</td>

<td>
${formatCurrency(
bundle.originalPrice
)}
</td>

<td>
${formatCurrency(
bundle.bundlePrice
)}
</td>

<td>
${bundle.discount || 0}%
</td>

<td>
${bundle.status || "active"}
</td>

<td>

<div class="actionButtons">

<button
class="btnEdit"
onclick="editBundle('${bundle.id}')">

Edit

</button>

<button
class="btnDelete"
onclick="deleteBundle('${bundle.id}')">

Delete

</button>

</div>

</td>

`;

table.appendChild(row);

});

}

/* =========================================================
ADD BUNDLE
========================================================= */

async function addBundle(){

try{

const bundleName =
prompt("Bundle Name");

if(!bundleName)
return;

await addDoc(

collection(
db,
BUNDLES_COLLECTION
),

{

name:bundleName,

services:[],

originalPrice:0,

bundlePrice:0,

discount:0,

status:"active",

createdAt:
serverTimestamp()

}

);

await loadBundles();

renderBundles();

showToast(
"Bundle Added"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
EDIT BUNDLE
========================================================= */

async function editBundle(id){

const bundle =

bundles.find(
item=>item.id===id
);

if(!bundle)
return;

const updatedName =

prompt(
"Bundle Name",
bundle.name
);

if(!updatedName)
return;

await updateDoc(

doc(
db,
BUNDLES_COLLECTION,
id
),

{
name:updatedName
}

);

await loadBundles();

renderBundles();

}

/* =========================================================
DELETE BUNDLE
========================================================= */

async function deleteBundle(id){

if(
!confirm(
"Delete Bundle?"
)
)
return;

await deleteDoc(

doc(
db,
BUNDLES_COLLECTION,
id
)

);

await loadBundles();

renderBundles();

}

/* =========================================================
PARTNER WISE PRICING
========================================================= */

function renderPartnerPricing(){

const table =

document.getElementById(
"partnerPricingBody"
);

if(!table)
return;

table.innerHTML = "";

services.forEach(service=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>Default Partner</td>

<td>
${service.city || "-"}
</td>

<td>
${service.name}
</td>

<td>
${formatCurrency(
service.partnerPrice || 0
)}
</td>

<td>
${formatCurrency(
service.price || 0
)}
</td>

<td>
${formatCurrency(
(service.price || 0) -
(service.partnerPrice || 0)
)}
</td>

<td>

<button
class="btnEdit">

Edit

</button>

</td>

`;

table.appendChild(row);

});

}

/* =========================================================
REVENUE TRACKING
========================================================= */

function updateRevenueTracking(){

const totalRevenue =

services.reduce(

(sum,item)=>

sum +

Number(
item.revenue || 0
),

0

);

const dailyRevenue =
Math.round(
totalRevenue * 0.05
);

const weeklyRevenue =
Math.round(
totalRevenue * 0.25
);

const monthlyRevenue =
Math.round(
totalRevenue * 0.75
);

setText(
"dailyRevenue",
formatCurrency(
dailyRevenue
)
);

setText(
"weeklyRevenue",
formatCurrency(
weeklyRevenue
)
);

setText(
"monthlyRevenue",
formatCurrency(
monthlyRevenue
)
);

setText(
"yearlyRevenue",
formatCurrency(
totalRevenue
)
);

}

/* =========================================================
SERVICE PERFORMANCE
========================================================= */

function renderServicePerformance(){

const table =

document.getElementById(
"servicePerformanceBody"
);

if(!table)
return;

table.innerHTML = "";

services.forEach(service=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${service.name}</td>

<td>${service.orders || 0}</td>

<td>
${formatCurrency(
service.revenue
)}
</td>

<td>
${service.customers || 0}
</td>

<td>
${service.rating || 0}
⭐
</td>

<td>
${service.repeatOrders || 0}
</td>

<td>
${service.growth || 0}%
</td>

`;

table.appendChild(row);

});

}

/* =========================================================
TOP SERVICES RANKING
========================================================= */

function updateTopServicesRanking(){

const sorted =

[...services]

.sort(

(a,b)=>

Number(
b.revenue || 0
)

-

Number(
a.revenue || 0
)

);

setText(
"rank1Service",
sorted[0]?.name || "-"
);

setText(
"rank2Service",
sorted[1]?.name || "-"
);

setText(
"rank3Service",
sorted[2]?.name || "-"
);

setText(
"rank1Revenue",
formatCurrency(
sorted[0]?.revenue || 0
)
);

setText(
"rank2Revenue",
formatCurrency(
sorted[1]?.revenue || 0
)
);

setText(
"rank3Revenue",
formatCurrency(
sorted[2]?.revenue || 0
)
);

}

/* =========================================================
PERFORMANCE SUMMARY
========================================================= */

function updatePerformanceSummary(){

updateRevenueTracking();

renderServicePerformance();

updateTopServicesRanking();

}

/* =========================================================
BUNDLE EVENTS
========================================================= */

function initializeBundleEvents(){

const addBundleBtn =

document.getElementById(
"addBundleBtn"
);

if(addBundleBtn){

addBundleBtn.addEventListener(

"click",

addBundle

);

}

}/* =========================================================
INVENTORY MANAGEMENT
========================================================= */

function renderInventory(){

const table = document.getElementById(
"inventoryTableBody"
);

if(!table) return;

table.innerHTML = "";

inventory.forEach(item=>{

const row = document.createElement("tr");

row.innerHTML = `

<td>${item.name || "-"}</td>

<td>${item.category || "-"}</td>

<td>${item.stock || 0}</td>

<td>${item.unit || "KG"}</td>

<td>${formatCurrency(item.cost || 0)}</td>

<td>${item.threshold || 0}</td>

<td>

<span class="${
(item.stock || 0) <=
(item.threshold || 0)

? "statusDisabled"

: "statusActive"
}">

${(item.stock || 0) <=
(item.threshold || 0)

? "Low Stock"

: "Available"}

</span>

</td>

<td>

<div class="actionButtons">

<button
class="btnEdit">

Edit

</button>

<button
class="btnDelete">

Delete

</button>

</div>

</td>

`;

table.appendChild(row);

});

}

/* =========================================================
ADD INVENTORY
========================================================= */

async function addInventoryItem(){

const name =
prompt("Inventory Name");

if(!name) return;

await addDoc(

collection(
db,
INVENTORY_COLLECTION
),

{

name,

category:"Laundry",

stock:0,

unit:"KG",

cost:0,

threshold:10,

createdAt:
serverTimestamp()

}

);

await loadInventory();

renderInventory();

}

/* =========================================================
PICKUP SLOTS
========================================================= */

let pickupSlots = [];

function renderPickupSlots(){

const body =

document.getElementById(
"pickupSlotsBody"
);

if(!body) return;

body.innerHTML = "";

pickupSlots.forEach(slot=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${slot.name}</td>

<td>${slot.start}</td>

<td>${slot.end}</td>

<td>${slot.capacity}</td>

<td>

<span class="statusActive">

${slot.status}

</span>

</td>

<td>

<button
class="btnDelete">

Delete

</button>

</td>

`;

body.appendChild(row);

});

}

function addPickupSlot(){

pickupSlots.push({

name:"Morning Slot",

start:"08:00",

end:"12:00",

capacity:100,

status:"active"

});

renderPickupSlots();

}

/* =========================================================
DELIVERY SLOTS
========================================================= */

let deliverySlots = [];

function renderDeliverySlots(){

const body =

document.getElementById(
"deliverySlotsBody"
);

if(!body) return;

body.innerHTML = "";

deliverySlots.forEach(slot=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${slot.name}</td>

<td>${slot.start}</td>

<td>${slot.end}</td>

<td>${slot.capacity}</td>

<td>

<span class="statusActive">

${slot.status}

</span>

</td>

<td>

<button
class="btnDelete">

Delete

</button>

</td>

`;

body.appendChild(row);

});

}

function addDeliverySlot(){

deliverySlots.push({

name:"Evening Delivery",

start:"16:00",

end:"20:00",

capacity:100,

status:"active"

});

renderDeliverySlots();

}

/* =========================================================
SERVICE SCHEDULING
========================================================= */

function saveServiceSchedule(){

const service =

document.getElementById(
"scheduleService"
)?.value;

const startTime =

document.getElementById(
"serviceStartTime"
)?.value;

const endTime =

document.getElementById(
"serviceEndTime"
)?.value;

const status =

document.getElementById(
"serviceScheduleStatus"
)?.value;

localStorage.setItem(

"serviceSchedule",

JSON.stringify({

service,
startTime,
endTime,
status

})

);

showToast(
"Schedule Saved"
);

}

/* =========================================================
LOAD SERVICE SCHEDULE
========================================================= */

function loadServiceSchedule(){

const schedule =

JSON.parse(

localStorage.getItem(
"serviceSchedule"
)

||

"{}"

);

if(
document.getElementById(
"serviceStartTime"
)
){

document.getElementById(
"serviceStartTime"
).value =

schedule.startTime || "";

}

if(
document.getElementById(
"serviceEndTime"
)
){

document.getElementById(
"serviceEndTime"
).value =

schedule.endTime || "";

}

}

/* =========================================================
CAPACITY TRACKING
========================================================= */

function updateCapacityTracking(){

const pickupCapacity =

pickupSlots.reduce(

(sum,item)=>

sum +

Number(
item.capacity || 0
),

0

);

const deliveryCapacity =

deliverySlots.reduce(

(sum,item)=>

sum +

Number(
item.capacity || 0
),

0

);

const dailyCapacity =

pickupCapacity +
deliveryCapacity;

setText(
"pickupCapacity",
pickupCapacity
);

setText(
"deliveryCapacity",
deliveryCapacity
);

setText(
"dailyCapacity",
dailyCapacity
);

setText(
"capacityUsed",
"68%"
);

}

/* =========================================================
SLA MANAGEMENT
========================================================= */

function saveSLASettings(){

const slaData = {

washFold:

document
.querySelectorAll(
".pricingCard input"
)[0]?.value || 24,

dryClean:

document
.querySelectorAll(
".pricingCard input"
)[1]?.value || 48,

steamIron:

document
.querySelectorAll(
".pricingCard input"
)[2]?.value || 12,

express:

document
.querySelectorAll(
".pricingCard input"
)[3]?.value || 6

};

localStorage.setItem(

"slaSettings",

JSON.stringify(
slaData
)

);

showToast(
"SLA Saved"
);

}

/* =========================================================
INITIALIZE SLOT EVENTS
========================================================= */

function initializeSchedulingEvents(){

document
.getElementById(
"addPickupSlotBtn"
)
?.addEventListener(

"click",

addPickupSlot

);

document
.getElementById(
"addDeliverySlotBtn"
)
?.addEventListener(

"click",

addDeliverySlot

);

}/* =========================================================
REVIEWS & RATINGS
========================================================= */

let reviews = [];
let complaints = [];

function renderReviews(){

const table =
document.getElementById(
"reviewsTableBody"
);

if(!table) return;

table.innerHTML = "";

reviews.forEach(review=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${review.customer || "-"}</td>

<td>${review.service || "-"}</td>

<td>${review.rating || 0} ⭐</td>

<td>${review.comment || "-"}</td>

<td>${review.date || "-"}</td>

<td>

<span class="statusActive">

Published

</span>

</td>

<td>

<div class="actionButtons">

<button
class="btnView">

View

</button>

<button
class="btnDelete">

Delete

</button>

</div>

</td>

`;

table.appendChild(row);

});

}

/* =========================================================
RATING ANALYTICS
========================================================= */

function updateRatingAnalytics(){

if(!reviews.length){

setText(
"averageRating",
"0.0"
);

setText(
"totalReviews",
0
);

return;

}

const totalRatings =

reviews.reduce(

(sum,item)=>

sum +

Number(
item.rating || 0
),

0

);

const average =

(
totalRatings /
reviews.length
)

.toFixed(1);

setText(
"averageRating",
average
);

setText(
"totalReviews",
reviews.length
);

const positive =

reviews.filter(

item=>

Number(
item.rating
) >= 4

).length;

const negative =

reviews.filter(

item=>

Number(
item.rating
) <= 2

).length;

setText(
"positiveReviews",
positive
);

setText(
"negativeReviews",
negative
);

}

/* =========================================================
COMPLAINT TRACKING
========================================================= */

function renderComplaints(){

const table =

document.getElementById(
"complaintsTableBody"
);

if(!table) return;

table.innerHTML = "";

complaints.forEach(item=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${item.id || "-"}</td>

<td>${item.customer || "-"}</td>

<td>${item.service || "-"}</td>

<td>${item.issue || "-"}</td>

<td>${item.priority || "Medium"}</td>

<td>

<span class="statusPending">

${item.status || "Open"}

</span>

</td>

<td>

${item.assignedTo || "-"}

</td>

<td>

<div class="actionButtons">

<button
class="btnEdit">

Resolve

</button>

<button
class="btnDelete">

Delete

</button>

</div>

</td>

`;

table.appendChild(row);

});

}

/* =========================================================
ADD COMPLAINT
========================================================= */

function addComplaint(){

const issue =

prompt(
"Complaint Issue"
);

if(!issue) return;

complaints.push({

id:
Date.now(),

customer:
"Customer",

service:
"Wash & Fold",

issue,

priority:
"High",

status:
"Open",

assignedTo:
"Support Team"

});

renderComplaints();

updateComplaintAnalytics();

}

/* =========================================================
COMPLAINT ANALYTICS
========================================================= */

function updateComplaintAnalytics(){

const total =
complaints.length;

const open =

complaints.filter(

item=>

item.status ===
"Open"

).length;

const resolved =
total - open;

setText(
"qualityIssues",
open
);

setText(
"qualityChecks",
total
);

setText(
"qualityPassRate",

total
?

Math.round(
(resolved / total) * 100
) + "%"

:

"100%"

);

}

/* =========================================================
QUALITY CONTROL
========================================================= */

function updateQualityControl(){

const score =

Math.max(

100 -

(
complaints.length * 5
),

0

);

setText(
"qualityScore",
score + "%"
);

}

/* =========================================================
REFUND ANALYTICS
========================================================= */

function updateRefundAnalytics(){

const refundOrders =

complaints.filter(

item=>

item.status ===
"Refunded"

).length;

const refundAmount =

refundOrders * 250;

setText(
"refundOrders",
refundOrders
);

setText(
"totalRefunds",
formatCurrency(
refundAmount
)
);

setText(
"refundRate",

services.length

?

Math.round(
(refundOrders /
services.length) * 100
) + "%"

:

"0%"

);

setText(
"avgRefundTime",
"12h"
);

}

/* =========================================================
RATING BREAKDOWN
========================================================= */

function renderRatingAnalytics(){

const table =

document.getElementById(
"ratingAnalyticsBody"
);

if(!table) return;

table.innerHTML = "";

services.forEach(service=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${service.name}</td>

<td>${Math.floor(Math.random()*100)}</td>

<td>${Math.floor(Math.random()*80)}</td>

<td>${Math.floor(Math.random()*50)}</td>

<td>${Math.floor(Math.random()*20)}</td>

<td>${Math.floor(Math.random()*10)}</td>

<td>${service.rating || 4.5}</td>

`;

table.appendChild(row);

});

}

/* =========================================================
CUSTOMER FEEDBACK ANALYTICS
========================================================= */

function updateCustomerFeedbackAnalytics(){

const delayCases =

complaints.filter(

item=>

item.issue?.includes(
"Delay"
)

).length;

const cleaningCases =

complaints.filter(

item=>

item.issue?.includes(
"Cleaning"
)

).length;

const damageCases =

complaints.filter(

item=>

item.issue?.includes(
"Damage"
)

).length;

setText(
"delayComplaintCount",
delayCases + " Cases"
);

setText(
"cleaningComplaintCount",
cleaningCases + " Cases"
);

setText(
"damageComplaintCount",
damageCases + " Cases"
);

}

/* =========================================================
REVIEW EVENTS
========================================================= */

function initializeReviewEvents(){

document
.getElementById(
"addComplaintBtn"
)
?.addEventListener(

"click",

addComplaint

);

}/* =========================================================
MARKETING TOOLS
========================================================= */

let promotions = [];
let coupons = [];
let campaigns = [];

/* =========================================================
PROMOTIONS
========================================================= */

function renderPromotions(){

const table =
document.getElementById(
"promotionTableBody"
);

if(!table) return;

table.innerHTML = "";

promotions.forEach(promo=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${promo.name}</td>

<td>${promo.service}</td>

<td>${promo.discount}%</td>

<td>${promo.startDate}</td>

<td>${promo.endDate}</td>

<td>

<span class="statusActive">

${promo.status}

</span>

</td>

<td>

<div class="actionButtons">

<button
class="btnEdit">

Edit

</button>

<button
class="btnDelete">

Delete

</button>

</div>

</td>

`;

table.appendChild(row);

});

}

function createPromotion(){

const name =
prompt("Promotion Name");

if(!name) return;

promotions.push({

name,

service:"Wash & Fold",

discount:20,

startDate:new Date()
.toLocaleDateString(),

endDate:"31/12/2026",

status:"Active"

});

renderPromotions();

updateMarketingAnalytics();

}

/* =========================================================
COUPONS INTEGRATION
========================================================= */

function renderCouponsIntegration(){

const table =
document.getElementById(
"couponIntegrationBody"
);

if(!table) return;

table.innerHTML = "";

coupons.forEach(coupon=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${coupon.code}</td>

<td>${coupon.discount}%</td>

<td>${coupon.limit}</td>

<td>${coupon.used}</td>

<td>${coupon.expiry}</td>

<td>

<span class="statusActive">

${coupon.status}

</span>

</td>

`;

table.appendChild(row);

});

}

function createCoupon(){

const code =
prompt("Coupon Code");

if(!code) return;

coupons.push({

code,

discount:20,

limit:1000,

used:0,

expiry:"31/12/2026",

status:"Active"

});

renderCouponsIntegration();

updateMarketingAnalytics();

}

/* =========================================================
LOYALTY PROGRAM
========================================================= */

function updateLoyaltyProgram(){

const bronze = 1500;
const silver = 800;
const gold = 350;
const platinum = 120;

console.log({

bronze,
silver,
gold,
platinum

});

}

/* =========================================================
MEMBERSHIP ANALYTICS
========================================================= */

function updateMembershipAnalytics(){

const totalMembers =

1200;

const premiumMembers =

420;

const conversionRate =

Math.round(

(premiumMembers /
totalMembers) * 100

);

setText(
"conversionRate",
conversionRate + "%"
);

}

/* =========================================================
CAMPAIGN ANALYTICS
========================================================= */

function updateCampaignAnalytics(){

const emailsSent =
campaigns.length * 500;

const smsSent =
campaigns.length * 300;

const views =
campaigns.length * 1500;

const orders =
campaigns.length * 120;

setText(
"emailsSent",
emailsSent
);

setText(
"smsSent",
smsSent
);

setText(
"campaignViews",
views
);

setText(
"campaignOrders",
orders
);

}

/* =========================================================
CREATE CAMPAIGN
========================================================= */

function createCampaign(){

campaigns.push({

name:
"Festival Campaign",

date:
new Date()
.toLocaleDateString()

});

updateCampaignAnalytics();

}

/* =========================================================
SEASONAL OFFERS
========================================================= */

function updateSeasonalOffers(){

const seasonalRevenue =

promotions.length * 25000;

setText(
"promoRevenue",
formatCurrency(
seasonalRevenue
)
);

}

/* =========================================================
MARKETING ANALYTICS
========================================================= */

function updateMarketingAnalytics(){

setText(
"activePromotions",
promotions.length
);

setText(
"couponUsage",

coupons.reduce(

(sum,item)=>

sum +
(item.used || 0),

0

)

);

updateSeasonalOffers();

updateMembershipAnalytics();

updateCampaignAnalytics();

}

/* =========================================================
MARKETING EVENTS
========================================================= */

function initializeMarketingEvents(){

document
.getElementById(
"createPromotionBtn"
)
?.addEventListener(

"click",

createPromotion

);

document
.getElementById(
"createCouponBtn"
)
?.addEventListener(

"click",

createCoupon

);

}

/* =========================================================
DEFAULT DATA
========================================================= */

function loadMarketingDemoData(){

if(promotions.length)
return;

promotions.push({

name:"New User Offer",

service:"Wash & Fold",

discount:15,

startDate:"01/01/2026",

endDate:"31/12/2026",

status:"Active"

});

coupons.push({

code:"WELCOME100",

discount:10,

limit:1000,

used:120,

expiry:"31/12/2026",

status:"Active"

});

renderPromotions();

renderCouponsIntegration();

updateMarketingAnalytics();

}/* =========================================================
AI RECOMMENDATIONS
========================================================= */

function updateAIRecommendations(){

const topRevenueService =

services.sort(
(a,b)=>
(b.revenue || 0) -
(a.revenue || 0)
)[0];

setText(

"revenueSuggestion",

topRevenueService

? `Promote ${topRevenueService.name}`

: "No recommendation"

);

setText(

"citySuggestion",

"Expand to Jaipur"

);

setText(

"serviceSuggestion",

"Increase Express Laundry Capacity"

);

}

/* =========================================================
DEMAND FORECASTING
========================================================= */

function renderDemandForecast(){

const table =

document.getElementById(
"forecastTableBody"
);

if(!table) return;

table.innerHTML = "";

services.forEach(service=>{

const orders =
service.orders || 0;

const nextWeek =
Math.round(
orders * 1.15
);

const nextMonth =
Math.round(
orders * 1.35
);

const row =
document.createElement("tr");

row.innerHTML = `

<td>${service.name}</td>

<td>${orders}</td>

<td>${nextWeek}</td>

<td>${nextMonth}</td>

<td>+15%</td>

<td>

<span class="statusActive">

High

</span>

</td>

`;

table.appendChild(row);

});

}

/* =========================================================
BUSINESS INTELLIGENCE
========================================================= */

function updateBusinessIntelligence(){

const revenue =

services.reduce(

(sum,item)=>

sum +
(item.revenue || 0),

0

);

setText(
"currentRevenue",
formatCurrency(revenue)
);

setText(
"targetRevenue",
formatCurrency(
revenue * 1.3
)
);

setText(
"revenueAchievement",
"77%"
);

setText(
"currentOrders",
services.reduce(
(sum,item)=>
sum + (item.orders || 0),
0
)
);

setText(
"targetOrders",
"5000"
);

setText(
"ordersAchievement",
"68%"
);

setText(
"customersAchievement",
"81%"
);

}

/* =========================================================
AUDIT LOGS
========================================================= */

let auditLogs = [];

function addAuditLog(
action,
module
){

auditLogs.unshift({

date:new Date()
.toLocaleString(),

user:"Admin",

action,

module,

status:"Success"

});

renderAuditLogs();

}

function renderAuditLogs(){

const body =

document.getElementById(
"auditLogsBody"
);

if(!body) return;

body.innerHTML = "";

auditLogs.forEach(log=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${log.date}</td>

<td>${log.user}</td>

<td>${log.action}</td>

<td>${log.module}</td>

<td>${log.status}</td>

`;

body.appendChild(row);

});

}

/* =========================================================
EXPORT CSV
========================================================= */

function exportServicesCSV(){

let csv =

"Name,Category,Price,Orders,Revenue\n";

services.forEach(service=>{

csv +=

`${service.name},

${service.category},

${service.price},

${service.orders},

${service.revenue}\n`;

});

const blob =

new Blob(
[csv],
{type:"text/csv"}
);

const link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"services.csv";

link.click();

}

/* =========================================================
BACKUP DATA
========================================================= */

function createBackup(){

const backup = {

services,
categories,
cityPricing,
bundles,
inventory,

createdAt:
new Date()
.toISOString()

};

localStorage.setItem(

"servicesBackup",

JSON.stringify(
backup
)

);

showToast(
"Backup Created"
);

}

/* =========================================================
RESTORE BACKUP
========================================================= */

function restoreBackup(){

const backup =

JSON.parse(

localStorage.getItem(
"servicesBackup"
)

||

"{}"

);

if(!backup.services){

alert(
"No Backup Found"
);

return;

}

services =
backup.services || [];

categories =
backup.categories || [];

cityPricing =
backup.cityPricing || [];

bundles =
backup.bundles || [];

inventory =
backup.inventory || [];

renderServicesTable();
renderCategories();
renderCityPricing();
renderBundles();
renderInventory();

showToast(
"Backup Restored"
);

}

/* =========================================================
INITIALIZATION
========================================================= */

async function initializeServicesPanel(){

try{

await loadServices();
await loadCategories();
await loadCityPricing();
await loadBundles();
await loadInventory();

renderServicesTable();
renderCategories();
renderCityPricing();
renderBundles();
renderInventory();

updateServiceAnalytics();
updateTopService();
updateCategoryAnalytics();
updateCityAnalytics();
updateRevenueTracking();
updatePerformanceSummary();

renderPickupSlots();
renderDeliverySlots();

updateCapacityTracking();

updateRatingAnalytics();
updateComplaintAnalytics();
updateRefundAnalytics();
updateQualityControl();
updateCustomerFeedbackAnalytics();

loadMarketingDemoData();

updateMarketingAnalytics();

renderDemandForecast();
updateBusinessIntelligence();
updateAIRecommendations();

initializeServiceButtons();
initializeCategoryEvents();
initializeCityPricingEvents();
initializeBundleEvents();
initializeSchedulingEvents();
initializeReviewEvents();
setupSelectAll();

console.log(
"QuickPress Services Ready 🚀"
);

}catch(error){

console.error(
"Services Init Error",
error
);

}

}

/* =========================================================
DOM READY
========================================================= */

document.addEventListener(

"DOMContentLoaded",

initializeServicesPanel

);

/* =========================================================
GLOBAL EXPORTS
========================================================= */

window.servicesApp = {

saveService,
updateService,
deleteService,
viewService,

addCategory,
editCategory,
deleteCategory,

addCityPricing,
editCityPricing,
deleteCityPricing,

addBundle,
editBundle,
deleteBundle,

featureSelectedServices,
activateSelectedServices,
disableSelectedServices,
deleteSelectedServices,

exportServicesCSV,
createBackup,
restoreBackup

};

console.log(
"SERVICES.JS LOADED SUCCESSFULLY 🚀"
);
