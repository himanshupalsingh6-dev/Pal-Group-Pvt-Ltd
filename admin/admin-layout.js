/* ==========================================
QUICKPRESS ADMIN LAYOUT JS
========================================== */

/* ==========================================
ELEMENTS
========================================== */

const sidebar =
document.getElementById(
"sidebar"
);

const sidebarToggle =
document.getElementById(
"sidebarToggle"
);

/* ==========================================
SIDEBAR TOGGLE
========================================== */

if(sidebarToggle){

sidebarToggle.addEventListener(

"click",

()=>{

sidebar.classList.toggle(
"active"
);

}

);

}

/* ==========================================
AUTO ACTIVE MENU
========================================== */

const currentPage =

window.location.pathname
.split("/")
.pop();

document
.querySelectorAll(
".menuItem"
)

.forEach(item=>{

const href =

item.getAttribute(
"href"
);

if(href===currentPage){

document
.querySelectorAll(
".menuItem"
)

.forEach(menu=>{

menu.classList.remove(
"active"
);

});

item.classList.add(
"active"
);

}

});

/* ==========================================
PROFILE DROPDOWN
========================================== */

const profileMenu =
document.querySelector(
".adminProfile"
);

if(profileMenu){

profileMenu.addEventListener(

"click",

()=>{

const oldMenu =

document.getElementById(
"profileDropdown"
);

if(oldMenu){

oldMenu.remove();

return;

}

const dropdown =

document.createElement(
"div"
);

dropdown.id =
"profileDropdown";

dropdown.innerHTML = `

<div class="dropdownItem">
👤 My Profile
</div>

<div class="dropdownItem">
⚙ Account Settings
</div>

<div class="dropdownItem logoutItem">
🚪 Logout
</div>

`;

dropdown.style.cssText = `

position:absolute;
top:75px;
right:20px;

width:220px;

background:white;

border-radius:18px;

box-shadow:
0 12px 30px rgba(0,0,0,.12);

padding:8px;

z-index:99999;

`;

document.body.appendChild(
dropdown
);

dropdown
.querySelector(
".logoutItem"
)

.addEventListener(

"click",

logoutAdmin

);

}

);

}

/* ==========================================
NOTIFICATION PANEL
========================================== */

const bellButton =

document.querySelectorAll(
".iconBtn"
)[1];

if(bellButton){

bellButton.addEventListener(

"click",

()=>{

showNotificationPanel();

}

);

}

function showNotificationPanel(){

const oldPanel =

document.getElementById(
"notificationPanel"
);

if(oldPanel){

oldPanel.remove();

return;

}

const panel =

document.createElement(
"div"
);

panel.id =
"notificationPanel";

panel.innerHTML = `

<div class="notifyHeader">

Notifications

</div>

<div class="notifyItem">

📦 New Order Received

</div>

<div class="notifyItem">

👤 New Customer Joined

</div>

<div class="notifyItem">

💰 Payment Received

</div>

`;

panel.style.cssText = `

position:absolute;

top:75px;
right:90px;

width:300px;

background:white;

border-radius:18px;

box-shadow:
0 12px 30px rgba(0,0,0,.12);

overflow:hidden;

z-index:99999;

`;

document.body.appendChild(
panel
);

}

/* ==========================================
DARK MODE
========================================== */

const darkButton =

document.querySelectorAll(
".iconBtn"
)[2];

if(darkButton){

darkButton.addEventListener(

"click",

toggleDarkMode

);

}

function toggleDarkMode(){

document.body.classList.toggle(
"darkMode"
);

localStorage.setItem(

"qp_admin_dark",

document.body.classList.contains(
"darkMode"
)

);

}

/* LOAD SAVED MODE */

if(

localStorage.getItem(
"qp_admin_dark"
)

=== "true"

){

document.body.classList.add(
"darkMode"
);

}

/* ==========================================
DARK MODE CSS
========================================== */

const darkStyle =
document.createElement(
"style"
);

darkStyle.innerHTML = `

body.darkMode{

background:#0F172A;

}

body.darkMode .sidebar,
body.darkMode .topbar,
body.darkMode .section,
body.darkMode .card{

background:#111827;

}

body.darkMode .logoText,
body.darkMode .topbar h1,
body.darkMode .profileInfo h4{

color:white;

}

body.darkMode .menuItem{

color:#CBD5E1;

}

body.darkMode .pageContent{

background:#0F172A;

}

`;

document.head.appendChild(
darkStyle
);

/* ==========================================
LOGOUT
========================================== */

function logoutAdmin(){

const confirmLogout =

confirm(
"Logout from Admin Panel?"
);

if(!confirmLogout)
return;

localStorage.removeItem(
"adminLogin"
);

window.location.href =
"admin-login.html";

}

/* ==========================================
OUTSIDE CLICK
========================================== */

document.addEventListener(

"click",

(event)=>{

if(

!event.target.closest(
".adminProfile"
)

){

const profileDropdown =

document.getElementById(
"profileDropdown"
);

if(profileDropdown){

profileDropdown.remove();

}

}

}

);

/* ==========================================
WINDOW RESIZE
========================================== */

window.addEventListener(

"resize",

()=>{

if(

window.innerWidth > 991

){

sidebar.classList.remove(
"active"
);

}

}

);

/* ==========================================
INIT
========================================== */

console.log(

"QuickPress Super Admin Ready 🚀"

);
