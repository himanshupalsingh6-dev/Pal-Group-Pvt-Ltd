/* =========================================================
FILE : partner/js/layout.js
PARTNER LAYOUT SYSTEM
========================================================= */

async function loadLayout(){

/* =========================================================
LOAD HTML
========================================================= */

const response =

await fetch(
"./layout.html"
);

const html =

await response.text();

/* ========================================================= */

document.getElementById(
"layoutContainer"
).innerHTML = html;

/* =========================================================
CURRENT PAGE
========================================================= */

const currentPage =

window.location.pathname
.split("/")
.pop();

/* =========================================================
REMOVE ACTIVE
========================================================= */

document
.querySelectorAll(".menuItem")
.forEach(item=>{

item.classList.remove(
"active"
);

});

/* =========================================================
SET ACTIVE PAGE
========================================================= */

if(currentPage === "index.html"){

document
.getElementById(
"dashboardLink"
)
.classList.add("active");

}

/* ========================================================= */

if(currentPage === "orders.html"){

document
.getElementById(
"ordersLink"
)
.classList.add("active");

}

/* ========================================================= */

if(currentPage === "services.html"){

document
.getElementById(
"servicesLink"
)
.classList.add("active");

}

/* ========================================================= */

if(currentPage === "tracking.html"){

document
.getElementById(
"trackingLink"
)
.classList.add("active");

}

/* ========================================================= */

if(currentPage === "wallet.html"){

document
.getElementById(
"walletLink"
)
.classList.add("active");

}

/* ========================================================= */

if(currentPage === "analytics.html"){

document
.getElementById(
"analyticsLink"
)
.classList.add("active");

}

/* ========================================================= */

if(currentPage === "settings.html"){

document
.getElementById(
"settingsLink"
)
.classList.add("active");

}

/* =========================================================
LOGOUT
========================================================= */

document
.getElementById(
"logoutBtn"
)
.addEventListener(

"click",

()=>{

localStorage.removeItem(
"partnerSession"
);

window.location.href =
"login.html";

}

);

}

/* ========================================================= */

loadLayout();
