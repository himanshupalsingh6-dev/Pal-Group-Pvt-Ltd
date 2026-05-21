/* =====================================================
FILE : layout.js
QUICKPRESS ADMIN COMMON LAYOUT
===================================================== */

/* =====================================================
LOAD COMMON LAYOUT
===================================================== */

async function loadLayout(){

try{

/* =========================================
FETCH LAYOUT FILE
========================================= */

const response =
await fetch(
"layout.html"
);

/* ========================================= */

const html =
await response.text();

/* ========================================= */

document.getElementById(
"layoutContainer"
).innerHTML = html;

/* ========================================= */

setActiveMenu();

/* ========================================= */

loadAdminProfile();

/* ========================================= */

setupSearch();

/* ========================================= */

setupLogout();

/* ========================================= */

setupLiveClock();

/* ========================================= */

setupSidebarHover();

/* ========================================= */

console.log(
"Layout Loaded Successfully 🚀"
);

/* ========================================= */

}catch(error){

console.log(
"Layout Error",
error
);

}

}

/* =====================================================
ACTIVE MENU
===================================================== */

function setActiveMenu(){

const currentPage =
window.location.pathname
.split("/")
.pop();

/* ========================================= */

const links =
document.querySelectorAll(
".menuLink"
);

/* ========================================= */

links.forEach(link=>{

const href =
link.getAttribute(
"href"
);

/* ========================================= */

if(href === currentPage){

link.classList.add(
"active"
);

}

});

}

/* =====================================================
ADMIN PROFILE
===================================================== */

function loadAdminProfile(){

const adminName =
localStorage.getItem(
"adminName"
) || "QuickPress Admin";

/* ========================================= */

const adminPhoto =
localStorage.getItem(
"adminPhoto"
) || "https://i.pravatar.cc/100";

/* ========================================= */

const nameEl =
document.getElementById(
"adminName"
);

const photoEl =
document.getElementById(
"adminPhoto"
);

/* ========================================= */

if(nameEl){

nameEl.innerHTML =
adminName;

}

/* ========================================= */

if(photoEl){

photoEl.src =
adminPhoto;

}

}

/* =====================================================
GLOBAL SEARCH
===================================================== */

function setupSearch(){

const searchInput =
document.querySelector(
".searchBar input"
);

/* ========================================= */

if(!searchInput){

return;

}

/* ========================================= */

searchInput.addEventListener(
"input",
()=>{

const value =
searchInput.value
.toLowerCase();

/* ========================================= */

const rows =
document.querySelectorAll(
"table tbody tr"
);

/* ========================================= */

rows.forEach(row=>{

const text =
row.innerText
.toLowerCase();

/* ========================================= */

if(text.includes(value)){

row.style.display =
"table-row";

}else{

row.style.display =
"none";

}

});

});

}

/* =====================================================
LOGOUT SYSTEM
===================================================== */

function setupLogout(){

const logoutBtn =
document.getElementById(
"logoutBtn"
);

/* ========================================= */

if(!logoutBtn){

return;

}

/* ========================================= */

logoutBtn.addEventListener(
"click",
()=>{

const confirmLogout =
confirm(
"Logout from admin panel?"
);

/* ========================================= */

if(!confirmLogout){

return;

}

/* ========================================= */

localStorage.removeItem(
"adminLogin"
);

localStorage.removeItem(
"adminName"
);

localStorage.removeItem(
"adminPhoto"
);

/* ========================================= */

showToast(
"Logout Successful"
);

/* ========================================= */

setTimeout(()=>{

window.location.href =
"login.html";

},1000);

});

}

/* =====================================================
LIVE CLOCK
===================================================== */

function setupLiveClock(){

setInterval(()=>{

const liveBox =
document.querySelector(
".liveBox"
);

/* ========================================= */

if(liveBox){

liveBox.innerHTML = `

<div class="liveDot"></div>

${new Date()
.toLocaleTimeString()}

`;

}

},1000);

}

/* =====================================================
SIDEBAR HOVER EFFECT
===================================================== */

function setupSidebarHover(){

const menuLinks =
document.querySelectorAll(
".menuLink"
);

/* ========================================= */

menuLinks.forEach(link=>{

link.addEventListener(
"mouseenter",
()=>{

link.style.transform =
"translateX(4px)";

});

/* ========================================= */

link.addEventListener(
"mouseleave",
()=>{

link.style.transform =
"translateX(0px)";

});

});

}

/* =====================================================
TOAST
===================================================== */

function showToast(message){

const toast =
document.createElement(
"div"
);

/* ========================================= */

toast.innerHTML =
message;

/* ========================================= */

toast.style.position =
"fixed";

toast.style.right =
"20px";

toast.style.bottom =
"20px";

toast.style.background =
"#111827";

toast.style.color =
"#fff";

toast.style.padding =
"14px 22px";

toast.style.borderRadius =
"16px";

toast.style.fontWeight =
"800";

toast.style.fontSize =
"14px";

toast.style.zIndex =
"99999";

toast.style.boxShadow =
"0 10px 30px rgba(0,0,0,0.2)";

toast.style.animation =
"toastAnim 0.3s ease";

/* ========================================= */

document.body.appendChild(
toast
);

/* ========================================= */

setTimeout(()=>{

toast.remove();

},3000);

}

/* =====================================================
PAGE LOADER
===================================================== */

window.addEventListener(
"load",
()=>{

const loader =
document.getElementById(
"pageLoader"
);

/* ========================================= */

if(loader){

loader.style.opacity =
"0";

/* ========================================= */

setTimeout(()=>{

loader.remove();

},400);

}

});

/* =====================================================
CREATE LOADER
===================================================== */

const loader =
document.createElement(
"div"
);

loader.id =
"pageLoader";

/* ========================================= */

loader.innerHTML = `

<div class="loaderSpinner"></div>

`;

/* ========================================= */

loader.style.position =
"fixed";

loader.style.inset =
"0";

loader.style.background =
"#F4F7FB";

loader.style.display =
"flex";

loader.style.alignItems =
"center";

loader.style.justifyContent =
"center";

loader.style.zIndex =
"999999";

loader.style.transition =
"0.4s";

/* ========================================= */

document.body.appendChild(
loader
);

/* ========================================= */

const style =
document.createElement(
"style"
);

style.innerHTML = `

.loaderSpinner{

width:70px;
height:70px;

border-radius:50%;

border:6px solid #E5E7EB;

border-top-color:#111827;

animation:spin 1s linear infinite;

}

@keyframes spin{

100%{
transform:rotate(360deg);
}

}

@keyframes toastAnim{

from{
opacity:0;
transform:translateY(20px);
}

to{
opacity:1;
transform:translateY(0);
}

}

`;

/* ========================================= */

document.head.appendChild(
style
);

/* =====================================================
PAGE TITLE AUTO
===================================================== */

const currentPage =
window.location.pathname
.split("/")
.pop()
.replace(".html","");

/* ========================================= */

document.title =
`QuickPress Admin • ${currentPage}`;

/* =====================================================
INIT
===================================================== */

loadLayout();
