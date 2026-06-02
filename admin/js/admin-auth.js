import { auth } from "../js/firebase.js";

const adminLoggedIn =

localStorage.getItem(
"adminLoggedIn"
);

const adminRole =

localStorage.getItem(
"adminRole"
);

if(
!adminLoggedIn ||
(
adminRole !== "admin" &&
adminRole !== "super_admin"
)
){

window.location.href =
"login.html";

}

/* MOBILE BLOCK */

if(window.innerWidth < 1024){

window.location.href =
"mobile-blocked.html";

}
