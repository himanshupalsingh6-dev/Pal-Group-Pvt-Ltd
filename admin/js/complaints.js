/* =========================================================
FILE : admin/js/complaints.js
QUICKPRESS CUSTOMER COMPLAINT CENTER
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
query,
orderBy,
onSnapshot,
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
ELEMENTS
========================================================= */

const complaintContainer =
document.getElementById(
"complaintContainer"
);

const totalComplaints =
document.getElementById(
"totalComplaints"
);

const pendingComplaints =
document.getElementById(
"pendingComplaints"
);

const processingComplaints =
document.getElementById(
"processingComplaints"
);

const resolvedComplaints =
document.getElementById(
"resolvedComplaints"
);

const searchInput =
document.getElementById(
"searchInput"
);

const statusFilter =
document.getElementById(
"statusFilter"
);

/* =========================================================
DATA
========================================================= */

let allComplaints = [];

/* =========================================================
REALTIME COMPLAINTS
========================================================= */

onSnapshot(

query(
collection(db,"complaints"),
orderBy("createdAt","desc")
),

(snapshot)=>{

complaintContainer.innerHTML = "";

allComplaints = [];

/* ========================================= */

let total = 0;
let pending = 0;
let processing = 0;
let resolved = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const complaint = {

id:docSnap.id,
...docSnap.data()

};

allComplaints.push(
complaint
);

/* ========================================= */

total++;

/* ========================================= */

if(
complaint.status === "Pending"
||
!complaint.status
){

pending++;

}

if(
complaint.status === "Processing"
){

processing++;

}

if(
complaint.status === "Resolved"
){

resolved++;

}

/* ========================================= */

renderComplaint(
complaint
);

});

/* ========================================= */

totalComplaints.innerHTML =
total;

pendingComplaints.innerHTML =
pending;

processingComplaints.innerHTML =
processing;

resolvedComplaints.innerHTML =
resolved;

}

/* END */

);

/* =========================================================
RENDER COMPLAINT
========================================================= */

function renderComplaint(
complaint
){

const search =
searchInput.value
.toLowerCase();

const filter =
statusFilter.value;

/* ========================================= */

if(
search &&
!(
(complaint.customerName || "")
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
(complaint.status || "Pending")
!== filter
){

return;

}

/* ========================================= */

let badgeClass =
"pending";

/* ========================================= */

if(
complaint.status === "Resolved"
){

badgeClass = "resolved";

}

if(
complaint.status === "Processing"
){

badgeClass = "processing";

}

/* ========================================= */

const row = `

<div class="complaintRow">

<!-- ID -->

<div>

#${complaint.ticketId || complaint.id}

</div>

<!-- CUSTOMER -->

<div>

<b>

${complaint.customerName || "--"}

</b>

<br>

${complaint.mobile || "--"}

</div>

<!-- ISSUE -->

<div>

${complaint.issue || "--"}

</div>

<!-- DATE -->

<div>

${complaint.date || "--"}

</div>

<!-- STATUS -->

<div>

<div class="badge ${badgeClass}">

${complaint.status || "Pending"}

</div>

</div>

<!-- ACTION -->

<div>

<button
class="actionBtn"
onclick="updateComplaint('${complaint.id}')">

Update

</button>

</div>

</div>

`;

complaintContainer.innerHTML += row;

}

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"input",
reloadComplaints
);

statusFilter.addEventListener(
"change",
reloadComplaints
);

/* =========================================================
RELOAD
========================================================= */

function reloadComplaints(){

complaintContainer.innerHTML = "";

allComplaints.forEach((complaint)=>{

renderComplaint(
complaint
);

});

}

/* =========================================================
UPDATE STATUS
========================================================= */

window.updateComplaint =
async(id)=>{

const status =
prompt(
"Update Status : Pending / Processing / Resolved"
);

/* ========================================= */

if(!status){

return;

}

/* ========================================= */

await updateDoc(

doc(
db,
"complaints",
id
),

{

status

}

);

/* ========================================= */

alert(
"Complaint Updated"
);

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Complaint Center Active"
);
