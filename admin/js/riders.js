/* =========================================================
FILE : admin/js/riders.js
QUICKPRESS ENTERPRISE RIDERS PANEL
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot,
addDoc,
doc,
updateDoc,
deleteDoc

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
text-align:center;
padding:30px;
">

<div>

<div
style="
font-size:80px;
margin-bottom:20px;
">

🖥️

</div>

<h1
style="
font-size:42px;
font-weight:900;
">

Desktop Only

</h1>

<p
style="
margin-top:12px;
font-size:16px;
line-height:1.7;
color:#D1D5DB;
">

QuickPress Admin Panel only works on Laptop/Desktop

</p>

</div>

</div>

`;

}

/* =========================================================
ELEMENTS
========================================================= */

const ridersGrid =
document.getElementById(
"ridersGrid"
);

const searchInput =
document.getElementById(
"searchInput"
);

const cityFilter =
document.getElementById(
"cityFilter"
);

const totalRiders =
document.getElementById(
"totalRiders"
);

const onlineRiders =
document.getElementById(
"onlineRiders"
);

const totalTrips =
document.getElementById(
"totalTrips"
);

const rejectedOrders =
document.getElementById(
"rejectedOrders"
);

const riderRevenue =
document.getElementById(
"riderRevenue"
);

/* =========================================================
DATA
========================================================= */

let allRiders = [];

/* =========================================================
REALTIME RIDERS
========================================================= */

onSnapshot(

collection(db,"riders"),

(snapshot)=>{

allRiders = [];

let cities = new Set();

let online = 0;

let trips = 0;

let rejected = 0;

let revenue = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const rider = {

id:docSnap.id,
...docSnap.data()

};

allRiders.push(rider);

/* ========================================= */

if(rider.city){

cities.add(rider.city);

}

/* ========================================= */

if(rider.online){

online++;

}

/* ========================================= */

trips +=
Number(rider.totalTrips || 0);

rejected +=
Number(rider.rejectedOrders || 0);

revenue +=
Number(rider.totalEarnings || 0);

});

/* ========================================= */

totalRiders.innerHTML =
allRiders.length;

onlineRiders.innerHTML =
online;

totalTrips.innerHTML =
trips;

rejectedOrders.innerHTML =
rejected;

riderRevenue.innerHTML =
`₹${revenue}`;

/* ========================================= */

loadCities([...cities]);

/* ========================================= */

renderRiders();

}

/* END */

);

/* =========================================================
LOAD CITIES
========================================================= */

function loadCities(cities){

const current =
cityFilter.value;

cityFilter.innerHTML = `

<option value="All">
All Cities
</option>

`;

cities.forEach((city)=>{

cityFilter.innerHTML += `

<option value="${city}">
${city}
</option>

`;

});

cityFilter.value =
current;

}

/* =========================================================
RENDER RIDERS
========================================================= */

function renderRiders(){

ridersGrid.innerHTML = "";

/* ========================================= */

const search =
searchInput.value
.toLowerCase();

const selectedCity =
cityFilter.value;

/* ========================================= */

allRiders.forEach((rider)=>{

/* =====================================
SEARCH
===================================== */

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

/* =====================================
CITY
===================================== */

if(
selectedCity !== "All"
&&
rider.city !== selectedCity
){

return;

}

/* =====================================
STATUS
===================================== */

const statusClass =
rider.online

?

"online"

:

"offline";

const statusText =
rider.online

?

"Online"

:

"Offline";

/* =====================================
CARD
===================================== */

const card = `

<div class="riderCard">

<!-- TOP -->

<div class="riderTop">

<div class="riderInfo">

<div class="avatar">

${rider.name
?.charAt(0)
|| "R"}

</div>

<div>

<h3>

${rider.name || "Rider"}

</h3>

<p>

${rider.city || ""}

</p>

</div>

</div>

<div class="status ${statusClass}">

${statusText}

</div>

</div>

<!-- INFO -->

<div class="infoGrid">

<div class="infoBox">

<span>
Mobile
</span>

<h4>

${rider.mobile || "--"}

</h4>

</div>

<div class="infoBox">

<span>
Trips
</span>

<h4>

${rider.totalTrips || 0}

</h4>

</div>

<div class="infoBox">

<span>
Rejected
</span>

<h4>

${rider.rejectedOrders || 0}

</h4>

</div>

<div class="infoBox">

<span>
Earnings
</span>

<h4>

₹${rider.totalEarnings || 0}

</h4>

</div>

<div class="infoBox">

<span>
Vehicle
</span>

<h4>

${rider.vehicleNumber || "--"}

</h4>

</div>

<div class="infoBox">

<span>
Area
</span>

<h4>

${rider.area || "--"}

</h4>

</div>

</div>

<!-- BUTTONS -->

<div class="btnGrid">

<button
class="btn viewBtn"
onclick="viewRider('${rider.id}')">

View

</button>

<button
class="btn callBtn"
onclick="callRider('${rider.mobile}')">

Call

</button>

<button
class="btn toggleBtn"
onclick="toggleRider(
'${rider.id}',
${rider.online}
)">

${rider.online ? "Offline" : "Online"}

</button>

</div>

</div>

`;

ridersGrid.innerHTML += card;

});

}

/* =========================================================
SEARCH EVENTS
========================================================= */

searchInput.addEventListener(
"input",
renderRiders
);

cityFilter.addEventListener(
"change",
renderRiders
);

/* =========================================================
ADD RIDER
========================================================= */

window.addRider =
async()=>{

const name =
prompt(
"Enter Rider Name"
);

if(!name){

return;

}

const mobile =
prompt(
"Enter Mobile"
);

const city =
prompt(
"Enter City"
);

const area =
prompt(
"Enter Area"
);

const vehicleNumber =
prompt(
"Enter Vehicle Number"
);

const aadhar =
prompt(
"Enter Aadhar Number"
);

const pan =
prompt(
"Enter PAN Number"
);

/* ========================================= */

await addDoc(

collection(db,"riders"),

{

name,
mobile,
city,
area,
vehicleNumber,
aadhar,
pan,

online:true,

totalTrips:0,
rejectedOrders:0,
totalEarnings:0,

createdAt:
new Date()

}

);

alert(
"Rider Added"
);

};

/* =========================================================
VIEW RIDER
========================================================= */

window.viewRider =
(id)=>{

window.location.href =
`rider-view.html?id=${id}`;

};

/* =========================================================
CALL RIDER
========================================================= */

window.callRider =
(number)=>{

window.open(
`tel:${number}`
);

};

/* =========================================================
TOGGLE RIDER
========================================================= */

window.toggleRider =
async(id,current)=>{

await updateDoc(

doc(db,"riders",id),

{

online:!current

}

);

};

/* =========================================================
DELETE RIDER
========================================================= */

window.deleteRider =
async(id)=>{

const confirmDelete =
confirm(
"Delete Rider?"
);

if(!confirmDelete){

return;

}

await deleteDoc(

doc(db,"riders",id)

);

alert(
"Rider Deleted"
);

};
