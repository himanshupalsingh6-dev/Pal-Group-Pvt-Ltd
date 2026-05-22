/* =========================================================
FILE : partner/js/settings.js
ADVANCE SETTINGS SYSTEM
========================================================= */

import {

db,
auth

}

from "../../firebase.js";

import {

doc,
getDoc,
updateDoc,
setDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import {

updatePassword

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

/* =========================================================
SESSION
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
TAB SYSTEM
========================================================= */

const menuBtns =
document.querySelectorAll(
".menuBtn"
);

const sections =
document.querySelectorAll(
".settingsSection"
);

/* ========================================================= */

menuBtns.forEach(btn=>{

btn.addEventListener(
"click",
()=>{

menuBtns.forEach(item=>{

item.classList.remove(
"active"
);

});

sections.forEach(sec=>{

sec.classList.remove(
"active"
);

});

/* ========================================================= */

btn.classList.add(
"active"
);

document
.getElementById(
btn.dataset.tab
)
.classList.add(
"active"
);

});

});

/* =========================================================
LOAD PROFILE
========================================================= */

async function loadPartnerData(){

try{

const partnerRef =

await getDoc(

doc(
db,
"partners",
partner.uid
)

);

/* ========================================================= */

if(partnerRef.exists()){

const data =
partnerRef.data();

/* =========================================================
PROFILE
========================================================= */

document.getElementById(
"partnerName"
).value =
data.name || "";

document.getElementById(
"shopName"
).value =
data.shop || "";

document.getElementById(
"phone"
).value =
data.phone || "";

document.getElementById(
"city"
).value =
data.city || "";

/* =========================================================
BUSINESS
========================================================= */

document.getElementById(
"openingTime"
).value =
data.openingTime || "";

document.getElementById(
"closingTime"
).value =
data.closingTime || "";

document.getElementById(
"minimumOrder"
).value =
data.minimumOrder || "";

document.getElementById(
"deliveryRadius"
).value =
data.deliveryRadius || "";

/* =========================================================
BANK
========================================================= */

document.getElementById(
"accountHolder"
).value =
data.accountHolder || "";

document.getElementById(
"accountNumber"
).value =
data.accountNumber || "";

document.getElementById(
"ifscCode"
).value =
data.ifscCode || "";

document.getElementById(
"upiId"
).value =
data.upiId || "";

/* =========================================================
PROFILE IMAGE
========================================================= */

if(data.profile){

document.getElementById(
"profileImage"
).src =
data.profile;

}

/* =========================================================
UPDATE SESSION
========================================================= */

localStorage.setItem(

"partnerSession",

JSON.stringify({

...partner,
...data

})

);

}

}catch(error){

console.log(error);

}

}

/* =========================================================
SAVE PROFILE
========================================================= */

document
.getElementById(
"saveProfileBtn"
)
.addEventListener(

"click",

async()=>{

try{

const updatedData = {

name:

document.getElementById(
"partnerName"
).value,

shop:

document.getElementById(
"shopName"
).value,

phone:

document.getElementById(
"phone"
).value,

city:

document.getElementById(
"city"
).value,

updatedAt:new Date()

};

/* ========================================================= */

await updateDoc(

doc(
db,
"partners",
partner.uid
),

updatedData

);

/* =========================================================
ADMIN PANEL LIVE DATA
========================================================= */

await setDoc(

doc(
db,
"admin_partners",
partner.uid
),

{

...updatedData,

partnerId:partner.uid

},

{merge:true}

);

/* ========================================================= */

showToast(
"Profile Updated"
);

/* ========================================================= */

loadPartnerData();

}catch(error){

console.log(error);

showToast(
"Update Failed"
);

}

}
);

/* =========================================================
SAVE BUSINESS
========================================================= */

document
.getElementById(
"saveBusinessBtn"
)
.addEventListener(

"click",

async()=>{

try{

const businessData = {

openingTime:

document.getElementById(
"openingTime"
).value,

closingTime:

document.getElementById(
"closingTime"
).value,

minimumOrder:

document.getElementById(
"minimumOrder"
).value,

deliveryRadius:

document.getElementById(
"deliveryRadius"
).value,

updatedAt:new Date()

};

/* ========================================================= */

await updateDoc(

doc(
db,
"partners",
partner.uid
),

businessData

);

/* ========================================================= */

await setDoc(

doc(
db,
"admin_partners",
partner.uid
),

businessData,

{merge:true}

);

/* ========================================================= */

showToast(
"Business Settings Saved"
);

}catch(error){

console.log(error);

}

}
);

/* =========================================================
SAVE BANK
========================================================= */

document
.getElementById(
"saveBankBtn"
)
.addEventListener(

"click",

async()=>{

try{

const bankData = {

accountHolder:

document.getElementById(
"accountHolder"
).value,

accountNumber:

document.getElementById(
"accountNumber"
).value,

ifscCode:

document.getElementById(
"ifscCode"
).value,

upiId:

document.getElementById(
"upiId"
).value,

updatedAt:new Date()

};

/* ========================================================= */

await updateDoc(

doc(
db,
"partners",
partner.uid
),

bankData

);

/* ========================================================= */

await setDoc(

doc(
db,
"admin_partners",
partner.uid
),

bankData,

{merge:true}

);

/* ========================================================= */

showToast(
"Bank Details Saved"
);

}catch(error){

console.log(error);

showToast(
"Bank Save Failed"
);

}

}
);

/* =========================================================
CHANGE PASSWORD
========================================================= */

document
.getElementById(
"changePasswordBtn"
)
.addEventListener(

"click",

async()=>{

const newPassword =
document.getElementById(
"newPassword"
).value;

const confirmPassword =
document.getElementById(
"confirmPassword"
).value;

/* ========================================================= */

if(!newPassword){

showToast(
"Enter password"
);

return;

}

/* ========================================================= */

if(newPassword !== confirmPassword){

showToast(
"Password not match"
);

return;

}

/* ========================================================= */

try{

await updatePassword(

auth.currentUser,
newPassword

);

/* ========================================================= */

showToast(
"Password Updated"
);

}catch(error){

console.log(error);

showToast(
error.message
);

}

}
);

/* =========================================================
SWITCHES
========================================================= */

document
.querySelectorAll(".switch")
.forEach(sw=>{

sw.addEventListener(
"click",
()=>{

sw.classList.toggle(
"active"
);

});

});

/* =========================================================
PROFILE IMAGE UPLOAD
========================================================= */

document
.getElementById(
"uploadBtn"
)
.addEventListener(

"click",

()=>{

const imageUrl = prompt(
"Paste Profile Image URL"
);

/* ========================================================= */

if(imageUrl){

saveProfileImage(
imageUrl
);

}

}
);

/* =========================================================
SAVE IMAGE
========================================================= */

async function saveProfileImage(url){

try{

await updateDoc(

doc(
db,
"partners",
partner.uid
),

{

profile:url

}

);

/* ========================================================= */

document.getElementById(
"profileImage"
).src = url;

/* ========================================================= */

showToast(
"Profile Updated"
);

}catch(error){

console.log(error);

}

}

/* =========================================================
DISABLE SHOP
========================================================= */

document
.querySelectorAll(".dangerBtn")
.forEach(btn=>{

btn.addEventListener(
"click",
async()=>{

const text =
btn.innerText;

/* ========================================================= */

if(text.includes("Disable")){

await updateDoc(

doc(
db,
"partners",
partner.uid
),

{

shopDisabled:true

}

);

showToast(
"Shop Disabled"
);

}

/* ========================================================= */

if(text.includes("Delete")){

const confirmDelete =

confirm(
"Delete Account?"
);

/* ========================================================= */

if(confirmDelete){

await updateDoc(

doc(
db,
"partners",
partner.uid
),

{

deleted:true

}

);

localStorage.removeItem(
"partnerSession"
);

window.location.href =
"login.html";

}

}

});

});

/* =========================================================
REALTIME ADMIN SYNC
========================================================= */

async function syncAdminPanel(){

try{

const partnerRef =

await getDoc(

doc(
db,
"partners",
partner.uid
)

);

/* ========================================================= */

if(partnerRef.exists()){

await setDoc(

doc(
db,
"admin_partners",
partner.uid
),

partnerRef.data(),

{merge:true}

);

}

}catch(error){

console.log(error);

}

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

/* =========================================================
INIT
========================================================= */

loadPartnerData();

syncAdminPanel();
