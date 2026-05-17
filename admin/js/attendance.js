/* =========================================================
FILE : admin/js/attendance.js
QUICKPRESS STAFF ATTENDANCE SYSTEM
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
doc,
updateDoc

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

const attendanceContainer =
document.getElementById(
"attendanceContainer"
);

const searchInput =
document.getElementById(
"searchInput"
);

const statusFilter =
document.getElementById(
"statusFilter"
);

const presentCount =
document.getElementById(
"presentCount"
);

const absentCount =
document.getElementById(
"absentCount"
);

const lateCount =
document.getElementById(
"lateCount"
);

const totalStaff =
document.getElementById(
"totalStaff"
);

/* =========================================================
DATA
========================================================= */

let allAttendance = [];

/* =========================================================
REALTIME ATTENDANCE
========================================================= */

onSnapshot(

query(
collection(db,"attendance"),
orderBy("createdAt","desc")
),

(snapshot)=>{

attendanceContainer.innerHTML = "";

allAttendance = [];

/* ========================================= */

let present = 0;
let absent = 0;
let late = 0;
let total = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const staff = {

id:docSnap.id,
...docSnap.data()

};

allAttendance.push(staff);

/* ========================================= */

total++;

/* ========================================= */

if(staff.status === "Present"){

present++;

}

if(staff.status === "Absent"){

absent++;

}

if(staff.status === "Late"){

late++;

}

/* ========================================= */

renderAttendance(staff);

});

/* ========================================= */

presentCount.innerHTML =
present;

absentCount.innerHTML =
absent;

lateCount.innerHTML =
late;

totalStaff.innerHTML =
total;

}

/* END */

);

/* =========================================================
RENDER ATTENDANCE
========================================================= */

function renderAttendance(staff){

const search =
searchInput.value
.toLowerCase();

const filter =
statusFilter.value;

/* ========================================= */

if(
search &&
!(
(staff.name || "")
.toLowerCase()
.includes(search)
)
){

return;

}

/* ========================================= */

if(
filter !== "All"
&&
staff.status !== filter
){

return;

}

/* ========================================= */

let badgeClass = "present";

/* ========================================= */

if(staff.status === "Absent"){

badgeClass = "absent";

}

if(staff.status === "Late"){

badgeClass = "late";

}

/* ========================================= */

const row = `

<div class="attendanceRow">

<!-- STAFF -->

<div class="user">

<div class="avatar">

${(staff.name || "S")
.charAt(0)
.toUpperCase()}

</div>

<div>

<b>

${staff.name || "Staff"}

</b>

</div>

</div>

<!-- ROLE -->

<div>

${staff.role || "--"}

</div>

<!-- CHECK IN -->

<div>

${staff.checkIn || "--"}

</div>

<!-- CHECK OUT -->

<div>

${staff.checkOut || "--"}

</div>

<!-- STATUS -->

<div>

<div class="badge ${badgeClass}">

${staff.status || "--"}

</div>

</div>

<!-- ACTION -->

<div>

<button
class="actionBtn"
onclick="checkoutStaff('${staff.id}')">

Check Out

</button>

</div>

</div>

`;

attendanceContainer.innerHTML += row;

}

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"input",
reloadAttendance
);

statusFilter.addEventListener(
"change",
reloadAttendance
);

/* =========================================================
RELOAD
========================================================= */

function reloadAttendance(){

attendanceContainer.innerHTML = "";

allAttendance.forEach((staff)=>{

renderAttendance(staff);

});

}

/* =========================================================
MARK ATTENDANCE
========================================================= */

window.markAttendance =
async()=>{

const name =
prompt(
"Staff Name"
);

if(!name){

return;

}

/* ========================================= */

const role =
prompt(
"Role"
);

const status =
prompt(
"Status : Present / Absent / Late"
);

/* ========================================= */

await addDoc(

collection(
db,
"attendance"
),

{

name,
role,
status,

checkIn:
new Date()
.toLocaleTimeString(),

checkOut:"--",

createdAt:
new Date()

}

);

/* ========================================= */

alert(
"Attendance Marked"
);

};

/* =========================================================
CHECK OUT
========================================================= */

window.checkoutStaff =
async(id)=>{

await updateDoc(

doc(
db,
"attendance",
id
),

{

checkOut:
new Date()
.toLocaleTimeString()

}

);

/* ========================================= */

alert(
"Check Out Updated"
);

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Attendance System Active"
);
