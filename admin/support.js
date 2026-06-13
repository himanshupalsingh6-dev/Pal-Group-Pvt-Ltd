/* =========================================================
QUICKPRESS SUPPORT PANEL
FILE: support.js
PART 1/5
========================================================= */

/* =========================================================
FIREBASE IMPORTS
========================================================= */

import { db } from "../firebase/firebase.js";

import {

collection,
getDocs,
addDoc,
doc,
serverTimestamp,
query,
orderBy

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
COLLECTIONS
========================================================= */

const SUPPORT_COLLECTION =
"supportTickets";

const REPLIES_COLLECTION =
"supportReplies";

const LIVE_CHAT_COLLECTION =
"liveChatRequests";

const AGENTS_COLLECTION =
"supportAgents";

/* =========================================================
GLOBAL STATE
========================================================= */

let tickets = [];
let replies = [];
let liveChats = [];
let agents = [];

let selectedTicket = null;

/* =========================================================
HELPERS
========================================================= */

function setText(
id,
value
){

const el =
document.getElementById(id);

if(el){

el.innerText =
value;

}

}

function formatDate(
date
){

if(!date)
return "-";

try{

if(date.seconds){

return new Date(
date.seconds * 1000
)

.toLocaleString(
"en-IN"
);

}

return new Date(date)

.toLocaleString(
"en-IN"
);

}catch{

return "-";

}

}

/* =========================================================
LOAD TICKETS
========================================================= */

async function loadTickets(){

try{

const snapshot =

await getDocs(

query(

collection(
db,
SUPPORT_COLLECTION
),

orderBy(
"createdAt",
"desc"
)

)

);

tickets = [];

snapshot.forEach(docSnap=>{

tickets.push({

id:docSnap.id,

...docSnap.data()

});

});

console.log(
"Tickets Loaded:",
tickets.length
);

}catch(error){

console.error(
"Ticket Load Error",
error
);

}

}

/* =========================================================
LOAD REPLIES
========================================================= */

async function loadReplies(){

try{

const snapshot =

await getDocs(

collection(
db,
REPLIES_COLLECTION
)

);

replies = [];

snapshot.forEach(docSnap=>{

replies.push({

id:docSnap.id,

...docSnap.data()

});

});

}catch(error){

console.error(
error
);

}

}

/* =========================================================
LOAD LIVE CHATS
========================================================= */

async function loadLiveChats(){

try{

const snapshot =

await getDocs(

collection(
db,
LIVE_CHAT_COLLECTION
)

);

liveChats = [];

snapshot.forEach(docSnap=>{

liveChats.push({

id:docSnap.id,

...docSnap.data()

});

});

}catch(error){

console.error(
error
);

}

}

/* =========================================================
LOAD AGENTS
========================================================= */

async function loadAgents(){

try{

const snapshot =

await getDocs(

collection(
db,
AGENTS_COLLECTION
)

);

agents = [];

snapshot.forEach(docSnap=>{

agents.push({

id:docSnap.id,

...docSnap.data()

});

});

}catch(error){

console.error(
error
);

}

}

/* =========================================================
ANALYTICS
========================================================= */

function updateSupportAnalytics(){

setText(
"totalTickets",
tickets.length
);

setText(
"openTickets",

tickets.filter(

t=>t.status === "open"

).length

);

setText(
"pendingTickets",

tickets.filter(

t=>t.status === "pending"

).length

);

setText(
"resolvedTickets",

tickets.filter(

t=>t.status === "resolved"

).length

);

setText(
"criticalTickets",

tickets.filter(

t=>t.priority === "critical"

).length

);

setText(
"liveChats",
liveChats.length
);

setText(
"assignedTickets",

tickets.filter(
t=>t.assignedAgent
).length

);

}

/* =========================================================
MODALS
========================================================= */

window.openTicketModal =
function(){

document

.getElementById(
"ticketModal"
)

.classList.add(
"active"
);

};

window.closeTicketModal =
function(){

document

.getElementById(
"ticketModal"
)

.classList.remove(
"active"
);

};

/* =========================================================
CREATE TICKET
========================================================= */

window.saveTicket =
async function(){

try{

const ticketData = {

type:

document.getElementById(
"ticketType"
).value,

priority:

document.getElementById(
"ticketPriority"
).value,

userName:

document.getElementById(
"userName"
).value,

userPhone:

document.getElementById(
"userPhone"
).value,

orderId:

document.getElementById(
"orderId"
).value,

assignedAgent:

document.getElementById(
"assignedAgent"
).value,

subject:

document.getElementById(
"ticketSubject"
).value,

description:

document.getElementById(
"ticketDescription"
).value,

status:"open",

createdAt:
serverTimestamp()

};

await addDoc(

collection(
db,
SUPPORT_COLLECTION
),

ticketData

);

closeTicketModal();

await loadTickets();

updateSupportAnalytics();

renderTickets();

alert(
"Ticket Created Successfully"
);

}catch(error){

console.error(
error
);

alert(
"Ticket Creation Failed"
);

}

};/* =========================================================
RENDER TICKETS TABLE
========================================================= */

function renderTickets(){

const tbody =

document.getElementById(
"ticketTableBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

tickets.forEach(ticket=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>

${ticket.id}

</td>

<td>

${ticket.userName || "-"}

</td>

<td>

${ticket.type || "-"}

</td>

<td>

${ticket.subject || "-"}

</td>

<td>

${getPriorityBadge(
ticket.priority
)}

</td>

<td>

${getStatusBadge(
ticket.status
)}

</td>

<td>

${ticket.assignedAgent || "-"}

</td>

<td>

${formatDate(
ticket.createdAt
)}

</td>

<td>

<button
class="primaryBtn"
onclick="viewTicket(
'${ticket.id}'
)">

View

</button>

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
STATUS BADGE
========================================================= */

function getStatusBadge(
status
){

switch(status){

case "open":

return `
<span class="statusOpen">
Open
</span>
`;

case "pending":

return `
<span class="statusPending">
Pending
</span>
`;

case "resolved":

return `
<span class="statusResolved">
Resolved
</span>
`;

case "closed":

return `
<span class="statusClosed">
Closed
</span>
`;

default:

return `
<span class="statusOpen">
Open
</span>
`;

}

}

/* =========================================================
PRIORITY BADGE
========================================================= */

function getPriorityBadge(
priority
){

switch(priority){

case "critical":

return `
<span style="
background:#FEE2E2;
color:#DC2626;
padding:6px 12px;
border-radius:20px;
font-weight:700;
">
Critical
</span>
`;

case "high":

return `
<span style="
background:#FEF3C7;
color:#D97706;
padding:6px 12px;
border-radius:20px;
font-weight:700;
">
High
</span>
`;

case "medium":

return `
<span style="
background:#DBEAFE;
color:#2563EB;
padding:6px 12px;
border-radius:20px;
font-weight:700;
">
Medium
</span>
`;

default:

return `
<span style="
background:#DCFCE7;
color:#16A34A;
padding:6px 12px;
border-radius:20px;
font-weight:700;
">
Low
</span>
`;

}

}

/* =========================================================
VIEW TICKET
========================================================= */

window.viewTicket =
function(ticketId){

const ticket =

tickets.find(

item=>item.id === ticketId

);

if(!ticket)
return;

selectedTicket =
ticket;

updateTicketDetails(
ticket
);

renderTicketReplies(
ticket.id
);

renderTicketTimeline(
ticket.id
);

};

/* =========================================================
UPDATE DETAILS PANEL
========================================================= */

function updateTicketDetails(
ticket
){

setText(
"detailTicketId",
ticket.id
);

setText(
"detailUser",
ticket.userName || "-"
);

setText(
"detailType",
ticket.type || "-"
);

setText(
"detailPriority",
ticket.priority || "-"
);

setText(
"detailStatus",
ticket.status || "-"
);

setText(
"detailAgent",
ticket.assignedAgent || "-"
);

setText(
"detailOrderId",
ticket.orderId || "-"
);

setText(
"detailDescription",
ticket.description || "-"
);

}

/* =========================================================
RENDER REPLIES
========================================================= */

function renderTicketReplies(
ticketId
){

const container =

document.getElementById(
"replyTimeline"
);

if(!container)
return;

container.innerHTML = "";

const ticketReplies =

replies.filter(

reply=>

reply.ticketId === ticketId

);

ticketReplies.forEach(reply=>{

const item =
document.createElement(
"div"
);

item.className =
"replyItem";

item.innerHTML = `

<strong>

${reply.agentName || "Support"}

</strong>

<p>

${reply.message}

</p>

<small>

${formatDate(
reply.createdAt
)}

</small>

`;

container.appendChild(
item
);

});

}

/* =========================================================
RENDER TIMELINE
========================================================= */

function renderTicketTimeline(
ticketId
){

const container =

document.getElementById(
"ticketTimeline"
);

if(!container)
return;

container.innerHTML = "";

const ticket =

tickets.find(

t=>t.id === ticketId

);

if(!ticket)
return;

const events = [

{
title:"Ticket Created",
time:ticket.createdAt
}

];

if(ticket.assignedAgent){

events.push({

title:
"Assigned To " +
ticket.assignedAgent,

time:
ticket.updatedAt ||
ticket.createdAt

});

}

if(ticket.status === "resolved"){

events.push({

title:
"Ticket Resolved",

time:
ticket.resolvedAt ||
ticket.updatedAt

});

}

if(ticket.status === "closed"){

events.push({

title:
"Ticket Closed",

time:
ticket.closedAt ||
ticket.updatedAt

});

}

events.forEach(event=>{

const item =
document.createElement(
"div"
);

item.className =
"timelineItem";

item.innerHTML = `

<strong>

${event.title}

</strong>

<br>

<small>

${formatDate(
event.time
)}

</small>

`;

container.appendChild(
item
);

});

}

/* =========================================================
TICKET COUNTERS
========================================================= */

function updateTicketTypeStats(){

setText(
"customerTickets",

tickets.filter(
t=>t.type === "customer"
).length

);

setText(
"partnerTickets",

tickets.filter(
t=>t.type === "partner"
).length

);

setText(
"driverTickets",

tickets.filter(
t=>t.type === "driver"
).length

);

setText(
"closedTickets",

tickets.filter(
t=>t.status === "closed"
).length

);

}/* =========================================================
LIVE CHAT REQUESTS TABLE
========================================================= */

function renderLiveChats(){

const tbody =

document.getElementById(
"liveChatBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

liveChats.forEach(chat=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${chat.id}</td>

<td>${chat.userName || "-"}</td>

<td>${chat.type || "-"}</td>

<td>${chat.message || "-"}</td>

<td>

${chat.status || "pending"}

</td>

<td>

${formatDate(
chat.createdAt
)}

</td>

<td>

<button
class="primaryBtn"
onclick="acceptLiveChat(
'${chat.id}'
)">

Accept

</button>

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
ACCEPT LIVE CHAT
========================================================= */

window.acceptLiveChat =
async function(chatId){

alert(
"Live Chat Accepted : " +
chatId
);

};

/* =========================================================
SUPPORT HISTORY
========================================================= */

function renderSupportHistory(){

const tbody =

document.getElementById(
"supportHistoryBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

tickets

.filter(

ticket=>

ticket.status === "resolved"

||

ticket.status === "closed"

)

.forEach(ticket=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${ticket.id}</td>

<td>${ticket.userName || "-"}</td>

<td>${ticket.subject || "-"}</td>

<td>${ticket.status}</td>

<td>

${ticket.assignedAgent || "-"}

</td>

<td>

${formatDate(
ticket.updatedAt ||
ticket.createdAt
)}

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
SEARCH FILTER
========================================================= */

function initTicketSearch(){

const searchInput =

document.getElementById(
"ticketSearch"
);

if(!searchInput)
return;

searchInput.addEventListener(

"input",

e=>{

const value =

e.target.value
.toLowerCase();

document

.querySelectorAll(
"#ticketTableBody tr"
)

.forEach(row=>{

row.style.display =

row.innerText

.toLowerCase()

.includes(value)

?

""

:

"none";

});

}

);

}

/* =========================================================
STATUS FILTER
========================================================= */

function initStatusFilter(){

const filter =

document.getElementById(
"statusFilter"
);

if(!filter)
return;

filter.addEventListener(

"change",

()=>{

const value =
filter.value;

document

.querySelectorAll(
"#ticketTableBody tr"
)

.forEach(row=>{

if(!value){

row.style.display = "";

return;

}

row.style.display =

row.innerText

.toLowerCase()

.includes(value)

?

""

:

"none";

});

}

);

}

/* =========================================================
PRIORITY FILTER
========================================================= */

function initPriorityFilter(){

const filter =

document.getElementById(
"priorityFilter"
);

if(!filter)
return;

filter.addEventListener(

"change",

()=>{

const value =
filter.value;

document

.querySelectorAll(
"#ticketTableBody tr"
)

.forEach(row=>{

if(!value){

row.style.display = "";

return;

}

row.style.display =

row.innerText

.toLowerCase()

.includes(value)

?

""

:

"none";

});

}

);

}

/* =========================================================
TYPE FILTER
========================================================= */

function initTypeFilter(){

const filter =

document.getElementById(
"typeFilter"
);

if(!filter)
return;

filter.addEventListener(

"change",

()=>{

const value =
filter.value;

document

.querySelectorAll(
"#ticketTableBody tr"
)

.forEach(row=>{

if(!value){

row.style.display = "";

return;

}

row.style.display =

row.innerText

.toLowerCase()

.includes(value)

?

""

:

"none";

});

}

);

}

/* =========================================================
EXPORT TICKETS CSV
========================================================= */

window.exportTicketsCSV =
function(){

let csv =

"Ticket ID,User,Type,Subject,Priority,Status\n";

tickets.forEach(ticket=>{

csv +=

`${ticket.id},
${ticket.userName},
${ticket.type},
${ticket.subject},
${ticket.priority},
${ticket.status}\n`;

});

downloadCSV(
csv,
"support-tickets.csv"
);

};

/* =========================================================
EXPORT REPLIES CSV
========================================================= */

window.exportRepliesCSV =
function(){

let csv =

"Ticket ID,Agent,Reply\n";

replies.forEach(reply=>{

csv +=

`${reply.ticketId},
${reply.agentName},
${reply.message}\n`;

});

downloadCSV(
csv,
"support-replies.csv"
);

};

/* =========================================================
EXPORT LIVE CHATS CSV
========================================================= */

window.exportLiveChatsCSV =
function(){

let csv =

"Chat ID,User,Message,Status\n";

liveChats.forEach(chat=>{

csv +=

`${chat.id},
${chat.userName},
${chat.message},
${chat.status}\n`;

});

downloadCSV(
csv,
"live-chats.csv"
);

};

/* =========================================================
CSV DOWNLOADER
========================================================= */

function downloadCSV(
csv,
filename
){

const blob =

new Blob(

[csv],

{

type:"text/csv"

}

);

const url =

URL.createObjectURL(
blob
);

const a =
document.createElement(
"a"
);

a.href = url;

a.download =
filename;

a.click();

URL.revokeObjectURL(
url
);

}

/* =========================================================
REFRESH SUPPORT HISTORY
========================================================= */

function refreshSupportHistory(){

renderSupportHistory();

renderLiveChats();

initTicketSearch();

initStatusFilter();

initPriorityFilter();

initTypeFilter();

console.log(
"Support History Updated"
);

}/* =========================================================
LOAD ALL SUPPORT DATA
========================================================= */

async function loadSupportData(){

try{

await Promise.all([

loadTickets(),
loadReplies(),
loadLiveChats(),
loadAgents()

]);

console.log(
"Support Data Loaded"
);

}catch(error){

console.error(
"Support Load Error",
error
);

}

}

/* =========================================================
AGENT ANALYTICS
========================================================= */

function updateAgentAnalytics(){

setText(
"activeAgents",
agents.length
);

setText(
"agentReplies",
replies.length
);

let topAgent = "-";
let maxReplies = 0;

const stats = {};

replies.forEach(reply=>{

const agent =

reply.agentName ||
"Support";

stats[agent] =

(stats[agent] || 0) + 1;

});

Object.keys(stats)

.forEach(agent=>{

if(

stats[agent] >

maxReplies

){

maxReplies =
stats[agent];

topAgent =
agent;

}

});

setText(
"topAgent",
topAgent
);

setText(
"fastestResolution",
"2h"
);

}

/* =========================================================
SUPPORT KPI
========================================================= */

function updateSupportKPIs(){

const total =
tickets.length || 1;

const resolved =

tickets.filter(

t=>

t.status === "resolved"

||

t.status === "closed"

).length;

const resolutionRate =

(

resolved /

total

*

100

).toFixed(1);

setText(
"resolutionRate",
resolutionRate + "%"
);

setText(
"satisfactionRate",
"95%"
);

setText(
"avgResponseTime",
"12m"
);

setText(
"systemHealth",
"99.9%"
);

setText(
"avgResolutionTime",
"4h"
);

}

/* =========================================================
REFRESH DASHBOARD
========================================================= */

function refreshSupportDashboard(){

updateSupportAnalytics();

updateTicketTypeStats();

updateAgentAnalytics();

updateSupportKPIs();

renderTickets();

refreshSupportHistory();

refreshSelectedTicket();

console.log(
"Support Dashboard Refreshed"
);

}

/* =========================================================
RESET FORM
========================================================= */

function resetTicketForm(){

document.getElementById(
"ticketId"
).value = "";

document.getElementById(
"ticketType"
).value = "customer";

document.getElementById(
"ticketPriority"
).value = "low";

document.getElementById(
"userName"
).value = "";

document.getElementById(
"userPhone"
).value = "";

document.getElementById(
"orderId"
).value = "";

document.getElementById(
"assignedAgent"
).value = "";

document.getElementById(
"ticketSubject"
).value = "";

document.getElementById(
"ticketDescription"
).value = "";

}

/* =========================================================
MODAL OVERRIDE
========================================================= */

const originalCloseTicketModal =
window.closeTicketModal;

window.closeTicketModal =
function(){

resetTicketForm();

originalCloseTicketModal();

};

/* =========================================================
AUTO REFRESH
========================================================= */

setInterval(

async ()=>{

await loadSupportData();

refreshSupportDashboard();

},

300000

);

/* =========================================================
GLOBAL EXPORTS
========================================================= */

window.supportApp = {

loadTickets,
loadReplies,
loadLiveChats,
loadAgents,

saveTicket,

viewTicket,

sendReply,

saveInternalNote,

assignTicket,

markPending,

resolveTicket,

closeTicket,

renderTickets,

renderSupportHistory,

renderLiveChats,

refreshSupportDashboard,

exportTicketsCSV,

exportRepliesCSV,

exportLiveChatsCSV

};

/* =========================================================
INITIALIZATION
========================================================= */

document.addEventListener(

"DOMContentLoaded",

async ()=>{

try{

console.log(
"QuickPress Support Starting..."
);

await loadSupportData();

refreshSupportDashboard();

console.log(
"QuickPress Support Ready 🚀"
);

}catch(error){

console.error(

"Support Initialization Error",

error

);

}

}

);

/* =========================================================
END OF FILE
QUICKPRESS SUPPORT PANEL
========================================================= */
/* =========================================================
SEND REPLY
========================================================= */

window.sendReply =
async function(){

try{

if(!selectedTicket){

alert(
"Select Ticket First"
);

return;

}

const message =

document.getElementById(
"ticketReply"
).value
.trim();

if(!message){

alert(
"Reply Required"
);

return;

}

await addDoc(

collection(
db,
REPLIES_COLLECTION
),

{

ticketId:
selectedTicket.id,

agentName:
"Support Team",

message,

createdAt:
serverTimestamp()

}

);

document.getElementById(
"ticketReply"
).value = "";

await loadReplies();

renderTicketReplies(
selectedTicket.id
);

alert(
"Reply Sent"
);

}catch(error){

console.error(
error
);

alert(
"Reply Failed"
);

}

};

/* =========================================================
SAVE INTERNAL NOTE
========================================================= */

window.saveInternalNote =
async function(){

try{

if(!selectedTicket){

alert(
"Select Ticket First"
);

return;

}

const note =

document.getElementById(
"internalNote"
).value
.trim();

if(!note){

alert(
"Note Required"
);

return;

}

await updateDoc(

doc(
db,
SUPPORT_COLLECTION,
selectedTicket.id
),

{

internalNote:note,

updatedAt:
serverTimestamp()

}

);

alert(
"Note Saved"
);

}catch(error){

console.error(
error
);

alert(
"Save Failed"
);

}

};

/* =========================================================
ASSIGN TICKET
========================================================= */

window.assignTicket =
async function(){

try{

if(!selectedTicket){

alert(
"Select Ticket First"
);

return;

}

const agent = prompt(
"Enter Agent Name"
);

if(!agent)
return;

await updateDoc(

doc(
db,
SUPPORT_COLLECTION,
selectedTicket.id
),

{

assignedAgent:agent,

updatedAt:
serverTimestamp()

}

);

await loadTickets();

renderTickets();

const updated =

tickets.find(
t=>t.id === selectedTicket.id
);

if(updated){

selectedTicket =
updated;

updateTicketDetails(
updated
);

}

alert(
"Ticket Assigned"
);

}catch(error){

console.error(
error
);

}

};

/* =========================================================
MARK PENDING
========================================================= */

window.markPending =
async function(){

try{

if(!selectedTicket){

alert(
"Select Ticket First"
);

return;

}

await updateDoc(

doc(
db,
SUPPORT_COLLECTION,
selectedTicket.id
),

{

status:"pending",

updatedAt:
serverTimestamp()

}

);

await loadTickets();

renderTickets();

updateSupportAnalytics();

alert(
"Marked Pending"
);

}catch(error){

console.error(
error
);

}

};

/* =========================================================
RESOLVE TICKET
========================================================= */

window.resolveTicket =
async function(){

try{

if(!selectedTicket){

alert(
"Select Ticket First"
);

return;

}

await updateDoc(

doc(
db,
SUPPORT_COLLECTION,
selectedTicket.id
),

{

status:"resolved",

resolvedAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

}

);

await loadTickets();

renderTickets();

updateSupportAnalytics();

updateTicketTypeStats();

alert(
"Ticket Resolved"
);

}catch(error){

console.error(
error
);

}

};

/* =========================================================
CLOSE TICKET
========================================================= */

window.closeTicket =
async function(){

try{

if(!selectedTicket){

alert(
"Select Ticket First"
);

return;

}

await updateDoc(

doc(
db,
SUPPORT_COLLECTION,
selectedTicket.id
),

{

status:"closed",

closedAt:
serverTimestamp(),

updatedAt:
serverTimestamp()

}

);

await loadTickets();

renderTickets();

updateSupportAnalytics();

updateTicketTypeStats();

alert(
"Ticket Closed"
);

}catch(error){

console.error(
error
);

}

};

/* =========================================================
REFRESH CURRENT TICKET
========================================================= */

function refreshSelectedTicket(){

if(!selectedTicket)
return;

const updated =

tickets.find(

t=>t.id === selectedTicket.id

);

if(!updated)
return;

selectedTicket =
updated;

updateTicketDetails(
updated
);

renderTicketReplies(
updated.id
);

renderTicketTimeline(
updated.id
);

}
