/* =========================================================
FILE : admin/js/franchise.js
QUICKPRESS FRANCHISE MANAGEMENT
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
query,
orderBy,
onSnapshot,
addDoc,
updateDoc,
doc

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

const franchiseContainer =
document.getElementById(
"franchiseContainer"
);

const totalFranchise =
document.getElementById(
"totalFranchise"
);

const activeFranchise =
document.getElementById(
"activeFranchise"
);

const monthlyRevenue =
document.getElementById(
"monthlyRevenue"
);

const pendingFranchise =
document.getElementById(
"pendingFranchise"
);

/* =========================================================
REALTIME FRANCHISE
========================================================= */

onSnapshot(

query(
collection(db,"franchise"),
orderBy("createdAt","desc")
),

(snapshot)=>{

franchiseContainer.innerHTML = "";

/* ========================================= */

let total = 0;
let active = 0;
let pending = 0;
let revenue = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const franchise = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

total++;

revenue +=
Number(
franchise.revenue || 0
);

/* ========================================= */

if(franchise.status === "Pending"){

pending++;

}

if(franchise.status === "Active"){

active++;

}

/* ========================================= */

renderFranchise(
franchise
);

});

/* ========================================= */

totalFranchise.innerHTML =
total;

activeFranchise.innerHTML =
active;

pendingFranchise.innerHTML =
pending;

monthlyRevenue.innerHTML =
`₹${revenue}`;

/* END */

});

/* =========================================================
RENDER FRANCHISE
========================================================= */

function renderFranchise(
franchise
){

let badgeClass =
"active";

/* ========================================= */

if(franchise.status === "Pending"){

badgeClass = "pending";

}

if(franchise.status === "Closed"){

badgeClass = "closed";

}

/* ========================================= */

const row = `

<div class="franchiseRow">

<!-- NAME -->

<div>

<b>

${franchise.name || "--"}

</b>

<br>

${franchise.owner || "--"}

</div>

<!-- CITY -->

<div>

${franchise.city || "--"}

</div>

<!-- ORDERS -->

<div>

${franchise.orders || 0}

</div>

<!-- REVENUE -->

<div>

₹${franchise.revenue || 0}

</div>

<!-- STATUS -->

<div>

<div class="badge ${badgeClass}">

${franchise.status || "Active"}

</div>

</div>

<!-- ACTION -->

<div>

<button
class="actionBtn"
onclick="updateFranchise('${franchise.id}')">

Update

</button>

</div>

</div>

`;

franchiseContainer.innerHTML += row;

}

/* =========================================================
ADD FRANCHISE
========================================================= */

window.addFranchise =
async()=>{

const name =
prompt(
"Franchise Name"
);

if(!name){

return;

}

/* ========================================= */

const owner =
prompt(
"Owner Name"
);

const city =
prompt(
"City"
);

const revenue =
prompt(
"Revenue"
);

/* ========================================= */

await addDoc(

collection(
db,
"franchise"
),

{

name,
owner,
city,

orders:0,

revenue:
Number(revenue),

status:"Pending",

createdAt:
new Date()

}

);

/* ========================================= */

alert(
"Franchise Added"
);

};

/* =========================================================
UPDATE FRANCHISE
========================================================= */

window.updateFranchise =
async(id)=>{

const status =
prompt(
"Update Status : Active / Pending / Closed"
);

if(!status){

return;

}

/* ========================================= */

await updateDoc(

doc(
db,
"franchise",
id
),

{

status

}

);

/* ========================================= */

alert(
"Franchise Updated"
);

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Franchise System Active"
);
