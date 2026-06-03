/* =========================================================
FILE : auth.js
========================================================= */

import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

/* =========================================================
GET CURRENT USER
========================================================= */

export function requireLogin(callback){

    onAuthStateChanged(auth,(user)=>{

        if(!user){

            window.location.href="login.html";
            return;

        }

        callback(user);

    });

}
