/* =========================================================
QUICKPRESS SERVICES PANEL
PRODUCTION FIREBASE VERSION
PART 1/10
========================================================= */

/* =========================================================
FIREBASE
========================================================= */

import { db }

from "../js/firebase.js";

import {

collection,
doc,
addDoc,
setDoc,
updateDoc,
deleteDoc,
getDoc,
getDocs,

query,
where,
orderBy,
limit,

onSnapshot,

serverTimestamp,
increment

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
COLLECTIONS
========================================================= */

export const COLLECTIONS = {

SERVICES:
"services",

CATEGORIES:
"serviceCategories",

CITY_PRICING:
"serviceCityPricing",

BUNDLES:
"serviceBundles",

INVENTORY:
"inventory",

ORDERS:
"orders",

REVIEWS:
"reviews",

COMPLAINTS:
"complaints",

PROMOTIONS:
"promotions",

COUPONS:
"coupons",

CITIES:
"cities",

PICKUP_SLOTS:
"pickupSlots",

DELIVERY_SLOTS:
"deliverySlots",

AUDIT_LOGS:
"auditLogs",

SERVICE_ANALYTICS:
"serviceAnalytics"

};

/* =========================================================
GLOBAL STATE
========================================================= */

let services = [];

let categories = [];

let cities = [];

let cityPricing = [];

let bundles = [];

let inventory = [];

let orders = [];

let reviews = [];

let complaints = [];

let promotions = [];

let coupons = [];

let pickupSlots = [];

let deliverySlots = [];

let selectedServices = [];

/* =========================================================
DOM HELPERS
========================================================= */

function get(id){

return document.getElementById(id);

}

function setText(
id,
value
){

const el = get(id);

if(el){

el.textContent = value;

}

}

function setHTML(
id,
value
){

const el = get(id);

if(el){

el.innerHTML = value;

}

}

function currency(amount){

return "₹" +

Number(
amount || 0
)

.toLocaleString(
"en-IN"
);

}

function toast(message){

console.log(
"QuickPress:",
message
);

}

/* =========================================================
AUDIT LOG
========================================================= */

async function addAuditLog(

action,
module,
details = ""

){

try{

await addDoc(

collection(
db,
COLLECTIONS.AUDIT_LOGS
),

{

action,
module,
details,

createdAt:
serverTimestamp()

}

);

}catch(error){

console.error(
"Audit Log Error",
error
);

}

}

/* =========================================================
REALTIME SERVICES
========================================================= */

function listenServices(){

const q = query(

collection(
db,
COLLECTIONS.SERVICES
),

orderBy(
"createdAt",
"desc"
)

);

onSnapshot(

q,

(snapshot)=>{

services = [];

snapshot.forEach(docSnap=>{

services.push({

id:docSnap.id,

...docSnap.data()

});

});

renderServicesTable();

updateServicesAnalytics();

updateTopServicesRanking();

}

);

}

/* =========================================================
REALTIME CATEGORIES
========================================================= */

function listenCategories(){

onSnapshot(

collection(
db,
COLLECTIONS.CATEGORIES
),

(snapshot)=>{

categories = [];

snapshot.forEach(docSnap=>{

categories.push({

id:docSnap.id,

...docSnap.data()

});

});

populateCategoryFilter();

renderCategories();

}

);

}

/* =========================================================
REALTIME CITIES
========================================================= */

function listenCities(){

onSnapshot(

collection(
db,
COLLECTIONS.CITIES
),

(snapshot)=>{

cities = [];

snapshot.forEach(docSnap=>{

cities.push({

id:docSnap.id,

...docSnap.data()

});

});

populateCityFilter();

}

);

}

/* =========================================================
REALTIME CITY PRICING
========================================================= */

function listenCityPricing(){

onSnapshot(

collection(
db,
COLLECTIONS.CITY_PRICING
),

(snapshot)=>{

cityPricing = [];

snapshot.forEach(docSnap=>{

cityPricing.push({

id:docSnap.id,

...docSnap.data()

});

});

renderCityPricing();

}

);

}

/* =========================================================
REALTIME BUNDLES
========================================================= */

function listenBundles(){

onSnapshot(

collection(
db,
COLLECTIONS.BUNDLES
),

(snapshot)=>{

bundles = [];

snapshot.forEach(docSnap=>{

bundles.push({

id:docSnap.id,

...docSnap.data()

});

});

renderBundles();

}

);

}

/* =========================================================
REALTIME INVENTORY
========================================================= */

function listenInventory(){

onSnapshot(

collection(
db,
COLLECTIONS.INVENTORY
),

(snapshot)=>{

inventory = [];

snapshot.forEach(docSnap=>{

inventory.push({

id:docSnap.id,

...docSnap.data()

});

});

renderInventory();

}

);

}

/* =========================================================
REALTIME ORDERS
========================================================= */

function listenOrders(){

onSnapshot(

collection(
db,
COLLECTIONS.ORDERS
),

(snapshot)=>{

orders = [];

snapshot.forEach(docSnap=>{

orders.push({

id:docSnap.id,

...docSnap.data()

});

});

calculateRevenue();

calculateOrdersAnalytics();

}

);

}

/* =========================================================
REALTIME REVIEWS
========================================================= */

function listenReviews(){

onSnapshot(

collection(
db,
COLLECTIONS.REVIEWS
),

(snapshot)=>{

reviews = [];

snapshot.forEach(docSnap=>{

reviews.push({

id:docSnap.id,

...docSnap.data()

});

});

renderReviews();

updateRatingAnalytics();

}

);

}

/* =========================================================
REALTIME COMPLAINTS
========================================================= */

function listenComplaints(){

onSnapshot(

collection(
db,
COLLECTIONS.COMPLAINTS
),

(snapshot)=>{

complaints = [];

snapshot.forEach(docSnap=>{

complaints.push({

id:docSnap.id,

...docSnap.data()

});

});

renderComplaints();

updateComplaintAnalytics();

}

);

}

/* =========================================================
REALTIME COUPONS
========================================================= */

function listenCoupons(){

onSnapshot(

collection(
db,
COLLECTIONS.COUPONS
),

(snapshot)=>{

coupons = [];

snapshot.forEach(docSnap=>{

coupons.push({

id:docSnap.id,

...docSnap.data()

});

});

renderCouponsIntegration();

}

);

}

/* =========================================================
REALTIME PROMOTIONS
========================================================= */

function listenPromotions(){

onSnapshot(

collection(
db,
COLLECTIONS.PROMOTIONS
),

(snapshot)=>{

promotions = [];

snapshot.forEach(docSnap=>{

promotions.push({

id:docSnap.id,

...docSnap.data()

});

});

renderPromotions();

}

);

}/* =========================================================
REAL SERVICES CRUD
PART 2/10
========================================================= */

/* =========================================================
RENDER SERVICES TABLE
========================================================= */

function renderServicesTable(){

const tbody =
document.getElementById(
"servicesTableBody"
);

if(!tbody) return;

tbody.innerHTML = "";

services.forEach(service=>{

const cityRates =

cityPricing.filter(

item=>

item.serviceId ===
service.id

).length;

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
src="${service.image || 'https://placehold.co/60'}"
width="60"
height="60"
style="
border-radius:12px;
object-fit:cover;
">

</td>

<td>

<strong>

${service.name || "-"}

</strong>

</td>

<td>

${service.categoryName || "-"}

</td>

<td>

${service.unit || "KG"}

</td>

<td>

${currency(
service.basePrice
)}

</td>

<td>

${currency(
service.expressPrice
)}

</td>

<td>

${service.totalOrders || 0}

</td>

<td>

${currency(
service.totalRevenue
)}

</td>

<td>

<span class="${
service.status === "active"
? "statusActive"
: "statusDisabled"
}">

${service.status || "inactive"}

</span>

</td>

<td>

${service.featured
? "⭐"
: "-"}

</td>

<td>

${cityRates}

 Cities

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

tbody.appendChild(row);

});

}

