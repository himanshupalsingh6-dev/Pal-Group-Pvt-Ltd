/* =========================================================
FILE : admin/js/services.js
QUICKPRESS ENTERPRISE SERVICES PANEL
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

const servicesGrid =
document.getElementById(
"servicesGrid"
);

const searchInput =
document.getElementById(
"searchInput"
);

const totalServices =
document.getElementById(
"totalServices"
);

const activeServices =
document.getElementById(
"activeServices"
);

const inactiveServices =
document.getElementById(
"inactiveServices"
);

const serviceRevenue =
document.getElementById(
"serviceRevenue"
);

/* =========================================================
DATA
========================================================= */

let allServices = [];

/* =========================================================
REALTIME SERVICES
========================================================= */

onSnapshot(

collection(db,"services"),

(snapshot)=>{

allServices = [];

let active = 0;
let inactive = 0;

let revenue = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const service = {

id:docSnap.id,
...docSnap.data()

};

allServices.push(service);

/* ========================================= */

revenue +=
Number(service.price || 0);

/* ========================================= */

if(service.active){

active++;

}else{

inactive++;

}

});

/* ========================================= */

totalServices.innerHTML =
allServices.length;

activeServices.innerHTML =
active;

inactiveServices.innerHTML =
inactive;

serviceRevenue.innerHTML =
`₹${revenue}`;

/* ========================================= */

renderServices();

}

/* END */

);

/* =========================================================
RENDER SERVICES
========================================================= */

function renderServices(){

servicesGrid.innerHTML = "";

/* ========================================= */

const search =
searchInput.value
.toLowerCase();

/* ========================================= */

allServices.forEach((service)=>{

/* =====================================
SEARCH
===================================== */

if(
search &&
!(
service.name || "")
.toLowerCase()
.includes(search)
){

return;

}

/* =====================================
STATUS
===================================== */

const statusClass =
service.active

?

"active"

:

"inactive";

const statusText =
service.active

?

"Active"

:

"Inactive";

/* =====================================
ICON
===================================== */

const icon =
service.icon || "👕";

/* =====================================
CARD
===================================== */

const card = `

<div class="serviceCard">

<!-- TOP -->

<div class="serviceTop">

<div class="serviceIcon">

${icon}

</div>

<div class="status ${statusClass}">

${statusText}

</div>

</div>

<!-- INFO -->

<h3>

${service.name || "Service"}

</h3>

<p>

${service.description || "QuickPress Service"}

</p>

<!-- PRICE -->

<div class="priceGrid">

<div class="priceBox">

<span>
Price
</span>

<h4>

₹${service.price || 0}

</h4>

</div>

<div class="priceBox">

<span>
Category
</span>

<h4>

${service.category || "Laundry"}

</h4>

</div>

</div>

<!-- BUTTONS -->

<div class="btnGrid">

<button
class="btn editBtn"
onclick="editService('${service.id}')">

Edit

</button>

<button
class="btn toggleBtn"
onclick="toggleService(
'${service.id}',
${service.active}
)">

${service.active ? "Disable" : "Enable"}

</button>

<button
class="btn deleteBtn"
onclick="deleteService('${service.id}')">

Delete

</button>

</div>

</div>

`;

servicesGrid.innerHTML += card;

});

}

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"input",
renderServices
);

/* =========================================================
ADD SERVICE
========================================================= */

window.addService =
async()=>{

const name =
prompt(
"Enter Service Name"
);

if(!name){

return;

}

const price =
prompt(
"Enter Price"
);

const category =
prompt(
"Enter Category"
);

const icon =
prompt(
"Enter Icon Emoji"
);

const description =
prompt(
"Enter Description"
);

/* ========================================= */

await addDoc(

collection(db,"services"),

{

name,
price:Number(price || 0),
category,
icon,
description,

active:true,

createdAt:
new Date()

}

);

alert(
"Service Added"
);

};

/* =========================================================
EDIT SERVICE
========================================================= */

window.editService =
async(id)=>{

const name =
prompt(
"Enter New Name"
);

const price =
prompt(
"Enter New Price"
);

if(!name){

return;

}

await updateDoc(

doc(db,"services",id),

{

name,
price:Number(price || 0)

}

);

alert(
"Service Updated"
);

};

/* =========================================================
TOGGLE SERVICE
========================================================= */

window.toggleService =
async(id,current)=>{

await updateDoc(

doc(db,"services",id),

{

active:!current

}

);

};

/* =========================================================
DELETE SERVICE
========================================================= */

window.deleteService =
async(id)=>{

const confirmDelete =
confirm(
"Delete Service?"
);

if(!confirmDelete){

return;

}

await deleteDoc(

doc(db,"services",id)

);

alert(
"Service Deleted"
);

};
