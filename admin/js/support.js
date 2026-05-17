/* =========================================================
FILE : admin/js/support.js
QUICKPRESS SUPPORT CENTER
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot,
query,
orderBy,
doc,
updateDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
ELEMENTS
========================================================= */

const ticketList =
document.getElementById(
"ticketList"
);

const totalTickets =
document.getElementById(
"totalTickets"
);

const pendingTickets =
document.getElementById(
"pendingTickets"
);

const solvedTickets =
document.getElementById(
"solvedTickets"
);

const todayTickets =
document.getElementById(
"todayTickets"
);

/* =========================================================
REALTIME SUPPORT
========================================================= */

onSnapshot(

query(
collection(db,"supportTickets"),
orderBy("createdAt","desc")
),

(snapshot)=>{

ticketList.innerHTML = "";

/* ========================================= */

let total = 0;
let pending = 0;
let solved = 0;
let today = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const ticket = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

total++;

/* ========================================= */

if(ticket.status === "Pending"){

pending++;

}else{

solved++;

}

/* ========================================= */

if(ticket.createdAt?.seconds){

const date =
new Date(
ticket.createdAt.seconds * 1000
).toDateString();

if(
date ===
new Date().toDateString()
){

today++;

}

}

/* ========================================= */

const statusClass =
ticket.status === "Solved"

?

"solved"

:

"pending";

/* ========================================= */

const card = `

<div class="ticketCard">

<div class="ticketLeft">

<div class="ticketIcon">

🎧

</div>

<div class="ticketInfo">

<h3>

${ticket.subject || "Support Ticket"}

</h3>

<p>

${ticket.message || ""}

</p>

</div>

</div>

<div>

<div class="status ${statusClass}">

${ticket.status || "Pending"}

</div>

</div>

</div>

`;

ticketList.innerHTML += card;

});

/* ========================================= */

totalTickets.innerHTML =
total;

pendingTickets.innerHTML =
pending;

solvedTickets.innerHTML =
solved;

todayTickets.innerHTML =
today;

}

/* END */

);
