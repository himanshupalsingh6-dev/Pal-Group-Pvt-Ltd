/* ==========================================
QUICKPRESS SERVICES
PART 1/5
FIREBASE + GLOBAL STATE
========================================== */

import { db }
from "../js/firebase.js";

import {

collection,
query,
where,
orderBy,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* ==========================================
GLOBAL STATE
========================================== */

window.allServices = [];

window.filteredServices = [];

window.currentCategory = "All";

window.currentCity =
localStorage.getItem(
"selectedCity"
)
||
"Kasganj";

/* ==========================================
CITY MULTIPLIER
========================================== */

window.cityPricing = {

Kasganj:1,
Agra:1.10,
Aligarh:1.05,
Noida:1.30,
Lucknow:1.20,
Kanpur:1.15,
Mathura:1.10,
Bareilly:1.08,
Meerut:1.12,
Ghaziabad:1.18

};

/* ==========================================
CURRENT CITY
========================================== */

const cityElement =

document.getElementById(
"currentCity"
);

if(cityElement){

cityElement.innerText =
currentCity;

}

/* ==========================================
PRICE CALCULATOR
========================================== */

window.getServicePrice =
function(service){

const factor =

cityPricing[
currentCity
]

|| 1;

return Math.round(

(service.price || 0)

* factor

);

};

/* ==========================================
LOADING UI
========================================== */

window.showLoading =
function(){

const loader =

document.getElementById(
"loadingState"
);

if(loader){

loader.style.display =
"block";

}

};

window.hideLoading =
function(){

const loader =

document.getElementById(
"loadingState"
);

if(loader){

loader.style.display =
"none";

}

};

/* ==========================================
EMPTY UI
========================================== */

window.showEmpty =
function(){

const empty =

document.getElementById(
"emptyState"
);

if(empty){

empty.style.display =
"block";

}

};

window.hideEmpty =
function(){

const empty =

document.getElementById(
"emptyState"
);

if(empty){

empty.style.display =
"none";

}

};

/* ==========================================
TOAST
========================================== */

window.showToast =
function(message){

const toast =

document.getElementById(
"toast"
);

if(!toast) return;

toast.innerText =
message;

toast.classList.add(
"show"
);

setTimeout(()=>{

toast.classList.remove(
"show"
);

},2500);

};

/* ==========================================
LOAD SERVICES
========================================== */

window.loadServices =
function(){

showLoading();

const q =

query(

collection(
db,
"services"
),

where(
"active",
"==",
true
)

);

onSnapshot(

q,

(snapshot)=>{

allServices = [];

snapshot.forEach(doc=>{

allServices.push({

id:doc.id,

...doc.data()

});

});

filteredServices =
[...allServices];

hideLoading();

renderServices(
filteredServices
);

buildCategories();

loadTrendingServices();

loadRecommendedServices();

loadRecentServices();

}

);

};

/* ==========================================
START
========================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

loadServices();

}

);/* ==========================================
PART 2/5
RENDER SERVICES + CATEGORIES
========================================== */

/* ==========================================
RENDER SERVICES
========================================== */

window.renderServices =
function(services){

const grid =

document.getElementById(
"servicesGrid"
);

if(!grid) return;

if(!services ||
services.length===0){

grid.innerHTML = "";

showEmpty();

return;

}

hideEmpty();

grid.innerHTML =

services.map(service=>`

<div
class="serviceCard fadeUp"
onclick="openService('${service.id}')">

<div class="serviceImage">

<img
src="${
service.image ||
'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800'
}"
loading="lazy">

<div class="discountBadge">

${service.discount || "20% OFF"}

</div>

<div class="ratingBadge">

⭐ ${service.rating || "4.8"}

</div>

<button
class="wishlistBtn
${isFavorite(service.id)
? "active"
: ""}"

onclick="
event.stopPropagation();
toggleFavorite('${service.id}')
">

<i class="fa-${
isFavorite(service.id)
? "solid"
: "regular"
} fa-heart"></i>

</button>

</div>

<div class="serviceBody">

<div class="serviceCategory">

${service.category || "Laundry"}

</div>

<div class="serviceName">

${service.name || "Service"}

</div>

<div class="serviceDescription">

${service.description || ""}

</div>

<div class="serviceBottom">

<div class="priceBox">

<div class="oldPrice">

₹${service.oldPrice || ""}

</div>

<div class="newPrice">

₹${getServicePrice(service)}

</div>

</div>

<button
class="addBtn"
onclick="
event.stopPropagation();
addToCart('${service.id}')
">

Add

</button>

</div>

</div>

</div>

`).join("");

};

/* ==========================================
OPEN SERVICE
========================================== */

window.openService =
function(serviceId){

window.location.href =

`service-details.html?id=${serviceId}`;

};

/* ==========================================
BUILD CATEGORIES
========================================== */

window.buildCategories =
function(){

const wrapper =

document.getElementById(
"categoryWrapper"
);

if(!wrapper) return;

const categories =
new Set();

allServices.forEach(service=>{

if(service.category){

categories.add(
service.category
);

}

});

let html = `

<button
class="categoryChip active"
data-category="All">

All

</button>

`;

categories.forEach(category=>{

html += `

<button
class="categoryChip"
data-category="${category}">

${category}

</button>

`;

});

wrapper.innerHTML =
html;

bindCategoryEvents();

};

/* ==========================================
CATEGORY EVENTS
========================================== */

window.bindCategoryEvents =
function(){

document
.querySelectorAll(
".categoryChip"
)

.forEach(btn=>{

btn.addEventListener(

"click",

()=>{

document
.querySelectorAll(
".categoryChip"
)

.forEach(item=>{

item.classList.remove(
"active"
);

});

btn.classList.add(
"active"
);

currentCategory =

btn.dataset.category;

filterServices();

}

);

});

};

/* ==========================================
FILTER SERVICES
========================================== */

window.filterServices =
function(){

let services =
[...allServices];

if(

currentCategory !==
"All"

){

services =

services.filter(service=>

service.category ===
currentCategory

);

}

filteredServices =
services;

renderServices(
filteredServices
);

};/* ==========================================
PART 3/5
SEARCH + FAVORITES + RECENT SEARCHES
========================================== */

/* ==========================================
SEARCH ELEMENTS
========================================== */

const searchInput =

document.getElementById(
"serviceSearch"
);

/* ==========================================
RECENT SEARCHES
========================================== */

window.getRecentSearches =
function(){

return JSON.parse(

localStorage.getItem(
"qp_recent_searches"
)

|| "[]"

);

};

window.saveRecentSearch =
function(keyword){

if(!keyword) return;

let searches =
getRecentSearches();

searches = searches.filter(

item => item !== keyword

);

searches.unshift(
keyword
);

searches = searches.slice(0,5);

localStorage.setItem(

"qp_recent_searches",

JSON.stringify(searches)

);

};

/* ==========================================
SEARCH SERVICES
========================================== */

window.searchServices =
function(keyword){

if(!keyword){

filteredServices =
[...allServices];

filterServices();

return;

}

const search =
keyword.toLowerCase();

let services =
[...allServices];

services = services.filter(service =>

(service.name || "")
.toLowerCase()
.includes(search)

||

(service.category || "")
.toLowerCase()
.includes(search)

||

(service.description || "")
.toLowerCase()
.includes(search)

);

if(currentCategory !== "All"){

services =

services.filter(service=>

service.category ===
currentCategory

);

}

filteredServices =
services;

renderServices(
filteredServices
);

};

/* ==========================================
SEARCH INPUT
========================================== */

if(searchInput){

let searchTimer;

searchInput.addEventListener(

"input",

function(){

const value =
this.value.trim();

clearTimeout(
searchTimer
);

searchTimer =

setTimeout(()=>{

searchServices(
value
);

},300);

}

);

searchInput.addEventListener(

"change",

function(){

const value =
this.value.trim();

if(value){

saveRecentSearch(
value
);

}

}

);

}

/* ==========================================
FAVORITES
========================================== */

window.getFavorites =
function(){

return JSON.parse(

localStorage.getItem(
"qp_favorites"
)

|| "[]"

);

};

window.saveFavorites =
function(data){

localStorage.setItem(

"qp_favorites",

JSON.stringify(data)

);

};

window.isFavorite =
function(serviceId){

return getFavorites()
.includes(serviceId);

};

/* ==========================================
TOGGLE FAVORITE
========================================== */

window.toggleFavorite =
function(serviceId){

let favorites =
getFavorites();

if(

favorites.includes(
serviceId
)

){

favorites =

favorites.filter(

id => id !== serviceId

);

showToast(
"Removed From Favorites"
);

}else{

favorites.push(
serviceId
);

showToast(
"Added To Favorites"
);

}

saveFavorites(
favorites
);

renderServices(
filteredServices
);

renderFavorites();

};

/* ==========================================
RENDER FAVORITES
========================================== */

window.renderFavorites =
function(){

const favorites =
getFavorites();

const section =

document.getElementById(
"favoritesSection"
);

const grid =

document.getElementById(
"favoritesGrid"
);

if(!section || !grid)
return;

if(favorites.length===0){

section.style.display =
"none";

return;

}

section.style.display =
"block";

const favoriteServices =

allServices.filter(service=>

favorites.includes(
service.id
)

);

grid.innerHTML =

favoriteServices.map(service=>`

<div
class="serviceCard"
onclick="openService('${service.id}')">

<div class="serviceImage">

<img
src="${service.image}">

</div>

<div class="serviceBody">

<div class="serviceCategory">

${service.category}

</div>

<div class="serviceName">

${service.name}

</div>

<div class="serviceBottom">

<div class="newPrice">

₹${getServicePrice(service)}

</div>

<button
class="addBtn"
onclick="
event.stopPropagation();
addToCart('${service.id}')
">

Add

</button>

</div>

</div>

</div>

`).join("");

};

/* ==========================================
AUTO LOAD FAVORITES
========================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

renderFavorites();

}

);/* ==========================================
PART 4/5
CART + RECENTLY ORDERED
RECOMMENDED SERVICES
========================================== */

/* ==========================================
GET CART
========================================== */

window.getCart =
function(){

return JSON.parse(

localStorage.getItem(
"qp_cart"
)

|| "[]"

);

};

/* ==========================================
SAVE CART
========================================== */

window.saveCart =
function(cart){

localStorage.setItem(

"qp_cart",

JSON.stringify(cart)

);

updateCartBar();

};

/* ==========================================
ADD TO CART
========================================== */

window.addToCart =
function(serviceId){

const service =

allServices.find(

item =>

item.id === serviceId

);

if(!service) return;

let cart =
getCart();

const existing =

cart.find(

item =>

item.id === serviceId

);

if(existing){

existing.qty += 1;

}else{

cart.push({

id:service.id,

name:service.name,

price:getServicePrice(
service
),

image:service.image || "",

category:
service.category || "",

qty:1

});

}

saveCart(
cart
);

showToast(
"Added To Cart"
);

};

/* ==========================================
UPDATE FLOATING CART
========================================== */

window.updateCartBar =
function(){

const cart =
getCart();

const cartBar =

document.getElementById(
"floatingCart"
);

const cartItems =

document.getElementById(
"cartItems"
);

const cartTotal =

document.getElementById(
"cartTotal"
);

if(
!cartBar ||
!cartItems ||
!cartTotal
){

return;

}

let totalItems = 0;
let totalPrice = 0;

cart.forEach(item=>{

totalItems +=
item.qty;

totalPrice +=

item.price *
item.qty;

});

if(totalItems===0){

cartBar.style.display =
"none";

return;

}

cartBar.style.display =
"flex";

cartItems.innerText =

`${totalItems} Items`;

cartTotal.innerText =

`₹${totalPrice}`;

};

/* ==========================================
GO CART
========================================== */

window.goCart =
function(){

window.location.href =
"cart.html";

};

/* ==========================================
RECENTLY ORDERED
========================================== */

window.loadRecentServices =
function(){

const container =

document.getElementById(
"recentlyOrdered"
);

if(!container)
return;

const recentOrders =

JSON.parse(

localStorage.getItem(
"qp_recent_orders"
)

|| "[]"

);

if(
recentOrders.length===0
){

container.innerHTML =

`

<div class="recentCard">

<div class="recentInfo">

<h4>

No Recent Orders

</h4>

<p>

Your recently ordered
services will appear here

</p>

</div>

</div>

`;

return;

}

container.innerHTML =

recentOrders.map(order=>`

<div class="recentCard">

<div class="recentIcon">

🧺

</div>

<div class="recentInfo">

<h4>

${order.name}

</h4>

<p>

Ordered Recently

</p>

</div>

<button
class="reorderBtn"
onclick="reOrder('${order.id}')">

Reorder

</button>

</div>

`).join("");

};

/* ==========================================
REORDER
========================================== */

window.reOrder =
function(serviceId){

addToCart(
serviceId
);

showToast(
"Added Again"
);

};

/* ==========================================
TRENDING SERVICES
========================================== */

window.loadTrendingServices =
function(){

const grid =

document.getElementById(
"trendingGrid"
);

if(!grid)
return;

const trending =

allServices
.slice(0,4);

grid.innerHTML =

trending.map(service=>`

<div
class="serviceCard trendingCard"
onclick="openService('${service.id}')">

<div class="trendingTag">

🔥 Trending

</div>

<div class="serviceImage">

<img
src="${service.image}">

</div>

<div class="serviceBody">

<div class="serviceCategory">

${service.category}

</div>

<div class="serviceName">

${service.name}

</div>

<div class="serviceBottom">

<div class="newPrice">

₹${getServicePrice(service)}

</div>

<button
class="addBtn"
onclick="
event.stopPropagation();
addToCart('${service.id}')
">

Add

</button>

</div>

</div>

</div>

`).join("");

};

/* ==========================================
RECOMMENDED
========================================== */

window.loadRecommendedServices =
function(){

const grid =

document.getElementById(
"recommendedGrid"
);

if(!grid)
return;

const recommended =

allServices
.slice(0,6);

grid.innerHTML =

recommended.map(service=>`

<div
class="serviceCard"
onclick="openService('${service.id}')">

<div class="serviceImage">

<img
src="${service.image}">

</div>

<div class="serviceBody">

<div class="serviceCategory">

Recommended

</div>

<div class="serviceName">

${service.name}

</div>

<div class="serviceBottom">

<div class="newPrice">

₹${getServicePrice(service)}

</div>

<button
class="addBtn"
onclick="
event.stopPropagation();
addToCart('${service.id}')
">

Add

</button>

</div>

</div>

</div>

`).join("");

};

/* ==========================================
AUTO LOAD CART
========================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

updateCartBar();

loadRecentServices();

}

);/* ==========================================
PART 5/5
OFFLINE + SEARCH SUGGESTIONS
MODAL + PERFORMANCE + INIT
========================================== */

/* ==========================================
OFFLINE SUPPORT
========================================== */

window.addEventListener(

"offline",

()=>{

const bar =

document.getElementById(
"offlineBar"
);

if(bar){

bar.style.display =
"flex";

}

showToast(
"No Internet Connection"
);

}

);

window.addEventListener(

"online",

()=>{

const bar =

document.getElementById(
"offlineBar"
);

if(bar){

bar.style.display =
"none";

}

showToast(
"Internet Connected"
);

}

);

/* ==========================================
SEARCH SUGGESTIONS
========================================== */

window.showSearchSuggestions =
function(keyword){

const box =

document.getElementById(
"searchSuggestions"
);

if(!box) return;

if(!keyword){

box.style.display =
"none";

return;

}

const results =

allServices.filter(service=>

(service.name || "")
.toLowerCase()
.includes(
keyword.toLowerCase()
)

);

if(results.length===0){

box.style.display =
"none";

return;

}

box.innerHTML =

results
.slice(0,5)
.map(service=>`

<div
class="searchItem"
onclick="selectSuggestion('${service.name}')">

🔍 ${service.name}

</div>

`).join("");

box.style.display =
"block";

};

/* ==========================================
SELECT SUGGESTION
========================================== */

window.selectSuggestion =
function(text){

const input =

document.getElementById(
"serviceSearch"
);

if(input){

input.value = text;

}

searchServices(
text
);

const box =

document.getElementById(
"searchSuggestions"
);

if(box){

box.style.display =
"none";

}

};

/* ==========================================
SEARCH LISTENER
========================================== */

const serviceSearchInput =

document.getElementById(
"serviceSearch"
);

if(serviceSearchInput){

serviceSearchInput.addEventListener(

"keyup",

function(){

showSearchSuggestions(
this.value
);

}

);

}

/* ==========================================
SERVICE PREVIEW
========================================== */

window.previewService =
function(serviceId){

const service =

allServices.find(

item =>

item.id === serviceId

);

if(!service) return;

const modal =

document.getElementById(
"servicePreview"
);

if(!modal) return;

document.getElementById(
"previewImage"
).src =
service.image || "";

document.getElementById(
"previewName"
).innerText =
service.name || "";

document.getElementById(
"previewDescription"
).innerText =
service.description || "";

modal.classList.add(
"active"
);

document.getElementById(
"previewAddBtn"
).onclick =
function(){

addToCart(
service.id
);

modal.classList.remove(
"active"
);

};

};

/* ==========================================
CLOSE MODAL
========================================== */

const closeBtn =

document.querySelector(
".closePreview"
);

if(closeBtn){

closeBtn.addEventListener(

"click",

()=>{

document
.getElementById(
"servicePreview"
)
.classList.remove(
"active"
);

}

);

}

/* ==========================================
CLICK OUTSIDE MODAL
========================================== */

const modal =

document.getElementById(
"servicePreview"
);

if(modal){

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

}

/* ==========================================
PULL TO REFRESH
========================================== */

let startY = 0;

document.addEventListener(

"touchstart",

e=>{

startY =
e.touches[0].clientY;

}

);

document.addEventListener(

"touchend",

e=>{

const endY =

e.changedTouches[0]
.clientY;

if(

window.scrollY === 0

&&

(endY-startY) > 120

){

location.reload();

}

}

);

/* ==========================================
LAZY IMAGE LOAD
========================================== */

window.lazyLoadImages =
function(){

const images =

document.querySelectorAll(
"img[data-src]"
);

const observer =

new IntersectionObserver(

entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const img =
entry.target;

img.src =
img.dataset.src;

observer.unobserve(
img
);

}

});

}

);

