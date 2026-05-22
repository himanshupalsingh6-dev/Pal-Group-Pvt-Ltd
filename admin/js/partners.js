/* =========================================================
FILE : admin/js/partners.js
ADVANCE PARTNER SYSTEM
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

const partnersGrid =
document.getElementById(
"partnersGrid"
);

const savePartnerBtn =
document.getElementById(
"savePartnerBtn"
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

const partnerName =
document.getElementById(
"partnerName"
);

const partnerPhone =
document.getElementById(
"partnerPhone"
);

const partnerCity =
document.getElementById(
"partnerCity"
);

const partnerAddress =
document.getElementById(
"partnerAddress"
);

const partnerImage =
document.getElementById(
"partnerImage"
);

const partnerStatus =
document.getElementById(
"partnerStatus"
);

const partnerCommission =
document.getElementById(
"partnerCommission"
);

const partnerWallet =
document.getElementById(
"partnerWallet"
);

const partnerRating =
document.getElementById(
"partnerRating"
);

const partnerDesc =
document.getElementById(
"partnerDesc"
);

/* =========================================================
GLOBAL
========================================================= */

let editId = null;

let allPartners = [];

/* =========================================================
SAVE PARTNER
========================================================= */

savePartnerBtn.addEventListener(
"click",
async ()=>{

if(
!partnerName.value ||
!partnerPhone.value
){

showToast(
"Fill all fields"
);

return;

}

/* ========================================================= */

const partnerData = {

name:
partnerName.value,

phone:
partnerPhone.value,

city:
partnerCity.value,

address:
partnerAddress.value,

image:
partnerImage.value,

status:
partnerStatus.value,

commission:
Number(partnerCommission.value),

wallet:
Number(partnerWallet.value),

rating:
Number(partnerRating.value),

description:
partnerDesc.value,

orders:0,

revenue:0,

createdAt:
new Date()

};

/* ========================================================= */

if(editId){

await updateDoc(

doc(db,"partners",editId),

partnerData

);

showToast(
"Partner Updated"
);

editId = null;

savePartnerBtn.innerHTML =
"Save Partner";

}else{

await addDoc(

collection(db,"partners"),

partnerData

);

showToast(
"Partner Added"
);

}

/* ========================================================= */

clearForm();

}
);

/* =========================================================
LOAD PARTNERS
========================================================= */

const partnersQuery =
query(

collection(db,"partners"),

orderBy("createdAt","desc")

);

onSnapshot(
partnersQuery,
(snapshot)=>{

allPartners = [];

snapshot.forEach(docSnap=>{

allPartners.push({

id:docSnap.id,
...docSnap.data()

});

});

renderPartners();

}
);

/* =========================================================
RENDER
========================================================= */

function renderPartners(){

partnersGrid.innerHTML = "";

let filtered =
allPartners;

/* ========================================================= */

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

/* ========================================================= */

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

/* ========================================================= */

filtered.forEach(partner=>{

partnersGrid.innerHTML += `

<div class="partnerCard">

<div class="partnerTop">

<img
src="${partner.image || 'https://i.ibb.co/3SWQHfY/user.png'}"
class="partnerImage">

<div class="partnerInfo">

<h2>
${partner.name}
</h2>

<p>
${partner.phone}
</p>

</div>

</div>

<div class="partnerBody">

<div class="infoGrid">

<div class="infoBox">

<h5>
City
</h5>

<h4>
${partner.city}
</h4>

</div>

<div class="infoBox">

<h5>
Orders
</h5>

<h4>
${partner.orders || 0}
</h4>

</div>

<div class="infoBox">

<h5>
Revenue
</h5>

<h4>
₹${partner.revenue || 0}
</h4>

</div>

<div class="infoBox">

<h5>
Wallet
</h5>

<h4>
₹${partner.wallet || 0}
</h4>

</div>

<div class="infoBox">

<h5>
Commission
</h5>

<h4>
${partner.commission || 0}%

</h4>

</div>

<div class="infoBox">

<h5>
Rating
</h5>

<h4>
⭐ ${partner.rating || 5}
</h4>

</div>

</div>

<span class="status ${partner.status === "Active" ? "active" : "inactive"}">

${partner.status}

</span>

<br><br>

<div class="cardActions">

<button
class="editBtn"
onclick="editPartner('${partner.id}')">

Edit

</button>

<button
class="deleteBtn"
onclick="deletePartner('${partner.id}')">

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

window.editPartner =
function(id){

const partner =
allPartners.find(
item=>item.id === id
);

if(!partner){

return;

}

editId = id;

partnerName.value =
partner.name;

partnerPhone.value =
partner.phone;

partnerCity.value =
partner.city;

partnerAddress.value =
partner.address;

partnerImage.value =
partner.image;

partnerStatus.value =
partner.status;

partnerCommission.value =
partner.commission;

partnerWallet.value =
partner.wallet;

partnerRating.value =
partner.rating;

partnerDesc.value =
partner.description;

savePartnerBtn.innerHTML =
"Update Partner";

window.scrollTo({

top:0,
behavior:"smooth"

});

}

/* =========================================================
DELETE
========================================================= */

window.deletePartner =
async function(id){

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

showToast(
"Partner Deleted"
);

}

/* =========================================================
FILTERS
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
CLEAR FORM
========================================================= */

function clearForm(){

partnerName.value = "";

partnerPhone.value = "";

partnerAddress.value = "";

partnerImage.value = "";

partnerDesc.value = "";

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
