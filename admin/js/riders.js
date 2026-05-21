/* =========================================================
FILE : js/riders.js
REALTIME RIDERS SYSTEM
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

const ridersGrid =
document.getElementById(
"ridersGrid"
);

const saveRiderBtn =
document.getElementById(
"saveRiderBtn"
);

const searchInput =
document.getElementById(
"searchInput"
);

const cityFilter =
document.getElementById(
"cityFilter"
);

/* =========================================================
INPUTS
========================================================= */

const riderName =
document.getElementById(
"riderName"
);

const riderPhone =
document.getElementById(
"riderPhone"
);

const riderCity =
document.getElementById(
"riderCity"
);

const vehicleNumber =
document.getElementById(
"vehicleNumber"
);

const riderImage =
document.getElementById(
"riderImage"
);

const riderStatus =
document.getElementById(
"riderStatus"
);

/* =========================================================
GLOBAL
========================================================= */

let editId = null;

let allRiders = [];

/* =========================================================
SAVE RIDER
========================================================= */

saveRiderBtn.addEventListener(
"click",
async ()=>{

if(
!riderName.value ||
!riderPhone.value
){

showToast(
"Fill all fields"
);

return;

}

/* ========================================================= */

const riderData = {

name:
riderName.value,

phone:
riderPhone.value,

city:
riderCity.value,

vehicle:
vehicleNumber.value,

image:
riderImage.value,

status:
riderStatus.value,

orders:
0,

earnings:
0,

rating:5,

liveLocation:"Kasganj",

createdAt:
new Date()

};

/* ========================================================= */

if(editId){

await updateDoc(

doc(db,"riders",editId),

riderData

);

showToast(
"Rider Updated"
);

editId = null;

saveRiderBtn.innerHTML =
"Save Rider";

/* ========================================================= */

}else{

await addDoc(

collection(db,"riders"),

riderData

);

showToast(
"Rider Added"
);

}

/* ========================================================= */

clearForm();

}
);

/* =========================================================
LOAD RIDERS
========================================================= */

const ridersQuery =
query(

collection(db,"riders"),

orderBy("createdAt","desc")

);

/* ========================================================= */

onSnapshot(
ridersQuery,
(snapshot)=>{

allRiders = [];

/* ========================================================= */

snapshot.forEach(docSnap=>{

allRiders.push({

id:docSnap.id,
...docSnap.data()

});

});

/* ========================================================= */

renderRiders();

}
);

/* =========================================================
RENDER RIDERS
========================================================= */

function renderRiders(){

ridersGrid.innerHTML = "";

/* ========================================================= */

let filtered =
allRiders;

/* =========================================================
SEARCH
========================================================= */

const keyword =
searchInput.value.toLowerCase();

if(keyword){

filtered =
filtered.filter(item=>

(item.name || "")
.toLowerCase()
.includes(keyword)

||

(item.phone || "")
.toLowerCase()
.includes(keyword)

);

}

/* =========================================================
CITY FILTER
========================================================= */

if(cityFilter.value !== "All"){

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
EMPTY
========================================================= */

if(filtered.length === 0){

ridersGrid.innerHTML = `

<div
style="
grid-column:1/-1;
background:#fff;
padding:80px;
border-radius:30px;
text-align:center;
">

<i
class="fa-solid fa-motorcycle"
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

No Riders Found

</h2>

<p
style="
font-size:14px;
font-weight:700;
color:#6B7280;
">

Add riders from admin panel

</p>

</div>

`;

return;

}

/* =========================================================
RENDER CARDS
========================================================= */

filtered.forEach(rider=>{

ridersGrid.innerHTML += `

<div class="riderCard">

<div class="riderTop">

<img
src="${rider.image || 'https://i.ibb.co/3SWQHfY/user.png'}"
class="riderImage">

<div class="riderInfo">

<h2>
${rider.name}
</h2>

<p>
${rider.phone}
</p>

</div>

</div>

<div class="riderBody">

<div class="infoGrid">

<div class="infoBox">

<h5>
City
</h5>

<h4>
${rider.city}
</h4>

</div>

<div class="infoBox">

<h5>
Vehicle
</h5>

<h4>
${rider.vehicle}
</h4>

</div>

<div class="infoBox">

<h5>
Orders
</h5>

<h4>
${rider.orders || 0}
</h4>

</div>

<div class="infoBox">

<h5>
Earnings
</h5>

<h4>
₹${rider.earnings || 0}
</h4>

</div>

<div class="infoBox">

<h5>
Rating
</h5>

<h4>
⭐ ${rider.rating || 5}
</h4>

</div>

<div class="infoBox">

<h5>
Live Location
</h5>

<h4>
${rider.liveLocation || "Kasganj"}
</h4>

</div>

</div>

<span class="status ${rider.status === "Online" ? "online" : "offline"}">

${rider.status}

</span>

<br><br>

<div class="cardActions">

<button
class="editBtn"
onclick="editRider('${rider.id}')">

Edit

</button>

<button
class="deleteBtn"
onclick="deleteRider('${rider.id}')">

Delete

</button>

</div>

</div>

</div>

`;

});

}

/* =========================================================
EDIT RIDER
========================================================= */

window.editRider =
function(id){

const rider =
allRiders.find(
item=>item.id === id
);

if(!rider){

return;

}

/* ========================================================= */

editId = id;

riderName.value =
rider.name;

riderPhone.value =
rider.phone;

riderCity.value =
rider.city;

vehicleNumber.value =
rider.vehicle;

riderImage.value =
rider.image;

riderStatus.value =
rider.status;

saveRiderBtn.innerHTML =
"Update Rider";

/* ========================================================= */

window.scrollTo({

top:0,
behavior:"smooth"

});

}

/* =========================================================
DELETE RIDER
========================================================= */

window.deleteRider =
async function(id){

const confirmDelete =
confirm(
"Delete Rider?"
);

if(!confirmDelete){

return;

}

/* ========================================================= */

await deleteDoc(
doc(db,"riders",id)
);

showToast(
"Rider Deleted"
);

}

/* =========================================================
FILTER EVENTS
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
CLEAR FORM
========================================================= */

function clearForm(){

riderName.value = "";

riderPhone.value = "";

vehicleNumber.value = "";

riderImage.value = "";

riderStatus.value = "Online";

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
