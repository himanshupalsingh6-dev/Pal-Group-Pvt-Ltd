/* =========================================================
FILE : admin/js/notifications.js
QUICKPRESS ENTERPRISE NOTIFICATION CENTER
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

const notificationList =
document.getElementById(
"notificationList"
);

const totalNotifications =
document.getElementById(
"totalNotifications"
);

const unreadNotifications =
document.getElementById(
"unreadNotifications"
);

const todayNotifications =
document.getElementById(
"todayNotifications"
);

/* =========================================================
REALTIME NOTIFICATIONS
========================================================= */

onSnapshot(

query(
collection(db,"notifications"),
orderBy("createdAt","desc")
),

(snapshot)=>{

notificationList.innerHTML = "";

/* ========================================= */

let total = 0;

let unread = 0;

let today = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const notify = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

total++;

/* ========================================= */

if(!notify.read){

unread++;

}

/* ========================================= */

if(notify.createdAt?.seconds){

const notifyDate =
new Date(
notify.createdAt.seconds * 1000
).toDateString();

const todayDate =
new Date()
.toDateString();

if(notifyDate === todayDate){

today++;

}

}

/* =========================================
ICON
========================================= */

let icon = "🔔";

if(notify.type === "order"){

icon = "📦";

}

if(notify.type === "payment"){

icon = "💰";

}

if(notify.type === "partner"){

icon = "🏪";

}

if(notify.type === "rider"){

icon = "🛵";

}

if(notify.type === "user"){

icon = "👤";

}

/* =========================================
STATUS
========================================= */

const statusClass =
notify.read

?

"read"

:

"unread";

const statusText =
notify.read

?

"Read"

:

"Unread";

/* =========================================
TIME
========================================= */

let time = "--";

if(notify.createdAt?.seconds){

time =
new Date(
notify.createdAt.seconds * 1000
).toLocaleString();

}

/* =========================================
CARD
========================================= */

const card = `

<div
class="notificationCard"
onclick="markRead('${notify.id}')">

<div class="left">

<div class="icon">

${icon}

</div>

<div class="content">

<h3>

${notify.title || "Notification"}

</h3>

<p>

${notify.message || ""}

</p>

<div class="time">

${time}

</div>

</div>

</div>

<div class="status ${statusClass}">

${statusText}

</div>

</div>

`;

notificationList.innerHTML += card;

});

/* =========================================
UPDATE STATS
========================================= */

totalNotifications.innerHTML =
total;

unreadNotifications.innerHTML =
unread;

todayNotifications.innerHTML =
today;

}

/* END */

);

/* =========================================================
MARK AS READ
========================================================= */

window.markRead =
async(id)=>{

await updateDoc(

doc(db,"notifications",id),

{

read:true

}

);

};
