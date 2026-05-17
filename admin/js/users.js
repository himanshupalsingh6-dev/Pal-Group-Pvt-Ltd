/* =========================================================
FILE : admin/js/users.js
QUICKPRESS ENTERPRISE USERS PANEL
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot,
doc,
deleteDoc

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
padding:30px;
">

<div>

<div
style="
font-size:80px;
margin-bottom:20px;
">

🖥️

</div>

<h1
style="
font-size:42px;
font-weight:900;
">

Desktop Only

</h1>

<p
style="
margin-top:12px;
font-size:16px;
line-height:1.7;
color:#D1D5DB;
">

QuickPress Admin Panel only works on Laptop/Desktop

</p>

</div>

</div>

`;

}

/* =========================================================
ELEMENTS
========================================================= */

const usersGrid =
document.getElementById(
"usersGrid"
);

const searchInput =
document.getElementById(
"searchInput"
);

const cityFilter =
document.getElementById(
"cityFilter"
);

const totalUsers =
document.getElementById(
"totalUsers"
);

const activeUsers =
document.getElementById(
"activeUsers"
);

const todayUsers =
document.getElementById(
"todayUsers"
);

const totalSpend =
document.getElementById(
"totalSpend"
);

/* =========================================================
DATA
========================================================= */

let allUsers = [];

/* =========================================================
REALTIME USERS
========================================================= */

onSnapshot(

collection(db,"users"),

(snapshot)=>{

allUsers = [];

let cities = new Set();

let spend = 0;

let active = 0;

let today = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const user = {

id:docSnap.id,
...docSnap.data()

};

allUsers.push(user);

/* ========================================= */

if(user.city){

cities.add(user.city);

}

/* ========================================= */

spend +=
Number(user.totalSpend || 0);

/* ========================================= */

if(user.active){

active++;

}

/* ========================================= */

const todayDate =
new Date()
.toDateString();

if(user.createdAt){

const created =
new Date(
user.createdAt.seconds * 1000
).toDateString();

if(created === todayDate){

today++;

}

}

});

/* ========================================= */

totalUsers.innerHTML =
allUsers.length;

activeUsers.innerHTML =
active;

todayUsers.innerHTML =
today;

totalSpend.innerHTML =
`₹${spend}`;

/* ========================================= */

loadCities([...cities]);

/* ========================================= */

renderUsers();

}

/* END */

);

/* =========================================================
LOAD CITIES
========================================================= */

function loadCities(cities){

const current =
cityFilter.value;

cityFilter.innerHTML = `

<option value="All">
All Cities
</option>

`;

cities.forEach((city)=>{

cityFilter.innerHTML += `

<option value="${city}">
${city}
</option>

`;

});

cityFilter.value =
current;

}

/* =========================================================
RENDER USERS
========================================================= */

function renderUsers(){

usersGrid.innerHTML = "";

/* ========================================= */

const search =
searchInput.value
.toLowerCase();

const selectedCity =
cityFilter.value;

/* ========================================= */

allUsers.forEach((user)=>{

/* =====================================
SEARCH
===================================== */

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

/* =====================================
CITY
===================================== */

if(
selectedCity !== "All"
&&
user.city !== selectedCity
){

return;

}

/* =====================================
TIME
===================================== */

let joined = "--";

if(user.createdAt?.seconds){

joined =
new Date(
user.createdAt.seconds * 1000
).toLocaleDateString();

}

/* =====================================
CARD
===================================== */

const card = `

<div class="userCard">

<!-- TOP -->

<div class="userTop">

<div class="userInfo">

<div class="avatar">

${user.name
?.charAt(0)
|| "U"}

</div>

<div>

<h3>

${user.name || "User"}

</h3>

<p>

${user.city || ""}

</p>

</div>

</div>

<div class="status active">

Active

</div>

</div>

<!-- INFO -->

<div class="infoGrid">

<div class="infoBox">

<span>
Mobile
</span>

<h4>

${user.mobile || "--"}

</h4>

</div>

<div class="infoBox">

<span>
Orders
</span>

<h4>

${user.totalOrders || 0}

</h4>

</div>

<div class="infoBox">

<span>
Wallet
</span>

<h4>

₹${user.wallet || 0}

</h4>

</div>

<div class="infoBox">

<span>
Spend
</span>

<h4>

₹${user.totalSpend || 0}

</h4>

</div>

<div class="infoBox">

<span>
Joined
</span>

<h4>

${joined}

</h4>

</div>

<div class="infoBox">

<span>
Address
</span>

<h4>

${user.area || "--"}

</h4>

</div>

</div>

<!-- BUTTONS -->

<div class="btnGrid">

<button
class="btn viewBtn"
onclick="viewUser('${user.id}')">

View

</button>

<button
class="btn callBtn"
onclick="callUser('${user.mobile}')">

Call

</button>

<button
class="btn deleteBtn"
onclick="deleteUser('${user.id}')">

Delete

</button>

</div>

</div>

`;

usersGrid.innerHTML += card;

});

}

/* =========================================================
SEARCH EVENTS
========================================================= */

searchInput.addEventListener(
"input",
renderUsers
);

cityFilter.addEventListener(
"change",
renderUsers
);

/* =========================================================
VIEW USER
========================================================= */

window.viewUser =
(id)=>{

window.location.href =
`user-view.html?id=${id}`;

};

/* =========================================================
CALL USER
========================================================= */

window.callUser =
(number)=>{

window.open(
`tel:${number}`
);

};

/* =========================================================
DELETE USER
========================================================= */

window.deleteUser =
async(id)=>{

const confirmDelete =
confirm(
"Delete User?"
);

if(!confirmDelete){

return;

}

await deleteDoc(

doc(db,"users",id)

);

alert(
"User Deleted"
);

};
