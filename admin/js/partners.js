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

const partnersContainer =
document.getElementById(
"partnersContainer"
);

const totalPartners =
document.getElementById(
"totalPartners"
);

const activePartners =
document.getElementById(
"activePartners"
);

const pendingKyc =
document.getElementById(
"pendingKyc"
);

const monthlyRevenue =
document.getElementById(
"monthlyRevenue"
);

/* ========================================================= */

let allPartners = [];

/* =========================================================
PASSWORD
========================================================= */

window.generatePassword = ()=>{

const password =

"QP@" +
Math.floor(
1000 + Math.random() * 9000
);

/* ========================================================= */

document.getElementById(
"partnerPassword"
).value = password;

};

/* =========================================================
ADD PARTNER
========================================================= */

window.addPartner =
async()=>{

const partner = {

name:
document.getElementById(
"partnerName"
).value,

phone:
document.getElementById(
"partnerPhone"
).value,

email:
document.getElementById(
"partnerEmail"
).value,

password:
document.getElementById(
"partnerPassword"
).value,

shopName:
document.getElementById(
"shopName"
).value,

city:
document.getElementById(
"partnerCity"
).value,

area:
document.getElementById(
"partnerArea"
).value,

service:
document.getElementById(
"partnerService"
).value,

commission:
document.getElementById(
"partnerCommission"
).value,

status:
document.getElementById(
"partnerStatus"
).value,

earnings:0,

createdAt:
Date.now()

};

/* ========================================================= */

await addDoc(

collection(db,"partners"),

partner

);

/* ========================================================= */

alert(
"Partner Added"
);

};

/* =========================================================
REALTIME
========================================================= */

onSnapshot(

collection(db,"partners"),

(snapshot)=>{

partnersContainer.innerHTML = "";

allPartners = [];

let active = 0;
let pending = 0;
let revenue = 0;

const cities = [];

/* ========================================================= */

snapshot.forEach(docSnap=>{

const partner =
docSnap.data();

partner.id =
docSnap.id;

allPartners.push(partner);

/* ========================================================= */

if(partner.status === "active"){
active++;
}

if(partner.status === "pending"){
pending++;
}

revenue +=
partner.earnings || 0;

/* ========================================================= */

if(
partner.city &&
!cities.includes(partner.city)
){

cities.push(partner.city);

}

});

/* ========================================================= */

totalPartners.innerHTML =
allPartners.length;

activePartners.innerHTML =
active;

pendingKyc.innerHTML =
pending;

monthlyRevenue.innerHTML =
"₹" + revenue;

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

renderPartners(allPartners);

}
);

/* =========================================================
RENDER
========================================================= */

function renderPartners(data){

partnersContainer.innerHTML = "";

/* ========================================================= */

data.forEach(item=>{

partnersContainer.innerHTML += `

<div class="tableRow">

<div>
${item.id.slice(0,6)}
</div>

<div>
${item.shopName || '-'}
</div>

<div>
${item.name || '-'}
</div>

<div>

${item.city}

<br>

${item.area}

</div>

<div>
${item.service}
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
class="actionBtn editBtn">

Edit

</button>

<button
class="actionBtn walletBtn">

Wallet

</button>

<button
class="actionBtn suspendBtn"
onclick="suspendPartner('${item.id}')">

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

window.suspendPartner =
async(id)=>{

await updateDoc(

doc(db,"partners",id),

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
filterPartners
);

document.getElementById(
"cityFilter"
).addEventListener(
"change",
filterPartners
);

document.getElementById(
"serviceFilter"
).addEventListener(
"change",
filterPartners
);

document.getElementById(
"statusFilter"
).addEventListener(
"change",
filterPartners
);

/* ========================================================= */

function filterPartners(){

const search =

document.getElementById(
"searchInput"
).value.toLowerCase();

const city =

document.getElementById(
"cityFilter"
).value;

const service =

document.getElementById(
"serviceFilter"
).value;

const status =

document.getElementById(
"statusFilter"
).value;

/* ========================================================= */

const filtered =

allPartners.filter(item=>{

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

const matchService =

service
?
item.service === service
:
true;

const matchStatus =

status
?
item.status === status
:
true;

return (

matchSearch &&
matchCity &&
matchService &&
matchStatus

);

});

/* ========================================================= */

renderPartners(filtered);

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
