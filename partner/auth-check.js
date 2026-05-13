const partnerId =
localStorage.getItem("partnerId");

/* NOT LOGIN */

if(!partnerId){

alert("Please Login First");

/* REDIRECT */

window.location.href =
"./login.html";

}
