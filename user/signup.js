/* =====================================================
LOGIN.JS
FULL REAL LOGIN SYSTEM
===================================================== */

/* =====================================================
IMPORT FIREBASE
===================================================== */

import {

auth

}

from "./firebase.js";

import {

signInWithEmailAndPassword,
signInAnonymously,
onAuthStateChanged

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import {

doc,
getDoc,
setDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import {

db

}

from "./firebase.js";

/* =====================================================
ELEMENTS
===================================================== */

const loginForm =
document.getElementById(
"loginForm"
);

const phoneInput =
document.getElementById(
"phone"
);

const passwordInput =
document.getElementById(
"password"
);

const loginBtn =
document.getElementById(
"loginBtn"
);

/* =====================================================
AUTO LOGIN CHECK
===================================================== */

onAuthStateChanged(
auth,
(user)=>{

if(user){

window.location.href =
"index.html";

}

}
);

/* =====================================================
LOGIN SYSTEM
===================================================== */

loginForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

/* ========================================= */

const phone =
phoneInput.value.trim();

const password =
passwordInput.value.trim();

/* ========================================= */

if(phone === ""){

showToast(
"Enter mobile number"
);

return;

}

/* ========================================= */

if(password === ""){

showToast(
"Enter password"
);

return;

}

/* ========================================= */

loginBtn.innerHTML =
"Please Wait...";

loginBtn.disabled =
true;

/* =========================================
TEMP OTP LOGIN
========================================= */

if(password === "4502"){

try{

/* =========================================
ANONYMOUS LOGIN
========================================= */

const userCredential =
await signInAnonymously(
auth
);

const user =
userCredential.user;

/* =========================================
SAVE TEMP USER
========================================= */

await setDoc(

doc(
db,
"users",
user.uid
),

{

name:"QuickPress User",

phone:phone,

city:"Kasganj",

wallet:0,

createdAt:
Date.now()

}

);

/* ========================================= */

showToast(
"OTP Login Success 🚀"
);

/* ========================================= */

setTimeout(()=>{

window.location.href =
"index.html";

},1200);

/* ========================================= */

}catch(error){

console.log(error);

showToast(
"Login Failed"
);

loginBtn.innerHTML =
"Login Now";

loginBtn.disabled =
false;

}

return;

}

/* =====================================================
EMAIL STYLE LOGIN
===================================================== */

/* =========================================
CONVERT PHONE TO EMAIL
========================================= */

const fakeEmail =
`${phone}@quickpress.com`;

try{

/* ========================================= */

await signInWithEmailAndPassword(

auth,
fakeEmail,
password

);

/* ========================================= */

showToast(
"Login Successful 🚀"
);

/* ========================================= */

setTimeout(()=>{

window.location.href =
"index.html";

},1200);

/* ========================================= */

}catch(error){

console.log(error);

showToast(
"Invalid Login Details"
);

loginBtn.innerHTML =
"Login Now";

loginBtn.disabled =
false;

}

}
);

/* =====================================================
TOAST
===================================================== */

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
"100px";

toast.style.left =
"50%";

toast.style.transform =
"translateX(-50%)";

toast.style.background =
"#111827";

toast.style.color =
"#fff";

toast.style.padding =
"14px 22px";

toast.style.borderRadius =
"18px";

toast.style.fontWeight =
"700";

toast.style.fontSize =
"14px";

toast.style.zIndex =
"99999";

toast.style.boxShadow =
"0 8px 24px rgba(0,0,0,0.18)";

document.body.appendChild(
toast
);

setTimeout(()=>{

toast.remove();

},2500);

}
