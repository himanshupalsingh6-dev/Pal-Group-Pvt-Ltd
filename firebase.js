/* =========================================================
FILE : firebase.js
========================================================= */

/* =========================================================
FIREBASE IMPORT
========================================================= */

import { initializeApp }

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

import {

getFirestore

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import {

getAuth

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import {

getStorage

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";

/* =========================================================
FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

apiKey:
"AIzaSyBBaslH5QsahoyESYpo1nVtlYIUYfVJ2d4",

authDomain:
"quickpress-offical.firebaseapp.com",

projectId:
"quickpress-offical",

storageBucket:
"quickpress-offical.firebasestorage.app",

messagingSenderId:
"939286557961",

appId:
"1:939286557961:web:ddac64f197e14877718fd8"

};

/* =========================================================
INITIALIZE FIREBASE
========================================================= */

const app =
initializeApp(
firebaseConfig
);

/* =========================================================
SERVICES
========================================================= */

const db =
getFirestore(app);

const auth =
getAuth(app);

const storage =
getStorage(app);

/* =========================================================
EXPORT
========================================================= */

export {

db,
auth,
storage

};
