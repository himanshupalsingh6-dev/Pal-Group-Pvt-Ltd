/* =========================================================
FILE : admin/js/referrals.js
QUICKPRESS REFERRAL SYSTEM
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
query,
orderBy,
onSnapshot,
updateDoc,
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

if(adminLogin !== "true"){

window.location.href =
"login.html";

}

/* =========================================================
ELEMENTS
========================================================= */

const referralContainer =
document.getElementById(
"referralContainer"
);

const totalReferrals =
document.getElementById(
"totalReferrals"
);

const referralEarnings =
document.getElementById(
"referralEarnings"
);

const pendingRewards =
document.getElementById(
"pendingRewards"
);

const activeReferrals =
document.getElementById(
"activeReferrals"
);

/* =========================================================
REALTIME REFERRALS
========================================================= */

onSnapshot(

query(
collection(db,"referrals"),
orderBy("createdAt","desc")
),

(snapshot)=>{

referralContainer.innerHTML = "";

/* ========================================= */

let total = 0;
let earnings = 0;
let pending = 0;
let active = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const referral = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

total++;

earnings +=
Number(
referral.reward || 0
);

/* ========================================= */

if(
referral.status === "Pending"
){

pending++;

}

if(
referral.status === "Active"
){

active++;

}

/* ========================================= */

renderReferral(
referral
);

});

/* ========================================= */

totalReferrals.innerHTML =
total;

referralEarnings.innerHTML =
`₹${earnings}`;

pendingRewards.innerHTML =
pending;

activeReferrals.innerHTML =
active;

}

/* END */

);

/* =========================================================
RENDER REFERRAL
========================================================= */

function renderReferral(
referral
){

let badgeClass =
"active";

/* ========================================= */

if(
referral.status === "Pending"
){

badgeClass =
"pending";

}

/* ========================================= */

const row = `

<div class="referralRow">

<!-- USER -->

<div>

<b>

${referral.userName || "--"}

</b>

<br>

${referral.mobile || "--"}

</div>

<!-- CODE -->

<div>

${referral.code || "--"}

</div>

<!-- INVITES -->

<div>

${referral.invites || 0}

</div>

<!-- REWARD -->

<div>

₹${referral.reward || 0}

</div>

<!-- STATUS -->

<div>

<div class="badge ${badgeClass}">

${referral.status || "Active"}

</div>

</div>

<!-- ACTION -->

<div>

<button
class="actionBtn"
onclick="approveReward('${referral.id}')">

Approve

</button>

</div>

</div>

`;

referralContainer.innerHTML += row;

}

/* =========================================================
APPROVE REWARD
========================================================= */

window.approveReward =
async(id)=>{

await updateDoc(

doc(
db,
"referrals",
id
),

{

status:"Active"

}

);

/* ========================================= */

alert(
"Reward Approved"
);

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Referral System Active"
);