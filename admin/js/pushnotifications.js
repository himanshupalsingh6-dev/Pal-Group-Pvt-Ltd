/* =========================================================
FILE : admin/js/pushnotifications.js
QUICKPRESS PUSH NOTIFICATION CENTER
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
ELEMENTS
========================================================= */

const notificationContainer =
document.getElementById(
"notificationContainer"
);

const titleInput =
document.getElementById(
"titleInput"
);

const targetInput =
document.getElementById(
"targetInput"
);

const messageInput =
document.getElementById(
"messageInput"
);

/* =========================================================
REALTIME NOTIFICATIONS
========================================================= */

onSnapshot(

query(
collection(db,"pushNotifications"),
orderBy("createdAt","desc")
),

(snapshot)=>{

notificationContainer.innerHTML = "";

/* ========================================= */

snapshot.forEach((docSnap)=>{

const notification = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

renderNotification(
notification
);

});

}

/* END */

);

/* =========================================================
RENDER NOTIFICATION
========================================================= */

function renderNotification(
notification
){

let badgeClass =
"sent";

/* ========================================= */

if(
notification.status === "Failed"
){

badgeClass =
"failed";

}

if(
notification.status === "Pending"
){

badgeClass =
"pending";

}

/* ========================================= */

const row = `

<div class="notificationRow">

<!-- TITLE -->

<div>

<b>

${notification.title || "--"}

</b>

<br>

${notification.message || "--"}

</div>

<!-- TARGET -->

<div>

${notification.target || "--"}

</div>

<!-- DATE -->

<div>

${notification.date || "--"}

</div>

<!-- STATUS -->

<div>

<div class="badge ${badgeClass}">

${notification.status || "Sent"}

</div>

</div>

<!-- ADMIN -->

<div>

${notification.sentBy || "Admin"}

</div>

</div>

`;

notificationContainer.innerHTML += row;

}

/* =========================================================
SEND NOTIFICATION
========================================================= */

window.sendNotification =
async()=>{

const title =
titleInput.value.trim();

const target =
targetInput.value;

const message =
messageInput.value.trim();

/* ========================================= */

if(
!title
||
!message
){

alert(
"Fill all fields"
);

return;

}

/* ========================================= */

await addDoc(

collection(
db,
"pushNotifications"
),

{

title,
target,
message,

status:"Sent",

sentBy:
localStorage.getItem(
"quickpress_admin_name"
)
||
"Admin",

date:
new Date()
.toLocaleString(),

createdAt:
new Date()

}

);

/* ========================================= */

titleInput.value = "";

messageInput.value = "";

/* ========================================= */

alert(
"Notification Sent"
);

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Push Notification Center Active"
);
