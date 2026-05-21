/* =========================================================
FILE : services.js
FULL REALTIME SERVICES SYSTEM
========================================================= */

import { db }

from "../firebase.js";

import {

collection,
addDoc,
onSnapshot,
deleteDoc,
doc,
updateDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
ELEMENTS
========================================================= */

const serviceName =
document.getElementById(
"serviceName"
);

const servicePrice =
document.getElementById(
"servicePrice"
);

const serviceCity =
document.getElementById(
"serviceCity"
);

const serviceImage =
document.getElementById(
"serviceImage"
);

const serviceCategory =
document.getElementById(
"serviceCategory"
);

const serviceTime =
document.getElementById(
"serviceTime"
);

const serviceDesc =
document.getElementById(
"serviceDesc"
);

const saveServiceBtn =
document.getElementById(
"saveServiceBtn"
);

const servicesGrid =
document.getElementById(
"servicesGrid"
);

/* =========================================================
GLOBAL
========================================================= */

let editId = null;

/* =========================================================
SAVE SERVICE
========================================================= */

saveServiceBtn.addEventListener(
"click",
async ()=>{

/* ========================================================= */

if(
!serviceName.value ||
!servicePrice.value
){

showToast(
"Fill all details"
);

return;

}

/* ========================================================= */

const serviceData = {

name:
serviceName.value,

price:
Number(servicePrice.value),

city:
serviceCity.value,

image:
serviceImage.value,

category:
serviceCategory.value,

time:
serviceTime.value,

description:
serviceDesc.value,

createdAt:
new Date()

};

/* ========================================================= */

if(editId){

await updateDoc(

doc(db,"services",editId),

serviceData

);

/* ========================================================= */

showToast(
"Service Updated"
);

/* ========================================================= */

editId = null;

saveServiceBtn.innerHTML =
"Save Service";

/* ========================================================= */

}else{

await addDoc(

collection(db,"services"),

serviceData

);

/* ========================================================= */

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

onSnapshot(

collection(db,"services"),

(snapshot)=>{

servicesGrid.innerHTML = "";

/* ========================================================= */

snapshot.forEach(docSnap=>{

const service =
docSnap.data();

/* ========================================================= */

servicesGrid.innerHTML += `

<div class="serviceCard">

<img
src="${service.image}"
class="serviceImage">

<div class="serviceBody">

<div class="serviceTitle">

${service.name}

</div>

<div class="serviceDesc">

${service.description}

</div>

<div class="priceWrap">

<div class="price">

₹${service.price}

</div>

<div class="city">

${service.city}

</div>

</div>

<div class="cardActions">

<button
class="actionBtn editBtn"
onclick="editService('${docSnap.id}',
'${service.name}',
'${service.price}',
'${service.city}',
'${service.image}',
'${service.category}',
'${service.time}',
'${service.description}')">

Edit

</button>

<button
class="actionBtn deleteBtn"
onclick="deleteService('${docSnap.id}')">

Delete

</button>

</div>

</div>

</div>

`;

});

}
);

/* =========================================================
EDIT
========================================================= */

window.editService =
function(
id,
name,
price,
city,
image,
category,
time,
description
){

editId = id;

/* ========================================================= */

serviceName.value =
name;

servicePrice.value =
price;

serviceCity.value =
city;

serviceImage.value =
image;

serviceCategory.value =
category;

serviceTime.value =
time;

serviceDesc.value =
description;

/* ========================================================= */

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
"Delete this service?"
);

if(!confirmDelete){

return;

}

/* ========================================================= */

await deleteDoc(
doc(db,"services",id)
);

/* ========================================================= */

showToast(
"Service Deleted"
);

}

/* =========================================================
CLEAR
========================================================= */

function clearForm(){

serviceName.value = "";
servicePrice.value = "";
serviceCity.value = "Kasganj";
serviceImage.value = "";
serviceCategory.value = "Laundry";
serviceTime.value = "";
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

/* ========================================================= */

toast.style.position =
"fixed";

toast.style.right =
"20px";

toast.style.bottom =
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

/* ========================================================= */

document.body.appendChild(
toast
);

/* ========================================================= */

setTimeout(()=>{

toast.remove();

},3000);

}
