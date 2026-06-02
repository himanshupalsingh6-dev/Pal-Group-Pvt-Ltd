/* ==========================
ACTIVE MENU
========================== */

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
item.getAttribute("href");

if(href === currentPage){

item.classList.add(
"activeMenu"
);

}

});

/* ==========================
PAGE TITLE
========================== */

const pageTitle =

currentPage
.replace(".html","")
.replace("-"," ");

if(

document.getElementById(
"pageTitle"
)

){

document.getElementById(
"pageTitle"
).innerHTML =

pageTitle

.charAt(0)
.toUpperCase()

+

pageTitle
.slice(1);

}
