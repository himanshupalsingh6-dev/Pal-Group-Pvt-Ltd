import { db } from "../js/firebase.js";

import {
collection,
onSnapshot
}
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* ELEMENTS */

const totalRevenue =
document.getElementById("totalRevenue");

const totalOrders =
document.getElementById("totalOrders");

const totalUsers =
document.getElementById("totalUsers");

const totalPartners =
document.getElementById("totalPartners");

const totalRiders =
document.getElementById("totalRiders");

const pendingWithdraws =
document.getElementById("pendingWithdraws");

/* =========================
ORDERS + REVENUE
========================= */

onSnapshot(collection(db,"orders"),(snapshot)=>{

let revenue = 0;
let orders = 0;

snapshot.forEach((doc)=>{

const order = doc.data();

orders++;

revenue += order.total || 0;

});

totalRevenue.innerHTML =
"₹" + revenue;

totalOrders.innerHTML =
orders;

});

/* =========================
USERS
========================= */

onSnapshot(collection(db,"users"),(snapshot)=>{

totalUsers.innerHTML =
snapshot.size;

});

/* =========================
PARTNERS
========================= */

onSnapshot(collection(db,"partners"),(snapshot)=>{

totalPartners.innerHTML =
snapshot.size;

});

/* =========================
RIDERS
========================= */

onSnapshot(collection(db,"delivery"),(snapshot)=>{

totalRiders.innerHTML =
snapshot.size;

});

/* =========================
WITHDRAW
========================= */

onSnapshot(collection(db,"withdraws"),(snapshot)=>{

let pending = 0;

snapshot.forEach((doc)=>{

const data = doc.data();

if(data.status==="pending"){

pending++;

}

});

pendingWithdraws.innerHTML =
pending;

});
