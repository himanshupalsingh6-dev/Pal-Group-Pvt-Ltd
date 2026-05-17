/* =========================================================
QUICKPRESS ENTERPRISE SECURITY SYSTEM
========================================================= */

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
SESSION TIMEOUT
========================================================= */

const loginTime =
localStorage.getItem(
"quickpress_login_time"
);

/* ========================================= */

if(loginTime){

const currentTime =
Date.now();

const diff =
currentTime -
Number(loginTime);

/* =========================================
12 HOURS SESSION
========================================= */

const maxTime =
12 * 60 * 60 * 1000;

/* ========================================= */

if(diff > maxTime){

alert(
"Session Expired"
);

logoutAdmin();

}

}

/* =========================================================
TAB SWITCH DETECTION
========================================================= */

document.addEventListener(
"visibilitychange",
()=>{

if(document.hidden){

console.log(
"Admin switched tab"
);

}

}
);

/* =========================================================
RIGHT CLICK BLOCK
========================================================= */

document.addEventListener(
"contextmenu",
(e)=>{

e.preventDefault();

}
);

/* =========================================================
DEVTOOLS BLOCK
========================================================= */

document.addEventListener(
"keydown",
(e)=>{

/* ========================================= */

if(
e.key === "F12"
){

e.preventDefault();

}

/* ========================================= */

if(
e.ctrlKey
&&
e.shiftKey
&&
e.key === "I"
){

e.preventDefault();

}

/* ========================================= */

if(
e.ctrlKey
&&
e.shiftKey
&&
e.key === "J"
){

e.preventDefault();

}

/* ========================================= */

if(
e.ctrlKey
&&
e.key === "u"
){

e.preventDefault();

}

}
);

/* =========================================================
COPY BLOCK
========================================================= */

document.addEventListener(
"copy",
(e)=>{

e.preventDefault();

}
);

/* =========================================================
SCREENSHOT WARNING
========================================================= */

document.addEventListener(
"keyup",
(e)=>{

if(
e.key === "PrintScreen"
){

alert(
"Screenshots Disabled"
);

navigator.clipboard.writeText(
""
);

}

}
);

/* =========================================================
AUTO LOGOUT IF MULTIPLE TABS
========================================================= */

if(localStorage.getItem(
"quickpress_admin_open"
)){

alert(
"Admin Panel Already Open"
);

window.location.href =
"login.html";

}

/* ========================================= */

localStorage.setItem(
"quickpress_admin_open",
"true"
);

/* ========================================= */

window.addEventListener(
"beforeunload",
()=>{

localStorage.removeItem(
"quickpress_admin_open"
);

}
);

/* =========================================================
ONLINE CHECK
========================================================= */

window.addEventListener(
"offline",
()=>{

alert(
"Internet Disconnected"
);

}
);

/* =========================================================
LOGOUT FUNCTION
========================================================= */

function logoutAdmin(){

localStorage.removeItem(
"quickpress_admin"
);

localStorage.removeItem(
"quickpress_admin_name"
);

localStorage.removeItem(
"quickpress_admin_role"
);

localStorage.removeItem(
"quickpress_login_time"
);

window.location.href =
"login.html";

}

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Security Active"
);