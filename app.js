/* =====================================================
QUICKPRESS FINAL APP JS
===================================================== */

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

const city =

data.address.city ||

data.address.town ||

data.address.village ||

data.address.state ||

"Kasganj";

locationText.innerHTML =
`📍 ${city}`;

})

.catch(() => {

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
WALLET BUTTON
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
SEARCH BAR EFFECT
===================================================== */

const searchInput =
document.querySelector(
".searchBar input"
);

const searchBar =
document.querySelector(
".searchBar"
);

searchInput.addEventListener(
"focus",
()=>{

searchBar.style.transform =
"scale(1.01)";

searchBar.style.boxShadow =
"0 14px 30px rgba(0,0,0,0.12)";

}
);

searchInput.addEventListener(
"blur",
()=>{

searchBar.style.transform =
"scale(1)";

searchBar.style.boxShadow =
"0 10px 25px rgba(0,0,0,0.08)";

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

item.style.transform =
"scale(1)";

});

card.style.transform =
"scale(1.06)";

showToast(
`${card.innerText} selected`
);

}
);

});

/* =====================================================
REAL CART SYSTEM
===================================================== */

let cart = [];

const popupCart =
document.getElementById(
"popupCart"
);

const closeCart =
document.getElementById(
"closeCart"
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
ADD TO CART
===================================================== */

const addButtons =
document.querySelectorAll(
".addBtn"
);

addButtons.forEach(button=>{

button.addEventListener(
"click",
()=>{

const card =
button.closest(
".productCard"
);

const productName =
card.querySelector("h3")
.innerText;

const productPrice =
card.querySelector(".price")
.innerText;

const productEmoji =
card.querySelector(".productImage")
.innerText;

cart.push({

name:productName,
price:productPrice,
emoji:productEmoji

});

button.innerHTML =
"Added ✓";

button.style.background =
"#111827";

renderCart();

showToast(
`${productName} added to cart`
);

}
);

});

/* =====================================================
RENDER CART
===================================================== */

function renderCart(){

cartItems.innerHTML = "";

let total = 0;

if(cart.length === 0){

cartItems.innerHTML = `

<div style="
text-align:center;
padding:30px 10px;
color:#6B7280;
font-weight:700;
">

Your cart is empty 🛒

</div>

`;

}

cart.forEach(item=>{

const numericPrice =
parseInt(
item.price.replace("₹","")
);

total += numericPrice;

cartItems.innerHTML += `

<div class="cartItem">

<div style="
display:flex;
align-items:center;
gap:12px;
">

<div style="
font-size:34px;
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

cartTotal.innerText =
`₹${total}`;

walletAmount.innerText =
`₹${total}`;

}

/* =====================================================
CLOSE CART
===================================================== */

closeCart.addEventListener(
"click",
()=>{

popupCart.style.display =
"none";

}
);

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
"Proceeding to checkout 🚀"
);

setTimeout(()=>{

window.location.href =
"checkout.html";

},1000);

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
"Opening partner section"
);

}
);

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

let scrollPosition = 0;

setInterval(()=>{

if(reviewTrack){

scrollPosition += 300;

if(

scrollPosition >=

reviewTrack.scrollWidth -

reviewTrack.clientWidth

){

scrollPosition = 0;

}

reviewTrack.scrollTo({

left:scrollPosition,

behavior:"smooth"

});

}

},3000);

/* =====================================================
TOAST FUNCTION
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
"16px";

toast.style.fontWeight =
"700";

toast.style.fontSize =
"14px";

toast.style.zIndex =
"99999";

toast.style.boxShadow =
"0 8px 20px rgba(0,0,0,0.18)";

toast.style.animation =
"fadeIn 0.3s ease";

document.body.appendChild(
toast
);

setTimeout(()=>{

toast.remove();

},2500);

}

/* =====================================================
PAGE LOAD
===================================================== */

window.addEventListener(
"load",
()=>{

document.body.style.opacity =
"1";

});

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
"Voice search coming soon 🎤"
);

}
);

/* =====================================================
PRODUCT FAVORITE
===================================================== */

const favoriteButtons =
document.querySelectorAll(
".favoriteBtn"
);

favoriteButtons.forEach(btn=>{

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

/* =====================================================
SCROLL HEADER EFFECT
===================================================== */

window.addEventListener(
"scroll",
()=>{

const hero =
document.querySelector(
".hero"
);

if(window.scrollY > 30){

hero.style.boxShadow =
"0 10px 25px rgba(0,0,0,0.08)";

}else{

hero.style.boxShadow =
"none";

}

});
