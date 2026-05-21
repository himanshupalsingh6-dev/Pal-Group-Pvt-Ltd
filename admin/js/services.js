/* =========================================================
FILE : js/services.js
ADVANCE REALTIME SERVICES SYSTEM
========================================================= */

import { db }

from "../../firebase.js";

import {

collection,
addDoc,
onSnapshot,
deleteDoc,
doc,
updateDoc,
query,
orderBy

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
ELEMENTS
========================================================= */

const servicesGrid =
document.getElementById(
"servicesGrid"
);

const saveServiceBtn =
document.getElementById(
"saveServiceBtn"
);

const searchInput =
document.getElementById(
"searchInput"
);

const cityFilter =
document.getElementById(
"cityFilter"
);

const categoryFilter =
document.getElementById(
"categoryFilter"
);

/* =========================================================
FORM INPUTS
========================================================= */

const serviceName =
document.getElementById(
"serviceName"
);

const serviceCategory =
document.getElementById(
"serviceCategory"
);

const serviceCity =
document.getElementById(
"serviceCity"
);

const servicePrice =
document.getElementById(
"servicePrice"
);

const serviceOldPrice =
document.getElementById(
"serviceOldPrice"
);

const serviceTime =
document.getElementById(
"serviceTime"
);

const serviceRating =
document.getElementById(
"serviceRating"
);

const serviceIcon =
document.getElementById(
"serviceIcon"
);

const serviceImage =
document.getElementById(
"serviceImage"
);

const serviceDesc =
document.getElementById(
"serviceDesc"
);

/* =========================================================
GLOBAL
========================================================= */

let editId = null;

let allServices = [];

/* =========================================================
SAVE SERVICE
========================================================= */

saveServiceBtn.addEventListener(
"click",
async ()=>{

if(
!serviceName.value ||
!servicePrice.value
){

showToast(
"Fill all required fields"
);

return;

}

/* ========================================================= */

const serviceData = {

name:
serviceName.value,

category:
serviceCategory.value,

city:
serviceCity.value,

price:
Number(servicePrice.value),

oldPrice:
Number(serviceOldPrice.value),

time:
serviceTime.value,

rating:
serviceRating.value,

icon:
serviceIcon.value,

image:
serviceImage.value,

description:
serviceDesc.value,

orders:
0,

revenue:
0,

createdAt:
new Date()

};

/* ========================================================= */

if(editId){

await updateDoc(

doc(db,"services",editId),

serviceData

);

showToast(
"Service Updated"
);

editId = null;

saveServiceBtn.innerHTML =
"Save Service";

/* ========================================================= */

}else{

await addDoc(

collection(db,"services"),

serviceData

);

showToast(
"Service Added"
);

}

/* ========================================================= */

clearForm();

}
);

/* =========================================================
LOAD SERVICES
========================================================= */

const servicesQuery =
query(

collection(db,"services"),

orderBy("createdAt","desc")

);

/* ========================================================= */

onSnapshot(
servicesQuery,
(snapshot)=>{

allServices = [];

/* ========================================================= */

snapshot.forEach(docSnap=>{

allServices.push({

id:docSnap.id,
...docSnap.data()

});

});

/* ========================================================= */

renderServices();

}
);

/* =========================================================
RENDER SERVICES
========================================================= */

function renderServices(){

servicesGrid.innerHTML = "";

/* ========================================================= */

let filtered =
allServices;

/* =========================================================
SEARCH FILTER
========================================================= */

const keyword =
searchInput?.value
?.toLowerCase() || "";

if(keyword){

filtered =
filtered.filter(item=>

(item.name || "")
.toLowerCase()
.includes(keyword)

||

(item.category || "")
.toLowerCase()
.includes(keyword)

);

}

/* =========================================================
CITY FILTER
========================================================= */

if(
cityFilter &&
cityFilter.value !== "All"
){

filtered =
filtered.filter(item=>

(item.city || "")
.toLowerCase()

===

cityFilter.value
.toLowerCase()

);

}

/* =========================================================
CATEGORY FILTER
========================================================= */

if(
categoryFilter &&
categoryFilter.value !== "All"
){

filtered =
filtered.filter(item=>

(item.category || "")
.toLowerCase()

===

categoryFilter.value
.toLowerCase()

);

}

/* =========================================================
EMPTY
========================================================= */

if(filtered.length === 0){

servicesGrid.innerHTML = `

<div
style="
grid-column:1/-1;
padding:80px;
background:#fff;
border-radius:30px;
text-align:center;
">

<i
class="fa-solid fa-box-open"
style="
font-size:70px;
color:#D1D5DB;
margin-bottom:20px;
display:block;
"></i>

<h2
style="
font-size:32px;
font-weight:900;
margin-bottom:10px;
">

No Services Found

</h2>

<p
style="
font-size:14px;
font-weight:700;
color:#6B7280;
">

Add services from admin panel

</p>

</div>

`;

return;

}

/* =========================================================
RENDER CARDS
========================================================= */

filtered.forEach(service=>{

servicesGrid.innerHTML += `

<div class="serviceCard">

<div
style="
height:230px;
background:#F9FAFB;
display:flex;
align-items:center;
justify-content:center;
position:relative;
">

<img
src="${service.icon}"
style="
width:100px;
height:100px;
object-fit:contain;
">

<div
style="
position:absolute;
top:18px;
right:18px;
background:#111827;
color:#fff;
padding:10px 14px;
border-radius:999px;
font-size:12px;
font-weight:900;
">

${service.category}

</div>

</div>

<div class="serviceBody">

<div class="serviceTop">

<div class="serviceName">

${service.name}

</div>

<div class="categoryTag">

${service.city}

</div>

</div>

<div class="serviceDesc">

${service.description}

</div>

<div class="serviceInfo">

<div class="infoBox">

<h5>
Price
</h5>

<h4>
₹${service.price}
</h4>

</div>

<div class="infoBox">

<h5>
Old Price
</h5>

<h4>
₹${service.oldPrice || 0}
</h4>

</div>

<div class="infoBox">

<h5>
Orders
</h5>

<h4>
${service.orders || 0}
</h4>

</div>

<div class="infoBox">

<h5>
Revenue
</h5>

<h4>
₹${service.revenue || 0}
</h4>

</div>

<div class="infoBox">

<h5>
Delivery
</h5>

<h4>
${service.time || "30 mins"}
</h4>

</div>

<div class="infoBox">

<h5>
Rating
</h5>

<h4>
⭐ ${service.rating || 5}
</h4>

</div>

</div>

<div class="cardActions">

<button
class="editBtn"
onclick="editService('${service.id}')">

Edit

</button>

<button
class="deleteBtn"
onclick="deleteService('${service.id}')">

Delete

</button>

</div>

</div>

</div>

`;

});

}

/* =========================================================
EDIT
========================================================= */

window.editService =
function(id){

const service =
allServices.find(
item=>item.id === id
);

if(!service){

return;

}

editId = id;

serviceName.value =
service.name || "";

serviceCategory.value =
service.category || "";

serviceCity.value =
service.city || "";

servicePrice.value =
service.price || "";

serviceOldPrice.value =
service.oldPrice || "";

serviceTime.value =
service.time || "";

serviceRating.value =
service.rating || "";

serviceIcon.value =
service.icon || "";

serviceImage.value =
service.image || "";

serviceDesc.value =
service.description || "";

saveServiceBtn.innerHTML =
"Update Service";

/* ========================================================= */

window.scrollTo({

top:0,
behavior:"smooth"

});

}

/* =========================================================
DELETE
========================================================= */

window.deleteService =
async function(id){

const confirmDelete =
confirm(
"Delete service?"
);

if(!confirmDelete){

return;

}

/* ========================================================= */

await deleteDoc(
doc(db,"services",id)
);

showToast(
"Service Deleted"
);

}

/* =========================================================
FILTER EVENTS
========================================================= */

if(searchInput){

searchInput.addEventListener(
"input",
renderServices
);

}

if(cityFilter){

cityFilter.addEventListener(
"change",
renderServices
);

}

if(categoryFilter){

categoryFilter.addEventListener(
"change",
renderServices
);

}

/* =========================================================
CLEAR FORM
========================================================= */

function clearForm(){

serviceName.value = "";

servicePrice.value = "";

serviceOldPrice.value = "";

serviceTime.value = "";

serviceRating.value = "";

serviceIcon.value = "";

serviceImage.value = "";

serviceDesc.value = "";

}

/* =========================================================
TOAST
========================================================= */

function showToast(message){

const toast =
document.createElement(
"div"
);

toast.innerHTML =
message;

toast.style.position =
"fixed";

toast.style.bottom =
"20px";

toast.style.right =
"20px";

toast.style.background =
"#111827";

toast.style.color =
"#fff";

toast.style.padding =
"14px 20px";

toast.style.borderRadius =
"16px";

toast.style.fontWeight =
"800";

toast.style.zIndex =
"99999";

document.body.appendChild(
toast
);

setTimeout(()=>{

toast.remove();

},3000);

}
