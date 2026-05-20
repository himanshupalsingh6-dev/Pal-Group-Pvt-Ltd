/* =====================================================
FILE : login.js
QUICKPRESS REAL FIREBASE LOGIN
===================================================== */

/* =====================================================
IMPORT FIREBASE
===================================================== */

import {

auth

}

from "../firebase.js";

import {

signInWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

/* =====================================================
ELEMENTS
===================================================== */

const loginForm =
document.getElementById(
"loginForm"
);

const loginBtn =
document.getElementById(
"loginBtn"
);

/* =====================================================
LOGIN
===================================================== */

loginForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

/* ========================================= */

const phone =
document.getElementById(
"phone"
).value.trim();

const password =
document.getElementById(
"password"
).value.trim();

/* ========================================= */

if(phone.length !== 10){

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
CONVERT PHONE TO EMAIL
========================================= */

const email =
`${phone}@quickpress.com`;

try{

/* ========================================= */

await signInWithEmailAndPassword(

auth,
email,
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

/* ========================================= */

showToast(
"Invalid mobile number or password"
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