/* =========================================================
CREATE SERVICE
========================================================= */

async function saveService(){

try{

const service = {

name:

get(
"serviceName"
)?.value?.trim(),

categoryId:

get(
"serviceCategory"
)?.value,

categoryName:

get(
"serviceCategory"
)?.selectedOptions[0]
?.textContent ||

"",

basePrice:

Number(

get(
"servicePrice"
)?.value || 0

),

expressPrice:

Number(

get(
"serviceExpressPrice"
)?.value || 0

),

unit:

get(
"serviceUnit"
)?.value ||

"KG",

image:

get(
"serviceImage"
)?.value ||

"",

status:"active",

featured:false,

totalOrders:0,

totalRevenue:0,

rating:0,

createdAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

};

if(!service.name){

alert(
"Service Name Required"
);

return;

}

await addDoc(

collection(
db,
COLLECTIONS.SERVICES
),

service

);

await addAuditLog(

"CREATE",

"SERVICES",

service.name

);

toast(
"Service Created"
);

closeServiceModal();

}catch(error){

console.error(error);

}

}

/* =========================================================
VIEW SERVICE
========================================================= */

async function viewService(id){

try{

const snap =

await getDoc(

doc(
db,
COLLECTIONS.SERVICES,
id
)

);

if(!snap.exists())
return;

const service =
snap.data();

alert(

`
Service:
${service.name}

Category:
${service.categoryName}

Price:
${currency(service.basePrice)}

Express:
${currency(service.expressPrice)}

Orders:
${service.totalOrders || 0}

Revenue:
${currency(service.totalRevenue)}
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
COLLECTIONS.SERVICES,
id
)

);

if(!snap.exists())
return;

const service =
snap.data();

get("serviceName").value =
service.name || "";

get("servicePrice").value =
service.basePrice || 0;

get("serviceExpressPrice").value =
service.expressPrice || 0;

get("serviceImage").value =
service.image || "";

get("serviceCategory").value =
service.categoryId || "";

openServiceModal();

const saveBtn =

document.getElementById(
"saveServiceBtn"
);

saveBtn.onclick =
()=>updateService(id);

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
COLLECTIONS.SERVICES,
id
),

{

name:
get("serviceName").value,

basePrice:
Number(
get("servicePrice").value
),

expressPrice:
Number(
get("serviceExpressPrice").value
),

image:
get("serviceImage").value,

categoryId:
get("serviceCategory").value,

updatedAt:
serverTimestamp()

}

);

await addAuditLog(

"UPDATE",

"SERVICES",

id

);

toast(
"Service Updated"
);

closeServiceModal();

}catch(error){

console.error(error);

}

}

/* =========================================================
DELETE SERVICE
========================================================= */

async function deleteService(id){

const ok = confirm(
"Delete Service ?"
);

if(!ok) return;

try{

await deleteDoc(

doc(
db,
COLLECTIONS.SERVICES,
id
)

);

await addAuditLog(

"DELETE",

"SERVICES",

id

);

toast(
"Service Deleted"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
FEATURED SERVICE
========================================================= */

async function toggleFeatured(id){

try{

const snap =

await getDoc(

doc(
db,
COLLECTIONS.SERVICES,
id
)

);

const service =
snap.data();

await updateDoc(

doc(
db,
COLLECTIONS.SERVICES,
id
),

{

featured:
!service.featured,

updatedAt:
serverTimestamp()

}

);

}catch(error){

console.error(error);

}

}

/* =========================================================
STATUS CHANGE
========================================================= */

async function changeServiceStatus(

id,
status

){

await updateDoc(

doc(
db,
COLLECTIONS.SERVICES,
id
),

{

status,

updatedAt:
serverTimestamp()

}

);

}

/* =========================================================
SERVICE ANALYTICS
========================================================= */

function updateServicesAnalytics(){

setText(
"totalServices",
services.length
);

setText(

"activeServices",

services.filter(

item=>

item.status ===
"active"

).length

);

setText(

"featuredServices",

services.filter(

item=>

item.featured === true

).length

);

}

/* =========================================================
SERVICE MODAL
========================================================= */

function openServiceModal(){

document
.getElementById(
"addServiceModal"
)
?.classList.add(
"active"
);

}

function closeServiceModal(){

document
.getElementById(
"addServiceModal"
)
?.classList.remove(
"active"
);

}/* =========================================================
REAL CATEGORIES CRUD
REAL CITIES CRUD
PART 3/10
========================================================= */

/* =========================================================
RENDER CATEGORIES
========================================================= */

function renderCategories(){

const container =

document.getElementById(
"categoryGrid"
);

if(!container) return;

container.innerHTML = "";

categories.forEach(category=>{

const totalServices =

services.filter(

service=>

service.categoryId ===
category.id

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

${category.description || "-"}

</p>

<br>

<strong>

${totalServices}
Services

</strong>

`;

container.appendChild(card);

});

}

/* =========================================================
CREATE CATEGORY
========================================================= */

