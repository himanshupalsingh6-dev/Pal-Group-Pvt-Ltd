/* =========================================================
FILE : services.js
QUICKPRESS SERVICES PAGE
========================================================= */

import {

db

}

from "./firebase.js";

import {

collection,
getDocs

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
ELEMENTS
========================================================= */

const servicesGrid =
document.getElementById("servicesGrid");

const searchInput =
document.getElementById("searchInput");

const categoryBtns =
document.querySelectorAll(".categoryBtn");

const cartBtn =
document.querySelector(".cartBtn");

const popupCart =
document.getElementById("popupCart");

const closePopup =
document.getElementById("closePopup");

const cartItems =
document.getElementById("cartItems");

const toast =
document.getElementById("toast");

const cartCount =
document.getElementById("cartCount");

const locationText =
document.getElementById("locationText");

/* =========================================================
LIVE LOCATION
========================================================= */

navigator.geolocation.getCurrentPosition(

async(position)=>{

const lat =
position.coords.latitude;

const lon =
position.coords.longitude;

try{

const response =
await fetch(
`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
);

const data =
await response.json();

locationText.innerHTML =
`📍 ${data.address.city || data.address.town || data.address.village || "Kasganj"}`;

}catch{

locationText.innerHTML =
"📍 Kasganj";

}

},

()=>{

locationText.innerHTML =
"📍 Kasganj";

}

);

/* =========================================================
GLOBAL VARIABLES
========================================================= */

let allServices = [];

let cart = [];

let currentCategory = "all";

/* =========================================================
LOAD SERVICES FROM FIREBASE
========================================================= */

async function loadServices(){

servicesGrid.innerHTML =
"<p>Loading services...</p>";

try{

const querySnapshot =
await getDocs(
collection(db,"services")
);

allServices = [];

querySnapshot.forEach((doc)=>{

allServices.push({

id:doc.id,
...doc.data()

});

});

renderServices(allServices);

}catch(error){

console.log(error);

servicesGrid.innerHTML =
"<p>Failed to load services</p>";

}

}

loadServices();

/* =========================================================
RENDER SERVICES
========================================================= */

function renderServices(data){

servicesGrid.innerHTML = "";

if(data.length === 0){

servicesGrid.innerHTML =

`

<div class="emptyBox">

<h3>
No Services Found
</h3>

<p>
Try another search
</p>

</div>

`;

return;

}

data.forEach((service)=>{

servicesGrid.innerHTML +=

`

<div class="serviceCard">

<div class="serviceImage">

${service.icon || "🧺"}

</div>

<div class="serviceInfo">

<div class="serviceCategory">

${service.category || "Premium"}

</div>

<h3 class="serviceName">

${service.name || "Laundry Service"}

</h3>

<p class="serviceDesc">

${service.description || "Premium laundry service"}

</p>

<div class="serviceBottom">

<div>

<div class="servicePrice">

₹${service.price || 0}

</div>

<div class="deliveryTime">

⚡ 10 mins

</div>

</div>

<button
class="addBtn"
data-id="${service.id}"
data-name="${service.name}"
data-price="${service.price}">

ADD

</button>

</div>

</div>

</div>

`;

});

activateAddButtons();

}

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener("input",()=>{

const value =
searchInput.value
.toLowerCase();

let filtered =
allServices.filter(service=>{

const name =
(service.name || "")
.toLowerCase();

const category =
(service.category || "")
.toLowerCase();

const matchSearch =
name.includes(value) ||
category.includes(value);

const matchCategory =

currentCategory === "all"
?

true

:

category.includes(currentCategory);

return matchSearch && matchCategory;

});

renderServices(filtered);

});

/* =========================================================
CATEGORY FILTER
========================================================= */

categoryBtns.forEach((btn)=>{

btn.addEventListener("click",()=>{

categoryBtns.forEach((b)=>{

b.classList.remove("active");

});

btn.classList.add("active");

currentCategory =
btn.dataset.category;

filterServices();

});

});

function filterServices(){

let filtered =
allServices.filter(service=>{

const category =
(service.category || "")
.toLowerCase();

if(currentCategory === "all"){

return true;

}

return category.includes(currentCategory);

});

renderServices(filtered);

}

/* =========================================================
ADD TO CART
========================================================= */

function activateAddButtons(){

document.querySelectorAll(".addBtn")
.forEach((btn)=>{

btn.onclick = ()=>{

const item = {

id:btn.dataset.id,
name:btn.dataset.name,
price:Number(btn.dataset.price)

};

cart.push(item);

updateCart();

showToast(
`${item.name} added`
);

};

});

}

/* =========================================================
UPDATE CART
========================================================= */

function updateCart(){

cartCount.innerHTML =
cart.length;

if(cart.length === 0){

cartItems.innerHTML =
"No items added";

return;

}

cartItems.innerHTML = "";

let total = 0;

cart.forEach((item,index)=>{

total += item.price;

cartItems.innerHTML +=

`

<div class="cartItem">

<div>

<h4>
${item.name}
</h4>

<p>
₹${item.price}
</p>

</div>

<button
class="removeBtn"
onclick="removeCartItem(${index})">

Remove

</button>

</div>

`;

});

cartItems.innerHTML +=

`

<div class="cartTotal">

Total :
₹${total}

</div>

`;

}

/* =========================================================
REMOVE CART ITEM
========================================================= */

window.removeCartItem =
function(index){

cart.splice(index,1);

updateCart();

showToast(
"Item removed"
);

}

/* =========================================================
OPEN / CLOSE CART
========================================================= */

cartBtn.onclick = ()=>{

popupCart.style.display =
"flex";

}

closePopup.onclick = ()=>{

popupCart.style.display =
"none";

}

/* =========================================================
TOAST
========================================================= */

function showToast(message){

toast.innerHTML =
message;

toast.style.display =
"block";

setTimeout(()=>{

toast.style.display =
"none";

},2500);

}

/* =========================================================
CHECKOUT BUTTON
========================================================= */

document.querySelector(".checkoutBtn")
.onclick = ()=>{

if(cart.length === 0){

showToast(
"Cart is empty"
);

return;

}

window.location.href =
"checkout.html";

}

/* =========================================================
AUTO CLOSE POPUP
========================================================= */

window.onclick = (e)=>{

if(e.target === popupCart){

popupCart.style.display =
"none";

}

}
