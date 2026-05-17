/* =========================================================
FILE : admin/js/heatmap.js
QUICKPRESS HEATMAP ANALYTICS
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
AUTH CHECK
========================================================= */

const adminLogin =
localStorage.getItem(
"quickpress_admin"
);

if(adminLogin !== "true"){

window.location.href =
"login.html";

}

/* =========================================================
ELEMENTS
========================================================= */

const totalOrders =
document.getElementById(
"totalOrders"
);

const hotZones =
document.getElementById(
"hotZones"
);

const activeRiders =
document.getElementById(
"activeRiders"
);

const cityContainer =
document.getElementById(
"cityContainer"
);

/* =========================================================
MAP INIT
========================================================= */

const map = L.map(
"heatmap"
).setView(
[28.6139,77.2090],
6
);

/* =========================================================
MAP TILE
========================================================= */

L.tileLayer(

"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

{

attribution:
"&copy; OpenStreetMap"

}

).addTo(map);

/* =========================================================
DATA
========================================================= */

let cityOrders = {};

let total = 0;

let hot = 0;

/* =========================================================
LIVE ORDERS
========================================================= */

onSnapshot(

collection(db,"orders"),

(snapshot)=>{

cityOrders = {};

total = 0;

hot = 0;

cityContainer.innerHTML = "";

/* ========================================= */

snapshot.forEach((docSnap)=>{

const order =
docSnap.data();

/* ========================================= */

const city =
order.city || "Unknown";

/* ========================================= */

if(!cityOrders[city]){

cityOrders[city] = 0;

}

/* ========================================= */

cityOrders[city]++;

/* ========================================= */

total++;

});

/* ========================================= */

Object.keys(cityOrders)
.forEach((city)=>{

const orders =
cityOrders[city];

/* ========================================= */

let badgeClass =
"low";

let level =
"LOW";

/* ========================================= */

if(orders >= 20){

badgeClass =
"hot";

level = "HOT";

hot++;

}

else if(orders >= 10){

badgeClass =
"medium";

level = "MEDIUM";

}

/* ========================================= */

renderCity(
city,
orders,
level,
badgeClass
);

/* =========================================
DUMMY COORDS
========================================= */

const lat =
28 + Math.random() * 5;

const lng =
77 + Math.random() * 5;

/* ========================================= */

L.circle(

[lat,lng],

{

color:
orders >= 20
? "red"
: orders >= 10
? "orange"
: "green",

fillColor:
orders >= 20
? "red"
: orders >= 10
? "orange"
: "green",

fillOpacity:0.4,

radius:
orders * 400

}

)

.addTo(map)

.bindPopup(

`

<b>${city}</b>

<br>

Orders : ${orders}

<br>

Zone : ${level}

`

);

});

/* ========================================= */

totalOrders.innerHTML =
total;

hotZones.innerHTML =
hot;

}

/* END */

);

/* =========================================================
LIVE RIDERS
========================================================= */

onSnapshot(

collection(db,"riders"),

(snapshot)=>{

let active = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const rider =
docSnap.data();

/* ========================================= */

if(
rider.status === "Available"
||
rider.status === "On Delivery"
){

active++;

}

});

/* ========================================= */

activeRiders.innerHTML =
active;

}

/* END */

);

/* =========================================================
RENDER CITY
========================================================= */

function renderCity(
city,
orders,
level,
badgeClass
){

const row = `

<div class="cityItem">

<div>

${city}

</div>

<div style="
display:flex;
align-items:center;
gap:12px;
">

<div>

${orders} Orders

</div>

<div class="badge ${badgeClass}">

${level}

</div>

</div>

</div>

`;

cityContainer.innerHTML += row;

}

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Heatmap Active"
);
