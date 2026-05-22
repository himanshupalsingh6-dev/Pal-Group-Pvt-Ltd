/* =========================================================
FILE : rider/js/login.js
RIDER LOGIN SYSTEM
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
getDoc,
updateDoc

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
AUTO LOGIN
========================================================= */

onAuthStateChanged(

auth,

async(user)=>{

if(user){

try{

const riderRef =

await getDoc(

doc(
db,
"riders",
user.uid
)

);

/* ========================================================= */

if(riderRef.exists()){

const riderData =
riderRef.data();

/* ========================================================= */

if(
riderData.role === "rider"
){

localStorage.setItem(

"riderSession",

JSON.stringify({

uid:user.uid,

name:riderData.name,

email:riderData.email,

phone:riderData.phone,

city:riderData.city,

vehicle:riderData.vehicle,

vehicleNumber:riderData.vehicleNumber,

profile:riderData.profile,

online:riderData.online,

role:riderData.role

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
FIREBASE LOGIN
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
GET RIDER DATA
========================================================= */

const riderRef =

await getDoc(

doc(
db,
"riders",
user.uid
)

);

/* ========================================================= */

if(!riderRef.exists()){

showToast(
"Rider Account Not Found"
);

loginBtn.innerHTML =
"Login Rider Account";

loginBtn.disabled = false;

return;

}

/* ========================================================= */

const riderData =
riderRef.data();

/* =========================================================
ROLE CHECK
========================================================= */

if(
riderData.role !== "rider"
){

showToast(
"Unauthorized Access"
);

loginBtn.innerHTML =
"Login Rider Account";

loginBtn.disabled = false;

return;

}

/* =========================================================
STATUS CHECK
========================================================= */

if(
riderData.status !== "active"
){

showToast(
"Rider Account Disabled"
);

loginBtn.innerHTML =
"Login Rider Account";

loginBtn.disabled = false;

return;

}

/* =========================================================
UPDATE ONLINE STATUS
========================================================= */

await updateDoc(

doc(
db,
"riders",
user.uid
),

{

online:true,

lastLogin:new Date()

}

);

/* =========================================================
SAVE SESSION
========================================================= */

localStorage.setItem(

"riderSession",

JSON.stringify({

uid:user.uid,

name:riderData.name,

email:riderData.email,

phone:riderData.phone,

city:riderData.city,

vehicle:riderData.vehicle,

vehicleNumber:riderData.vehicleNumber,

profile:riderData.profile,

online:true,

role:riderData.role

})

);

/* ========================================================= */

showToast(
"Login Successful"
);

/* ========================================================= */

setTimeout(()=>{

window.location.href =
"index.html";

},1000);

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

else{

showToast(
error.message
);

}

}

/* ========================================================= */

loginBtn.innerHTML =
"Login Rider Account";

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
