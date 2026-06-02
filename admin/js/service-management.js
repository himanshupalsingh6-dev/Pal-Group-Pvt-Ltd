import { db, storage } from "../js/firebase.js";

import {
collection,
addDoc,
getDocs,
getDoc,
doc,
updateDoc,
deleteDoc,
query,
where,
orderBy,
limit,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
}
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";

/* =====================================
GLOBAL STATE
===================================== */

window.appState = {

editingServiceId: null,

editingCategoryId: null,

services: [],
categories: [],
cities: []

};

/* =====================================
INIT
===================================== */

document.addEventListener(
"DOMContentLoaded",
async ()=>{

console.log(
"Service Management Loaded"
);

bindQuickActions();

await loadOverview();

await loadServices();

await loadCategories();

await loadCities();

});

/* =====================================
QUICK ACTIONS
===================================== */

function bindQuickActions(){

const addServiceBtn =

document.querySelector(
"#addServiceBtn"
);

if(addServiceBtn){

addServiceBtn.addEventListener(

"click",

()=>{

const modal =

document.getElementById(
"serviceModal"
);

if(modal){

modal.style.display =
"flex";

}

}

);

}

const addCategoryBtn =

document.querySelector(
"#addCategoryBtn"
);

if(addCategoryBtn){

addCategoryBtn.addEventListener(

"click",

()=>{

const modal =

document.getElementById(
"categoryModal"
);

if(modal){

modal.style.display =
"flex";

}

}

);

}

}

/* =====================================
OVERVIEW
===================================== */

async function loadOverview(){

try{

const servicesSnap =

await getDocs(
collection(db,"services")
);

const categoriesSnap =

await getDocs(
collection(db,"categories")
);

const citiesSnap =

await getDocs(
collection(db,"cities")
);

setText(
"totalServices",
servicesSnap.size
);

setText(
"totalCategories",
categoriesSnap.size
);

setText(
"activeCities",
citiesSnap.size
);

}
catch(error){

console.error(
"Overview Error",
error
);

}

}

/* =====================================
HELPER
===================================== */

function setText(id,value){

const el =
document.getElementById(id);

if(el){

el.innerHTML = value;

}

}
/* =====================================
LOAD SERVICES
===================================== */

async function loadServices(){

try{

const snapshot =

await getDocs(

collection(
db,
"services"
)

);

window.appState.services = [];

snapshot.forEach(docSnap=>{

window.appState.services.push({

id:docSnap.id,

...docSnap.data()

});

});

renderServices();

}
catch(error){

console.error(
"Load Services Error",
error
);

}

}

/* =====================================
RENDER SERVICES
===================================== */

function renderServices(){

const table =

document.getElementById(
"recentServices"
);

if(!table) return;

if(

window.appState.services.length === 0

){

table.innerHTML =

`
<div class="loadingBox">

No Services Found

</div>
`;

return;

}

let html =

`
<table class="dataTable">

<thead>

<tr>

<th>Name</th>
<th>Status</th>
<th>Actions</th>

</tr>

</thead>

<tbody>
`;

window.appState.services.forEach(service=>{

html +=

`
<tr>

<td>

${service.name || "-"}

</td>

<td>

${service.active

? '<span class="statusActive">Active</span>'

: '<span class="statusInactive">Inactive</span>'}

</td>

<td>

<button
onclick="editService('${service.id}')">

Edit

</button>

<button
onclick="deleteService('${service.id}')">

Delete

</button>

</td>

</tr>
`;

});

html +=

`
</tbody>
</table>
`;

table.innerHTML = html;

}

/* =====================================
SAVE SERVICE
===================================== */

const saveServiceBtn =

document.getElementById(
"saveServiceBtn"
);

