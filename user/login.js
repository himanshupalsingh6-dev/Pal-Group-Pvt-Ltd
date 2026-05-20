/* =====================================================
FILE : login.js
FINAL FIXED LOGIN.JS
NO AUTO REDIRECT BUG
===================================================== */

/* =====================================================
IMPORT FIREBASE
===================================================== */

import {

auth,
db

}

from "../firebase.js";

import {

signInWithEmailAndPassword,
signInAnonymously

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import {

doc,
setDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

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
LOGIN FORM
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

if(phone.length < 10){

showToast(
"Enter valid mobile number"
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
OTP : 4502
========================================= */

if(password === "4502"){

try{

const userCredential =
await signInAnonymously(
auth
);

const user =
userCredential.user;

/* ========================================= */

await setDoc(

doc(
db,
"users",
user.uid
),

{

name:"QuickPress User",

phone:phone,

wallet:0,

city:"Kasganj",

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

/* =========================================
PHONE TO EMAIL
========================================= */

const fakeEmail =
`${phone}@quickpress.com`;

try{

await signInWithEmailAndPassword(

auth,
fakeEmail,
password

);

/* ========================================= */

showToast(
"Welcome Back 🚀"
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
"14px 24px";

toast.style.borderRadius =
"18px";

toast.style.fontWeight =
"700";

toast.style.zIndex =
"99999";

toast.style.boxShadow =
"0 10px 30px rgba(0,0,0,0.18)";

document.body.appendChild(
toast
);

setTimeout(()=>{

toast.remove();

},2500);

}
