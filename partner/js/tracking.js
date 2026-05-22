/* =========================================================
FILE : partner/js/tracking.js
PARTNER LIVE TRACKING
========================================================= */

import { db }

from "../../firebase.js";

import {

collection,
query,
where,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
AUTH
========================================================= */

const partner =

JSON.parse(

localStorage.getItem(
"partnerSession"
)

);

/* ========================================================= */

if(!partner){

window.location.href =
"login.html";

}

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
ELEMENTS
========================================================= */

const ordersContainer =
document.getElementById(
"ordersContainer"
);

const riderPanel =
document.getElementById(
"riderPanel"
);

/* =========================================================
MARKERS
========================================================= */

const riderMarkers = {};

/* =========================================================
LOAD LIVE ORDERS
========================================================= */

const trackingQuery =

query(

collection(db,"orders"),

where(
"partnerId",
"==",
partner.uid
),

where(
"liveTracking",
"==",
true
)

);

/* ========================================================= */

onSnapshot(
trackingQuery,
(snapshot)=>{

ordersContainer.innerHTML = "";

/* ========================================================= */

snapshot.forEach(docSnap=>{

const order =
docSnap.data();

/* ========================================================= */

ordersContainer.innerHTML += `

<div class="orderCard">

<div class="orderTop">

<div class="orderId">

#${order.orderId}

</div>

<div class="orderStatus">

${order.status}

</div>

</div>

<div class="customerInfo">

<h4>
${order.customerName}
</h4>

<p>
📞 ${order.phone}
</p>

<p>
📍 ${order.address}
</p>

</div>

<div class="actionButtons">

<button
class="actionBtn viewBtn">

View Details

</button>

<button
class="actionBtn trackBtn"
onclick="trackRider(
'${order.riderId}',
${order.riderLat},
${order.riderLng},
'${order.riderName}',
'${order.riderPhone}',
'${order.vehicleName}',
'${order.vehicleNumber}',
'${order.riderImage}',
'${order.status}',
'${order.eta}',
'${order.speed}'
)">

Track Rider

</button>

</div>

</div>

`;

});

});

/* =========================================================
TRACK RIDER
========================================================= */

window.trackRider = (

riderId,
lat,
lng,
name,
phone,
vehicle,
vehicleNo,
image,
status,
eta,
speed

)=>{

/* ========================================================= */

riderPanel.style.display =
"block";

/* =========================================================
SET DATA
========================================================= */

document.getElementById(
"riderName"
).innerHTML = name;

document.getElementById(
"riderPhone"
).innerHTML = phone;

document.getElementById(
"vehicleName"
).innerHTML = vehicle;

document.getElementById(
"vehicleNumber"
).innerHTML = vehicleNo;

document.getElementById(
"deliveryStatus"
).innerHTML = status;

document.getElementById(
"etaText"
).innerHTML = eta;

document.getElementById(
"riderSpeed"
).innerHTML = speed + " km/h";

document.getElementById(
"riderImage"
).src = image;

/* =========================================================
CALL
========================================================= */

document.getElementById(
"callBtn"
).onclick = ()=>{

window.location.href =
`tel:${phone}`;

};

/* =========================================================
MARKER
========================================================= */

if(riderMarkers[riderId]){

map.removeLayer(
riderMarkers[riderId]
);

}

/* ========================================================= */

const marker =
L.marker([lat,lng])

.addTo(map)

.bindPopup(

`

<b>${name}</b>

<br>

${vehicle}

<br>

${vehicleNo}

`

)

.openPopup();

/* ========================================================= */

riderMarkers[riderId] =
marker;

/* ========================================================= */

map.setView(
[lat,lng],
15
);

};
