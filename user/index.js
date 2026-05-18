/* =========================================================
FILE : user/index.js
QUICKPRESS USER HOME
REALTIME FIREBASE SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
USER DATA
========================================================= */

const userName =
localStorage.getItem(
"quickpress_user_name"
)
||
"QuickPress User";

const userCity =
localStorage.getItem(
"quickpress_user_city"
)
||
"Kasganj";

/* =========================================================
ELEMENTS
========================================================= */

const userNameElement =
document.getElementById(
"userName"
);

const userCityElement =
document.getElementById(
"userCity"
);

const servicesGrid =
document.getElementById(
"servicesGrid"
);

/* =========================================================
PROFILE DATA
========================================================= */

userNameElement.innerHTML =
userName;

userCityElement.innerHTML =
userCity;

/* =========================================================
LIVE SERVICES
========================================================= */

onSnapshot(

collection(db,"services"),

(snapshot)=>{

servicesGrid.innerHTML = "";

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

/* =========================================================
RENDER SERVICE
========================================================= */

function renderService(
service
){

const card = `

<div class="serviceCard">

<!-- IMAGE -->

<div class="serviceImage">

${service.icon || "🧺"}

</div>

<!-- TITLE -->

<h3>

${service.name || "Laundry"}

</h3>

<!-- DESC -->

<p>

${service.description || "Premium laundry service"}

</p>

<!-- PRICE -->

<div class="priceRow">

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

+

</button>

</div>

</div>

`;

servicesGrid.innerHTML += card;

}

/* =========================================================
ADD TO CART
========================================================= */

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

/* =========================================================
TOAST
========================================================= */

function showToast(message){

const toast =
document.createElement("div");

/* ========================================= */

toast.innerHTML =
message;

/* ========================================= */

toast.style.position =
"fixed";

toast.style.bottom =
"110px";

toast.style.left =
"50%";

toast.style.transform =
"translateX(-50%)";

toast.style.background =
"#111";

toast.style.color =
"#FFD000";

toast.style.padding =
"16px 24px";

toast.style.borderRadius =
"18px";

toast.style.fontSize =
"14px";

toast.style.fontWeight =
"800";

toast.style.zIndex =
"9999";

/* ========================================= */

document.body.appendChild(
toast
);

/* ========================================= */

setTimeout(()=>{

toast.remove();

},2000);

}

/* =========================================================
LIVE SEARCH
========================================================= */

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

/* =========================================================
ONLINE / OFFLINE
========================================================= */

window.addEventListener(
"offline",
()=>{

alert(
"Internet disconnected"
);

}
);

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress User Home Active"
);
