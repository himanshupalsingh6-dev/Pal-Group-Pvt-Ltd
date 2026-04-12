import { auth } from "../firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

window.addPartner = async function(){

let email = prompt("Enter Email");
let password = prompt("Enter Password");

let name = pname.value;
let area = parea.value;

try{

let userCred = await createUserWithEmailAndPassword(auth,email,password);
let uid = userCred.user.uid;

/* FIRESTORE SAVE */
await setDoc(doc(db,"users",uid),{
name:name,
email:email,
role:"partner"
});

/* PARTNER COLLECTION */
await addDoc(collection(db,"partners"),{
name:name,
area:area
});

alert("Partner Created ✅");

}catch(err){
alert(err.message);
}
};
