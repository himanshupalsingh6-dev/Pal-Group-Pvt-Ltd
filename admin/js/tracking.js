import { db }

from "../../firebase.js";

import {

collection,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* ========================================================= */

const ridersContainer =
document.getElementById(
"ridersContainer"
);

const onlineRiders =
document.getElementById(
"onlineRiders"
);

const busyRiders =
document.getElementById(
"busyRiders"
);

const activeOrders =
document.getElementById(
"activeOrders"
);

/* ========================================================= */

let allRiders = [];
let markers = [];

/* =========================================================
MAP
========================================================= */

const map =

L.map("map").setView(
[27.8176,78.6450],
13
);

/* ========================================================= */

L.tileLayer(

"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

{

attribution:"QuickPress"

}

).addTo(map);

/* =========================================================
REALTIME RIDERS
========================================================= */

onSnapshot(

collection(db,"riders"),

(snapshot)=>{

ridersContainer.innerHTML = "";

allRiders = [];

/* ========================================================= */

markers.forEach(marker=>{

map.removeLayer(marker);

});

/* ========================================================= */

markers = [];

let online = 0;
let busy = 0;

/* ========================================================= */

snapshot.forEach(docSnap=>{

const rider =
docSnap.data();

rider.id =
docSnap.id;

allRiders.push(rider);

/* ========================================================= */

if(rider.status === "online"){

online++;

}

if(
rider.status === "pickup" ||
rider.status === "delivery"
){

busy++;

}

/* =========================================================
RIDER CARD
========================================================= */

ridersContainer.innerHTML += `

<div
class="riderCard"
onclick="focusRider(
${rider.lat || 27.8176},
${rider.lng || 78.6450}
)">

<div class="riderTop">

<div class="riderInfo">

<img
src="${rider.photo || 'https://i.ibb.co/3SWQHfY/user.png'}"
class="riderImage">

<div>

<div class="riderName">

${rider.name || '-'}

</div>

<div class="riderArea">

${rider.city || '-'}
• ${rider.area || '-'}

</div>

</div>

</div>

<div class="status ${rider.status || 'online'}">

${rider.status || 'online'}

</div>

</div>

<div class="riderStats">

<div class="statBox">

<div class="statLabel">
Speed
</div>

<div class="statValue">

${rider.speed || 32}
km/h

</div>

</div>

<div class="statBox">

<div class="statLabel">
Battery
</div>

<div class="statValue">

${rider.battery || 80}%

</div>

</div>

<div class="statBox">

<div class="statLabel">
Orders
</div>

<div class="statValue">

${rider.activeOrders || 0}

</div>

</div>

<div class="statBox">

<div class="statLabel">
ETA
</div>

<div class="statValue">

4 Min

</div>

</div>

</div>

</div>

`;

/* =========================================================
MARKER
========================================================= */

const marker =

L.marker([
rider.lat || 27.8176,
rider.lng || 78.6450
])

.addTo(map)

.bindPopup(`

<div class="popupTitle">

${rider.name}

</div>

<div class="popupRow">

📞 ${rider.phone || '-'}

</div>

<div class="popupRow">

📍 ${rider.area || '-'}

</div>

<div class="popupRow">

🚴 Speed:
${rider.speed || 30} km/h

</div>

<div class="popupRow">

🔋 Battery:
${rider.battery || 80}%

</div>

<div class="popupRow">

💰 Earnings:
₹${rider.earnings || 0}

</div>

<div class="popupRow">

📦 Active Orders:
${rider.activeOrders || 0}

</div>

<div class="popupRow">

🕒 Updated:
Just now

</div>

<br>

<button
style="
width:100%;
height:42px;
border:none;
border-radius:12px;
background:#111827;
color:#fff;
font-weight:900;
cursor:pointer;
margin-bottom:8px;
">

Call Rider

</button>

<button
style="
width:100%;
height:42px;
border:none;
border-radius:12px;
background:#25D366;
color:#fff;
font-weight:900;
cursor:pointer;
margin-bottom:8px;
">

WhatsApp

</button>

<button
style="
width:100%;
height:42px;
border:none;
border-radius:12px;
background:#2563EB;
color:#fff;
font-weight:900;
cursor:pointer;
">

Assign Order

</button>

`);

/* ========================================================= */

markers.push(marker);

});

/* ========================================================= */

onlineRiders.innerHTML =
online;

busyRiders.innerHTML =
busy;

activeOrders.innerHTML =
busy + 3;

}
);

/* =========================================================
FOCUS RIDER
========================================================= */

window.focusRider =
(lat,lng)=>{

map.setView(
[lat,lng],
16
);

};

/* =========================================================
TRACK ALL
========================================================= */

window.trackAllRiders =
()=>{

map.setZoom(12);

};

/* =========================================================
REFRESH
========================================================= */

window.refreshTracking =
()=>{

location.reload();

};

/* =========================================================
NEAREST RIDER
========================================================= */

window.findNearestRider =
()=>{

if(markers[0]){

map.setView(
markers[0].getLatLng(),
16
);

markers[0]
.openPopup();

}

};

/* =========================================================
AUTO REFRESH
========================================================= */

setInterval(()=>{

console.log(
"Tracking Updated"
);

},5000);
