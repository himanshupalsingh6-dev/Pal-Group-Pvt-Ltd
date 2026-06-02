const adminLoggedIn =

localStorage.getItem(
"adminLoggedIn"
);

const role =

localStorage.getItem(
"adminRole"
);

if(
!adminLoggedIn ||
(
role !== "admin" &&
role !== "super_admin"
)
){

window.location.href =
"login.html";

}
