/* =========================================================
FILE : partner/js/layout.js
PARTNER LAYOUT
========================================================= */

async function loadLayout(){

const response =
await fetch(
"layout.html"
);

const html =
await response.text();

document.getElementById(
"layoutContainer"
).innerHTML = html;

/* ========================================================= */

const logoutBtn =
document.getElementById(
"logoutBtn"
);

/* ========================================================= */

logoutBtn.addEventListener(
"click",
()=>{

localStorage.removeItem(
"partner"
);

window.location.href =
"login.html";

}
);

}

/* ========================================================= */

loadLayout();
