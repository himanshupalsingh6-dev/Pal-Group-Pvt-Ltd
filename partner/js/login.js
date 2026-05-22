/* =========================================================
FILE : partner/js/login.js
QUICKPRESS PARTNER LOGIN SYSTEM
========================================================= */

import {

auth,
db

}

from "../../firebase.js";

import {

signInWithEmailAndPassword,
onAuthStateChanged

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import {

doc,
getDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
ELEMENTS
========================================================= */

const email =
document.getElementById(
"email"
);

const password =
document.getElementById(
"password"
);

const loginBtn =
document.getElementById(
"loginBtn"
);

/* =========================================================
AUTO LOGIN CHECK
========================================================= */

onAuthStateChanged(

auth,

async(user)=>{

if(user){

try{

const partnerRef =

await getDoc(

doc(
db,
"partners",
user.uid
)

);

/* ========================================================= */

if(
partnerRef.exists()
){

const data =
partnerRef.data();

/* ========================================================= */

if(
data.role === "partner"
){

localStorage.setItem(

"partnerSession",

JSON.stringify({

uid:user.uid,

name:data.name,

email:data.email,

role:data.role

})

);

/* ========================================================= */

window.location.href =
"index.html";

}

}

}catch(error){

console.log(error);

}

}

}
);

/* =========================================================
LOGIN
========================================================= */

loginBtn.addEventListener(

"click",

async()=>{

/* ========================================================= */

if(

!email.value ||
!password.value

){

showToast(
"Fill all fields"
);

return;

}

/* ========================================================= */

loginBtn.innerHTML =
"Please Wait...";

/* ========================================================= */

loginBtn.disabled = true;

/* ========================================================= */

try{

/* =========================================================
LOGIN FIREBASE
========================================================= */

const userCredential =

await signInWithEmailAndPassword(

auth,
email.value,
password.value

);

/* ========================================================= */

const user =
userCredential.user;

/* =========================================================
GET PARTNER DATA
========================================================= */

const partnerRef =

await getDoc(

doc(
db,
"partners",
user.uid
)

);

/* ========================================================= */

if(
!partnerRef.exists()
){

showToast(
"Partner account not found"
);

loginBtn.innerHTML =
"Login Partner Account";

loginBtn.disabled = false;

return;

}

/* ========================================================= */

const partnerData =
partnerRef.data();

/* =========================================================
ROLE CHECK
========================================================= */

if(
partnerData.role !== "partner"
){

showToast(
"Unauthorized Access"
);

loginBtn.innerHTML =
"Login Partner Account";

loginBtn.disabled = false;

return;

}

/* =========================================================
STATUS CHECK
========================================================= */

if(
partnerData.status !== "active"
){

showToast(
"Partner account disabled"
);

loginBtn.innerHTML =
"Login Partner Account";

loginBtn.disabled = false;

return;

}

/* =========================================================
SAVE SESSION
========================================================= */

localStorage.setItem(

"partnerSession",

JSON.stringify({

uid:user.uid,

name:partnerData.name,

email:partnerData.email,

role:partnerData.role,

city:partnerData.city

})

);

/* =========================================================
UPDATE ONLINE STATUS
========================================================= */

showToast(
"Login Successful"
);

/* ========================================================= */

setTimeout(()=>{

window.location.href =
"index.html";

},1200);

/* ========================================================= */

}catch(error){

console.log(error);

/* ========================================================= */

if(
error.code ===
"auth/invalid-credential"
){

showToast(
"Invalid Email or Password"
);

}

else if(
error.code ===
"auth/user-not-found"
){

showToast(
"Account not found"
);

}

else if(
error.code ===
"auth/wrong-password"
){

showToast(
"Wrong Password"
);

}

else{

showToast(
error.message
);

}

}

/* ========================================================= */

loginBtn.innerHTML =
"Login Partner Account";

loginBtn.disabled = false;

}
);

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

toast.style.fontSize =
"14px";

toast.style.zIndex =
"999999";

toast.style.boxShadow =
"0 10px 30px rgba(0,0,0,.15)";

/* ========================================================= */

document.body.appendChild(
toast
);

/* ========================================================= */

setTimeout(()=>{

toast.remove();

},3000);

}
