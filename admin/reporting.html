import { db }

from "../../firebase.js";

import {

collection,
addDoc,
onSnapshot,
doc,
deleteDoc,
updateDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
ELEMENTS
========================================================= */

const servicesContainer =
document.getElementById(
"servicesContainer"
);

const totalServices =
document.getElementById(
"totalServices"
);

const cityFilter =
document.getElementById(
"cityFilter"
);

/* ========================================================= */

let allServices = [];

/* =========================================================
ADD SERVICE
========================================================= */

window.addService =
async()=>{

const service = {

name:
document.getElementById(
"serviceName"
).value,

category:
document.getElementById(
"serviceCategory"
).value,

description:
document.getElementById(
"serviceDescription"
).value,

icon:
document.getElementById(
"serviceIcon"
).value,

city:
document.getElementById(
"serviceCity"
).value,

area:
document.getElementById(
"serviceArea"
).value,

price:Number(

document.getElementById(
"servicePrice"
).value

),

deliveryCharge:Number(

document.getElementById(
"deliveryCharge"
).value

),

minimumOrder:Number(

document.getElementById(
"minimumOrder"
).value

),

urgentCharge:Number(

document.getElementById(
"urgentCharge"
).value

),

status:
document.getElementById(
"serviceStatus"
).value,

createdAt:
Date.now()

};

/* ========================================================= */

await addDoc(

collection(db,"services"),

service

);

/* ========================================================= */

alert(
"Service Added"
);

};

/* =========================================================
REALTIME
========================================================= */

onSnapshot(

collection(db,"services"),

(snapshot)=>{

servicesContainer.innerHTML = "";

allServices = [];

let cities = [];

/* ========================================================= */

snapshot.forEach(docSnap=>{

const service =
docSnap.data();

service.id =
docSnap.id;

allServices.push(service);

/* ========================================================= */

if(!cities.includes(service.city)){

cities.push(service.city);

}

});

/* ========================================================= */

totalServices.innerHTML =
allServices.length;

/* ========================================================= */

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

renderServices(allServices);

}
);

/* =========================================================
RENDER
========================================================= */

function renderServices(data){

servicesContainer.innerHTML = "";

/* ========================================================= */

data.forEach(service=>{

servicesContainer.innerHTML += `

<div class="tableRow">

<div>

<div class="serviceIcon">

<i class="fa-solid ${service.icon}"></i>

</div>

</div>

<div>

<div style="
font-size:16px;
font-weight:900;
margin-bottom:8px;
">

${service.name}

</div>

<div style="
font-size:13px;
color:#6B7280;
">

${service.description}

</div>

</div>

<div>
${service.category}
</div>

<div>

${service.city}

<br>

${service.area}

</div>

<div>

₹${service.price}

</div>

<div>

<div class="status ${service.status}">
${service.status}
</div>

</div>

<div class="rowActions">

<button
class="rowBtn editBtn"
onclick="toggleStatus('${service.id}','${service.status}')">

Toggle

</button>

<button
class="rowBtn deleteBtn"
onclick="deleteService('${service.id}')">

Delete

</button>

</div>

</div>

`;

});

}

/* =========================================================
DELETE
========================================================= */

window.deleteService =
async(id)=>{

await deleteDoc(
doc(db,"services",id)
);

};

/* =========================================================
TOGGLE
========================================================= */

window.toggleStatus =
async(id,current)=>{

let next = "active";

/* ========================================================= */

if(current === "active"){

next = "inactive";

}else{

next = "active";

}

/* ========================================================= */

await updateDoc(

doc(db,"services",id),

{

status:next

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
filterServices
);

document.getElementById(
"categoryFilter"
).addEventListener(
"change",
filterServices
);

document.getElementById(
"cityFilter"
).addEventListener(
"change",
filterServices
);

document.getElementById(
"statusFilter"
).addEventListener(
"change",
filterServices
);

/* ========================================================= */

function filterServices(){

const search =

document.getElementById(
"searchInput"
).value.toLowerCase();

const category =

document.getElementById(
"categoryFilter"
).value;

const city =

document.getElementById(
"cityFilter"
).value;

const status =

document.getElementById(
"statusFilter"
).value;

/* ========================================================= */

const filtered =

allServices.filter(service=>{

const matchSearch =

service.name
.toLowerCase()
.includes(search);

const matchCategory =

category
?
service.category === category
:
true;

const matchCity =

city
?
service.city === city
:
true;

const matchStatus =

status
?
service.status === status
:
true;

return (

matchSearch &&
matchCategory &&
matchCity &&
matchStatus

);

});

/* ========================================================= */

renderServices(filtered);

}
