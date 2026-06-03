/* ==========================================
QUICKPRESS AUTH GUARD
FILE : user/js/auth-guard.js
========================================== */

import { auth } from "../firebase.js";

import {
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

onAuthStateChanged(

auth,

(user)=>{

if(!user){

window.location.replace(
"login.html"
);

return;

}

/* USER LOGGED IN */

document.body.style.display =
"block";

console.log(
"QuickPress Auth Guard Loaded"
);

}

);
