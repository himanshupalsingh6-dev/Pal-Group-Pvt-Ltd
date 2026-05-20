/* =====================================================
FILE : signup.js
QUICKPRESS REAL FIREBASE SIGNUP
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

createUserWithEmailAndPassword

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

const signupForm =
document.getElementById(
"signupForm"
);

const signupBtn =
document.getElementById(
"signupBtn"
);

/* =====================================================
SIGNUP
===================================================== */

signupForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

/* ========================================= */

const name =
document.getElementById(
"name"
).value.trim();

const phone =
document.getElementById(
"phone"
).value.trim();

const city =
document.getElementById(
"city"
).value.trim();

const password =
document.getElementById(
"password"
).value.trim();

/* ========================================= */

if(name === ""){

showToast(
"Enter full name"
);

return;

}

/* ========================================= */

if(phone.length !== 10){

showToast(
"Enter valid mobile number"
);

return;

}

/* ========================================= */

if(city === ""){

showToast(
"Enter city"
);

return;

}

/* ========================================= */

if(password.length < 4){

showToast(
"Password must be 4+ characters"
);

return;

}

/* ========================================= */

signupBtn.innerHTML =
"Creating Account...";

signupBtn.disabled =
true;

/* =========================================
CONVERT PHONE TO EMAIL
========================================= */

const email =
`${phone}@quickpress.com`;

try{

/* ========================================= */

const userCredential =
await createUserWithEmailAndPassword(

auth,
email,
password

);

/* ========================================= */

const user =
userCredential.user;

/* =========================================
SAVE USER DATA
========================================= */

await setDoc(

doc(
db,
"users",
user.uid
),

{

uid:user.uid,

name:name,

phone:phone,

city:city,

wallet:0,

orders:0,

createdAt:
Date.now(),

profile:
`https://ui-avatars.com/api/?name=${name}&background=111827&color=ffffff`

}

);

/* ========================================= */

showToast(
"Account Created Successfully 🚀"
);

/* ========================================= */

setTimeout(()=>{

window.location.href =
"index.html";

},1200);

/* ========================================= */

}catch(error){

console.log(error);

/* ========================================= */

if(
error.code ===
"auth/email-already-in-use"
){

showToast(
"Mobile number already registered"
);

}else{

showToast(
error.message
);

}

/* ========================================= */

signupBtn.innerHTML =
"Create Account";

signupBtn.disabled =
false;

}

}
);

/* =====================================================
TOAST FUNCTION
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

toast.style.fontSize =
"14px";

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
