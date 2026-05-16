/* =========================================================
FILE : admin/js/firebase-config.js
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
"YOUR_API_KEY",

authDomain:
"YOUR_PROJECT.firebaseapp.com",

projectId:
"YOUR_PROJECT_ID",

storageBucket:
"YOUR_PROJECT.appspot.com",

messagingSenderId:
"YOUR_SENDER_ID",

appId:
"YOUR_APP_ID"

};

/* =========================================================
INITIALIZE
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