if(saveServiceBtn){

saveServiceBtn.addEventListener(

"click",

async ()=>{

try{

const name =

document.getElementById(
"serviceName"
).value.trim();

const active =

document.getElementById(
"serviceStatus"
).checked;

const file =

document.getElementById(
"serviceFile"
)?.files?.[0];

if(!name){

alert(
"Service Name Required"
);

return;

}

let imageUrl = "";

if(file){

const storageRef =

ref(

storage,

`services/${Date.now()}_${file.name}`

);

await uploadBytes(
storageRef,
file
);

imageUrl =

await getDownloadURL(
storageRef
);

}

if(

window.appState.editingServiceId

){

await updateDoc(

doc(
db,
"services",
window.appState.editingServiceId
),

{

name,
active,

...(imageUrl && {
image:imageUrl
})

}

);

alert(
"Service Updated"
);

}
else{

await addDoc(

collection(
db,
"services"
),

{

name,

image:imageUrl,

active,

createdAt:
serverTimestamp()

}

);

alert(
"Service Added"
);

}

closeServiceModal();

await loadServices();

await loadOverview();

}
catch(error){

console.error(error);

alert(
"Failed To Save Service"
);

}

}

);

}

/* =====================================
EDIT SERVICE
===================================== */

window.editService =
async function(id){

try{

const snap =

await getDoc(

doc(
db,
"services",
id
)

);

if(!snap.exists()) return;

const data =
snap.data();

window.appState.editingServiceId =
id;

document.getElementById(
"serviceName"
).value =

data.name || "";

document.getElementById(
"serviceStatus"
).checked =

data.active || false;

document.getElementById(
"serviceModal"
).style.display =

"flex";

}
catch(error){

console.error(error);

}

};

/* =====================================
DELETE SERVICE
===================================== */

window.deleteService =
async function(id){

const ok =

confirm(
"Delete Service?"
);

if(!ok) return;

try{

await deleteDoc(

doc(
db,
"services",
id
)

);

await loadServices();

await loadOverview();

alert(
"Service Deleted"
);

}
catch(error){

console.error(error);

}

};

/* =====================================
CLOSE SERVICE MODAL
===================================== */

window.closeServiceModal =
function(){

window.appState.editingServiceId =
null;

const modal =

document.getElementById(
"serviceModal"
);

if(modal){

modal.style.display =
"none";

}

const name =

document.getElementById(
"serviceName"
);

if(name){

name.value = "";

}

};
/* =====================================
LOAD CATEGORIES
===================================== */

async function loadCategories(){

try{

const snapshot =

await getDocs(

collection(
db,
"categories"
)

);

window.appState.categories = [];

snapshot.forEach(docSnap=>{

window.appState.categories.push({

id:docSnap.id,

...docSnap.data()

});

});

await populateServiceDropdown();

renderCategories();

}
catch(error){

console.error(
"Load Categories Error",
error
);

}

}

/* =====================================
POPULATE SERVICE DROPDOWN
===================================== */

async function populateServiceDropdown(){

const select =

document.getElementById(
"categoryService"
);

if(!select) return;

select.innerHTML =

`
<option value="">
Select Service
</option>
`;

window.appState.services.forEach(service=>{

select.innerHTML +=

`
<option value="${service.id}">

${service.name}

</option>
`;

});

}

/* =====================================
RENDER CATEGORIES
===================================== */

function renderCategories(){

const tbody =

document.getElementById(
"categoriesTableBody"
);

if(!tbody) return;

if(

window.appState.categories.length === 0

){

tbody.innerHTML =

`
<tr>
<td colspan="4">
No Categories Found
</td>
</tr>
`;

return;

}

tbody.innerHTML = "";

window.appState.categories.forEach(category=>{

const service =

window.appState.services.find(

s => s.id === category.serviceId

);

tbody.innerHTML +=

`
<tr>

<td>

${category.name || "-"}

</td>

<td>

${service?.name || "-"}

</td>

<td>

${category.active

? '<span class="statusActive">Active</span>'

: '<span class="statusInactive">Inactive</span>'}

</td>

<td>

<button
class="editBtn"
onclick="editCategory('${category.id}')">

Edit

</button>

<button
class="deleteBtn"
onclick="deleteCategory('${category.id}')">

Delete

</button>

</td>

</tr>
`;

});

}

/* =====================================
SAVE CATEGORY
===================================== */

const saveCategoryBtn =

document.getElementById(
"saveCategoryBtn"
);

