import { auth, db } from "./firebase.js";

import {
GoogleAuthProvider,
signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import {
doc,
getDoc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const googleBtn =
document.getElementById(
"googleLoginBtn"
);

googleBtn.addEventListener(
"click",
googleLogin
);

async function googleLogin(){

try{

const provider =
new GoogleAuthProvider();

const result =
await signInWithPopup(
auth,
provider
);

const user =
result.user;

const userRef =
doc(
db,
"users",
user.uid
);

const snap =
await getDoc(
userRef
);

if(!snap.exists()){

await setDoc(
userRef,
{
uid:user.uid,
name:user.displayName,
email:user.email,
photo:user.photoURL,
phone:user.phoneNumber || "",
provider:"google",
createdAt:
serverTimestamp()
}
);

}

localStorage.setItem(
"qp_uid",
user.uid
);

window.location.href =
"notification-permission.html";

}catch(error){

console.error(error);

alert(
"Google Login Failed"
);

}

}
