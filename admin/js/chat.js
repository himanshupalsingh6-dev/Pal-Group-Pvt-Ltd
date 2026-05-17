/* =========================================================
FILE : admin/js/chat.js
QUICKPRESS ENTERPRISE LIVE CHAT SYSTEM
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
serverTimestamp

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

<div
style="
text-align:center;
">

<div
style="
font-size:90px;
margin-bottom:20px;
">

🖥️

</div>

<h1
style="
font-size:42px;
font-weight:900;
margin-bottom:10px;
">

Desktop Only

</h1>

<p
style="
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

const chatUsers =
document.getElementById(
"chatUsers"
);

const messages =
document.getElementById(
"messages"
);

const sendBtn =
document.getElementById(
"sendBtn"
);

const messageInput =
document.getElementById(
"messageInput"
);

const emptyState =
document.getElementById(
"emptyState"
);

const activeChat =
document.getElementById(
"activeChat"
);

const topName =
document.getElementById(
"topName"
);

const topAvatar =
document.getElementById(
"topAvatar"
);

const searchInput =
document.getElementById(
"searchInput"
);

/* =========================================================
DATA
========================================================= */

let selectedChatId = null;

let selectedUser = null;

let allChats = [];

/* =========================================================
LOAD CHAT USERS
========================================================= */

onSnapshot(

query(
collection(db,"chatUsers"),
orderBy("updatedAt","desc")
),

(snapshot)=>{

chatUsers.innerHTML = "";

allChats = [];

/* ========================================= */

snapshot.forEach((docSnap)=>{

const user = {

id:docSnap.id,
...docSnap.data()

};

allChats.push(user);

/* ========================================= */

renderUser(user);

});

}

/* END */

);

/* =========================================================
RENDER USER
========================================================= */

function renderUser(user){

const search =
searchInput.value
.toLowerCase();

/* ========================================= */

if(
search &&
!(
(user.name || "")
.toLowerCase()
.includes(search)
)
){

return;

}

/* ========================================= */

const activeClass =
selectedChatId === user.id

?

"active"

:

"";

/* ========================================= */

const html = `

<div
class="chatUser ${activeClass}"
onclick="openChat('${user.id}')">

<div class="avatar">

${(user.name || "U")
.charAt(0)
.toUpperCase()}

<div class="onlineDot"></div>

</div>

<div class="userInfo">

<h3>

${user.name || "User"}

</h3>

<p>

${user.lastMessage || "No messages"}

</p>

</div>

<div class="chatTime">

${user.lastTime || ""}

</div>

</div>

`;

chatUsers.innerHTML += html;

}

/* =========================================================
SEARCH
========================================================= */

searchInput.addEventListener(
"input",
()=>{

chatUsers.innerHTML = "";

allChats.forEach((user)=>{

renderUser(user);

});

});

/* =========================================================
OPEN CHAT
========================================================= */

window.openChat =
(chatId)=>{

selectedChatId = chatId;

/* ========================================= */

selectedUser =
allChats.find(
(u)=>u.id === chatId
);

/* ========================================= */

if(!selectedUser){

return;

}

/* ========================================= */

emptyState.style.display =
"none";

activeChat.style.display =
"flex";

/* ========================================= */

topName.innerHTML =
selectedUser.name || "User";

topAvatar.innerHTML = `

${(selectedUser.name || "U")
.charAt(0)
.toUpperCase()}

<div class="onlineDot"></div>

`;

/* ========================================= */

loadMessages(chatId);

/* ========================================= */

chatUsers.innerHTML = "";

allChats.forEach((user)=>{

renderUser(user);

});

};

/* =========================================================
LOAD MESSAGES
========================================================= */

function loadMessages(chatId){

onSnapshot(

query(
collection(
db,
"chats",
chatId,
"messages"
),
orderBy("createdAt","asc")
),

(snapshot)=>{

messages.innerHTML = "";

/* ========================================= */

snapshot.forEach((docSnap)=>{

const msg =
docSnap.data();

/* ========================================= */

const isAdmin =
msg.sender === "admin";

/* ========================================= */

const className =
isAdmin

?

"adminMessage"

:

"userMessage";

/* ========================================= */

const time =
msg.createdAt?.seconds

?

new Date(
msg.createdAt.seconds * 1000
).toLocaleTimeString()

:

"--";

/* ========================================= */

const html = `

<div class="message ${className}">

${msg.text || ""}

<div class="msgTime">

${time}

</div>

</div>

`;

messages.innerHTML += html;

});

/* ========================================= */

messages.scrollTop =
messages.scrollHeight;

}

/* END */

);

}

/* =========================================================
SEND MESSAGE
========================================================= */

sendBtn.addEventListener(
"click",
sendMessage
);

messageInput.addEventListener(
"keypress",
(e)=>{

if(e.key === "Enter"){

sendMessage();

}

});

/* =========================================================
SEND FUNCTION
========================================================= */

async function sendMessage(){

const text =
messageInput.value.trim();

/* ========================================= */

if(!text){

return;

}

/* ========================================= */

if(!selectedChatId){

return;

}

/* ========================================= */

await addDoc(

collection(
db,
"chats",
selectedChatId,
"messages"
),

{

text,
sender:"admin",

createdAt:
serverTimestamp()

}

);

/* ========================================= */

messageInput.value = "";

}

/* =========================================================
AUTO CREATE DEMO USER
========================================================= */

console.log(
"QuickPress Live Chat Active"
);
