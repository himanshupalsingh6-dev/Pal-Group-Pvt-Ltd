/* =========================================================
FILE : admin/js/tracking.js
QUICKPRESS ADMIN LIVE TRACKING
========================================================= */

import { db }

from "../../firebase.js";

import {

collection,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
MAP
========================================================= */

const map =
L.map("map")
.setView([27.4924,78.1234],12);

/* =========================================================
MAP LAYER
========================================================= */

L.tileLayer(

"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

{

attribution:
"&copy; OpenStreetMap"

}

).addTo(map);

/* =========================================================
GLOBAL
========================================================= */

const ridersList =
document.getElementById(
"ridersList"
);

const riderMarkers = {};

/* =========================================================
LOAD TRACKING
========================================================= */

onSnapshot(

collection(db,"tracking"),

(snapshot)=>{

ridersList.innerHTML = "";

/* ========================================================= */

let onlineCount = 0;

/* ========================================================= */

snapshot.forEach(docSnap=>{

const data =
docSnap.data();

/* ========================================================= */

onlineCount++;

/* ========================================================= */

const lat =
data.lat || 27.4924;

const lng =
data.lng || 78.1234;

/* ========================================================= */

if(riderMarkers[docSnap.id]){

riderMarkers[docSnap.id]
.setLatLng([lat,lng]);

}else{

const marker =
L.marker([lat,lng])

.addTo(map)

.bindPopup(

`

<b>${data.riderName}</b>

<br>

${data.status}

`

);

riderMarkers[docSnap.id] =
marker;

}

/* =========================================================
RIDER CARD
========================================================= */

ridersList.innerHTML += `

<div class="riderCard">

<div class="riderTop">

<div class="riderLeft">

<img
src="${data.image || 'https://i.ibb.co/3SWQHfY/user.png'}"
class="riderImage">

<div class="riderInfo">

<h3>
${data.riderName || "Rider"}
</h3>

<p>
${data.riderPhone || ""}
</p>

</div>

</div>

<div class="status">

${data.status || "Online"}

</div>

</div>

<div class="riderBottom">

<div class="infoBox">

<h5>
Order
</h5>

<h4>
${data.orderId || "QP102"}
</h4>

</div>

<div class="infoBox">

<h5>
ETA
</h5>

<h4>
${data.eta || "12 Min"}
</h4>

</div>

<div class="infoBox">

<h5>
Speed
</h5>

<h4>
${data.speed || 30} km/h
</h4>

</div>

<div class="infoBox">

<h5>
City
</h5>

<h4>
${data.city || "Kasganj"}
</h4>

</div>

</div>

</div>

`;

});

/* =========================================================
STATS
========================================================= */

document.getElementById(
"onlineRiders"
).innerHTML = onlineCount;

document.getElementById(
"activeOrders"
).innerHTML = onlineCount;

document.getElementById(
"deliveredOrders"
).innerHTML =
Math.floor(
onlineCount * 3
);

}
);
