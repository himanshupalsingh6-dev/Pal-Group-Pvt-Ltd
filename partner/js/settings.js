/* =========================================================
FILE : partner/js/settings.js
QUICKPRESS SETTINGS
========================================================= */

import {

db,
auth

}

from "../../firebase.js";

import {

doc,
getDoc,
updateDoc

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
TAB SWITCH
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

menuBtns.forEach(b=>{

b.classList.remove(
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

async function loadProfile(){

const ref =
await getDoc(

doc(
db,
"partners",
partner.uid
)

);

/* ========================================================= */

if(ref.exists()){

const data =
ref.data();

/* ========================================================= */

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

/* ========================================================= */

if(data.profile){

document.getElementById(
"profileImage"
).src =
data.profile;

}

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

await updateDoc(

doc(
db,
"partners",
partner.uid
),

{

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

}

);

/* ========================================================= */

showToast(
"Profile Updated"
);

}catch(error){

console.log(error);

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

await updateDoc(

doc(
db,
"partners",
partner.uid
),

{

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
).value

}

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

await updateDoc(

doc(
db,
"partners",
partner.uid
),

{

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
).value

}

);

/* ========================================================= */

showToast(
"Bank Details Saved"
);

}catch(error){

console.log(error);

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
SWITCH
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

/* ========================================================= */

loadProfile();