if(saveCategoryBtn){

saveCategoryBtn.addEventListener(

"click",

async()=>{

try{

const name =

document.getElementById(
"categoryName"
).value.trim();

const serviceId =

document.getElementById(
"categoryService"
).value;

const active =

document.getElementById(
"categoryStatus"
).value === "true";

if(!name){

alert(
"Category Name Required"
);

return;

}

if(!serviceId){

alert(
"Select Service"
);

return;

}

/* UPDATE */

if(

window.appState.editingCategoryId

){

await updateDoc(

doc(
db,
"categories",
window.appState.editingCategoryId
),

{

name,
serviceId,
active

}

);

alert(
"Category Updated"
);

}

/* ADD */

else{

await addDoc(

collection(
db,
"categories"
),

{

name,
serviceId,
active,

createdAt:
serverTimestamp()

}

);

alert(
"Category Added"
);

}

closeCategoryModal();

await loadCategories();

await loadOverview();

}
catch(error){

console.error(error);

alert(
"Failed To Save Category"
);

}

}

);

}

/* =====================================
EDIT CATEGORY
===================================== */

window.editCategory =
async function(id){

try{

const snap =

await getDoc(

doc(
db,
"categories",
id
)

);

if(!snap.exists()) return;

const data =
snap.data();

window.appState.editingCategoryId =
id;

document.getElementById(
"categoryName"
).value =

data.name || "";

document.getElementById(
"categoryService"
).value =

data.serviceId || "";

document.getElementById(
"categoryStatus"
).value =

data.active
? "true"
: "false";

document.getElementById(
"categoryModalTitle"
).innerHTML =

"Edit Category";

document.getElementById(
"saveCategoryBtn"
).innerHTML =

"Update Category";

document.getElementById(
"categoryModal"
).style.display =

"flex";

}
catch(error){

console.error(error);

}

};

/* =====================================
DELETE CATEGORY
===================================== */

window.deleteCategory =
async function(id){

const ok =

confirm(
"Delete Category?"
);

if(!ok) return;

try{

await deleteDoc(

doc(
db,
"categories",
id
)

);

await loadCategories();

await loadOverview();

alert(
"Category Deleted"
);

}
catch(error){

console.error(error);

}

};

/* =====================================
CLOSE CATEGORY MODAL
===================================== */

window.closeCategoryModal =
function(){

window.appState.editingCategoryId =
null;

document.getElementById(
"categoryModal"
).style.display =

"none";

document.getElementById(
"categoryName"
).value = "";

document.getElementById(
"categoryModalTitle"
).innerHTML =

"Add Category";

document.getElementById(
"saveCategoryBtn"
).innerHTML =

"Save Category";

};/* =====================================
LOAD CITIES
===================================== */

async function loadCities(){

try{

const snapshot =

await getDocs(

collection(
db,
"cities"
)

);

window.appState.cities = [];

snapshot.forEach(docSnap=>{

window.appState.cities.push({

id:docSnap.id,

...docSnap.data()

});

});

populateCityDropdowns();

renderCities();

}
catch(error){

console.error(
"Load Cities Error",
error
);

}

}

/* =====================================
POPULATE CITY DROPDOWNS
===================================== */

function populateCityDropdowns(){

const pricingCity =

document.getElementById(
"pricingCity"
);

if(pricingCity){

pricingCity.innerHTML =

`
<option value="">
Select City
</option>
`;

window.appState.cities.forEach(city=>{

pricingCity.innerHTML +=

`
<option value="${city.id}">

${city.name}

</option>
`;

});

}

}

/* =====================================
RENDER CITIES
===================================== */

function renderCities(){

const cityTable =

document.getElementById(
"citiesTableBody"
);

if(!cityTable) return;

if(

window.appState.cities.length === 0

){

cityTable.innerHTML =

`
<tr>
<td colspan="4">
No Cities Found
</td>
</tr>
`;

return;

}

cityTable.innerHTML = "";

window.appState.cities.forEach(city=>{

cityTable.innerHTML +=

`
<tr>

<td>

${city.name || "-"}

</td>

<td>

${city.state || "-"}

</td>

<td>

${city.active

? '<span class="statusActive">Active</span>'

: '<span class="statusInactive">Inactive</span>'}

</td>

<td>

<button
class="editBtn"
onclick="editCity('${city.id}')">

Edit

</button>

<button
class="deleteBtn"
onclick="deleteCity('${city.id}')">

Delete

</button>

</td>

</tr>
`;

});

}

