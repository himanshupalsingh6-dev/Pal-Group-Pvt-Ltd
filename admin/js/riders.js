import { db }

from "../../firebase.js";

import {

collection,
addDoc,
onSnapshot,
doc,
updateDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* ========================================================= */

const ridersContainer =
document.getElementById(
"ridersContainer"
);

const totalRiders =
document.getElementById(
"totalRiders"
);

const onlineRiders =
document.getElementById(
"onlineRiders"
);

const busyRiders =
document.getElementById(
"busyRiders"
);

const totalDeliveries =
document.getElementById(
"totalDeliveries"
);

const monthlyEarnings =
document.getElementById(
"monthlyEarnings"
);

/* ========================================================= */

let allRiders = [];

/* =========================================================
PASSWORD
========================================================= */

window.generatePassword = ()=>{

const password =

"Rider@" +
Math.floor(
1000 + Math.random() * 9000
);

/* ========================================================= */

document.getElementById(
"riderPassword"
).value = password;

};

/* =========================================================
ADD RIDER
========================================================= */

window.addRider =
async()=>{

const rider = {

name:
document.getElementById(
"riderName"
).value,

phone:
document.getElementById(
"riderPhone"
).value,

email:
document.getElementById(
"riderEmail"
).value,

password:
document.getElementById(
"riderPassword"
).value,

city:
document.getElementById(
"riderCity"
).value,

area:
document.getElementById(
"riderArea"
).value,

vehicle:
document.getElementById(
"vehicleType"
).value,

vehicleNumber:
document.getElementById(
"vehicleNumber"
).value,

status:
document.getElementById(
"riderStatus"
).value,

completedOrders:0,

earnings:0,

createdAt:
Date.now()

};

/* ========================================================= */

await addDoc(

collection(db,"riders"),

rider

);

/* ========================================================= */

alert(
"Rider Added"
);

};

/* =========================================================
REALTIME
========================================================= */

onSnapshot(

collection(db,"riders"),

(snapshot)=>{

ridersContainer.innerHTML = "";

allRiders = [];

let online = 0;
let busy = 0;
let deliveries = 0;
let earnings = 0;

const cities = [];

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
rider.status === "busy" ||
rider.status === "delivery"
){
busy++;
}

deliveries +=
rider.completedOrders || 0;

earnings +=
rider.earnings || 0;

/* ========================================================= */

if(
rider.city &&
!cities.includes(rider.city)
){

cities.push(rider.city);

}

});

/* ========================================================= */

totalRiders.innerHTML =
allRiders.length;

onlineRiders.innerHTML =
online;

busyRiders.innerHTML =
busy;

totalDeliveries.innerHTML =
deliveries;

monthlyEarnings.innerHTML =
"₹" + earnings;

/* ========================================================= */

const cityFilter =
document.getElementById(
"cityFilter"
);

cityFilter.innerHTML =

`
<option value="">
All Cities
</option>
`;

/* ========================================================= */

cities.forEach(city=>{

cityFilter.innerHTML += `

<option value="${city}">
${city}
</option>

`;

});

/* ========================================================= */

renderRiders(allRiders);

}
);

/* =========================================================
RENDER
========================================================= */

function renderRiders(data){

ridersContainer.innerHTML = "";

/* ========================================================= */

data.forEach(item=>{

ridersContainer.innerHTML += `

<div class="tableRow">

<div>
${item.id.slice(0,6)}
</div>

<div>
${item.name || '-'}
</div>

<div>
${item.phone || '-'}
</div>

<div>

${item.city}

<br>

${item.area}

</div>

<div>

${item.vehicle}

<br>

${item.vehicleNumber}

</div>

<div>
${item.completedOrders || 0}
</div>

<div>

<div class="status ${item.status}">

${item.status}

</div>

</div>

<div class="actions">

<button
class="actionBtn viewBtn">

View

</button>

<button
class="actionBtn walletBtn">

Wallet

</button>

<button
class="actionBtn trackBtn">

Track

</button>

<button
class="actionBtn suspendBtn"
onclick="suspendRider('${item.id}')">

Suspend

</button>

</div>

</div>

`;

});

}

/* =========================================================
SUSPEND
========================================================= */

window.suspendRider =
async(id)=>{

await updateDoc(

doc(db,"riders",id),

{

status:"suspended"

}

);

};

/* =========================================================
FILTERS
========================================================= */

document.getElementById(
"searchInput"
).addEventListener(
"keyup",
filterRiders
);

document.getElementById(
"cityFilter"
).addEventListener(
"change",
filterRiders
);

document.getElementById(
"statusFilter"
).addEventListener(
"change",
filterRiders
);

document.getElementById(
"vehicleFilter"
).addEventListener(
"change",
filterRiders
);

/* ========================================================= */

function filterRiders(){

const search =

document.getElementById(
"searchInput"
).value.toLowerCase();

const city =

document.getElementById(
"cityFilter"
).value;

const status =

document.getElementById(
"statusFilter"
).value;

const vehicle =

document.getElementById(
"vehicleFilter"
).value;

/* ========================================================= */

const filtered =

allRiders.filter(item=>{

const matchSearch =

(item.name || '')
.toLowerCase()
.includes(search);

const matchCity =

city
?
item.city === city
:
true;

const matchStatus =

status
?
item.status === status
:
true;

const matchVehicle =

vehicle
?
item.vehicle === vehicle
:
true;

return (

matchSearch &&
matchCity &&
matchStatus &&
matchVehicle

);

});

/* ========================================================= */

renderRiders(filtered);

}

/* =========================================================
MAP
========================================================= */

const map =

L.map("map").setView(
[27.8176,78.6450],
12
);

/* ========================================================= */

L.tileLayer(

"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

{

attribution:"QuickPress"

}

).addTo(map);

/* ========================================================= */

L.marker(
[27.8176,78.6450]
).addTo(map);
