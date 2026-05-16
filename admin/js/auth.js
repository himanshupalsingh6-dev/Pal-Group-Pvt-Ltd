/* =========================================================
FILE : admin/js/auth.js
========================================================= */

/* =========================================================
AUTH CHECK
========================================================= */

function checkAdminAuth(){

const session =
localStorage.getItem(
"quickpress_admin"
);

/* =========================================
NO LOGIN
========================================= */

if(session !== "true"){

window.location.href =
"login.html";

}

}

/* =========================================================
LOGOUT
========================================================= */

function logoutAdmin(){

localStorage.removeItem(
"quickpress_admin"
);

window.location.href =
"login.html";

}

/* =========================================================
DESKTOP ONLY SECURITY
========================================================= */

function blockMobileDevices(){

const isTouch =
'ontouchstart'
in window;

const isMobileUA =
/Android|iPhone|iPad|iPod/i
.test(
navigator.userAgent
);

if(
window.innerWidth < 1024
||
isTouch
||
isMobileUA
){

document.body.innerHTML = `

<div
style="
height:100vh;
display:flex;
align-items:center;
justify-content:center;
background:#081028;
color:white;
font-family:Poppins,sans-serif;
padding:30px;
text-align:center;
">

<div>

<div
style="
font-size:90px;
margin-bottom:25px;
color:#FFD400;
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
margin-top:18px;
line-height:1.8;
color:#9CA3AF;
">

QuickPress Admin Panel only works on Laptop/Desktop.

</p>

</div>

</div>

`;

}

}

/* =========================================================
SESSION TIMEOUT
========================================================= */

let inactivityTimer;

function resetSessionTimer(){

clearTimeout(
inactivityTimer
);

inactivityTimer =
setTimeout(()=>{

logoutAdmin();

},1000 * 60 * 60 * 2);

}

/* =========================================================
TRACK ACTIVITY
========================================================= */

document.addEventListener(
"mousemove",
resetSessionTimer
);

document.addEventListener(
"keydown",
resetSessionTimer
);

document.addEventListener(
"click",
resetSessionTimer
);

/* =========================================================
START SECURITY
========================================================= */

blockMobileDevices();

checkAdminAuth();

resetSessionTimer();

/* =========================================================
GLOBAL
========================================================= */

window.logoutAdmin =
logoutAdmin;