/* =====================================
SAVE CITY
===================================== */

const saveCityBtn =

document.getElementById(
"saveCityBtn"
);

if(saveCityBtn){

saveCityBtn.addEventListener(

"click",

async()=>{

try{

const name =

document.getElementById(
"cityName"
).value.trim();

const state =

document.getElementById(
"cityState"
).value.trim();

const active =

document.getElementById(
"cityStatus"
).checked;

if(!name){

alert(
"City Name Required"
);

return;

}

if(

window.appState.editingCityId

){

await updateDoc(

doc(
db,
"cities",
window.appState.editingCityId
),

{

name,
state,
active

}

);

alert(
"City Updated"
);

}
else{

await addDoc(

collection(
db,
"cities"
),

{

name,
state,
active,

createdAt:
serverTimestamp()

}

);

alert(
"City Added"
);

}

closeCityModal();

await loadCities();

await loadOverview();

}
catch(error){

console.error(error);

alert(
"Failed To Save City"
);

}

}

);

}

/* =====================================
EDIT CITY
===================================== */

window.editCity =
async function(id){

try{

const snap =

await getDoc(

doc(
db,
"cities",
id
)

);

if(!snap.exists()) return;

const data =
snap.data();

window.appState.editingCityId =
id;

document.getElementById(
"cityName"
).value =

data.name || "";

document.getElementById(
"cityState"
).value =

data.state || "";

document.getElementById(
"cityStatus"
).checked =

data.active || false;

document.getElementById(
"cityModal"
).style.display =

"flex";

}
catch(error){

console.error(error);

}

};

/* =====================================
DELETE CITY
===================================== */

window.deleteCity =
async function(id){

const ok =

confirm(
"Delete City?"
);

if(!ok) return;

try{

await deleteDoc(

doc(
db,
"cities",
id
)

);

await loadCities();

await loadOverview();

alert(
"City Deleted"
);

}
catch(error){

console.error(error);

}

};

/* =====================================
CLOSE CITY MODAL
===================================== */

window.closeCityModal =
function(){

window.appState.editingCityId =
null;

const modal =

document.getElementById(
"cityModal"
);

if(modal){

modal.style.display =
"none";

}

document.getElementById(
"cityName"
).value = "";

document.getElementById(
"cityState"
).value = "";

};/* =====================================
PRICING MODULE
===================================== */

window.appState.pricing = [];

/* =====================================
LOAD PRICING DROPDOWNS
===================================== */

function populatePricingServices(){

const select =

document.getElementById(
"pricingService"
);

if(!select) return;

select.innerHTML =

`
<option value="">
Select Service
</option>
`;

window.appState.services.forEach(service=>{

select.innerHTML +=

`
<option value="${service.id}">

${service.name}

</option>
`;

});

}

/* =====================================
LOAD CATEGORY PRICING
===================================== */

window.loadPricingTable =
async function(){

try{

const cityId =

document.getElementById(
"pricingCity"
).value;

const serviceId =

document.getElementById(
"pricingService"
).value;

if(!cityId || !serviceId){

return;

}

const tbody =

document.getElementById(
"pricingTableBody"
);

tbody.innerHTML =

`
<tr>

<td colspan="3">

Loading...

</td>

</tr>
`;

const categories =

window.appState.categories.filter(

item =>

item.serviceId === serviceId

);

if(categories.length === 0){

tbody.innerHTML =

`
<tr>

<td colspan="3">

No Categories Found

</td>

</tr>
`;

return;

}

const pricingSnap =

await getDocs(

collection(
db,
"city_pricing"
)

);

const pricingMap = {};

pricingSnap.forEach(docSnap=>{

const item =
docSnap.data();

pricingMap[
`${item.cityId}_${item.categoryId}`
] = item.price;

});

tbody.innerHTML = "";

categories.forEach(category=>{

const currentPrice =

pricingMap[
`${cityId}_${category.id}`
] || "";

tbody.innerHTML +=

`

<tr>

<td>

${category.name}

</td>

<td>

<input
type="number"
class="priceInput"
data-category="${category.id}"
value="${currentPrice}"
placeholder="0">

</td>

<td>

₹

</td>

</tr>

`;

});

}
catch(error){

console.error(
"Pricing Load Error",
error
);

}

};

