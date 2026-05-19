/* =====================================================
QUICKPRESS FINAL INDEX JS
FILE NAME : index.js
===================================================== */

/* =====================================================
FIREBASE IMPORT
===================================================== */

import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getFirestore,
collection,
query,
limit,
getDocs

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =====================================================
FIREBASE CONFIG
===================================================== */

const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain: "YOUR_PROJECT.firebaseapp.com",

projectId: "YOUR_PROJECT_ID",

storageBucket: "YOUR_PROJECT.appspot.com",

messagingSenderId: "YOUR_SENDER_ID",

appId: "YOUR_APP_ID"

};

/* =====================================================
INITIALIZE
===================================================== */

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

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

/* ========================================= */

locationText.innerHTML =

`📍 ${area}`;

/* ========================================= */

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

if(profileBtn){

profileBtn.addEventListener(
"click",
()=>{

window.location.href =
"profile.html";

}
);

}

/* =====================================================
SEARCH EFFECT
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
"0 8px 22px rgba(0,0,0,0.08)";

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
FIREBASE PRODUCTS
===================================================== */

const productGrid =
document.getElementById(
"productGrid"
);

async function loadTrendingServices(){

productGrid.innerHTML = `

<div style="
grid-column:1/3;
text-align:center;
padding:40px 0;
font-weight:700;
color:#6B7280;
">

Loading Services...

</div>

`;

try{

const servicesQuery =
query(

collection(
db,
"services"
),

limit(6)

);

const querySnapshot =
await getDocs(
servicesQuery
);

productGrid.innerHTML = "";

/* ========================================= */

querySnapshot.forEach(doc=>{

const product =
doc.data();

/* ========================================= */

productGrid.innerHTML += `

<div class="productCard">

<div class="favoriteBtn">
🤍
</div>

<div class="productImage">

${product.icon || "🧺"}

</div>

<div class="productInfo">

<h3>
${product.name || "Service"}
</h3>

<p>
${product.description || "Premium laundry service"}
</p>

<div class="productBottom">

<div class="price">
₹${product.price || 0}
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

if(querySnapshot.empty){

productGrid.innerHTML = `

<div style="
grid-column:1/3;
text-align:center;
padding:40px 0;
font-weight:700;
color:#6B7280;
">

No services found

</div>

`;

}

/* ========================================= */

activateCartButtons();
activateFavoriteButtons();

}catch(error){

console.log(error);

productGrid.innerHTML = `

<div style="
grid-column:1/3;
text-align:center;
padding:40px 0;
font-weight:700;
color:red;
">

Failed to load services

</div>

`;

}

}

loadTrendingServices();

/* =====================================================
POPUP CART
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

const walletAmount =
document.getElementById(
"walletAmount"
);

/* =====================================================
OPEN CART
===================================================== */

const walletBtn =
document.getElementById(
"walletBtn"
);

walletBtn.addEventListener(
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

const closeCart =
document.getElementById(
"closeCart"
);

closeCart.addEventListener(
"click",
()=>{

popupCart.style.display =
"none";

}
);

/* =====================================================
ADD TO CART
===================================================== */

function activateCartButtons(){

document.querySelectorAll(
".addBtn"
)

.forEach(button=>{

button.addEventListener(
"click",
()=>{

const card =
button.closest(
".productCard"
);

const name =
card.querySelector("h3")
.innerText;

const price =
card.querySelector(".price")
.innerText;

const emoji =
card.querySelector(".productImage")
.innerText;

/* ========================================= */

cart.push({

name,
price,
emoji

});

/* ========================================= */

button.innerHTML =
"Added ✓";

button.style.background =
"#111827";

/* ========================================= */

renderCart();

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

const numericPrice =
parseInt(
item.price.replace("₹","")
);

total += numericPrice;

/* ========================================= */

cartItems.innerHTML += `

<div class="cartItem">

<div style="
display:flex;
align-items:center;
gap:12px;
">

<div style="
font-size:32px;
">

${item.emoji}

</div>

<div>

<div style="
font-size:15px;
font-weight:800;
">

${item.name}

</div>

<div style="
font-size:14px;
color:#16A34A;
font-weight:700;
margin-top:3px;
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

walletAmount.innerText =
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
BOOK PICKUP BUTTON
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
FAVORITE BUTTON
===================================================== */

function activateFavoriteButtons(){

document.querySelectorAll(
".favoriteBtn"
)

.forEach(button=>{

button.addEventListener(
"click",
()=>{

if(button.innerHTML === "🤍"){

button.innerHTML =
"❤️";

showToast(
"Added to wishlist"
);

}else{

button.innerHTML =
"🤍";

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

reviewScroll += 300;

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