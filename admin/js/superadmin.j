/* =========================================================
FILE : admin/js/superadmin.js
QUICKPRESS SUPER ADMIN PANEL
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
query,
orderBy,
onSnapshot,
addDoc,
updateDoc,
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

const adminRole =
localStorage.getItem(
"quickpress_admin_role"
);

/* ========================================= */

if(adminLogin !== "true"){

window.location.href =
"login.html";

}

/* ========================================= */

if(
adminRole !== "Super Admin"
){

alert(
"Access Denied"
);

window.location.href =
"index.html";

}

/* =========================================================
ELEMENTS
========================================================= */

const adminContainer =
document.getElementById(
"adminContainer"
);

const totalAdmins =
document.getElementById(
"totalAdmins"
);

const superAdmins =
document.getElementById(
"superAdmins"
);

const managerAdmins =
document.getElementById(
"managerAdmins"
);

const supportAdmins =
document.getElementById(
"supportAdmins"
);

/* =========================================================
REALTIME ADMINS
========================================================= */

onSnapshot(

query(
collection(db,"admins"),
orderBy("createdAt","desc")
),

(snapshot)=>{

adminContainer.innerHTML = "";

/* ========================================= */

let total = 0;
let superCount = 0;
let managerCount = 0;
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

if(admin.role === "Manager"){

managerCount++;

}

if(admin.role === "Support"){

supportCount++;

}

/* ========================================= */

renderAdmin(
admin
);

});

/* ========================================= */

totalAdmins.innerHTML =
total;

superAdmins.innerHTML =
superCount;

managerAdmins.innerHTML =
managerCount;

supportAdmins.innerHTML =
supportCount;

}

/* END */

);

/* =========================================================
RENDER ADMIN
========================================================= */

function renderAdmin(admin){

let roleClass =
"manager";

/* ========================================= */

if(
admin.role === "Super Admin"
){

roleClass =
"super";

}

if(
admin.role === "Support"
){

roleClass =
"support";

}

/* ========================================= */

let statusClass =
"active";

/* ========================================= */

if(
admin.status === "Disabled"
){

statusClass =
"disabled";

}

/* ========================================= */

const row = `

<div class="adminRow">

<!-- ADMIN -->

<div class="adminInfo">

<div class="avatar">

${(admin.name || "A")
.charAt(0)
.toUpperCase()}

</div>

<div>

<b>

${admin.name || "--"}

</b>

<br>

${admin.email || "--"}

</div>

</div>

<!-- ROLE -->

<div>

<div class="badge ${roleClass}">

${admin.role || "--"}

</div>

</div>

<!-- STATUS -->

<div>

<div class="badge ${statusClass}">

${admin.status || "Active"}

</div>

</div>

<!-- LAST LOGIN -->

<div>

${admin.lastLogin || "--"}

</div>

<!-- PERMISSION -->

<div>

${admin.permissions || "Full"}

</div>

<!-- ACTION -->

<div class="actionBtns">

<button
class="actionBtn editBtn"
onclick="editAdmin('${admin.id}')">

Edit

</button>

<button
class="actionBtn deleteBtn"
onclick="deleteAdmin('${admin.id}')">

Delete

</button>

</div>

</div>

`;

adminContainer.innerHTML += row;

}

/* =========================================================
CREATE ADMIN
========================================================= */

window.createAdmin =
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
"Role : Super Admin / Manager / Support"
);

/* ========================================= */

await addDoc(

collection(
db,
"admins"
),

{

name,
email,
role,

status:"Active",

permissions:
role === "Support"
? "Limited"
: "Full",

lastLogin:
new Date()
.toLocaleString(),

createdAt:
new Date()

}

);

/* ========================================= */

alert(
"Admin Created"
);

};

/* =========================================================
EDIT ADMIN
========================================================= */

window.editAdmin =
async(id)=>{

const role =
prompt(
"Update Role : Super Admin / Manager / Support"
);

const status =
prompt(
"Status : Active / Disabled"
);

/* ========================================= */

await updateDoc(

doc(
db,
"admins",
id
),

{

role,
status,

permissions:
role === "Support"
? "Limited"
: "Full"

}

);

/* ========================================= */

alert(
"Admin Updated"
);

};

/* =========================================================
DELETE ADMIN
========================================================= */

window.deleteAdmin =
async(id)=>{

const confirmDelete =
confirm(
"Delete Admin?"
);

/* ========================================= */

if(!confirmDelete){

return;

}

/* ========================================= */

await deleteDoc(

doc(
db,
"admins",
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
"QuickPress Super Admin Active"
);
