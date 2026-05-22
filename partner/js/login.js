/* =========================================================
FILE : partner/js/login.js
FULL SECURE PARTNER LOGIN
========================================================= */

import {

auth,
db

}

from "../../firebase.js";

import {

signInWithEmailAndPassword,
setPersistence,
browserLocalPersistence,
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

const togglePassword =
document.getElementById(
"togglePassword"
);

/* =========================================================
SHOW PASSWORD
========================================================= */

togglePassword.addEventListener(
"click",
()=>{

if(password.type === "password"){

password.type = "text";

togglePassword.classList.replace(
"fa-eye",
"fa-eye-slash"
);

}else{

password.type = "password";

togglePassword.classList.replace(
"fa-eye-slash",
"fa-eye"
);

}

}
);

/* =========================================================
AUTO LOGIN
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

if(partnerRef.exists()){

const partnerData =
partnerRef.data();

/* =========================================================
ROLE CHECK
========================================================= */

if(
partnerData.role === "partner"
){

/* =========================================================
SESSION SAVE
========================================================= */

localStorage.setItem(

"partnerSession",

JSON.stringify({

uid:user.uid,

name:partnerData.name,

email:partnerData.email,

phone:partnerData.phone,

city:partnerData.city,

shop:partnerData.shop,

profile:partnerData.profile,

role:partnerData.role,

status:partnerData.status

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
"Please fill all fields"
);

return;

}

/* ========================================================= */

loginBtn.innerHTML =
"Please Wait...";

loginBtn.disabled = true;

/* ========================================================= */

try{

/* =========================================================
LOCAL SESSION
========================================================= */

await setPersistence(
auth,
browserLocalPersistence
);

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

if(!partnerRef.exists()){

showToast(
"Partner account not found"
);

resetButton();

return;

}

/* ========================================================= */

const partnerData =
partnerRef.data();

/* =========================================================
SECURITY CHECK
========================================================= */

if(
partnerData.role !== "partner"
){

showToast(
"Unauthorized Access"
);

resetButton();

return;

}

/* =========================================================
ACCOUNT STATUS
========================================================= */

if(
partnerData.status !== "active"
){

showToast(
"Partner account disabled"
);

resetButton();

return;

}

/* =========================================================
UPDATE LOGIN
========================================================= */

await updateDoc(

doc(
db,
"partners",
user.uid
),

{

online:true,

lastLogin:new Date(),

device:navigator.userAgent

}

);

/* =========================================================
SESSION SAVE
========================================================= */

localStorage.setItem(

"partnerSession",

JSON.stringify({

uid:user.uid,

name:partnerData.name,

email:partnerData.email,

phone:partnerData.phone,

city:partnerData.city,

shop:partnerData.shop,

profile:partnerData.profile,

role:partnerData.role,

status:partnerData.status,

online:true

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
"Invalid email or password"
);

}

else if(
error.code ===
"auth/too-many-requests"
){

showToast(
"Too many attempts. Try later"
);

}

else{

showToast(
error.message
);

}

}

/* ========================================================= */

resetButton();

}
);

/* =========================================================
RESET BUTTON
========================================================= */

function resetButton(){

loginBtn.innerHTML =
"Login Partner Account";

loginBtn.disabled = false;

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
"18px";

toast.style.fontWeight =
"800";

toast.style.fontSize =
"14px";

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
