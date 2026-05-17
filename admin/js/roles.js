/* =========================================================
FILE : admin/js/roles.js
QUICKPRESS MULTI ADMIN ROLE SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot,
addDoc,
deleteDoc,
doc

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
">

<div>

<div style="
font-size:90px;
margin-bottom:20px;
">

🖥️

</div>

<h1 style="
font-size:42px;
font-weight:900;
margin-bottom:10px;
">

Desktop Only

</h1>

<p style="
font-size:15px;
color:#D1D5DB;
">

QuickPress Admin Panel only works on Desktop

</p>

</div>

</div>

`;

}

/* =========================================================
ELEMENTS
========================================================= */

const rolesGrid =
document.getElementById(
"rolesGrid"
);

const totalAdmins =
document.getElementById(
"totalAdmins"
);

const superAdmins =
document.getElementById(
"superAdmins"
);

const cityAdmins =
document.getElementById(
"cityAdmins"
);

const supportAdmins =
document.getElementById(
"supportAdmins"
);

/* =========================================================
REALTIME ROLES
========================================================= */

onSnapshot(

collection(db,"adminRoles"),

(snapshot)=>{

rolesGrid.innerHTML = "";

/* ========================================= */

let total = 0;
let superCount = 0;
let cityCount = 0;
let supportCount = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const admin = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

total++;

/* ========================================= */

if(admin.role === "Super Admin"){

superCount++;

}

if(admin.role === "City Manager"){

cityCount++;

}

if(admin.role === "Support Admin"){

supportCount++;

}

/* ========================================= */

renderRole(admin);

});

/* ========================================= */

totalAdmins.innerHTML =
total;

superAdmins.innerHTML =
superCount;

cityAdmins.innerHTML =
cityCount;

supportAdmins.innerHTML =
supportCount;

}

/* END */

);

/* =========================================================
RENDER ROLE
========================================================= */

function renderRole(admin){

let badgeClass = "city";

/* ========================================= */

if(admin.role === "Super Admin"){

badgeClass = "super";

}

if(admin.role === "Finance Admin"){

badgeClass = "finance";

}

if(admin.role === "Support Admin"){

badgeClass = "support";

}

/* ========================================= */

const html = `

<div class="roleCard">

<!-- TOP -->

<div class="roleTop">

<div class="roleUser">

<div class="avatar">

${(admin.name || "A")
.charAt(0)
.toUpperCase()}

</div>

<div>

<h3>

${admin.name || "Admin"}

</h3>

<p>

${admin.email || "--"}

</p>

</div>

</div>

<div class="roleBadge ${badgeClass}">

${admin.role || "City Manager"}

</div>

</div>

<!-- PERMISSIONS -->

<div class="permissionList">

<div class="permission">

<span>
Orders Access
</span>

<div class="switch"></div>

</div>

<div class="permission">

<span>
Finance Access
</span>

<div class="switch"></div>

</div>

<div class="permission">

<span>
Users Access
</span>

<div class="switch"></div>

</div>

<div class="permission">

<span>
Settlement Access
</span>

<div class="switch"></div>

</div>

</div>

<!-- BUTTONS -->

<div class="btnGrid">

<button
class="btn editBtn"
onclick="editAdmin('${admin.id}')">

Edit

</button>

<button
class="btn deleteBtn"
onclick="deleteAdmin('${admin.id}')">

Delete

</button>

</div>

</div>

`;

rolesGrid.innerHTML += html;

}

/* =========================================================
ADD ADMIN
========================================================= */

window.addAdmin =
async()=>{

const name =
prompt(
"Admin Name"
);

if(!name){

return;

}

/* ========================================= */

const email =
prompt(
"Admin Email"
);

const role =
prompt(
"Role : Super Admin / Finance Admin / Support Admin / City Manager"
);

/* ========================================= */

await addDoc(

collection(
db,
"adminRoles"
),

{

name,
email,
role,

createdAt:
new Date()

}

);

/* ========================================= */

alert(
"Admin Added Successfully"
);

};

/* =========================================================
EDIT ADMIN
========================================================= */

window.editAdmin =
(id)=>{

alert(
`Edit Admin : ${id}`
);

};

/* =========================================================
DELETE ADMIN
========================================================= */

window.deleteAdmin =
async(id)=>{

const confirmDelete =
confirm(
"Delete this admin?"
);

/* ========================================= */

if(!confirmDelete){

return;

}

/* ========================================= */

await deleteDoc(

doc(
db,
"adminRoles",
id
)

);

/* ========================================= */

alert(
"Admin Deleted"
);

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Multi Admin System Active"
);
