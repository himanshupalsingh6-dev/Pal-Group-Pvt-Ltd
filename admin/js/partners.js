/* =========================================================
FILE : admin/js/partners.js
QUICKPRESS ENTERPRISE PARTNERS PANEL
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

const partnersGrid =
document.getElementById(
"partnersGrid"
);

const searchInput =
document.getElementById(
"searchInput"
);

const cityFilter =
document.getElementById(
"cityFilter"
);

const totalPartners =
document.getElementById(
"totalPartners"
);

const activePartners =
document.getElementById(
"activePartners"
);

const partnerOrders =
document.getElementById(
"partnerOrders"
);

const partnerRevenue =
document.getElementById(
"partnerRevenue"
);

/* =========================================================
DATA
========================================================= */

let allPartners = [];

/* =========================================================
REALTIME PARTNERS
========================================================= */

onSnapshot(

collection(db,"partners"),

(snapshot)=>{

allPartners = [];

let cities = new Set();

let active = 0;

let orders = 0;

let revenue = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const partner = {

id:docSnap.id,
...docSnap.data()

};

allPartners.push(partner);

/* ========================================= */

if(partner.city){

cities.add(partner.city);

}

/* ========================================= */

if(partner.active){

active++;

}

/* ========================================= */

orders +=
Number(partner.totalOrders || 0);

revenue +=
Number(partner.totalRevenue || 0);

});

/* ========================================= */

totalPartners.innerHTML =
allPartners.length;

activePartners.innerHTML =
active;

partnerOrders.innerHTML =
orders;

partnerRevenue.innerHTML =
`₹${revenue}`;

/* ========================================= */

loadCities([...cities]);

/* ========================================= */

renderPartners();

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
RENDER PARTNERS
========================================================= */

function renderPartners(){

partnersGrid.innerHTML = "";

/* ========================================= */

const search =
searchInput.value
.toLowerCase();

const selectedCity =
cityFilter.value;

/* ========================================= */

allPartners.forEach((partner)=>{

/* =====================================
SEARCH
===================================== */

if(
search &&
!(
(partner.name || "")
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
partner.city !== selectedCity
){

return;

}

/* =====================================
STATUS
===================================== */

const statusClass =
partner.active

?

"active"

:

"inactive";

const statusText =
partner.active

?

"Active"

:

"Inactive";

/* =====================================
CARD
===================================== */

const card = `

<div class="partnerCard">

<!-- TOP -->

<div class="partnerTop">

<div class="partnerInfo">

<div class="avatar">

${partner.name
?.charAt(0)
|| "P"}

</div>

<div>

<h3>

${partner.name || "Partner"}

</h3>

<p>

${partner.city || ""}

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

${partner.mobile || "--"}

</h4>

</div>

<div class="infoBox">

<span>
Orders
</span>

<h4>

${partner.totalOrders || 0}

</h4>

</div>

<div class="infoBox">

<span>
Revenue
</span>

<h4>

₹${partner.totalRevenue || 0}

</h4>

</div>

<div class="infoBox">

<span>
Commission
</span>

<h4>

₹${partner.commission || 0}

</h4>

</div>

<div class="infoBox">

<span>
Wallet
</span>

<h4>

₹${partner.wallet || 0}

</h4>

</div>

<div class="infoBox">

<span>
Area
</span>

<h4>

${partner.area || "--"}

</h4>

</div>

</div>

<!-- BUTTONS -->

<div class="btnGrid">

<button
class="btn viewBtn"
onclick="viewPartner('${partner.id}')">

View

</button>

<button
class="btn callBtn"
onclick="callPartner('${partner.mobile}')">

Call

</button>

<button
class="btn toggleBtn"
onclick="togglePartner(
'${partner.id}',
${partner.active}
)">

${partner.active ? "Disable" : "Enable"}

</button>

</div>

</div>

`;

partnersGrid.innerHTML += card;

});

}

/* =========================================================
SEARCH EVENTS
========================================================= */

searchInput.addEventListener(
"input",
renderPartners
);

cityFilter.addEventListener(
"change",
renderPartners
);

/* =========================================================
ADD PARTNER
========================================================= */

window.addPartner =
async()=>{

const name =
prompt(
"Enter Partner Name"
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

/* ========================================= */

await addDoc(

collection(db,"partners"),

{

name,
mobile,
city,
area,

wallet:0,
commission:0,

totalOrders:0,
totalRevenue:0,

active:true,

createdAt:
new Date()

}

);

alert(
"Partner Added"
);

};

/* =========================================================
VIEW PARTNER
========================================================= */

window.viewPartner =
(id)=>{

window.location.href =
`partner-view.html?id=${id}`;

};

/* =========================================================
CALL PARTNER
========================================================= */

window.callPartner =
(number)=>{

window.open(
`tel:${number}`
);

};

/* =========================================================
TOGGLE PARTNER
========================================================= */

window.togglePartner =
async(id,current)=>{

await updateDoc(

doc(db,"partners",id),

{

active:!current

}

);

};

/* =========================================================
DELETE PARTNER
========================================================= */

window.deletePartner =
async(id)=>{

const confirmDelete =
confirm(
"Delete Partner?"
);

if(!confirmDelete){

return;

}

await deleteDoc(

doc(db,"partners",id)

);

alert(
"Partner Deleted"
);

};