images.forEach(img=>{

observer.observe(img);

});

};

/* ==========================================
UPDATE CITY PRICING CARD
========================================== */

window.updatePricingInfo =
function(){

const cityElement =

document.getElementById(
"pricingCity"
);

const multiplierElement =

document.getElementById(
"pricingMultiplier"
);

if(cityElement){

cityElement.innerText =
currentCity;

}

if(multiplierElement){

multiplierElement.innerText =

(cityPricing[
currentCity
] || 1)

+ "x";

}

};

/* ==========================================
CACHE SERVICES
========================================== */

window.cacheServices =
function(){

localStorage.setItem(

"qp_cached_services",

JSON.stringify(
allServices
)

);

};

/* ==========================================
LOAD CACHE
========================================== */

window.loadCachedServices =
function(){

const cache =

JSON.parse(

localStorage.getItem(
"qp_cached_services"
)

|| "[]"

);

if(

cache.length > 0

&&

allServices.length===0

){

allServices = cache;

filteredServices =

[...cache];

renderServices(
filteredServices
);

}

};

/* ==========================================
FINAL INIT
========================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

loadCachedServices();

updatePricingInfo();

updateCartBar();

renderFavorites();

lazyLoadImages();

console.log(

"QuickPress Services Loaded Successfully"

);

}

);
