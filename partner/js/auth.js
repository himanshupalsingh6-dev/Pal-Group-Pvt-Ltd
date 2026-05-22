/* =========================================================
FILE : partner/js/auth.js
QUICKPRESS HIGH SECURITY AUTH SYSTEM
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
getDoc,
updateDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
SESSION CHECK
========================================================= */

const session =

JSON.parse(

localStorage.getItem(
"partnerSession"
)

);

/* =========================================================
NO SESSION
========================================================= */

if(!session){

window.location.replace(
"./login.html"
);

}

/* =========================================================
PAGE SECURITY
========================================================= */

const protectedPages = [

"index.html",
"orders.html",
"services.html",
"tracking.html",
"wallet.html",
"analytics.html",
"settings.html"

];

/* ========================================================= */

const currentPage =

window.location.pathname
.split("/")
.pop();

/* ========================================================= */

if(
protectedPages.includes(currentPage)
){

secureAuth();

}

/* =========================================================
MAIN SECURITY
========================================================= */

async function secureAuth(){

/* =========================================================
LOADING LOCK
========================================================= */

document.body.style.display =
"none";

/* ========================================================= */

onAuthStateChanged(

auth,

async(user)=>{

/* =========================================================
NOT LOGIN
========================================================= */

if(!user){

logoutUser();

return;

}

/* =========================================================
SESSION TAMPER CHECK
========================================================= */

if(
session.uid !== user.uid
){

logoutUser();

return;

}

/* =========================================================
GET DATABASE USER
========================================================= */

try{

const userRef =

await getDoc(

doc(
db,
"partners",
user.uid
)

);

/* ========================================================= */

if(!userRef.exists()){

logoutUser();

return;

}

/* ========================================================= */

const userData =
userRef.data();

/* =========================================================
ROLE CHECK
========================================================= */

if(
userData.role !== "partner"
){

logoutUser();

return;

}

/* =========================================================
STATUS CHECK
========================================================= */

if(
userData.status !== "active"
){

logoutUser();

return;

}

/* =========================================================
SHOP DISABLED
========================================================= */

if(
userData.shopDisabled === true
){

logoutUser();

return;

}

/* =========================================================
DEVICE SECURITY
========================================================= */

const currentDevice =
navigator.userAgent;

/* ========================================================= */

if(
userData.device &&
userData.device !== currentDevice
){

console.log(
"New Device Login"
);

}

/* =========================================================
UPDATE ACTIVE SESSION
========================================================= */

await updateDoc(

doc(
db,
"partners",
user.uid
),

{

lastActive:new Date(),

online:true,

device:currentDevice

}

);

/* =========================================================
FREEZE SESSION
========================================================= */

Object.freeze(session);

/* =========================================================
SHOW PAGE
========================================================= */

document.body.style.display =
"block";

/* ========================================================= */

}catch(error){

console.log(error);

logoutUser();

}

}

);

}

/* =========================================================
AUTO SESSION CHECK
========================================================= */

setInterval(

async()=>{

const currentUser =
auth.currentUser;

/* ========================================================= */

if(!currentUser){

logoutUser();

return;

}

/* ========================================================= */

try{

const userRef =

await getDoc(

doc(
db,
"partners",
currentUser.uid
)

);

/* ========================================================= */

if(!userRef.exists()){

logoutUser();

return;

}

/* ========================================================= */

const userData =
userRef.data();

/* ========================================================= */

if(
userData.status !== "active"
){

logoutUser();

}

/* ========================================================= */

if(
userData.deleted === true
){

logoutUser();

}

/* ========================================================= */

}catch(error){

console.log(error);

logoutUser();

}

},

10000

);

/* =========================================================
TAB SECURITY
========================================================= */

window.addEventListener(
"storage",
(event)=>{

if(
event.key === "partnerSession" &&
!event.newValue
){

logoutUser();

}

}
);

/* =========================================================
DEVTOOLS BLOCK
========================================================= */

document.addEventListener(
"contextmenu",
(event)=>{

event.preventDefault();

}
);

/* =========================================================
SHORTCUT BLOCK
========================================================= */

document.addEventListener(
"keydown",
(event)=>{

/* ========================================================= */

if(
event.key === "F12"
){

event.preventDefault();

}

/* ========================================================= */

if(
event.ctrlKey &&
event.shiftKey &&
event.key === "I"
){

event.preventDefault();

}

/* ========================================================= */

if(
event.ctrlKey &&
event.shiftKey &&
event.key === "J"
){

event.preventDefault();

}

/* ========================================================= */

if(
event.ctrlKey &&
event.key === "u"
){

event.preventDefault();

}

}
);

/* =========================================================
TOKEN CHECK
========================================================= */

async function verifyToken(){

const currentUser =
auth.currentUser;

/* ========================================================= */

if(!currentUser){

logoutUser();

return;

}

/* ========================================================= */

try{

await currentUser.getIdToken(
true
);

}catch(error){

logoutUser();

}

}

/* ========================================================= */

setInterval(
verifyToken,
300000
);

/* =========================================================
LOGOUT
========================================================= */

async function logoutUser(){

try{

await signOut(auth);

}catch(error){

console.log(error);

}

/* ========================================================= */

localStorage.removeItem(
"partnerSession"
);

/* ========================================================= */

window.location.replace(
"./login.html"
);

}

/* =========================================================
INACTIVE AUTO LOGOUT
========================================================= */

let inactivityTime =
0;

/* ========================================================= */

setInterval(()=>{

inactivityTime++;

if(inactivityTime >= 30){

logoutUser();

}

},60000);

/* ========================================================= */

document.addEventListener(
"mousemove",
()=>{

inactivityTime = 0;

}
);

/* ========================================================= */

document.addEventListener(
"keydown",
()=>{

inactivityTime = 0;

}
);

/* =========================================================
NETWORK SECURITY
========================================================= */

window.addEventListener(
"offline",
()=>{

showSecurityToast(
"Internet Disconnected"
);

}
);

/* ========================================================= */

window.addEventListener(
"online",
()=>{

showSecurityToast(
"Internet Connected"
);

}
);

/* =========================================================
TOAST
========================================================= */

function showSecurityToast(message){

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

toast.style.top =
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
