import { db }

from "../../firebase.js";

import {

collection,
onSnapshot,
doc,
updateDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* ========================================================= */

const complaintsContainer =
document.getElementById(
"complaintsContainer"
);

const detailsContainer =
document.getElementById(
"detailsContainer"
);

/* ========================================================= */

const totalComplaints =
document.getElementById(
"totalComplaints"
);

const pendingComplaints =
document.getElementById(
"pendingComplaints"
);

const resolvedComplaints =
document.getElementById(
"resolvedComplaints"
);

const refundRequests =
document.getElementById(
"refundRequests"
);

/* ========================================================= */

let allComplaints = [];

/* =========================================================
REALTIME
========================================================= */

onSnapshot(

collection(db,"complaints"),

(snapshot)=>{

complaintsContainer.innerHTML = "";

allComplaints = [];

let pending = 0;
let resolved = 0;
let refunds = 0;

const cities = [];

/* ========================================================= */

snapshot.forEach(docSnap=>{

const complaint =
docSnap.data();

complaint.id =
docSnap.id;

allComplaints.push(complaint);

/* ========================================================= */

if(complaint.status === "pending"){
pending++;
}

if(complaint.status === "resolved"){
resolved++;
}

if(complaint.type === "Refund"){
refunds++;
}

if(
complaint.city &&
!cities.includes(complaint.city)
){

cities.push(
complaint.city
);

}

});

/* ========================================================= */

totalComplaints.innerHTML =
allComplaints.length;

pendingComplaints.innerHTML =
pending;

resolvedComplaints.innerHTML =
resolved;

refundRequests.innerHTML =
refunds;

/* ========================================================= */

const cityFilter =
document.getElementById(
"cityFilter"
);

cityFilter.innerHTML =

`
<option value="">
City Wise
</option>
`;

/* ========================================================= */

cities.forEach(city=>{

cityFilter.innerHTML += `

<option value="${city}">
${city}
</option>

`;

});

/* ========================================================= */

renderComplaints(allComplaints);

}
);

/* =========================================================
RENDER
========================================================= */

function renderComplaints(data){

complaintsContainer.innerHTML = "";

/* ========================================================= */

data.forEach(item=>{

complaintsContainer.innerHTML += `

<div class="tableRow">

<div>
${item.complaintId || item.id}
</div>

<div>
${item.userName || '-'}
</div>

<div>
${item.type || '-'}
</div>

<div>
${item.orderId || '-'}
</div>

<div>

<div class="status ${item.priority || 'medium'}">

${item.priority || 'medium'}

</div>

</div>

<div>

<div class="status ${item.status || 'pending'}">

${item.status || 'pending'}

</div>

</div>

<div>
${item.assignedTo || 'Support'}
</div>

<div class="actions">

<button
class="actionBtn viewBtn"
onclick="viewComplaint('${item.id}')">

View

</button>

<button
class="actionBtn resolveBtn"
onclick="updateComplaint('${item.id}','resolved')">

Resolve

</button>

<button
class="actionBtn refundBtn"
onclick="updateComplaint('${item.id}','progress')">

Refund

</button>

</div>

</div>

`;

});

}

/* =========================================================
VIEW
========================================================= */

window.viewComplaint = (id)=>{

const item =
allComplaints.find(
c=>c.id === id
);

if(!item) return;

/* ========================================================= */

detailsContainer.innerHTML = `

<div class="detailRow">

Complaint ID:
${item.complaintId || item.id}

</div>

<div class="detailRow">

User:
${item.userName || '-'}

</div>

<div class="detailRow">

Type:
${item.type || '-'}

</div>

<div class="detailRow">

Order:
${item.orderId || '-'}

</div>

<div class="detailRow">

Priority:
${item.priority || '-'}

</div>

<div class="detailRow">

Status:
${item.status || '-'}

</div>

<div class="detailRow">

Message:
${item.message || 'No Message'}

</div>

<div class="detailRow">

Refund:
₹${item.refundAmount || 0}

</div>

<div class="detailRow">

Assigned:
${item.assignedTo || 'Support'}

</div>

<div class="detailRow">

Timeline:
10:00 Complaint Created

</div>

<div class="chatBox">

<div class="chatMessage">

Customer:
Please resolve fast

</div>

<div class="chatMessage">

Admin:
We are checking issue

</div>

</div>

<div class="actions"
style="margin-top:20px;">

<button
class="actionBtn resolveBtn">

Call User

</button>

<button
class="actionBtn refundBtn">

Approve Refund

</button>

<button
class="actionBtn viewBtn">

Close Ticket

</button>

</div>

`;

};

/* =========================================================
UPDATE
========================================================= */

window.updateComplaint =
async(id,status)=>{

await updateDoc(

doc(db,"complaints",id),

{

status

}

);

};

/* =========================================================
FILTERS
========================================================= */

document.getElementById(
"searchInput"
).addEventListener(
"keyup",
filterComplaints
);

document.getElementById(
"statusFilter"
).addEventListener(
"change",
filterComplaints
);

document.getElementById(
"priorityFilter"
).addEventListener(
"change",
filterComplaints
);

document.getElementById(
"typeFilter"
).addEventListener(
"change",
filterComplaints
);

document.getElementById(
"cityFilter"
).addEventListener(
"change",
filterComplaints
);

/* ========================================================= */

function filterComplaints(){

const search =

document.getElementById(
"searchInput"
).value.toLowerCase();

const status =

document.getElementById(
"statusFilter"
).value;

const priority =

document.getElementById(
"priorityFilter"
).value;

const type =

document.getElementById(
"typeFilter"
).value;

const city =

document.getElementById(
"cityFilter"
).value;

/* ========================================================= */

const filtered =

allComplaints.filter(item=>{

const matchSearch =

(item.userName || '')
.toLowerCase()
.includes(search);

const matchStatus =

status
?
item.status === status
:
true;

const matchPriority =

priority
?
item.priority === priority
:
true;

const matchType =

type
?
item.type === type
:
true;

const matchCity =

city
?
item.city === city
:
true;

return (

matchSearch &&
matchStatus &&
matchPriority &&
matchType &&
matchCity

);

});

/* ========================================================= */

renderComplaints(filtered);

}
