/* =========================================================
FILE : partner/login.js
QUICKPRESS PARTNER LOGIN SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
query,
where,
getDocs

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

const errorText =
document.getElementById(
"errorText"
);

/* =========================================================
ATTEMPTS SECURITY
========================================================= */

let loginAttempts =
Number(
localStorage.getItem(
"partner_login_attempts"
)
)
||
0;

/* ========================================= */

const bannedUntil =
localStorage.getItem(
"partner_banned_until"
);

/* ========================================= */

if(
bannedUntil
&&
Date.now() < Number(bannedUntil)
){

document.body.innerHTML = `

<div style="
height:100vh;
display:flex;
align-items:center;
justify-content:center;
font-family:Inter,sans-serif;
background:#F5F7FB;
">

<div style="
background:#fff;
padding:40px;
border-radius:28px;
text-align:center;
border:1px solid #E5E7EB;
">

<h1 style="
font-size:34px;
margin-bottom:18px;
">

Access Blocked

</h1>

<p style="
font-size:15px;
color:#6B7280;
line-height:1.7;
">

Too many wrong attempts.

<br><br>

Try again after 24 hours.

</p>

</div>

</div>

`;

throw new Error(
"Blocked"
);

}

/* =========================================================
LOGIN
========================================================= */

window.partnerLogin =
async()=>{

const partnerEmail =
email.value.trim();

const partnerPassword =
password.value.trim();

/* ========================================= */

if(
!partnerEmail
||
!partnerPassword
){

errorText.innerHTML =
"Fill all fields";

return;

}

/* ========================================= */

const partnerQuery =
query(

collection(db,"partners"),

where(
"email",
"==",
partnerEmail
),

where(
"password",
"==",
partnerPassword
)

);

/* ========================================= */

const snapshot =
await getDocs(
partnerQuery
);

/* ========================================= */

if(snapshot.empty){

loginAttempts++;

localStorage.setItem(
"partner_login_attempts",
loginAttempts
);

/* ========================================= */

errorText.innerHTML =
"Invalid Email or Password";

/* =========================================
5 ATTEMPTS BLOCK
========================================= */

if(loginAttempts >= 5){

const banTime =
Date.now()
+
24 * 60 * 60 * 1000;

/* ========================================= */

localStorage.setItem(
"partner_banned_until",
banTime
);

/* ========================================= */

alert(
"Too many wrong attempts. Blocked for 24 hours."
);

location.reload();

}

return;

}

/* =====================================================
SUCCESS LOGIN
===================================================== */

snapshot.forEach((docSnap)=>{

const partner =
docSnap.data();

/* ========================================= */

localStorage.setItem(
"quickpress_partner",
"true"
);

localStorage.setItem(
"quickpress_partner_id",
docSnap.id
);

localStorage.setItem(
"quickpress_partner_name",
partner.name || "Partner"
);

localStorage.setItem(
"quickpress_partner_email",
partner.email || ""
);

localStorage.setItem(
"quickpress_partner_city",
partner.city || ""
);

localStorage.setItem(
"quickpress_partner_login_time",
Date.now()
);

/* ========================================= */

localStorage.removeItem(
"partner_login_attempts"
);

/* ========================================= */

window.location.href =
"index.html";

});

};

/* =========================================================
ENTER KEY LOGIN
========================================================= */

document.addEventListener(
"keypress",
(e)=>{

if(e.key === "Enter"){

partnerLogin();

}

}
);

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Partner Login Active"
);