/* =========================================================
FILE : user/index.js
QUICKPRESS USER HOME
REALTIME FIREBASE V2
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot,
query,
orderBy

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =====================================================
ELEMENTS
===================================================== */

const serviceGrid =
document.querySelector(
".serviceGrid"
);

const userCity =
document.getElementById(
"userCity"
);

/* =====================================================
USER DATA
===================================================== */

const currentCity =

localStorage.getItem(
"quickpress_user_city"
)

||

"Kasganj";

/* ========================================= */

userCity.innerHTML =
currentCity;

/* =====================================================
LIVE SERVICES
===================================================== */

onSnapshot(

query(
collection(db,"services"),
orderBy("createdAt","desc")
),

(snapshot)=>{

serviceGrid.innerHTML = "";

/* ========================================= */

snapshot.forEach((docSnap)=>{

const service = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

renderService(
service
);

});

}

/* END */

);

/* =====================================================
RENDER SERVICE
===================================================== */

function renderService(
service
){

const card = `

<div class="serviceCard">

<!-- FAV -->

<div
class="favoriteBtn"
onclick="toggleFavorite(
'${service.id}'
)">

❤️

</div>

<!-- IMAGE -->

<div class="serviceImage">

${service.icon || "🧺"}

</div>

<!-- NAME -->

<h3>

${service.name || "Laundry"}

</h3>

<!-- DESC -->

<p>

${service.description || "Premium laundry service"}

</p>

<!-- BOTTOM -->

<div class="serviceBottom">

<div class="price">

₹${service.price || 0}

</div>

<button
class="addBtn"
onclick="addToCart(
'${service.id}',
'${service.name}',
'${service.price}',
'${service.icon}'
)">

ADD

</button>

</div>

</div>

`;

/* ========================================= */

serviceGrid.innerHTML += card;

}

/* =====================================================
ADD TO CART
===================================================== */

window.addToCart =
(
id,
name,
price,
icon
)=>{

let cart =

JSON.parse(
localStorage.getItem(
"quickpress_cart"
)
)

||

[];

/* ========================================= */

const existing =
cart.find(
(item)=> item.id === id
);

/* ========================================= */

if(existing){

existing.quantity += 1;

}

else{

cart.push({

id,
name,
price:Number(price),
icon,
quantity:1

});

}

/* ========================================= */

localStorage.setItem(
"quickpress_cart",
JSON.stringify(cart)
);

/* ========================================= */

showToast(
`${name} added`
);

};

/* =====================================================
FAVORITES
===================================================== */

window.toggleFavorite =
(id)=>{

showToast(
"Added to favorites"
);

};

/* =====================================================
TOAST
===================================================== */

function showToast(message){

const toast =
document.createElement("div");

/* ========================================= */

toast.innerHTML =
message;

/* ========================================= */

toast.style.position =
"fixed";

toast.style.left =
"50%";

toast.style.bottom =
"110px";

toast.style.transform =
"translateX(-50%)";

toast.style.background =
"#111827";

toast.style.color =
"#FFD400";

toast.style.padding =
"16px 24px";

toast.style.borderRadius =
"18px";

toast.style.fontSize =
"14px";

toast.style.fontWeight =
"900";

toast.style.zIndex =
"99999";

toast.style.boxShadow =
"0 10px 30px rgba(0,0,0,0.18)";

/* ========================================= */

document.body.appendChild(
toast
);

/* ========================================= */

setTimeout(()=>{

toast.remove();

},2000);

}

/* =====================================================
SEARCH
===================================================== */

const searchInput =
document.querySelector(
".searchBar input"
);

/* ========================================= */

searchInput.addEventListener(
"input",
(e)=>{

const value =
e.target.value
.toLowerCase();

/* ========================================= */

const cards =
document.querySelectorAll(
".serviceCard"
);

/* ========================================= */

cards.forEach((card)=>{

const text =
card.innerText
.toLowerCase();

/* ========================================= */

if(
text.includes(value)
){

card.style.display =
"block";

}

else{

card.style.display =
"none";

}

});

}
);

/* =====================================================
LIVE OFFERS
===================================================== */

onSnapshot(

collection(db,"offers"),

(snapshot)=>{

console.log(
"Offers updated:",
snapshot.size
);

}

/* END */

);

/* =====================================================
LIVE NOTIFICATIONS
===================================================== */

onSnapshot(

collection(db,"notifications"),

(snapshot)=>{

const badge =
document.querySelector(
".badge"
);

/* ========================================= */

if(badge){

badge.innerHTML =
snapshot.size;

}

}

/* END */

);

/* =====================================================
ONLINE STATUS
===================================================== */

window.addEventListener(
"offline",
()=>{

showToast(
"Internet disconnected"
);

}
);

/* =====================================================
WELCOME
===================================================== */

showToast(
"Welcome to QuickPress 🚀"
);

/* =====================================================
READY
===================================================== */

console.log(
"QuickPress User Panel Active"
);
