/* =========================================================
FILE : admin/js/login.js
QUICKPRESS ENTERPRISE SECURITY LOGIN
========================================================= */

/* =========================================================
LOGIN CREDENTIALS
========================================================= */

const ADMIN_ID =
"9258730561";

const ADMIN_PASS =
"4502";

/* =========================================================
ELEMENTS
========================================================= */

const loginForm =
document.getElementById(
"loginForm"
);

const adminId =
document.getElementById(
"adminId"
);

const adminPass =
document.getElementById(
"adminPass"
);

const loginBtn =
document.getElementById(
"loginBtn"
);

const errorBox =
document.getElementById(
"errorBox"
);

/* =========================================================
SECURITY STORAGE
========================================================= */

const MAX_ATTEMPTS = 5;

const BAN_HOURS = 24;

/* =========================================================
CHECK BAN
========================================================= */

function checkBan(){

const banData =
localStorage.getItem(
"quickpress_admin_ban"
);

if(!banData){

return false;

}

const banTime =
Number(banData);

const current =
Date.now();

/* ========================================= */

if(current > banTime){

localStorage.removeItem(
"quickpress_admin_ban"
);

localStorage.removeItem(
"quickpress_admin_attempts"
);

return false;

}

/* ========================================= */

const hoursLeft =
Math.ceil(
(banTime - current)
/
(1000 * 60 * 60)
);

/* ========================================= */

errorBox.style.display =
"block";

errorBox.innerHTML = `

❌ Too many wrong attempts

<br><br>

Admin Panel Locked

<br><br>

Try again after
${hoursLeft} hour

`;

/* ========================================= */

loginBtn.disabled =
true;

loginBtn.style.opacity =
"0.5";

return true;

}

/* =========================================================
INIT
========================================================= */

checkBan();

/* =========================================================
LOGIN
========================================================= */

loginForm.addEventListener(
"submit",

(e)=>{

e.preventDefault();

/* ========================================= */

if(checkBan()){

return;

}

/* ========================================= */

const id =
adminId.value.trim();

const pass =
adminPass.value.trim();

/* ========================================= */

if(
id === ADMIN_ID
&&
pass === ADMIN_PASS
){

/* =====================================
SUCCESS
===================================== */

localStorage.setItem(
"quickpress_admin",
"true"
);

localStorage.removeItem(
"quickpress_admin_attempts"
);

/* =====================================
REDIRECT
===================================== */

window.location.href =
"index.html";

return;

}

/* =====================================
FAILED LOGIN
===================================== */

let attempts =
Number(

localStorage.getItem(
"quickpress_admin_attempts"
)

|| 0

);

attempts++;

/* ===================================== */

localStorage.setItem(

"quickpress_admin_attempts",

attempts

);

/* =====================================
BAN SYSTEM
===================================== */

if(attempts >= MAX_ATTEMPTS){

const banUntil =
Date.now()
+
(BAN_HOURS * 60 * 60 * 1000);

/* ===================================== */

localStorage.setItem(

"quickpress_admin_ban",

banUntil

);

/* ===================================== */

errorBox.style.display =
"block";

errorBox.innerHTML = `

🚫 Too many wrong attempts

<br><br>

Admin Panel Locked
for 24 Hours

`;

/* ===================================== */

loginBtn.disabled =
true;

loginBtn.style.opacity =
"0.5";

return;

}

/* =====================================
ERROR
===================================== */

const left =
MAX_ATTEMPTS - attempts;

errorBox.style.display =
"block";

errorBox.innerHTML = `

❌ Wrong Admin ID or Password

<br><br>

Attempts Left :
${left}

`;

}

/* END */

);

/* =========================================================
BLOCK DIRECT ACCESS
========================================================= */

const isLoggedIn =
localStorage.getItem(
"quickpress_admin"
);

/* =========================================================
ALL ADMIN PAGES SECURITY
========================================================= */

if(

window.location.pathname
.includes("/admin/")

&&

!window.location.pathname
.includes("login.html")

){

if(isLoggedIn !== "true"){

window.location.href =
"login.html";

}

}

/* =========================================================
AUTO LOGOUT IF TAB CLOSED
========================================================= */

window.addEventListener(

"beforeunload",

()=>{

sessionStorage.setItem(
"quickpress_tab_close",
"true"
);

}

);

/* =========================================================
TAB SECURITY
========================================================= */

if(

sessionStorage.getItem(
"quickpress_tab_close"
)

){

console.log(
"Security Active"
);

}
