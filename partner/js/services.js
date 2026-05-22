/* =========================================================
FILE : partner/js/services.js
QUICKPRESS PARTNER SERVICES
========================================================= */

import {

db

}

from "../../firebase.js";

import {

collection,
addDoc,
onSnapshot,
doc,
updateDoc,
deleteDoc,
query,
where

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
ELEMENTS
========================================================= */

const servicesGrid =
document.getElementById(
"servicesGrid"
);

const serviceModal =
document.getElementById(
"serviceModal"
);

const openModalBtn =
document.getElementById(
"openModalBtn"
);

const saveServiceBtn =
document.getElementById(
"saveServiceBtn"
);

const searchInput =
document.getElementById(
"searchInput"
);

/* =========================================================
FORM
========================================================= */

const serviceName =
document.getElementById(
"serviceName"
);

const serviceCategory =
document.getElementById(
"serviceCategory"
);

const servicePrice =
document.getElementById(
"servicePrice"
);

const serviceIcon =
document.getElementById(
"serviceIcon"
);

const serviceDescription =
document.getElementById(
"serviceDescription"
);

/* =========================================================
STATS
========================================================= */

const totalServices =
document.getElementById(
"totalServices"
);

const totalOrders =
document.getElementById(
"totalOrders"
);

const totalRevenue =
document.getElementById(
"totalRevenue"
);

const topService =
document.getElementById(
"topService"
);

/* =========================================================
MODAL OPEN
========================================================= */

openModalBtn.addEventListener(
"click",
()=>{

serviceModal.style.display =
"flex";

}
);

/* =========================================================
MODAL CLOSE
========================================================= */

window.addEventListener(
"click",
(e)=>{

if(
e.target === serviceModal
){

serviceModal.style.display =
"none";

}

}
);

/* =========================================================
SAVE SERVICE
========================================================= */

saveServiceBtn.addEventListener(
"click",
async()=>{

/* ========================================================= */

if(

!serviceName.value ||
!servicePrice.value

){

showToast(
"Fill required fields"
);

return;

}

/* ========================================================= */

saveServiceBtn.innerHTML =
"Saving...";

/* ========================================================= */

try{

await addDoc(

collection(db,"services"),

{

partnerId:partner.uid,

partnerName:partner.name,

city:partner.city,

name:serviceName.value,

category:serviceCategory.value,

price:Number(servicePrice.value),

icon:serviceIcon.value || "fa-shirt",

description:serviceDescription.value,

status:"active",

orders:0,

revenue:0,

createdAt:new Date()

}

);

/* ========================================================= */

showToast(
"Service Added"
);

/* ========================================================= */

serviceModal.style.display =
"none";

/* ========================================================= */

clearForm();

/* ========================================================= */

}catch(error){

console.log(error);

showToast(
"Failed"
);

}

/* ========================================================= */

saveServiceBtn.innerHTML =
"Save Service";

}
);

/* =========================================================
LOAD SERVICES
========================================================= */

const servicesQuery =

query(

collection(db,"services"),

where(
"partnerId",
"==",
partner.uid
)

);

/* ========================================================= */

onSnapshot(
servicesQuery,
(snapshot)=>{

servicesGrid.innerHTML = "";

/* ========================================================= */

let serviceCount = 0;

let orderCount = 0;

let revenueCount = 0;

let topServiceName = "-";

/* ========================================================= */

snapshot.forEach(docSnap=>{

const service =
docSnap.data();

const serviceId =
docSnap.id;

/* ========================================================= */

serviceCount++;

orderCount +=
service.orders || 0;

revenueCount +=
service.revenue || 0;

/* ========================================================= */

if(
service.orders > 0
){

topServiceName =
service.name;

}

/* ========================================================= */

servicesGrid.innerHTML += `

<div class="serviceCard">

<div class="serviceTop">

<div class="serviceIcon">

<i class="fa-solid ${service.icon}"></i>

</div>

<div class="serviceStatus">

${service.status}

</div>

</div>

<div class="serviceName">

${service.name}

</div>

<div class="serviceDesc">

${service.description || "No description"}

</div>

<div class="priceBox">

<div>

<div class="priceTitle">

Service Price

</div>

</div>

<div class="priceValue">

₹${service.price}

</div>

</div>

<div class="statsRow">

<div class="statItem">

<h4>
${service.orders || 0}
</h4>

<p>
Orders
</p>

</div>

<div class="statItem">

<h4>
₹${service.revenue || 0}
</h4>

<p>
Revenue
</p>

</div>

<div class="statItem">

<h4>
${service.category}
</h4>

<p>
Category
</p>

</div>

</div>

<div class="actionButtons">

<button
class="actionBtn editBtn"
onclick="editService(
'${serviceId}',
'${service.name}',
'${service.category}',
'${service.price}',
'${service.icon}',
'${service.description}'
)">

Edit

</button>

<button
class="actionBtn disableBtn"
onclick="deleteService('${serviceId}')">

Delete

</button>

</div>

</div>

`;

});

/* =========================================================
UPDATE STATS
========================================================= */

totalServices.innerHTML =
serviceCount;

totalOrders.innerHTML =
orderCount;

totalRevenue.innerHTML =
"₹" + revenueCount;

topService.innerHTML =
topServiceName;

}
);

/* =========================================================
EDIT SERVICE
========================================================= */

window.editService = async(

id,
name,
category,
price,
icon,
description

)=>{

/* ========================================================= */

serviceModal.style.display =
"flex";

/* ========================================================= */

serviceName.value =
name;

serviceCategory.value =
category;

servicePrice.value =
price;

serviceIcon.value =
icon;

serviceDescription.value =
description;

/* ========================================================= */

saveServiceBtn.innerHTML =
"Update Service";

/* ========================================================= */

saveServiceBtn.onclick =
async()=>{

try{

await updateDoc(

doc(db,"services",id),

{

name:serviceName.value,

category:serviceCategory.value,

price:Number(servicePrice.value),

icon:serviceIcon.value,

description:serviceDescription.value,

updatedAt:new Date()

}

);

/* ========================================================= */

showToast(
"Service Updated"
);

/* ========================================================= */

serviceModal.style.display =
"none";

/* ========================================================= */

clearForm();

/* ========================================================= */

saveServiceBtn.innerHTML =
"Save Service";

}catch(error){

console.log(error);

}

};

};

/* =========================================================
DELETE
========================================================= */

window.deleteService =
async(id)=>{

const confirmDelete =
confirm(
"Delete service?"
);

/* ========================================================= */

if(!confirmDelete){

return;

}

/* ========================================================= */

try{

await deleteDoc(

doc(db,"services",id)

);

showToast(
"Service Deleted"
);

}catch(error){

console.log(error);

}

};

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"keyup",
()=>{

const value =

searchInput.value
.toLowerCase();

/* ========================================================= */

const cards =

document.querySelectorAll(
".serviceCard"
);

/* ========================================================= */

cards.forEach(card=>{

const text =

card.innerText
.toLowerCase();

/* ========================================================= */

if(text.includes(value)){

card.style.display =
"block";

}

else{

card.style.display =
"none";

}

});

}
);

/* =========================================================
CLEAR FORM
========================================================= */

function clearForm(){

serviceName.value = "";
servicePrice.value = "";
serviceDescription.value = "";
serviceIcon.value = "";
serviceCategory.value = "Wash";

}

/* =========================================================
TOAST
========================================================= */

function showToast(message){

const toast =
document.createElement(
"div"
);

/* ========================================================= */

toast.innerHTML =
message;

/* ========================================================= */

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
"999999";

/* ========================================================= */

document.body.appendChild(
toast
);

/* ========================================================= */

setTimeout(()=>{

toast.remove();

},3000);

}
