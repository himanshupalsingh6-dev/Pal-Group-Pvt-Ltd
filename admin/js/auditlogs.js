/* =========================================================
FILE : admin/js/auditlogs.js
QUICKPRESS AUDIT LOGS SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
query,
orderBy,
onSnapshot,
addDoc

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
">

<div style="text-align:center;">

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

const logsContainer =
document.getElementById(
"logsContainer"
);

const searchInput =
document.getElementById(
"searchInput"
);

const typeFilter =
document.getElementById(
"typeFilter"
);

const totalLogs =
document.getElementById(
"totalLogs"
);

const todayLogs =
document.getElementById(
"todayLogs"
);

const failedLogs =
document.getElementById(
"failedLogs"
);

const adminLogs =
document.getElementById(
"adminLogs"
);

/* =========================================================
DATA
========================================================= */

let allLogs = [];

/* =========================================================
REALTIME LOGS
========================================================= */

onSnapshot(

query(
collection(db,"auditLogs"),
orderBy("createdAt","desc")
),

(snapshot)=>{

logsContainer.innerHTML = "";

allLogs = [];

/* ========================================= */

let total = 0;
let today = 0;
let failed = 0;
let adminAction = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const log = {

id:docSnap.id,
...docSnap.data()

};

allLogs.push(log);

/* ========================================= */

total++;

/* ========================================= */

if(log.status === "Failed"){

failed++;

}

/* ========================================= */

if(log.admin){

adminAction++;

}

/* ========================================= */

if(log.createdAt?.seconds){

const logDate =
new Date(
log.createdAt.seconds * 1000
).toDateString();

const todayDate =
new Date()
.toDateString();

if(logDate === todayDate){

today++;

}

}

/* ========================================= */

renderLog(log);

});

/* ========================================= */

totalLogs.innerHTML =
total;

todayLogs.innerHTML =
today;

failedLogs.innerHTML =
failed;

adminLogs.innerHTML =
adminAction;

}

/* END */

);

/* =========================================================
RENDER LOG
========================================================= */

function renderLog(log){

const search =
searchInput.value
.toLowerCase();

const filter =
typeFilter.value;

/* ========================================= */

if(
search &&
!(
(log.description || "")
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
log.type !== filter
){

return;

}

/* ========================================= */

let badgeClass = "info";

/* ========================================= */

if(log.status === "Success"){

badgeClass = "success";

}

if(log.status === "Warning"){

badgeClass = "warning";

}

if(log.status === "Failed"){

badgeClass = "danger";

}

/* ========================================= */

const time =
log.createdAt?.seconds

?

new Date(
log.createdAt.seconds * 1000
).toLocaleString()

:

"--";

/* ========================================= */

const row = `

<div class="logRow">

<!-- ACTION -->

<div>

<b>

${log.type || "--"}

</b>

</div>

<!-- ADMIN -->

<div>

${log.admin || "System"}

</div>

<!-- DESC -->

<div>

${log.description || "--"}

</div>

<!-- TIME -->

<div>

${time}

</div>

<!-- STATUS -->

<div>

<div class="badge ${badgeClass}">

${log.status || "--"}

</div>

</div>

</div>

`;

logsContainer.innerHTML += row;

}

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"input",
reloadLogs
);

typeFilter.addEventListener(
"change",
reloadLogs
);

/* =========================================================
RELOAD
========================================================= */

function reloadLogs(){

logsContainer.innerHTML = "";

allLogs.forEach((log)=>{

renderLog(log);

});

}

/* =========================================================
CREATE DEMO LOG
========================================================= */

window.createDemoLog =
async()=>{

await addDoc(

collection(
db,
"auditLogs"
),

{

type:"Login",

admin:"Super Admin",

description:
"Admin logged into dashboard",

status:"Success",

createdAt:
new Date()

}

);

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Audit Logs Active"
);
