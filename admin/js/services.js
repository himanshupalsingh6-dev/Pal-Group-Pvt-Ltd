/* =========================================================
FILE : js/services.js
ADVANCE SERVICES SYSTEM
========================================================= */

import { db }

from "../../firebase.js";

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
SAVE
========================================================= */

saveServiceBtn.addEventListener(
"click",
async ()=>{

if(
!serviceName.value ||
!servicePrice.value
){

showToast(
"Fill all fields"
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
LOAD
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

<div class="serviceTop">

<div class="serviceName">

${service.name}

</div>

<div class="categoryTag">

${service.category}

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
City
</h5>

<h4>
${service.city}
</h4>

</div>

<div class="infoBox">

<h5>
Delivery
</h5>

<h4>
${service.time}
</h4>

</div>

<div class="infoBox">

<h5>
Rating
</h5>

<h4>
⭐ ${service.rating}
</h4>

</div>

</div>

<div class="cardActions">

<button
class="editBtn"
onclick="editService('${docSnap.id}',
'${service.name}',
'${service.category}',
'${service.city}',
'${service.price}',
'${service.oldPrice}',
'${service.time}',
'${service.rating}',
'${service.icon}',
'${service.image}',
'${service.description}')">

Edit

</button>

<button
class="deleteBtn"
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
category,
city,
price,
oldPrice,
time,
rating,
icon,
image,
description
){

editId = id;

serviceName.value = name;
serviceCategory.value = category;
serviceCity.value = city;
servicePrice.value = price;
serviceOldPrice.value = oldPrice;
serviceTime.value = time;
serviceRating.value = rating;
serviceIcon.value = icon;
serviceImage.value = image;
serviceDesc.value = description;

saveServiceBtn.innerHTML =
"Update Service";

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

await deleteDoc(
doc(db,"services",id)
);

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