async function addCategory(){

const name =
prompt(
"Category Name"
);

if(!name) return;

const description =
prompt(
"Description"
) || "";

try{

await addDoc(

collection(
db,
COLLECTIONS.CATEGORIES
),

{

name,

description,

createdAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

}

);

await addAuditLog(

"CREATE",

"CATEGORY",

name

);

toast(
"Category Added"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
UPDATE CATEGORY
========================================================= */

async function editCategory(id){

try{

const snap =

await getDoc(

doc(
db,
COLLECTIONS.CATEGORIES,
id
)

);

if(!snap.exists()) return;

const category =
snap.data();

const updatedName =
prompt(
"Category Name",
category.name
);

if(!updatedName)
return;

await updateDoc(

doc(
db,
COLLECTIONS.CATEGORIES,
id
),

{

name:
updatedName,

updatedAt:
serverTimestamp()

}

);

await addAuditLog(

"UPDATE",

"CATEGORY",

updatedName

);

}catch(error){

console.error(error);

}

}

/* =========================================================
DELETE CATEGORY
========================================================= */

async function deleteCategory(id){

if(
!confirm(
"Delete Category?"
)
)
return;

try{

await deleteDoc(

doc(
db,
COLLECTIONS.CATEGORIES,
id
)

);

await addAuditLog(

"DELETE",

"CATEGORY",

id

);

}catch(error){

console.error(error);

}

}

/* =========================================================
POPULATE CATEGORY FILTER
========================================================= */

function populateCategoryFilter(){

const select =

document.getElementById(
"categoryFilter"
);

if(!select) return;

select.innerHTML =

`
<option value="">
All Categories
</option>
`;

categories.forEach(category=>{

const option =
document.createElement(
"option"
);

option.value =
category.id;

option.textContent =
category.name;

select.appendChild(
option
);

});

}

/* =========================================================
CATEGORY ANALYTICS
========================================================= */

function updateCategoryAnalytics(){

setText(
"totalCategories",
categories.length
);

let topCategory = "-";
let highestCount = 0;

categories.forEach(category=>{

const count =

services.filter(

service=>

service.categoryId ===
category.id

).length;

if(count > highestCount){

highestCount = count;

topCategory =
category.name;

}

});

setText(
"topCategory",
topCategory
);

}

/* =========================================================
RENDER CITIES
========================================================= */

function renderCities(){

const table =

document.getElementById(
"citiesTableBody"
);

if(!table) return;

table.innerHTML = "";

cities.forEach(city=>{

const cityServices =

cityPricing.filter(

item=>

item.cityId === city.id

).length;

const row =
document.createElement("tr");

row.innerHTML = `

<td>${city.name}</td>

<td>${city.state || "-"}</td>

<td>${cityServices}</td>

<td>

<span class="${
city.status === "active"
? "statusActive"
: "statusDisabled"
}">

${city.status}

</span>

</td>

<td>

<div class="actionButtons">

<button
class="btnEdit"
onclick="editCity('${city.id}')">

Edit

</button>

<button
class="btnDelete"
onclick="deleteCity('${city.id}')">

Delete

</button>

</div>

</td>

`;

table.appendChild(row);

});

}

/* =========================================================
ADD CITY
========================================================= */

async function addCity(){

const cityName =
prompt("City Name");

if(!cityName)
return;

const state =
prompt("State") || "";

await addDoc(

collection(
db,
COLLECTIONS.CITIES
),

{

name:cityName,

state,

status:"active",

createdAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

}

);

await addAuditLog(

"CREATE",

"CITY",

cityName

);

}

/* =========================================================
EDIT CITY
========================================================= */

async function editCity(id){

const snap =

await getDoc(

doc(
db,
COLLECTIONS.CITIES,
id
)

);

if(!snap.exists())
return;

const city =
snap.data();

const name =
prompt(
"City Name",
city.name
);

if(!name)
return;

await updateDoc(

doc(
db,
COLLECTIONS.CITIES,
id
),

{

name,

updatedAt:
serverTimestamp()

}

);

}

/* =========================================================
DELETE CITY
========================================================= */

async function deleteCity(id){

if(
!confirm(
"Delete City?"
)
)
return;

await deleteDoc(

doc(
db,
COLLECTIONS.CITIES,
id
)

);

}

/* =========================================================
POPULATE CITY FILTER
========================================================= */

function populateCityFilter(){

const select =

document.getElementById(
"cityFilter"
);

if(!select) return;

select.innerHTML =

`
<option value="">
All Cities
</option>
`;

cities.forEach(city=>{

const option =
document.createElement(
"option"
);

option.value =
city.id;

option.textContent =
city.name;

select.appendChild(
option
);

});

}/* =========================================================
CITY WISE PRICING CRUD
PART 4/10
========================================================= */

/* =========================================================
RENDER CITY PRICING
========================================================= */

function renderCityPricing(){

const tbody =

document.getElementById(
"cityPricingTableBody"
);

if(!tbody) return;

tbody.innerHTML = "";

cityPricing.forEach(price=>{

const service =

services.find(

item=>

item.id ===
price.serviceId

);

const city =

cities.find(

item=>

item.id ===
price.cityId

);

const row =
document.createElement("tr");

row.innerHTML = `

<td>

${city?.name || "-"}

</td>

<td>

${service?.name || "-"}

</td>

<td>

${currency(
price.normalPrice
)}

</td>

<td>

${currency(
price.expressPrice
)}

</td>

<td>

${currency(
price.bulkPrice
)}

</td>

<td>

${currency(
price.partnerPrice
)}

</td>

<td>

<span class="${
price.status === "active"
? "statusActive"
: "statusDisabled"
}">

${price.status}

</span>

</td>

<td>

<div class="actionButtons">

<button
class="btnEdit"
onclick="editCityPricing('${price.id}')">

Edit

</button>

<button
class="btnDelete"
onclick="deleteCityPricing('${price.id}')">

Delete

</button>

</div>

</td>

`;

tbody.appendChild(row);

});

}

/* =========================================================
CREATE CITY PRICE
========================================================= */

async function saveCityPricing(){

try{

const cityId =

document.getElementById(
"pricingCity"
)?.value;

const serviceId =

document.getElementById(
"pricingService"
)?.value;

const normalPrice =

Number(

document.getElementById(
"normalPrice"
)?.value || 0

);

const expressPrice =

Number(

document.getElementById(
"expressPrice"
)?.value || 0

);

const bulkPrice =

Number(

document.getElementById(
"bulkPrice"
)?.value || 0

);

const partnerPrice =

Number(

document.getElementById(
"partnerPrice"
)?.value || 0

);

await addDoc(

collection(
db,
COLLECTIONS.CITY_PRICING
),

{

cityId,
serviceId,

normalPrice,
expressPrice,
bulkPrice,
partnerPrice,

status:"active",

createdAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

}

);

await addAuditLog(

"CREATE",

"CITY_PRICING",

serviceId

);

toast(
"City Price Created"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
EDIT CITY PRICE
========================================================= */

async function editCityPricing(id){

try{

const snap =

await getDoc(

doc(
db,
COLLECTIONS.CITY_PRICING,
id
)

);

if(!snap.exists())
return;

const data =
snap.data();

document.getElementById(
"pricingCity"
).value =
data.cityId;

document.getElementById(
"pricingService"
).value =
data.serviceId;

document.getElementById(
"normalPrice"
).value =
data.normalPrice;

document.getElementById(
"expressPrice"
).value =
data.expressPrice;

document.getElementById(
"bulkPrice"
).value =
data.bulkPrice;

document.getElementById(
"partnerPrice"
).value =
data.partnerPrice;

const saveBtn =

document.getElementById(
"saveCityPricingBtn"
);

if(saveBtn){

saveBtn.onclick =
()=>updateCityPricing(id);

}

}catch(error){

console.error(error);

}

}

/* =========================================================
UPDATE CITY PRICE
========================================================= */

async function updateCityPricing(id){

try{

await updateDoc(

doc(
db,
COLLECTIONS.CITY_PRICING,
id
),

{

normalPrice:Number(
document.getElementById(
"normalPrice"
).value
),

expressPrice:Number(
document.getElementById(
"expressPrice"
).value
),

bulkPrice:Number(
document.getElementById(
"bulkPrice"
).value
),

partnerPrice:Number(
document.getElementById(
"partnerPrice"
).value
),

updatedAt:
serverTimestamp()

}

);

await addAuditLog(

"UPDATE",

"CITY_PRICING",

id

);

toast(
"City Pricing Updated"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
DELETE CITY PRICE
========================================================= */

async function deleteCityPricing(id){

if(
!confirm(
"Delete Pricing?"
)
)
return;

try{

await deleteDoc(

doc(
db,
COLLECTIONS.CITY_PRICING,
id
)

);

await addAuditLog(

"DELETE",

"CITY_PRICING",

id

);

}catch(error){

console.error(error);

}

}

/* =========================================================
GET CITY PRICE
========================================================= */

function getServiceCityPrice(

serviceId,
cityId

){

const record =

cityPricing.find(

item=>

item.serviceId === serviceId &&

item.cityId === cityId

);

return record || null;

}

/* =========================================================
BULK UPDATE CITY PRICES
========================================================= */

async function bulkIncreaseCityPrices(

percentage = 10

){

try{

const updates =

cityPricing.map(async item=>{

const multiplier =

1 +
(percentage / 100);

await updateDoc(

doc(
db,
COLLECTIONS.CITY_PRICING,
item.id
),

{

normalPrice:

Math.round(
item.normalPrice *
multiplier
),

expressPrice:

Math.round(
item.expressPrice *
multiplier
),

bulkPrice:

Math.round(
item.bulkPrice *
multiplier
),

partnerPrice:

Math.round(
item.partnerPrice *
multiplier
),

updatedAt:
serverTimestamp()

}

);

});

await Promise.all(
updates
);

toast(
"Bulk Price Updated"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
CITY WISE SERVICE MATRIX
========================================================= */

function generatePricingMatrix(){

const matrix = {};

cities.forEach(city=>{

matrix[city.name] = {};

services.forEach(service=>{

const price =

cityPricing.find(

item=>

item.cityId === city.id &&

item.serviceId === service.id

);

matrix[city.name][service.name] =

price?.normalPrice || 0;

});

});

return matrix;

}

/* =========================================================
PARTNER COMMISSION
========================================================= */

function calculatePartnerMargin(

serviceId,
cityId

){

const pricing =

getServiceCityPrice(

serviceId,
cityId

);

if(!pricing)
return 0;

return (

pricing.normalPrice -

pricing.partnerPrice

);

}

/* =========================================================
DYNAMIC PRICE RULES
========================================================= */

function applyDynamicPricing(

basePrice,
type = "normal"

){

const peakMultiplier = 1.10;
const rainMultiplier = 1.15;
const festivalMultiplier = 1.20;

let price = basePrice;

if(type === "peak"){

price *= peakMultiplier;

}

if(type === "rain"){

price *= rainMultiplier;

}

if(type === "festival"){

price *= festivalMultiplier;

}

return Math.round(price);

}/* =========================================================
SERVICE BUNDLES + INVENTORY
PART 5/10
========================================================= */

/* =========================================================
RENDER BUNDLES
========================================================= */

function renderBundles(){

const tbody =

document.getElementById(
"bundleTableBody"
);

if(!tbody) return;

tbody.innerHTML = "";

bundles.forEach(bundle=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${bundle.name}</td>

<td>
${bundle.services?.length || 0}
</td>

<td>
${currency(
bundle.originalPrice
)}
</td>

<td>
${currency(
bundle.bundlePrice
)}
</td>

<td>
${bundle.discount}%
</td>

<td>

<span class="${
bundle.status === "active"
? "statusActive"
: "statusDisabled"
}">

${bundle.status}

</span>

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

tbody.appendChild(row);

});

}

/* =========================================================
CREATE BUNDLE
========================================================= */

async function saveBundle(){

try{

const selectedServices =

Array.from(

document.querySelectorAll(
".bundleServiceCheckbox:checked"
)

).map(
item=>item.value
);

const bundleName =

document.getElementById(
"bundleName"
)?.value;

const originalPrice =

Number(

document.getElementById(
"bundleOriginalPrice"
)?.value || 0

);

const bundlePrice =

Number(

document.getElementById(
"bundlePrice"
)?.value || 0

);

const discount =

Math.round(

(
(originalPrice - bundlePrice)
/

originalPrice

) * 100

);

await addDoc(

collection(
db,
COLLECTIONS.BUNDLES
),

{

name:bundleName,

services:selectedServices,

originalPrice,

bundlePrice,

discount,

status:"active",

createdAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

}

);

await addAuditLog(

"CREATE",
"BUNDLE",
bundleName

);

toast(
"Bundle Created"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
UPDATE BUNDLE
========================================================= */

async function updateBundle(id){

try{

await updateDoc(

doc(
db,
COLLECTIONS.BUNDLES,
id
),

{

name:

document.getElementById(
"bundleName"
).value,

updatedAt:
serverTimestamp()

}

);

toast(
"Bundle Updated"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
EDIT BUNDLE
========================================================= */

async function editBundle(id){

const snap =

await getDoc(

doc(
db,
COLLECTIONS.BUNDLES,
id
)

);

if(!snap.exists())
return;

const bundle =
snap.data();

document.getElementById(
"bundleName"
).value =
bundle.name;

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
COLLECTIONS.BUNDLES,
id
)

);

await addAuditLog(

"DELETE",
"BUNDLE",
id

);

}

/* =========================================================
BUNDLE ANALYTICS
========================================================= */

function updateBundleAnalytics(){

const totalBundles =
bundles.length;

const revenue =

bundles.reduce(

(sum,item)=>

sum +

Number(
item.bundleRevenue || 0
),

0

);

setText(
"totalBundles",
totalBundles
);

setText(
"bundleRevenue",
currency(
revenue
)
);

}

/* =========================================================
RENDER INVENTORY
========================================================= */

function renderInventory(){

const tbody =

document.getElementById(
"inventoryTableBody"
);

if(!tbody) return;

tbody.innerHTML = "";

inventory.forEach(item=>{

const lowStock =

item.stock <=
item.threshold;

const row =
document.createElement("tr");

row.innerHTML = `

<td>${item.name}</td>

<td>${item.category}</td>

<td>${item.stock}</td>

<td>${item.unit}</td>

<td>${currency(item.cost)}</td>

<td>${item.threshold}</td>

<td>

<span class="${
lowStock
? "statusDisabled"
: "statusActive"
}">

${lowStock
? "Low Stock"
: "Available"}

</span>

</td>

<td>

<div class="actionButtons">

<button
class="btnEdit"
onclick="editInventory('${item.id}')">

Edit

</button>

<button
class="btnDelete"
onclick="deleteInventory('${item.id}')">

Delete

</button>

</div>

</td>

`;

tbody.appendChild(row);

});

}

/* =========================================================
ADD INVENTORY ITEM
========================================================= */

async function saveInventoryItem(){

try{

await addDoc(

collection(
db,
COLLECTIONS.INVENTORY
),

{

name:

document.getElementById(
"inventoryName"
)?.value,

category:

document.getElementById(
"inventoryCategory"
)?.value,

stock:Number(

document.getElementById(
"inventoryStock"
)?.value || 0

),

threshold:Number(

document.getElementById(
"inventoryThreshold"
)?.value || 0

),

cost:Number(

document.getElementById(
"inventoryCost"
)?.value || 0

),

unit:"KG",

createdAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

}

);

toast(
"Inventory Added"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
UPDATE INVENTORY STOCK
========================================================= */

async function updateInventoryStock(

inventoryId,
quantity

){

try{

await updateDoc(

doc(
db,
COLLECTIONS.INVENTORY,
inventoryId
),

{

stock:
increment(
quantity
),

updatedAt:
serverTimestamp()

}

);

}catch(error){

console.error(error);

}

}

/* =========================================================
LOW STOCK ALERTS
========================================================= */

function updateInventoryAlerts(){

const lowStockItems =

inventory.filter(

item=>

item.stock <=
item.threshold

);

setText(

"lowStockItems",

lowStockItems.length

);

}

/* =========================================================
EDIT INVENTORY
========================================================= */

async function editInventory(id){

const snap =

await getDoc(

doc(
db,
COLLECTIONS.INVENTORY,
id
)

);

if(!snap.exists())
return;

const item =
snap.data();

const stock =

prompt(
"Stock",
item.stock
);

if(stock === null)
return;

await updateDoc(

doc(
db,
COLLECTIONS.INVENTORY,
id
),

{

stock:Number(stock),

updatedAt:
serverTimestamp()

}

);

}

/* =========================================================
DELETE INVENTORY
========================================================= */

async function deleteInventory(id){

if(
!confirm(
"Delete Inventory Item?"
)
)
return;

await deleteDoc(

doc(
db,
COLLECTIONS.INVENTORY,
id
)

);

}

/* =========================================================
INVENTORY ANALYTICS
========================================================= */

function updateInventoryAnalytics(){

const totalStockValue =

inventory.reduce(

(sum,item)=>

sum +

(
item.stock *
item.cost
),

0

);

setText(

"inventoryValue",

currency(
totalStockValue
)

);

updateInventoryAlerts();

}/* =========================================================
ORDERS + REVENUE ANALYTICS
PART 6/10
========================================================= */

/* =========================================================
CALCULATE REVENUE
========================================================= */

function calculateRevenue(){

let totalRevenue = 0;

let completedRevenue = 0;

let pendingRevenue = 0;

orders.forEach(order=>{

const amount =

Number(
order.totalAmount || 0
);

totalRevenue += amount;

if(
order.status === "completed"
){

completedRevenue += amount;

}else{

pendingRevenue += amount;

}

});

setText(
"servicesRevenue",
currency(
totalRevenue
)
);

setText(
"completedRevenue",
currency(
completedRevenue
)
);

setText(
"pendingRevenue",
currency(
pendingRevenue
)
);

}

/* =========================================================
ORDER ANALYTICS
========================================================= */

function calculateOrdersAnalytics(){

const totalOrders =
orders.length;

const completedOrders =

orders.filter(

order=>

order.status ===
"completed"

).length;

const cancelledOrders =

orders.filter(

order=>

order.status ===
"cancelled"

).length;

const pendingOrders =

orders.filter(

order=>

order.status ===
"pending"

).length;

setText(
"totalOrders",
totalOrders
);

setText(
"completedOrders",
completedOrders
);

setText(
"cancelledOrders",
cancelledOrders
);

setText(
"pendingOrders",
pendingOrders
);

}

/* =========================================================
SERVICE PERFORMANCE
========================================================= */

function renderServicePerformance(){

const tbody =

document.getElementById(
"servicePerformanceBody"
);

if(!tbody) return;

tbody.innerHTML = "";

services.forEach(service=>{

const serviceOrders =

orders.filter(

order=>

order.serviceId ===
service.id

);

const revenue =

serviceOrders.reduce(

(sum,order)=>

sum +

Number(
order.totalAmount || 0
),

0

);

const row =
document.createElement("tr");

row.innerHTML = `

<td>${service.name}</td>

<td>${serviceOrders.length}</td>

<td>${currency(revenue)}</td>

<td>${service.rating || 0}</td>

<td>${service.repeatOrders || 0}</td>

<td>${service.growth || 0}%</td>

`;

tbody.appendChild(row);

});

}

/* =========================================================
TOP SERVICES
========================================================= */

function updateTopServicesRanking(){

const ranking =

services.map(service=>{

const revenue =

orders

.filter(

order=>

order.serviceId ===
service.id

)

.reduce(

(sum,item)=>

sum +

Number(
item.totalAmount || 0
),

0

);

return {

...service,

revenue

};

})

.sort(

(a,b)=>

b.revenue -
a.revenue

);

setText(
"rank1Service",
ranking[0]?.name || "-"
);

setText(
"rank2Service",
ranking[1]?.name || "-"
);

setText(
"rank3Service",
ranking[2]?.name || "-"
);

setText(
"rank1Revenue",
currency(
ranking[0]?.revenue || 0
)
);

setText(
"rank2Revenue",
currency(
ranking[1]?.revenue || 0
)
);

setText(
"rank3Revenue",
currency(
ranking[2]?.revenue || 0
)
);

}

/* =========================================================
CITY ANALYTICS
========================================================= */

function updateCityAnalytics(){

const cityRevenue = {};

orders.forEach(order=>{

const cityName =
order.cityName || "Unknown";

if(
!cityRevenue[cityName]
){

cityRevenue[cityName] = 0;

}

cityRevenue[cityName] +=

Number(
order.totalAmount || 0
);

});

let topCity = "-";
let highestRevenue = 0;

Object.keys(cityRevenue)

.forEach(city=>{

if(

cityRevenue[city] >
highestRevenue

){

highestRevenue =
cityRevenue[city];

topCity = city;

}

});

setText(
"hotCity",
topCity
);

setText(
"cityRevenue",
currency(
highestRevenue
)
);

}

/* =========================================================
DAILY REVENUE
========================================================= */

function calculateDailyRevenue(){

const today =

new Date()
.toDateString();

let revenue = 0;

orders.forEach(order=>{

const date =

order.createdAt?.toDate
?

order.createdAt
.toDate()
.toDateString()

: "";

if(date === today){

revenue +=

Number(
order.totalAmount || 0
);

}

});

setText(
"dailyRevenue",
currency(revenue)
);

}

/* =========================================================
MONTHLY REVENUE
========================================================= */

function calculateMonthlyRevenue(){

const currentMonth =

new Date().getMonth();

const currentYear =

new Date().getFullYear();

let revenue = 0;

orders.forEach(order=>{

if(
!order.createdAt?.toDate
)
return;

const date =
order.createdAt.toDate();

if(

date.getMonth() ===
currentMonth

&&

date.getFullYear() ===
currentYear

){

revenue +=

Number(
order.totalAmount || 0
);

}

});

setText(
"monthlyRevenue",
currency(
revenue
)
);

}

/* =========================================================
AVERAGE ORDER VALUE
========================================================= */

function calculateAverageOrderValue(){

const revenue =

orders.reduce(

(sum,order)=>

sum +

Number(
order.totalAmount || 0
),

0

);

const avg =

orders.length

?

revenue /
orders.length

: 0;

setText(
"avgOrderValue",
currency(
Math.round(avg)
)
);

}

/* =========================================================
CUSTOMER ANALYTICS
========================================================= */

function updateCustomerAnalytics(){

const customers =
new Set();

orders.forEach(order=>{

customers.add(
order.customerId
);

});

setText(
"totalCustomers",
customers.size
);

}

/* =========================================================
REVENUE DASHBOARD
========================================================= */

function updateRevenueDashboard(){

calculateRevenue();

calculateOrdersAnalytics();

calculateDailyRevenue();

calculateMonthlyRevenue();

calculateAverageOrderValue();

updateCustomerAnalytics();

updateCityAnalytics();

renderServicePerformance();

updateTopServicesRanking();

}

/* =========================================================
ORDER EXPORT
========================================================= */

function exportOrdersCSV(){

let csv =

"OrderID,Customer,Amount,Status\n";

orders.forEach(order=>{

csv +=

`${order.id},

${order.customerName},

${order.totalAmount},

${order.status}\n`;

});

const blob =

new Blob(
[csv],
{
type:"text/csv"
}
);

const link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"orders.csv";

link.click();

}/* =========================================================
REVIEWS + COMPLAINTS + REFUNDS
PART 7/10
========================================================= */

/* =========================================================
RENDER REVIEWS
========================================================= */

function renderReviews(){

const tbody =

document.getElementById(
"reviewsTableBody"
);

if(!tbody) return;

tbody.innerHTML = "";

reviews.forEach(review=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>
${review.customerName || "-"}
</td>

<td>
${review.serviceName || "-"}
</td>

<td>
${review.rating || 0} ⭐
</td>

<td>
${review.review || "-"}
</td>

<td>
${review.createdDate || "-"}
</td>

<td>

<span class="statusActive">

Published

</span>

</td>

<td>

<div class="actionButtons">

<button
class="btnView"
onclick="viewReview('${review.id}')">

View

</button>

<button
class="btnDelete"
onclick="deleteReview('${review.id}')">

Delete

</button>

</div>

</td>

`;

tbody.appendChild(row);

});

}

/* =========================================================
VIEW REVIEW
========================================================= */

async function viewReview(id){

const review =

reviews.find(

item=>item.id===id

);

if(!review) return;

alert(

`
Customer:
${review.customerName}

Service:
${review.serviceName}

Rating:
${review.rating}

Review:
${review.review}
`

);

}

/* =========================================================
DELETE REVIEW
========================================================= */

async function deleteReview(id){

if(
!confirm(
"Delete Review?"
)
)
return;

await deleteDoc(

doc(
db,
COLLECTIONS.REVIEWS,
id
)

);

await addAuditLog(

"DELETE",
"REVIEWS",
id

);

}

/* =========================================================
RATING ANALYTICS
========================================================= */

function updateRatingAnalytics(){

const totalReviews =
reviews.length;

if(!totalReviews){

setText(
"averageRating",
"0"
);

return;

}

const totalRating =

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
totalRating /
totalReviews
)

.toFixed(1);

setText(
"averageRating",
average
);

setText(
"totalReviews",
totalReviews
);

const positive =

reviews.filter(

item=>

item.rating >= 4

).length;

const negative =

reviews.filter(

item=>

item.rating <= 2

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
RENDER COMPLAINTS
========================================================= */

function renderComplaints(){

const tbody =

document.getElementById(
"complaintsTableBody"
);

if(!tbody) return;

tbody.innerHTML = "";

complaints.forEach(item=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${item.ticketId}</td>

<td>${item.customerName}</td>

<td>${item.serviceName}</td>

<td>${item.issue}</td>

<td>${item.priority}</td>

<td>

<span class="${
item.status === "resolved"
? "statusActive"
: "statusPending"
}">

${item.status}

</span>

</td>

<td>

${item.assignedTo || "-"}

</td>

<td>

<div class="actionButtons">

<button
class="btnEdit"
onclick="resolveComplaint('${item.id}')">

Resolve

</button>

</div>

</td>

`;

tbody.appendChild(row);

});

}

/* =========================================================
RESOLVE COMPLAINT
========================================================= */

async function resolveComplaint(id){

await updateDoc(

doc(
db,
COLLECTIONS.COMPLAINTS,
id
),

{

status:"resolved",

resolvedAt:
serverTimestamp()

}

);

await addAuditLog(

"RESOLVE",
"COMPLAINT",
id

);

}

/* =========================================================
COMPLAINT ANALYTICS
========================================================= */

function updateComplaintAnalytics(){

const total =
complaints.length;

const resolved =

complaints.filter(

item=>

item.status ===
"resolved"

).length;

const pending =

complaints.filter(

item=>

item.status !==
"resolved"

).length;

const passRate =

total

?

Math.round(
(resolved/total)*100
)

:100;

setText(
"qualityChecks",
total
);

setText(
"qualityIssues",
pending
);

setText(
"qualityPassRate",
passRate + "%"
);

}

/* =========================================================
QUALITY SCORE
========================================================= */

function updateQualityControl(){

const complaintsWeight =

complaints.length * 2;

const reviewWeight =

reviews.length
?

reviews.reduce(

(sum,item)=>

sum +
item.rating,

0

) / reviews.length

: 5;

let score =

Math.round(

(reviewWeight * 20)

-

complaintsWeight

);

if(score < 0)
score = 0;

if(score > 100)
score = 100;

setText(
"qualityScore",
score + "%"
);

}

/* =========================================================
REFUND ANALYTICS
========================================================= */

function updateRefundAnalytics(){

const refundedOrders =

orders.filter(

item=>

item.paymentStatus ===
"refunded"

);

const refundAmount =

refundedOrders.reduce(

(sum,item)=>

sum +

Number(
item.totalAmount || 0
),

0

);

setText(
"refundOrders",
refundedOrders.length
);

setText(
"totalRefunds",
currency(
refundAmount
)
);

const rate =

orders.length

?

Math.round(

(
refundedOrders.length /
orders.length
)*100

)

:0;

setText(
"refundRate",
rate + "%"
);

}

/* =========================================================
CUSTOMER SATISFACTION
========================================================= */

function updateCustomerSatisfaction(){

const avgRating =

reviews.length

?

reviews.reduce(

(sum,item)=>

sum +
item.rating,

0

) /

reviews.length

:0;

const score =

Math.round(

(avgRating / 5) * 100

);

setText(
"customerRetention",
score + "%"
);

}

/* =========================================================
TOP COMPLAINT REASONS
========================================================= */

function updateComplaintReasons(){

const reasons = {

delay:0,
cleaning:0,
damage:0

};

complaints.forEach(item=>{

const issue =

(item.issue || "")
.toLowerCase();

if(
issue.includes("delay")
){

reasons.delay++;

}

if(
issue.includes("clean")
){

reasons.cleaning++;

}

if(
issue.includes("damage")
){

reasons.damage++;

}

});

setText(
"delayComplaintCount",
`${reasons.delay} Cases`
);

setText(
"cleaningComplaintCount",
`${reasons.cleaning} Cases`
);

setText(
"damageComplaintCount",
`${reasons.damage} Cases`
);

}

/* =========================================================
CUSTOMER EXPERIENCE DASHBOARD
========================================================= */

function updateCustomerExperienceDashboard(){

updateRatingAnalytics();

updateComplaintAnalytics();

updateQualityControl();

updateRefundAnalytics();

updateCustomerSatisfaction();

updateComplaintReasons();

}/* =========================================================
COUPONS + PROMOTIONS + MARKETING
PART 8/10
========================================================= */

/* =========================================================
RENDER COUPONS
========================================================= */

function renderCouponsIntegration(){

const tbody =

document.getElementById(
"couponIntegrationBody"
);

if(!tbody) return;

tbody.innerHTML = "";

coupons.forEach(coupon=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${coupon.code}</td>

<td>${coupon.discount}%</td>

<td>${coupon.usageLimit}</td>

<td>${coupon.usedCount || 0}</td>

<td>${coupon.expiryDate || "-"}</td>

<td>

<span class="${
coupon.status === "active"
? "statusActive"
: "statusDisabled"
}">

${coupon.status}

</span>

</td>

`;

tbody.appendChild(row);

});

}

/* =========================================================
CREATE COUPON
========================================================= */

async function saveCoupon(){

try{

await addDoc(

collection(
db,
COLLECTIONS.COUPONS
),

{

code:

document.getElementById(
"couponCode"
)?.value,

discount:Number(

document.getElementById(
"couponDiscount"
)?.value || 0

),

usageLimit:Number(

document.getElementById(
"couponLimit"
)?.value || 0

),

usedCount:0,

expiryDate:

document.getElementById(
"couponExpiry"
)?.value,

status:"active",

createdAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

}

);

await addAuditLog(

"CREATE",
"COUPON",
"NEW COUPON"

);

toast(
"Coupon Created"
);

}catch(error){

console.error(error);

}

}

/* =========================================================
DELETE COUPON
========================================================= */

async function deleteCoupon(id){

if(
!confirm(
"Delete Coupon?"
)
)
return;

await deleteDoc(

doc(
db,
COLLECTIONS.COUPONS,
id
)

);

}

/* =========================================================
RENDER PROMOTIONS
========================================================= */

function renderPromotions(){

const tbody =

document.getElementById(
"promotionTableBody"
);

if(!tbody) return;

tbody.innerHTML = "";

promotions.forEach(promo=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${promo.title}</td>

<td>${promo.serviceName}</td>

<td>${promo.discount}%</td>

<td>${promo.startDate}</td>

<td>${promo.endDate}</td>

<td>

<span class="${
promo.status === "active"
? "statusActive"
: "statusDisabled"
}">

${promo.status}

</span>

</td>

<td>

<button
class="btnDelete"
onclick="deletePromotion('${promo.id}')">

Delete

</button>

</td>

`;

tbody.appendChild(row);

});

}

/* =========================================================
CREATE PROMOTION
========================================================= */

async function savePromotion(){

try{

await addDoc(

collection(
db,
COLLECTIONS.PROMOTIONS
),

{

title:

document.getElementById(
"promotionTitle"
)?.value,

serviceId:

document.getElementById(
"promotionService"
)?.value,

serviceName:

document.getElementById(
"promotionService"
)?.selectedOptions[0]
?.textContent ||

"",

discount:Number(

document.getElementById(
"promotionDiscount"
)?.value || 0

),

startDate:

document.getElementById(
"promotionStart"
)?.value,

endDate:

document.getElementById(
"promotionEnd"
)?.value,

status:"active",

createdAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

}

);

await addAuditLog(

"CREATE",
"PROMOTION",
"NEW PROMOTION"

);

}catch(error){

console.error(error);

}

}

/* =========================================================
DELETE PROMOTION
========================================================= */

async function deletePromotion(id){

if(
!confirm(
"Delete Promotion?"
)
)
return;

await deleteDoc(

doc(
db,
COLLECTIONS.PROMOTIONS,
id
)

);

}

/* =========================================================
LOYALTY PROGRAM
========================================================= */

function updateLoyaltyProgram(){

const customers =
new Set();

orders.forEach(order=>{

customers.add(
order.customerId
);

});

const totalMembers =
customers.size;

setText(
"bronzeMembers",
Math.round(totalMembers*0.50)
);

setText(
"silverMembers",
Math.round(totalMembers*0.25)
);

setText(
"goldMembers",
Math.round(totalMembers*0.15)
);

setText(
"platinumMembers",
Math.round(totalMembers*0.10)
);

}

/* =========================================================
MEMBERSHIP ANALYTICS
========================================================= */

function updateMembershipAnalytics(){

const members =
new Set();

orders.forEach(order=>{

members.add(
order.customerId
);

});

const total =
members.size;

const premium =
Math.round(
total * 0.25
);

const rate =

total

?

Math.round(
(premium/total)*100
)

:0;

setText(
"membershipUsers",
total
);

setText(
"premiumMembers",
premium
);

setText(
"conversionRate",
rate + "%"
);

}

/* =========================================================
CAMPAIGN ANALYTICS
========================================================= */

function updateCampaignAnalytics(){

const activePromotions =

promotions.filter(

item=>

item.status ===
"active"

).length;

const couponUsage =

coupons.reduce(

(sum,item)=>

sum +

Number(
item.usedCount || 0
),

0

);

setText(
"activePromotions",
activePromotions
);

setText(
"couponUsage",
couponUsage
);

}

/* =========================================================
PROMOTION REVENUE
========================================================= */

function updatePromotionRevenue(){

let revenue = 0;

orders.forEach(order=>{

if(
order.couponApplied
){

revenue +=

Number(
order.totalAmount || 0
);

}

});

setText(
"promoRevenue",
currency(
revenue
)
);

}

/* =========================================================
SEASONAL OFFERS
========================================================= */

function updateSeasonalOffers(){

const month =
new Date().getMonth()+1;

let offer =
"New User Offer";

if(month >= 10){

offer =
"Diwali Offer";

}else if(month >= 3){

offer =
"Holi Offer";

}

setText(
"seasonalOffer",
offer
);

}

/* =========================================================
MARKETING DASHBOARD
========================================================= */

function updateMarketingDashboard(){

updateCampaignAnalytics();

updateMembershipAnalytics();

updatePromotionRevenue();

updateSeasonalOffers();

updateLoyaltyProgram();

}/* =========================================================
AI ANALYTICS + FORECASTING
PART 9/10
========================================================= */

/* =========================================================
AI RECOMMENDATIONS
========================================================= */

function updateAIRecommendations(){

if(!services.length){

setText(
"aiRecommendation",
"No Data Available"
);

return;

}

const bestService =

services

.map(service=>{

const revenue =

orders

.filter(

order=>

order.serviceId ===
service.id

)

.reduce(

(sum,item)=>

sum +

Number(
item.totalAmount || 0
),

0

);

return {

...service,

revenue

};

})

.sort(

(a,b)=>

b.revenue -
a.revenue

)[0];

setText(

"aiRecommendation",

`Promote ${bestService.name}
in more cities`

);

}

/* =========================================================
SERVICE GROWTH ANALYTICS
========================================================= */

function updateServiceGrowthAnalytics(){

const growthTable =

document.getElementById(
"serviceGrowthBody"
);

if(!growthTable) return;

growthTable.innerHTML = "";

services.forEach(service=>{

const serviceOrders =

orders.filter(

order=>

order.serviceId ===
service.id

);

const currentOrders =
serviceOrders.length;

const predictedOrders =

Math.round(
currentOrders * 1.20
);

const growth =
currentOrders

?

Math.round(

(
(predictedOrders -
currentOrders)

/

currentOrders

) * 100

)

:0;

const row =
document.createElement("tr");

row.innerHTML = `

<td>${service.name}</td>

<td>${currentOrders}</td>

<td>${predictedOrders}</td>

<td>${growth}%</td>

`;

growthTable.appendChild(row);

});

}

/* =========================================================
CITY GROWTH ANALYTICS
========================================================= */

function updateCityGrowthAnalytics(){

const cityMap = {};

orders.forEach(order=>{

const city =
order.cityName ||
"Unknown";

if(!cityMap[city]){

cityMap[city] = 0;

}

cityMap[city]++;

});

let fastestCity = "-";
let maxOrders = 0;

Object.keys(cityMap)

.forEach(city=>{

if(

cityMap[city] >
maxOrders

){

maxOrders =
cityMap[city];

fastestCity =
city;

}

});

setText(
"fastestGrowingCity",
fastestCity
);

setText(
"cityGrowthOrders",
maxOrders
);

}

/* =========================================================
DEMAND FORECASTING
========================================================= */

function renderDemandForecast(){

const tbody =

document.getElementById(
"forecastTableBody"
);

if(!tbody) return;

tbody.innerHTML = "";

services.forEach(service=>{

const totalOrders =

orders.filter(

order=>

order.serviceId ===
service.id

).length;

const forecast7Days =

Math.round(
totalOrders * 1.10
);

const forecast30Days =

Math.round(
totalOrders * 1.35
);

const row =
document.createElement("tr");

row.innerHTML = `

<td>${service.name}</td>

<td>${totalOrders}</td>

<td>${forecast7Days}</td>

<td>${forecast30Days}</td>

<td>

<span class="statusActive">

High Demand

</span>

</td>

`;

tbody.appendChild(row);

});

}

/* =========================================================
PREDICTED REVENUE
========================================================= */

function updatePredictedRevenue(){

const totalRevenue =

orders.reduce(

(sum,item)=>

sum +

Number(
item.totalAmount || 0
),

0

);

const nextMonth =

Math.round(
totalRevenue * 1.15
);

const nextQuarter =

Math.round(
totalRevenue * 1.40
);

setText(
"predictedRevenueMonth",
currency(
nextMonth
)
);

setText(
"predictedRevenueQuarter",
currency(
nextQuarter
)
);

}

/* =========================================================
BUSINESS INTELLIGENCE
========================================================= */

function updateBusinessIntelligence(){

const revenue =

orders.reduce(

(sum,item)=>

sum +

Number(
item.totalAmount || 0
),

0

);

const totalCustomers =

new Set(

orders.map(
item=>
item.customerId
)

).size;

const avgRevenuePerCustomer =

totalCustomers

?

Math.round(
revenue /
totalCustomers
)

:0;

setText(
"businessRevenue",
currency(
revenue
)
);

setText(
"businessCustomers",
totalCustomers
);

setText(
"avgRevenueCustomer",
currency(
avgRevenuePerCustomer
)
);

}

/* =========================================================
TOP OPPORTUNITY ANALYSIS
========================================================= */

function updateOpportunityAnalysis(){

const inactiveCities =

cities.filter(city=>{

const cityOrders =

orders.filter(

order=>

order.cityId ===
city.id

);

return cityOrders.length < 5;

});

setText(

"expansionOpportunity",

inactiveCities[0]?.name ||

"No Suggestion"

);

}

/* =========================================================
AI PRICING SUGGESTION
========================================================= */

function updatePricingSuggestions(){

if(!services.length)
return;

const topService =

services[0];

setText(

"pricingSuggestion",

`Increase ${topService.name}
price by 5%`

);

}

/* =========================================================
SERVICE PROFITABILITY
========================================================= */

function updateProfitabilityAnalytics(){

let profit = 0;

orders.forEach(order=>{

const revenue =

Number(
order.totalAmount || 0
);

const cost =

Number(
order.partnerCost || 0
);

profit +=

(revenue - cost);

});

setText(
"netProfit",
currency(
profit
)
);

}

/* =========================================================
EXECUTIVE DASHBOARD
========================================================= */

function updateExecutiveDashboard(){

updateAIRecommendations();

updateServiceGrowthAnalytics();

updateCityGrowthAnalytics();

renderDemandForecast();

updatePredictedRevenue();

updateBusinessIntelligence();

updateOpportunityAnalysis();

updatePricingSuggestions();

updateProfitabilityAnalytics();

}/* =========================================================
PICKUP SLOTS MANAGEMENT
========================================================= */

function renderPickupSlots(){

const tbody =
document.getElementById(
"pickupSlotsBody"
);

if(!tbody) return;

tbody.innerHTML = "";

pickupSlots.forEach(slot=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${slot.name}</td>
<td>${slot.startTime}</td>
<td>${slot.endTime}</td>
<td>${slot.capacity}</td>
<td>${slot.booked || 0}</td>

<td>

<span class="statusActive">

${slot.status}

</span>

</td>

`;

tbody.appendChild(row);

});

}

/* =========================================================
DELIVERY SLOTS
========================================================= */

function renderDeliverySlots(){

const tbody =
document.getElementById(
"deliverySlotsBody"
);

if(!tbody) return;

tbody.innerHTML = "";

deliverySlots.forEach(slot=>{

const row =
document.createElement("tr");

row.innerHTML = `

<td>${slot.name}</td>
<td>${slot.startTime}</td>
<td>${slot.endTime}</td>
<td>${slot.capacity}</td>
<td>${slot.booked || 0}</td>

<td>

<span class="statusActive">

${slot.status}

</span>

</td>

`;

tbody.appendChild(row);

});

}

/* =========================================================
LISTEN PICKUP SLOTS
========================================================= */

function listenPickupSlots(){

onSnapshot(

collection(
db,
COLLECTIONS.PICKUP_SLOTS
),

snapshot=>{

pickupSlots=[];

snapshot.forEach(docSnap=>{

pickupSlots.push({

id:docSnap.id,

...docSnap.data()

});

});

renderPickupSlots();

}

);

}

/* =========================================================
LISTEN DELIVERY SLOTS
========================================================= */

function listenDeliverySlots(){

onSnapshot(

collection(
db,
COLLECTIONS.DELIVERY_SLOTS
),

snapshot=>{

deliverySlots=[];

snapshot.forEach(docSnap=>{

deliverySlots.push({

id:docSnap.id,

...docSnap.data()

});

});

renderDeliverySlots();

}

);

}

/* =========================================================
SLA ANALYTICS
========================================================= */

function updateSLAAnalytics(){

const completedOrders =

orders.filter(

order=>

order.status ===
"completed"

);

let onTime = 0;

completedOrders.forEach(order=>{

if(order.slaMet){

onTime++;

}

});

const slaRate =

completedOrders.length

?

Math.round(

(onTime /
completedOrders.length)

*100

)

:100;

setText(
"slaRate",
slaRate + "%"
);

setText(
"slaCompleted",
onTime
);

}

/* =========================================================
EXPORT SERVICES CSV
========================================================= */

function exportServicesCSV(){

let csv =

"Service,Category,Price,Orders,Revenue\n";

services.forEach(service=>{

csv +=

`${service.name},
${service.categoryName},
${service.basePrice},
${service.totalOrders || 0},
${service.totalRevenue || 0}\n`;

});

const blob =

new Blob(
[csv],
{
type:"text/csv"
}
);

const url =
URL.createObjectURL(blob);

const a =
document.createElement("a");

a.href = url;

a.download =
"quickpress-services.csv";

a.click();

}

/* =========================================================
EXPORT CITY PRICING CSV
========================================================= */

function exportPricingCSV(){

let csv =

"City,Service,Normal,Express,Bulk,Partner\n";

cityPricing.forEach(item=>{

const city =

cities.find(
c=>c.id===item.cityId
);

const service =

services.find(
s=>s.id===item.serviceId
);

csv +=

`${city?.name},
${service?.name},
${item.normalPrice},
${item.expressPrice},
${item.bulkPrice},
${item.partnerPrice}\n`;

});

const blob =

new Blob(
[csv],
{
type:"text/csv"
}
);

const link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"city-pricing.csv";

link.click();

}

/* =========================================================
BACKUP DATA
========================================================= */

function createBackup(){

const backup = {

services,
categories,
cities,
cityPricing,
bundles,
inventory,
createdAt:
new Date()
.toISOString()

};

localStorage.setItem(

"quickpressServicesBackup",

JSON.stringify(
backup
)

);

toast(
"Backup Created"
);

}

/* =========================================================
EVENTS
========================================================= */

function initializeEvents(){

document
.getElementById(
"saveServiceBtn"
)
?.addEventListener(
"click",
saveService
);

document
.getElementById(
"saveCouponBtn"
)
?.addEventListener(
"click",
saveCoupon
);

document
.getElementById(
"savePromotionBtn"
)
?.addEventListener(
"click",
savePromotion
);

document
.getElementById(
"exportServicesBtn"
)
?.addEventListener(
"click",
exportServicesCSV
);

document
.getElementById(
"exportPricingBtn"
)
?.addEventListener(
"click",
exportPricingCSV
);

}

/* =========================================================
MASTER DASHBOARD UPDATE
========================================================= */

function refreshAllDashboards(){

updateRevenueDashboard();

updateCustomerExperienceDashboard();

updateMarketingDashboard();

updateExecutiveDashboard();

updateInventoryAnalytics();

updateBundleAnalytics();

updateCategoryAnalytics();

updateSLAAnalytics();

}

/* =========================================================
INITIALIZATION
========================================================= */

async function initializeServicesPanel(){

try{

listenServices();

listenCategories();

listenCities();

listenCityPricing();

listenBundles();

listenInventory();

listenOrders();

listenReviews();

listenComplaints();

listenCoupons();

listenPromotions();

listenPickupSlots();

listenDeliverySlots();

initializeEvents();

setInterval(

refreshAllDashboards,

3000

);

console.log(

"🚀 QUICKPRESS SERVICES PANEL READY"

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

addCategory,
editCategory,
deleteCategory,

addCity,
editCity,
deleteCity,

saveCityPricing,
updateCityPricing,
deleteCityPricing,

saveBundle,
updateBundle,
deleteBundle,

saveInventoryItem,
updateInventoryStock,

saveCoupon,
deleteCoupon,

savePromotion,
deletePromotion,

exportServicesCSV,
exportPricingCSV,

createBackup

};

console.log(

"✅ SERVICES.JS PRODUCTION VERSION LOADED"

);
