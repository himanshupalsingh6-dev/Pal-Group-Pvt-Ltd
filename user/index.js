/* =========================================================
IMPORTS
========================================================= */

import { db, auth }

from "./firebase.js";

import {

collection,
getDocs,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import {

onAuthStateChanged

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

/* =========================================================
ELEMENTS
========================================================= */

const productGrid =
document.getElementById(
"productGrid"
);

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

const walletBtn =
document.getElementById(
"walletBtn"
);

const walletAmount =
document.getElementById(
"walletAmount"
);

const closeCart =
document.getElementById(
"closeCart"
);

const locationText =
document.getElementById(
"locationText"
);

/* =========================================================
GLOBAL
========================================================= */

let currentUser = null;

let services = [];

let cart = [];

/* =========================================================
AUTH SYSTEM
========================================================= */

onAuthStateChanged(

auth,

async(user)=>{

/* ========================================================= */

if(user){

currentUser = user;

/* =========================================================
SHOW WALLET
========================================================= */

walletBtn.style.display =
"flex";

/* =========================================================
LOAD USER WALLET
========================================================= */

const walletSnapshot =
await getDocs(
collection(db,"wallets")
);

/* ========================================================= */

walletSnapshot.forEach(doc=>{

const data = doc.data();

if(data.uid === user.uid){

walletAmount.innerHTML =
"₹" + (data.balance || 0);

}

});

/* ========================================================= */

}else{

currentUser = null;

/* =========================================================
HIDE WALLET
========================================================= */

walletBtn.style.display =
"none";

}

}
);

/* =========================================================
GET LOCATION
========================================================= */

navigator.geolocation.getCurrentPosition(

(position)=>{

locationText.innerHTML =

`📍 Your Location Detected`;

},

()=>{

locationText.innerHTML =
"📍 Kasganj, Uttar Pradesh";

}

);

/* =========================================================
LOAD SERVICES REALTIME
========================================================= */

onSnapshot(

collection(db,"services"),

(snapshot)=>{

productGrid.innerHTML = "";

services = [];

/* ========================================================= */

snapshot.forEach(docSnap=>{

const service =
docSnap.data();

service.id =
docSnap.id;

services.push(service);

});

/* =========================================================
TRENDING SORT
========================================================= */

services.sort(

(a,b)=>

(b.orders || 0)
-
(a.orders || 0)

);

/* =========================================================
RENDER SERVICES
========================================================= */

services.forEach(service=>{

productGrid.innerHTML += `

<div class="productCard">

<div
class="favoriteBtn">

<i class="fa-regular fa-heart"></i>

</div>

<div class="productImage">

${service.icon || '🧺'}

</div>

<div class="productInfo">

<h3>
${service.name || 'Laundry'}
</h3>

<p>
${service.description || 'Premium Laundry Service'}
</p>

<div class="productBottom">

<div class="price">

₹${service.price || 0}

</div>

<button
class="addBtn"
onclick="addToCart('${service.id}')">

Add

</button>

</div>

</div>

</div>

`;

});

}
);

/* =========================================================
ADD TO CART
========================================================= */

window.addToCart =
(id)=>{

const service =
services.find(
s=>s.id === id
);

/* ========================================================= */

if(!service) return;

/* ========================================================= */

cart.push(service);

/* ========================================================= */

renderCart();

/* ========================================================= */

popupCart.style.display =
"block";

};

/* =========================================================
RENDER CART
========================================================= */

function renderCart(){

cartItems.innerHTML = "";

let total = 0;

/* ========================================================= */

cart.forEach(item=>{

total += Number(item.price || 0);

/* ========================================================= */

cartItems.innerHTML += `

<div class="cartItem">

<div>

<b>
${item.name}
</b>

<br>

₹${item.price}

</div>

<div>

<button
onclick="removeCart('${item.id}')"
style="
width:34px;
height:34px;
border:none;
border-radius:10px;
background:#EF4444;
color:#fff;
cursor:pointer;
">

×

</button>

</div>

</div>

`;

});

/* ========================================================= */

cartTotal.innerHTML =
"₹" + total;

}

/* =========================================================
REMOVE CART
========================================================= */

window.removeCart =
(id)=>{

cart =

cart.filter(
item=>item.id !== id
);

/* ========================================================= */

renderCart();

};

/* =========================================================
CLOSE CART
========================================================= */

closeCart.onclick = ()=>{

popupCart.style.display =
"none";

};

/* =========================================================
CATEGORY FILTERS
========================================================= */

const categoryCards =

document.querySelectorAll(
".categoryCard"
);

/* ========================================================= */

categoryCards.forEach(card=>{

card.addEventListener(

"click",

()=>{

const category =

card.innerText
.trim()
.toLowerCase();

/* ========================================================= */

const filtered =

services.filter(service=>{

return (

(service.category || '')
.toLowerCase()
.includes(category)

);

});

/* ========================================================= */

productGrid.innerHTML = "";

/* ========================================================= */

filtered.forEach(service=>{

productGrid.innerHTML += `

<div class="productCard">

<div class="favoriteBtn">

<i class="fa-regular fa-heart"></i>

</div>

<div class="productImage">

${service.icon || '🧺'}

</div>

<div class="productInfo">

<h3>
${service.name}
</h3>

<p>
${service.description}
</p>

<div class="productBottom">

<div class="price">

₹${service.price}

</div>

<button
class="addBtn"
onclick="addToCart('${service.id}')">

Add

</button>

</div>

</div>

</div>

`;

});

}

);

});

/* =========================================================
BOTTOM NAV SECURITY
========================================================= */

const navItems =

document.querySelectorAll(
".navItem"
);

/* ========================================================= */

navItems.forEach(item=>{

item.addEventListener(

"click",

()=>{

const text =

item.innerText
.trim()
.toLowerCase();

/* ========================================================= */

if(

(
text === "orders" ||
text === "wallet" ||
text === "profile"
)

&&

!currentUser

){

window.location.href =
"./login.html";

return;

}

/* =========================================================
ROUTES
========================================================= */

if(text === "home"){

window.location.href =
"./index.html";

}

if(text === "orders"){

window.location.href =
"./orders.html";

}

if(text === "services"){

window.location.href =
"./services.html";

}

if(text === "wallet"){

window.location.href =
"./wallet.html";

}

if(text === "profile"){

window.location.href =
"./profile.html";

}

}

);

});

/* =========================================================
PROFILE BUTTON SECURITY
========================================================= */

const profileBtn =

document.querySelector(
".profileBtn"
);

/* ========================================================= */

profileBtn.addEventListener(

"click",

()=>{

if(!currentUser){

window.location.href =
"./login.html";

return;

}

window.location.href =
"./profile.html";

}

);

/* =========================================================
WALLET BUTTON SECURITY
========================================================= */

walletBtn.addEventListener(

"click",

()=>{

if(!currentUser){

window.location.href =
"./login.html";

return;

}

window.location.href =
"./wallet.html";

}

);

/* =========================================================
SEARCH SYSTEM
========================================================= */

const searchInput =

document.querySelector(
".searchBar input"
);

/* ========================================================= */

searchInput.addEventListener(

"keyup",

()=>{

const value =

searchInput.value
.toLowerCase();

/* ========================================================= */

const filtered =

services.filter(service=>{

return (

(service.name || '')
.toLowerCase()
.includes(value)

);

});

/* ========================================================= */

productGrid.innerHTML = "";

/* ========================================================= */

filtered.forEach(service=>{

productGrid.innerHTML += `

<div class="productCard">

<div class="favoriteBtn">

<i class="fa-regular fa-heart"></i>

</div>

<div class="productImage">

${service.icon || '🧺'}

</div>

<div class="productInfo">

<h3>
${service.name}
</h3>

<p>
${service.description}
</p>

<div class="productBottom">

<div class="price">

₹${service.price}

</div>

<button
class="addBtn"
onclick="addToCart('${service.id}')">

Add

</button>

</div>

</div>

</div>

`;

});

}

);

/* =========================================================
CHECKOUT
========================================================= */

document.querySelector(
".checkoutBtn"
)

.addEventListener(

"click",

()=>{

if(!currentUser){

window.location.href =
"./login.html";

return;

}

/* ========================================================= */

window.location.href =
"./checkout.html";

}

);

/* =========================================================
AUTO REFRESH
========================================================= */

setInterval(()=>{

console.log(
"QuickPress Home Synced"
);

},5000);
