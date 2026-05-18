/* =========================================================
FILE : user/index.js
QUICKPRESS PREMIUM HOME
REALTIME FIREBASE CONNECTED
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot,
query,
orderBy,
limit

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

const profileBtn =
document.querySelector(
".profileBtn"
);

const searchInput =
document.querySelector(
".searchLeft input"
);

/* =====================================================
USER DATA
===================================================== */

const userName =

localStorage.getItem(
"quickpress_user_name"
)

||

"Himanshu";

/* ========================================= */

const firstLetter =
userName.charAt(0)
.toUpperCase();

/* ========================================= */

profileBtn.innerHTML =
firstLetter;

/* =====================================================
LIVE SERVICES
===================================================== */

const servicesQuery =

query(

collection(
db,
"services"
),

orderBy(
"createdAt",
"desc"
),

limit(8)

);

/* ========================================= */

onSnapshot(

servicesQuery,

(snapshot)=>{

serviceGrid.innerHTML = "";

/* ========================================= */

if(snapshot.empty){

serviceGrid.innerHTML = `

<div
style="
grid-column:1/-1;
padding:80px;
text-align:center;
font-size:22px;
font-weight:800;
color:#666;
">

No services available

</div>

`;

return;

}

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

<!-- FAVORITE -->

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
`${name} added to cart`
);

};

/* =====================================================
FAVORITES
===================================================== */

window.toggleFavorite =
(id)=>{

showToast(
"Added to favorites ❤️"
);

};

/* =====================================================
SEARCH
===================================================== */

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
TOAST
===================================================== */

function showToast(message){

const toast =
document.createElement(
"div"
);

/* ========================================= */

toast.innerHTML =
message;

/* ========================================= */

toast.style.position =
"fixed";

toast.style.bottom =
"120px";

toast.style.left =
"50%";

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
LIVE NOTIFICATIONS
===================================================== */

onSnapshot(

collection(
db,
"notifications"
),

(snapshot)=>{

console.log(
"Notifications:",
snapshot.size
);

}

/* END */

);

/* =====================================================
LIVE OFFERS
===================================================== */

onSnapshot(

collection(
db,
"offers"
),

(snapshot)=>{

console.log(
"Offers:",
snapshot.size
);

}

/* END */

);

/* =====================================================
QUICK MODE
===================================================== */

const switchBtn =
document.querySelector(
".switch"
);

/* ========================================= */

let quickMode =
true;

/* ========================================= */

switchBtn.addEventListener(
"click",
()=>{

quickMode = !quickMode;

/* ========================================= */

if(quickMode){

switchBtn.style.background =
"#16A34A";

showToast(
"Quick Mode ON ⚡"
);

}

else{

switchBtn.style.background =
"#D1D5DB";

showToast(
"Quick Mode OFF"
);

}

}
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
`Welcome ${userName} 🚀`
);

/* =====================================================
READY
===================================================== */

console.log(
"QuickPress Premium Home Ready"
);