/* =====================================
SAVE PRICING
===================================== */

const savePricingBtn =

document.getElementById(
"savePricingBtn"
);

if(savePricingBtn){

savePricingBtn.addEventListener(

"click",

async()=>{

try{

const cityId =

document.getElementById(
"pricingCity"
).value;

const serviceId =

document.getElementById(
"pricingService"
).value;

if(!cityId){

alert(
"Select City"
);

return;

}

if(!serviceId){

alert(
"Select Service"
);

return;

}

const inputs =

document.querySelectorAll(
".priceInput"
);

for(const input of inputs){

const categoryId =

input.dataset.category;

const price =

Number(
input.value || 0
);

await updatePricing(

cityId,
serviceId,
categoryId,
price
);

}

alert(
"Pricing Saved Successfully"
);

}
catch(error){

console.error(error);

alert(
"Pricing Save Failed"
);

}

}

);

}

/* =====================================
UPDATE PRICING
===================================== */

async function updatePricing(

cityId,
serviceId,
categoryId,
price

){

const pricingId =

`${cityId}_${categoryId}`;

await setDoc(

doc(
db,
"city_pricing",
pricingId
),

{

cityId,

serviceId,

categoryId,

price,

updatedAt:
serverTimestamp()

}

);

}

/* =====================================
PRICING EVENTS
===================================== */

const pricingCity =

document.getElementById(
"pricingCity"
);

if(pricingCity){

pricingCity.addEventListener(

"change",

loadPricingTable

);

}

const pricingService =

document.getElementById(
"pricingService"
);

if(pricingService){

pricingService.addEventListener(

"change",

loadPricingTable

);

}

/* =====================================
QUICK ACTION
===================================== */

