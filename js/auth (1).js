import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

window.signup = () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(()=> location.href="index.html")
    .catch(e=> alert(e.message));
};

window.login = () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  signInWithEmailAndPassword(auth, email, password)
    .then(()=> location.href="index.html")
    .catch(e=> alert(e.message));
};

window.logout = () => signOut(auth).then(()=> location.href="login.html");

window.protect = () => {
  onAuthStateChanged(auth, u => { if(!u) location.href="login.html"; });
};
