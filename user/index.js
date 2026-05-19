/* =====================================================
QUICKPRESS FINAL INDEX JS
FILE : index.js
===================================================== */

/* =====================================================
FIREBASE IMPORT
===================================================== */

import {

db

}

from

"./firebase.js";

import {

collection,
getDocs

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =====================================================
LIVE LOCATION
===================================================== */

const locationText =
document.getElementById(
"locationText"
);

function success(position){

const latitude =
position.coords.latitude;

const longitude =
position.coords.longitude;

fetch(
`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
)

.then(response => response.json())

.then(data => {

const area =

data.address.suburb ||

data.address.neighbourhood ||

data.address.city ||

data.address.town ||

data.address.village ||

"Kasganj";

locationText.innerHTML =
`📍 ${area}`;

})

.catch(()=>{

locationText.innerHTML =
"📍 Kasganj";

});

}

function error(){

locationText.innerHTML =
"📍 Kasganj";

}

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(
success,
error
);

}else{

locationText.innerHTML =
"📍 Kasganj";

}

/* =====================================================
PROFILE BUTTON
===================================================== */

const profileBtn =
document.querySelector(
".profileBtn"
);

profileBtn.addEventListener(
"click",
()=>{

window.location.href =
"profile.html";

}
);

/* =====================================================
SEARCH BAR EFFECT
===================================================== */

const searchBar =
document.querySelector(
".searchBar"
);

const searchInput =
document.querySelector(
".searchBar input"
);

searchInput.addEventListener(
"focus",
()=>{

searchBar.style.transform =
"scale(1.01)";

searchBar.style.boxShadow =
"0 12px 28px rgba(0,0,0,0.12)";

}
);

searchInput.addEventListener(
"blur",
()=>{

searchBar.style.transform =
"scale(1)";

searchBar.style.boxShadow =
"0 8px 20px rgba(0,0,0,0.06)";

}
);

/* =====================================================
MIC BUTTON
===================================================== */

const micBtn =
document.querySelector(
".micBtn"
);

micBtn.addEventListener(
"click",
()=>{

showToast(
"Voice Search Coming Soon 🎤"
);

}
);

/* =====================================================
CATEGORY ACTIVE
===================================================== */

const categoryCards =
document.querySelectorAll(
".categoryCard"
);

categoryCards.forEach(card=>{

card.addEventListener(
"click",
()=>{

categoryCards.forEach(item=>{

item.classList.remove(
"activeCategory"
);

});

card.classList.add(
"activeCategory"
);

showToast(
`${card.innerText} selected`
);

}
);

});

/* =====================================================
PRODUCT GRID
===================================================== */

const productGrid =
document.querySelector(
".productGrid"
);

/* =====================================================
LOAD REAL PRODUCTS
===================================================== */

async function loadProducts(){

productGrid.innerHTML = `

<div style="
padding:40px;
grid-column:1/-1;
text-align:center;
font-weight:800;
color:#6B7280;
">

Loading services...

</div>

`;

try{

const querySnapshot =
await getDocs(
collection(db,"services")
);

productGrid.innerHTML = "";

/* ========================================= */

querySnapshot.forEach(doc=>{

const product = doc.data();

/* ========================================= */

productGrid.innerHTML += `

<div class="productCard">

<div class="favoriteBtn">
🤍
</div>

<div class="productImage">

<img
src="${product.image}"
style="
width:100%;
height:100%;
object-fit:cover;
">

</div>

<div class="productInfo">

<h3>
${product.name}
</h3>

<p>
${product.description}
</p>

<div class="productBottom">

<div class="price">
₹${product.price}
</div>

<button class="addBtn">
ADD
</button>

</div>

</div>

</div>

`;

});

/* ========================================= */

setupCartButtons();

setupWishlist();

/* ========================================= */

}catch(error){

console.log(error);

productGrid.innerHTML = `

<div style="
padding:40px;
grid-column:1/-1;
text-align:center;
font-weight:800;
color:red;
">

Unable to load services

</div>

`;

}

}

/* =====================================================
START PRODUCT LOAD
===================================================== */

loadProducts();

/* =====================================================
REAL CART SYSTEM
===================================================== */

let cart = [];

const popupCart =
document.getElementById(
"popupCart"
);

const cartItems =
document.getElementById(
"cartItems"
);

const cartTotal =
document.getElementById(
"cartTotal"
);

const cartCount =
document.getElementById(
"cartCount"
);

/* =====================================================
OPEN CART
===================================================== */

document.getElementById(
"walletBtn"
)

.addEventListener(
"click",
()=>{

popupCart.style.display =
"block";

renderCart();

}
);

/* =====================================================
CLOSE CART
===================================================== */

document.getElementById(
"closeCart"
)

.addEventListener(
"click",
()=>{

popupCart.style.display =
"none";

}
);

/* =====================================================
SETUP CART BUTTONS
===================================================== */

function setupCartButtons(){

document.querySelectorAll(
".addBtn"
)

.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

const card =
btn.closest(
".productCard"
);

const name =
card.querySelector("h3")
.innerText;

const price =
card.querySelector(".price")
.innerText;

const image =
card.querySelector("img")
.src;

/* ========================================= */

cart.push({

name,
price,
image

});

/* ========================================= */

cartCount.innerText =
cart.length;

/* ========================================= */

btn.innerHTML =
"Added";

btn.style.background =
"#111827";

/* ========================================= */

renderCart();

/* ========================================= */

showToast(
`${name} added to cart`
);

}
);

});

}

/* =====================================================
RENDER CART
===================================================== */

function renderCart(){

cartItems.innerHTML = "";

let total = 0;

/* ========================================= */

if(cart.length === 0){

cartItems.innerHTML = `

<div style="
padding:25px;
text-align:center;
font-weight:700;
color:#6B7280;
">

Cart is empty 🛒

</div>

`;

}

/* ========================================= */

cart.forEach(item=>{

const amount =
parseInt(
item.price.replace("₹","")
);

total += amount;

/* ========================================= */

cartItems.innerHTML += `

<div class="cartItem">

<div style="
display:flex;
align-items:center;
gap:12px;
">

<img
src="${item.image}"
style="
width:52px;
height:52px;
border-radius:14px;
object-fit:cover;
">

<div>

<div style="
font-size:14px;
font-weight:800;
">

${item.name}

</div>

<div style="
font-size:13px;
font-weight:700;
color:#16A34A;
margin-top:4px;
">

${item.price}

</div>

</div>

</div>

</div>

`;

});

/* ========================================= */

cartTotal.innerText =
`₹${total}`;

}

/* =====================================================
CHECKOUT BUTTON
===================================================== */

const checkoutBtn =
document.querySelector(
".checkoutBtn"
);

checkoutBtn.addEventListener(
"click",
()=>{

if(cart.length === 0){

showToast(
"Cart is empty"
);

return;

}

showToast(
"Opening checkout 🚀"
);

setTimeout(()=>{

window.location.href =
"checkout.html";

},1200);

}
);

/* =====================================================
BOOK PICKUP
===================================================== */

const bookBtn =
document.querySelector(
".bookBtn"
);

bookBtn.addEventListener(
"click",
()=>{

showToast(
"Pickup booked successfully 🚀"
);

}
);

/* =====================================================
PARTNER BUTTON
===================================================== */

const partnerBtn =
document.querySelector(
".partnerBtn"
);

partnerBtn.addEventListener(
"click",
()=>{

showToast(
"Opening partners..."
);

}
);

/* =====================================================
WISHLIST
===================================================== */

function setupWishlist(){

document.querySelectorAll(
".favoriteBtn"
)

.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

if(btn.innerHTML === "🤍"){

btn.innerHTML = "❤️";

showToast(
"Added to wishlist"
);

}else{

btn.innerHTML = "🤍";

showToast(
"Removed from wishlist"
);

}

}
);

});

}

/* =====================================================
BOTTOM NAV
===================================================== */

const navItems =
document.querySelectorAll(
".navItem"
);

navItems.forEach(item=>{

item.addEventListener(
"click",
()=>{

navItems.forEach(nav=>{

nav.classList.remove(
"activeNav"
);

});

item.classList.add(
"activeNav"
);

}
);

});

/* =====================================================
AUTO REVIEW SLIDER
===================================================== */

const reviewTrack =
document.querySelector(
".reviewTrack"
);

let reviewScroll = 0;

setInterval(()=>{

if(reviewTrack){

reviewScroll += 260;

if(

reviewScroll >=

reviewTrack.scrollWidth -

reviewTrack.clientWidth

){

reviewScroll = 0;

}

reviewTrack.scrollTo({

left:reviewScroll,

behavior:"smooth"

});

}

},3200);

/* =====================================================
TOAST
===================================================== */

function showToast(message){

const toast =
document.createElement("div");

toast.innerHTML = message;

toast.style.position =
"fixed";

toast.style.bottom =
"100px";

toast.style.left =
"50%";

toast.style.transform =
"translateX(-50%)";

toast.style.background =
"#111827";

toast.style.color =
"#fff";

toast.style.padding =
"14px 22px";

toast.style.borderRadius =
"18px";

toast.style.fontWeight =
"700";

toast.style.fontSize =
"14px";

toast.style.zIndex =
"99999";

toast.style.boxShadow =
"0 8px 24px rgba(0,0,0,0.18)";

document.body.appendChild(
toast
);

setTimeout(()=>{

toast.remove();

},2500);

}

/* =====================================================
HEADER SCROLL EFFECT
===================================================== */

window.addEventListener(
"scroll",
()=>{

const hero =
document.querySelector(
".hero"
);

if(window.scrollY > 10){

hero.style.boxShadow =
"0 8px 22px rgba(0,0,0,0.08)";

}else{

hero.style.boxShadow =
"none";

}

});

/* =====================================================
PAGE LOAD
===================================================== */

window.addEventListener(
"load",
()=>{

document.body.style.opacity =
"1";

});
