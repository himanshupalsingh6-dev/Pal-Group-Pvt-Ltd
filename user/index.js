/* =========================================================
FILE : index.js
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
LIVE LOCATION
========================================================= */

const locationText =
document.getElementById("locationText");

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
LOAD PRODUCTS
========================================================= */

const productGrid =
document.getElementById("productGrid");

async function loadProducts(){

productGrid.innerHTML =
"";

try{

const querySnapshot =
await getDocs(
collection(db,"services")
);

querySnapshot.forEach((doc)=>{

const product =
doc.data();

productGrid.innerHTML +=

`

<div class="productCard">

<div class="productImage">

${product.icon || "🧺"}

</div>

<div class="productInfo">

<div class="productName">

${product.name}

</div>

<div class="productDesc">

${product.description || "Premium laundry service"}

</div>

<div class="productBottom">

<div class="productPrice">

₹${product.price}

</div>

<button
class="addBtn">

ADD

</button>

</div>

</div>

</div>

`;

});

activateCartButtons();

}catch(error){

console.log(error);

}

}

loadProducts();

/* =========================================================
CATEGORY REDIRECT
========================================================= */

document.querySelectorAll(".categoryCard")
.forEach(card=>{

card.addEventListener("click",()=>{

const category =
card.dataset.category
.toLowerCase();

const products =
document.querySelectorAll(".productCard");

products.forEach(product=>{

if(
product.innerText
.toLowerCase()
.includes(category)
){

product.scrollIntoView({

behavior:"smooth",
block:"center"

});

}

});

});

});

/* =========================================================
POPUP CART
========================================================= */

const popupCart =
document.getElementById("popupCart");

const cartBtn =
document.querySelector(".cartBtn");

const closePopup =
document.getElementById("closePopup");

cartBtn.onclick=()=>{

popupCart.style.display=
"flex";

};

closePopup.onclick=()=>{

popupCart.style.display=
"none";

};

/* =========================================================
TOAST
========================================================= */

function showToast(message){

const toast =
document.getElementById("toast");

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
ADD TO CART
========================================================= */

let cartCount = 0;

function activateCartButtons(){

document.querySelectorAll(".addBtn")
.forEach(btn=>{

btn.onclick=()=>{

cartCount++;

document.getElementById("cartCount")
.innerText =
cartCount;

showToast(
"Added To Cart"
);

};

});

}
