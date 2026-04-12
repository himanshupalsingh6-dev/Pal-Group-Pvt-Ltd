import { auth } from "../firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

window.addRider = async function(){

let email = prompt("Enter Email");
let password = prompt("Enter Password");

let name = rname.value;
let area = rarea.value;

try{

let userCred = await createUserWithEmailAndPassword(auth,email,password);
let uid = userCred.user.uid;

/* FIRESTORE SAVE */
await setDoc(doc(db,"users",uid),{
name:name,
email:email,
role:"rider"
});

/* RIDER COLLECTION */
await addDoc(collection(db,"delivery"),{
name:name,
area:area,
orders:0,
status:"available"
});

alert("Rider Created ✅");

}catch(err){
alert(err.message);
}
};
