/* =========================================================
FILE : partner/js/login.js
QUICKPRESS PARTNER LOGIN
========================================================= */

import {

auth,
db

}

from "../../firebase.js";

import {

signInWithEmailAndPassword

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
LOGIN
========================================================= */

loginBtn.addEventListener(
"click",
async ()=>{

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

try{

/* ========================================================= */

const userCredential =

await signInWithEmailAndPassword(

auth,
email.value,
password.value

);

/* ========================================================= */

const user =
userCredential.user;

/* ========================================================= */

const partnerDoc =

await getDoc(

doc(db,"partners",user.uid)

);

/* ========================================================= */

if(!partnerDoc.exists()){

showToast(
"Partner account not found"
);

loginBtn.innerHTML =
"Login Partner Account";

return;

}

/* ========================================================= */

const partnerData =
partnerDoc.data();

/* ========================================================= */

if(
partnerData.role !== "partner"
){

showToast(
"Unauthorized access"
);

return;

}

/* =========================================================
SAVE SESSION
========================================================= */

localStorage.setItem(

"partner",

JSON.stringify({

uid:user.uid,

name:partnerData.name,

email:partnerData.email,

role:"partner"

})

);

/* ========================================================= */

showToast(
"Login Success"
);

/* ========================================================= */

setTimeout(()=>{

window.location.href =
"index.html";

},1500);

/* ========================================================= */

}catch(error){

console.log(error);

showToast(
error.message
);

}

/* ========================================================= */

loginBtn.innerHTML =
"Login Partner Account";

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
