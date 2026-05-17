/* =========================================================
FILE : admin/js/settings.js
QUICKPRESS ENTERPRISE SETTINGS PANEL
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

doc,
setDoc,
getDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
AUTH CHECK
========================================================= */

const adminLogin =
localStorage.getItem(
"quickpress_admin"
);

if(adminLogin !== "true"){

window.location.href =
"login.html";

}

/* =========================================================
DESKTOP ONLY
========================================================= */

const isMobile =
/Android|iPhone|iPad|iPod/i
.test(
navigator.userAgent
);

if(
window.innerWidth < 1024
||
isMobile
){

document.body.innerHTML = `

<div
style="
height:100vh;
display:flex;
align-items:center;
justify-content:center;
background:#111827;
color:white;
font-family:Inter,sans-serif;
text-align:center;
padding:30px;
">

<div>

<div
style="
font-size:80px;
margin-bottom:20px;
">

🖥️

</div>

<h1
style="
font-size:42px;
font-weight:900;
">

Desktop Only

</h1>

<p
style="
margin-top:12px;
font-size:16px;
line-height:1.7;
color:#D1D5DB;
">

QuickPress Admin Panel only works on Laptop/Desktop

</p>

</div>

</div>

`;

}

/* =========================================================
ELEMENTS
========================================================= */

const businessName =
document.getElementById(
"businessName"
);

const supportEmail =
document.getElementById(
"supportEmail"
);

const supportNumber =
document.getElementById(
"supportNumber"
);

const businessAddress =
document.getElementById(
"businessAddress"
);

/* =========================================================
LOAD SETTINGS
========================================================= */

async function loadSettings(){

const settingsRef =
doc(
db,
"settings",
"business"
);

const settingsSnap =
await getDoc(
settingsRef
);

/* ========================================= */

if(settingsSnap.exists()){

const data =
settingsSnap.data();

/* ========================================= */

businessName.value =
data.businessName || "";

supportEmail.value =
data.supportEmail || "";

supportNumber.value =
data.supportNumber || "";

businessAddress.value =
data.businessAddress || "";

}

}

/* =========================================================
SAVE SETTINGS
========================================================= */

window.saveBusinessSettings =
async()=>{

/* ========================================= */

const data = {

businessName:
businessName.value,

supportEmail:
supportEmail.value,

supportNumber:
supportNumber.value,

businessAddress:
businessAddress.value,

updatedAt:
new Date()

};

/* ========================================= */

await setDoc(

doc(
db,
"settings",
"business"
),

data

);

/* ========================================= */

alert(
"Settings Saved Successfully"
);

};

/* =========================================================
INIT
========================================================= */

loadSettings();
