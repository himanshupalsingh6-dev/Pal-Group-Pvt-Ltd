/* =========================================================
FILE : rider/js/layout.js
RIDER MOBILE LAYOUT SYSTEM
========================================================= */

import {

db

}

from "../../firebase.js";

import {

doc,
getDoc,
updateDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
AUTH
========================================================= */

const rider =

JSON.parse(

localStorage.getItem(
"riderSession"
)

);

/* ========================================================= */

if(!rider){

window.location.href =
"login.html";

}

/* =========================================================
LOAD LAYOUT
========================================================= */

async function loadLayout(){

/* ========================================================= */

const response =

await fetch(
"./layout.html"
);

const html =
await response.text();

/* ========================================================= */

const bodyContent =
document.body.innerHTML;

/* ========================================================= */

document.body.innerHTML =
html;

/* ========================================================= */

document.getElementById(
"pageContent"
).innerHTML =
bodyContent;

/* =========================================================
LOAD RIDER DATA
========================================================= */

loadRiderData();

/* =========================================================
ACTIVE NAV
========================================================= */

setActiveNav();

/* =========================================================
ONLINE OFFLINE
========================================================= */

setupOnlineButton();

}

/* =========================================================
LOAD RIDER DATA
========================================================= */

async function loadRiderData(){

try{

const riderRef =

await getDoc(

doc(
db,
"riders",
rider.uid
)

);

/* ========================================================= */

if(riderRef.exists()){

const data =
riderRef.data();

/* ========================================================= */

document.getElementById(
"riderName"
).innerHTML =

data.name ||

"QuickPress Rider";

/* ========================================================= */

document.getElementById(
"riderCity"
).innerHTML =

data.city ||

"Realtime Delivery";

/* ========================================================= */

if(data.profile){

document.getElementById(
"riderProfile"
).src =
data.profile;

}

/* =========================================================
ONLINE STATUS
========================================================= */

if(data.online){

document
.getElementById(
"onlineBtn"
)
.classList.add(
"active"
);

document
.getElementById(
"onlineText"
)
.innerHTML =
"Online";

}

else{

document
.getElementById(
"onlineText"
)
.innerHTML =
"Offline";

}

}

}catch(error){

console.log(error);

}

}

/* =========================================================
ACTIVE NAVIGATION
========================================================= */

function setActiveNav(){

const currentPage =

window.location.pathname
.split("/")
.pop();

/* ========================================================= */

if(currentPage === "index.html"){

document
.getElementById(
"homeNav"
)
.classList.add(
"active"
);

}

/* ========================================================= */

if(currentPage === "orders.html"){

document
.getElementById(
"ordersNav"
)
.classList.add(
"active"
);

}

/* ========================================================= */

if(currentPage === "tracking.html"){

document
.getElementById(
"trackingNav"
)
.classList.add(
"active"
);

}

/* ========================================================= */

if(currentPage === "wallet.html"){

document
.getElementById(
"walletNav"
)
.classList.add(
"active"
);

}

/* ========================================================= */

if(currentPage === "settings.html"){

document
.getElementById(
"settingsNav"
)
.classList.add(
"active"
);

}

}

/* =========================================================
ONLINE / OFFLINE
========================================================= */

function setupOnlineButton(){

const onlineBtn =

document.getElementById(
"onlineBtn"
);

/* ========================================================= */

onlineBtn.addEventListener(

"click",

async()=>{

const isOnline =

onlineBtn.classList.contains(
"active"
);

/* ========================================================= */

if(isOnline){

onlineBtn.classList.remove(
"active"
);

document.getElementById(
"onlineText"
).innerHTML =
"Offline";

await updateStatus(false);

}

else{

onlineBtn.classList.add(
"active"
);

document.getElementById(
"onlineText"
).innerHTML =
"Online";

await updateStatus(true);

}

}

);

}

/* =========================================================
UPDATE STATUS
========================================================= */

async function updateStatus(status){

try{

await updateDoc(

doc(
db,
"riders",
rider.uid
),

{

online:status,

updatedAt:new Date()

}

);

/* ========================================================= */

localStorage.setItem(

"riderSession",

JSON.stringify({

...rider,
online:status

})

);

}catch(error){

console.log(error);

}

}

/* =========================================================
INIT
========================================================= */

loadLayout();
