// ===================================
// FIREBASE IMPORTS
// ===================================

import {

initializeApp

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

import {

getAuth

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import {

getFirestore

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import {

getStorage

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";

// ===================================
// FIREBASE CONFIG
// ===================================

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

// ===================================
// INITIALIZE
// ===================================

const app =
initializeApp(firebaseConfig);

// ===================================
// SERVICES
// ===================================

const auth =
getAuth(app);

const db =
getFirestore(app);

const storage =
getStorage(app);

// ===================================
// EXPORT
// ===================================

export {

auth,
db,
storage

};
