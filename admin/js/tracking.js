/* =========================================================
FILE : admin/js/tracking.js
QUICKPRESS ENTERPRISE LIVE TRACKING SYSTEM
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
OPEN ROUTE API
========================================================= */

const ORS_API_KEY =
"eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImZiZTAzNDcwNWY4NjQ0Mjg4ZmJmYTVkMzE0NzIzNWQxIiwiaCI6Im11cm11cjY0In0=";

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
DESKTOP ONLY
========================================================= */

const isMobile =
/Android|iPhone|iPad|iPod/i
.test(
navigator.userAgent
);

if(
window.innerWidth < 1024
||
isMobile
){

document.body.innerHTML = `

<div
style="
height:100vh;
display:flex;
align-items:center;
justify-content:center;
background:#111827;
color:white;
font-family:Inter,sans-serif;
">

<div style="text-align:center;">

<div style="
font-size:90px;
margin-bottom:20px;
">

🖥️

</div>

<h1 style="
font-size:42px;
font-weight:900;
margin-bottom:10px;
">

Desktop Only

</h1>

<p style="
font-size:15px;
color:#D1D5DB;
">

QuickPress Admin Panel only works on Desktop

</p>

</div>

</div>

`;

}

/* =========================================================
ELEMENTS
========================================================= */

const riderList =
document.getElementById(
"riderList"
);

const searchInput =
document.getElementById(
"searchInput"
);

const liveOrder =
document.getElementById(
"liveOrder"
);

const liveEta =
document.getElementById(
"liveEta"
);

const liveCity =
document.getElementById(
"liveCity"
);

const liveSpeed =
document.getElementById(
"liveSpeed"
);

/* =========================================================
MAP INIT
========================================================= */

const map = L.map(
'map'
).setView(
[28.6139,77.2090],
12
);

/* =========================================================
MAP TILES
========================================================= */

L.tileLayer(

'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

{

attribution:
'© OpenStreetMap contributors'

}

).addTo(map);

/* =========================================================
DATA
========================================================= */

let allRiders = [];

let markers = {};

let selectedRider = null;

let routeLine = null;

/* =========================================================
LOAD RIDERS
========================================================= */

onSnapshot(

collection(db,"riders"),

(snapshot)=>{

riderList.innerHTML = "";

allRiders = [];

/* ========================================= */

snapshot.forEach((docSnap)=>{

const rider = {

id:docSnap.id,
...docSnap.data()

};

allRiders.push(rider);

/* =========================================
MARKER
========================================= */

updateMarker(rider);

/* =========================================
CARD
========================================= */

renderRider(rider);

});

}

/* END */

);

/* =========================================================
RENDER RIDER
========================================================= */

function renderRider(rider){

const search =
searchInput.value
.toLowerCase();

/* ========================================= */

if(
search &&
!(
(rider.name || "")
.toLowerCase()
.includes(search)
)
){

return;

}

/* ========================================= */

const html = `

<div
class="riderCard"
onclick="focusRider('${rider.id}')">

<div class="riderLeft">

<div class="avatar">

${(rider.name || "R")
.charAt(0)
.toUpperCase()}

<div class="onlineDot"></div>

</div>

<div class="riderInfo">

<h3>

${rider.name || "Rider"}

</h3>

<p>

${rider.city || "Unknown City"}

</p>

</div>

</div>

<div class="status online">

ONLINE

</div>

</div>

`;

riderList.innerHTML += html;

}

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"input",
()=>{

riderList.innerHTML = "";

allRiders.forEach((rider)=>{

renderRider(rider);

});

});

/* =========================================================
UPDATE MARKER
========================================================= */

function updateMarker(rider){

const lat =
rider.lat || 28.6139;

const lng =
rider.lng || 77.2090;

/* ========================================= */

if(markers[rider.id]){

markers[rider.id]
.setLatLng([lat,lng]);

}else{

const marker =
L.marker([lat,lng])

.addTo(map)

.bindPopup(`

<b>
${rider.name || "Rider"}
</b>

<br>

${rider.city || ""}

`);

markers[rider.id] =
marker;

}

}

/* =========================================================
FOCUS RIDER
========================================================= */

window.focusRider =
async(id)=>{

selectedRider =
allRiders.find(
(r)=>r.id === id
);

if(!selectedRider){

return;

}

/* ========================================= */

const lat =
selectedRider.lat || 28.6139;

const lng =
selectedRider.lng || 77.2090;

/* ========================================= */

map.flyTo(
[lat,lng],
15
);

/* ========================================= */

liveOrder.innerHTML =
selectedRider.currentOrder
|| "No Active Order";

liveEta.innerHTML =
selectedRider.eta
|| "15 Min";

liveCity.innerHTML =
selectedRider.city
|| "--";

liveSpeed.innerHTML =
`${selectedRider.speed || 0} km/h`;

/* ========================================= */

drawRoute(
lat,
lng
);

};

/* =========================================================
DRAW ROUTE
========================================================= */

async function drawRoute(
startLat,
startLng
){

/* =========================================
DEMO DESTINATION
========================================= */

const endLat = 28.7041;
const endLng = 77.1025;

/* ========================================= */

try{

const response =
await fetch(

`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${startLng},${startLat}&end=${endLng},${endLat}`

);

const data =
await response.json();

/* ========================================= */

const coordinates =
data.features[0]
.geometry.coordinates;

/* ========================================= */

const route =
coordinates.map(

(coord)=>[
coord[1],
coord[0]
]

);

/* ========================================= */

if(routeLine){

map.removeLayer(routeLine);

}

/* ========================================= */

routeLine =
L.polyline(route,{

weight:6

}).addTo(map);

/* ========================================= */

}catch(error){

console.log(
"Route Error",
error
);

}

}

/* =========================================================
LIVE MOVEMENT
========================================================= */

setInterval(()=>{

allRiders.forEach((rider)=>{

if(
markers[rider.id]
&&
rider.online
){

const current =
markers[rider.id]
.getLatLng();

/* =====================================
DEMO MOVEMENT
===================================== */

const newLat =
current.lat +
((Math.random()-0.5)*0.001);

const newLng =
current.lng +
((Math.random()-0.5)*0.001);

/* =====================================
MOVE
===================================== */

markers[rider.id]
.setLatLng([
newLat,
newLng
]);

}

});

},5000);

/* =========================================================
AUTO CENTER
========================================================= */

window.autoCenter =
()=>{

if(!selectedRider){

return;

}

const marker =
markers[selectedRider.id];

if(marker){

map.flyTo(
marker.getLatLng(),
15
);

}

};

/* =========================================================
LIVE STATUS
========================================================= */

console.log(
"QuickPress Live Tracking Active"
);
