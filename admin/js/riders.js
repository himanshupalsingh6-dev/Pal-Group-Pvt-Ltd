import { db, auth } from "../js/firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { setDoc, doc, addDoc, collection } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

window.addRider = async function(){

let name = prompt("Name");
let phone = prompt("Mobile");
let aadhaar = prompt("Aadhaar");
let pan = prompt("PAN");
let vehicle = prompt("Vehicle Number");

let email = prompt("Email");
let password = prompt("Password");

let user = await createUserWithEmailAndPassword(auth,email,password);
let uid = user.user.uid;

/* USERS */
await setDoc(doc(db,"users",uid),{
name,
phone,
role:"rider"
});

/* RIDER */
await addDoc(collection(db,"delivery"),{
uid,
name,
phone,
aadhaar,
pan,
vehicle,
orders:0,
status:"available"
});

/* WALLET */
await setDoc(doc(db,"wallets",uid),{
balance:0
});

alert("Rider Created ✅");

};
