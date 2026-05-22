/* =========================================================
FILE : partner/js/auth.js
QUICKPRESS PARTNER AUTH SECURITY
========================================================= */

import {

auth,
db

}

from "../../firebase.js";

import {

onAuthStateChanged,
signOut

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
AUTH CHECK
========================================================= */

onAuthStateChanged(

auth,

async(user)=>{

/* =========================================================
NO LOGIN
========================================================= */

if(!user){

window.location.href =
"login.html";

return;

}

/* =========================================================
GET PARTNER DATA
========================================================= */

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
!partnerRef.exists()
){

await signOut(auth);

localStorage.removeItem(
"partnerSession"
);

window.location.href =
"login.html";

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

await signOut(auth);

localStorage.removeItem(
"partnerSession"
);

window.location.href =
"login.html";

return;

}

/* =========================================================
STATUS CHECK
========================================================= */

if(
partnerData.status !== "active"
){

await signOut(auth);

localStorage.removeItem(
"partnerSession"
);

window.location.href =
"login.html";

return;

}

/* =========================================================
SAVE FULL SESSION
========================================================= */

localStorage.setItem(

"partnerSession",

JSON.stringify({

uid:user.uid,

name:partnerData.name || "",

email:partnerData.email || "",

phone:partnerData.phone || "",

city:partnerData.city || "",

shop:partnerData.shop || "",

address:partnerData.address || "",

wallet:partnerData.wallet || 0,

earnings:partnerData.earnings || 0,

role:partnerData.role || "partner",

status:partnerData.status || "active",

profile:partnerData.profile || ""

})

);

/* =========================================================
GLOBAL ACCESS
========================================================= */

window.partnerData =
partnerData;

/* ========================================================= */

console.log(
"Partner Auth Success"
);

/* ========================================================= */

}catch(error){

console.log(error);

window.location.href =
"login.html";

}

}
);

/* =========================================================
GET PARTNER DATA
========================================================= */

window.getPartnerSession = ()=>{

return JSON.parse(

localStorage.getItem(
"partnerSession"
)

);

};