window.openPricingTab =
function(){

document
.querySelectorAll(
".tabBtn"
)

.forEach(btn=>{

btn.classList.remove(
"activeTab"
);

});

document
.querySelectorAll(
".tabContent"
)

.forEach(tab=>{

tab.classList.remove(
"activeContent"
);

});

const pricingBtn =

document.querySelector(
'[data-tab="pricing"]'
);/* =====================================
SERVICE AVAILABILITY
===================================== */

window.loadAvailability =
async function(){

try{

const tbody =

document.getElementById(
"availabilityTableBody"
);

if(!tbody) return;

tbody.innerHTML = "";

const pricingCities =

window.appState.cities;

const services =

window.appState.services;

if(

pricingCities.length === 0 ||

services.length === 0

){

tbody.innerHTML =

`
<tr>
<td colspan="3">

No Data Found

</td>
</tr>
`;

return;

}

for(const city of pricingCities){

for(const service of services){

tbody.innerHTML +=

`
<tr>

<td>

${city.name}

</td>

<td>

${service.name}

</td>

<td>

<label class="switch">

<input
type="checkbox"

data-city="${city.id}"

data-service="${service.id}"

class="availabilityToggle">

<span class="slider"></span>

</label>

</td>

</tr>
`;

}

}

await loadAvailabilityStatus();

}
catch(error){

console.error(error);

}

};

/* =====================================
LOAD STATUS
===================================== */

async function loadAvailabilityStatus(){

const snapshot =

await getDocs(

collection(
db,
"service_availability"
)

);

const map = {};

snapshot.forEach(docSnap=>{

const data =
docSnap.data();

map[
`${data.cityId}_${data.serviceId}`
] = data.active;

});

document
.querySelectorAll(
".availabilityToggle"
)

.forEach(toggle=>{

const cityId =

toggle.dataset.city;

const serviceId =

toggle.dataset.service;

toggle.checked =

map[
`${cityId}_${serviceId}`
] || false;

});

}

/* =====================================
SAVE AVAILABILITY
===================================== */

document.addEventListener(

"change",

async(event)=>{

if(

!event.target.classList.contains(
"availabilityToggle"
)

){

return;

}

try{

const cityId =

event.target.dataset.city;

const serviceId =

event.target.dataset.service;

const active =

event.target.checked;

await setDoc(

doc(

db,

"service_availability",

`${cityId}_${serviceId}`

),

{

cityId,

serviceId,

active,

updatedAt:
serverTimestamp()

}

);

}
catch(error){

console.error(error);

}

}

);

/* =====================================
QUICK ACTIONS
===================================== */

function bindEnterpriseActions(){

const actionButtons =

document.querySelectorAll(
".actionBtn"
);

actionButtons.forEach(btn=>{

const text =

btn.innerText
.trim();

if(

text.includes(
"Add Service"
)

){

btn.onclick = ()=>{

const modal =

document.getElementById(
"serviceModal"
);

if(modal){

modal.style.display =
"flex";

}

};

}

if(

text.includes(
"Add Category"
)

){

btn.onclick = ()=>{

const modal =

document.getElementById(
"categoryModal"
);

if(modal){

modal.style.display =
"flex";

}

};

}

if(

text.includes(
"Update Pricing"
)

){

btn.onclick = ()=>{

openPricingTab();

};

}

});

}

/* =====================================
ANALYTICS
===================================== */

window.loadAnalytics =
async function(){

try{

const ordersSnap =

await getDocs(

collection(
db,
"orders"
)

);

let revenue = 0;

const serviceMap = {};

ordersSnap.forEach(docSnap=>{

const data =
docSnap.data();

revenue +=

Number(
data.totalAmount || 0
);

const serviceName =

data.serviceName ||
"Unknown";

serviceMap[
serviceName
] =

(serviceMap[
serviceName
] || 0) + 1;

});

const todayOrders =

document.getElementById(
"todayOrders"
);

if(todayOrders){

todayOrders.innerHTML =

ordersSnap.size;

}

const todayRevenue =

document.getElementById(
"todayRevenue"
);

if(todayRevenue){

todayRevenue.innerHTML =

"₹" + revenue;

}

const analyticsRevenue =

document.getElementById(
"analyticsRevenue"
);

if(analyticsRevenue){

analyticsRevenue.innerHTML =

"₹" + revenue;

}

renderTopServices(
serviceMap
);

}
catch(error){

console.error(error);

}

};

/* =====================================
TOP SERVICES
===================================== */

function renderTopServices(
serviceMap
){

const tbody =

document.getElementById(
"topServicesTable"
);

if(!tbody) return;

tbody.innerHTML = "";

const sorted =

Object.entries(
serviceMap
)

.sort(

(a,b)=>

b[1]-a[1]

)

.slice(0,10);

if(sorted.length === 0){

tbody.innerHTML =

`
<tr>
<td colspan="3">

No Data Found

</td>
</tr>
`;

return;

}

sorted.forEach(item=>{

tbody.innerHTML +=

`
<tr>

<td>

${item[0]}

</td>

<td>

${item[1]}

</td>

<td>

-

</td>

</tr>
`;

});

}

/* =====================================
APP REFRESH
===================================== */

window.refreshServiceModule =
async function(){

await loadOverview();

await loadServices();

await loadCategories();

await loadCities();

await loadAvailability();

await loadAnalytics();

};

/* =====================================
FINAL INIT
===================================== */

setTimeout(

async()=>{

bindEnterpriseActions();

await refreshServiceModule();

console.log(
"QuickPress Service Management Ready"
);

},

1500

);

if(pricingBtn){

pricingBtn.classList.add(
"activeTab"
);

}

const pricingTab =

document.getElementById(
"pricing"
);

if(pricingTab){

pricingTab.classList.add(
"activeContent"
);

}

};

/* =====================================
INIT PRICING
===================================== */

setTimeout(()=>{

populatePricingServices();

},1000);
