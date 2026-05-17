/* =========================================================
FILE : partner/index.js
TEMP SECURITY DISABLED
========================================================= */

/* =========================================================
DISABLED LOGIN CHECK
========================================================= */

// const partnerLogin =
// localStorage.getItem(
// "quickpress_partner"
// );

// if(partnerLogin !== "true"){

// window.location.href =
// "login.html";

// }

/* =========================================================
TEMP DEMO DATA
========================================================= */

const partnerId =
"demoPartner";

const partnerName =
"Quick Partner";

const partnerCity =
"Kasganj";

/* =========================================================
ELEMENTS
========================================================= */

const avatar =
document.getElementById(
"avatar"
);

const welcomeName =
document.getElementById(
"welcomeName"
);

const partnerNameText =
document.getElementById(
"partnerName"
);

const partnerCityText =
document.getElementById(
"partnerCity"
);

const todayOrders =
document.getElementById(
"todayOrders"
);

const completedOrders =
document.getElementById(
"completedOrders"
);

const revenue =
document.getElementById(
"revenue"
);

const activeRiders =
document.getElementById(
"activeRiders"
);

const ordersContainer =
document.getElementById(
"ordersContainer"
);

/* =========================================================
PROFILE
========================================================= */

avatar.innerHTML =
partnerName
.charAt(0)
.toUpperCase();

welcomeName.innerHTML =
partnerName;

partnerNameText.innerHTML =
partnerName;

partnerCityText.innerHTML =
partnerCity;

/* =========================================================
DUMMY STATS
========================================================= */

todayOrders.innerHTML =
"28";

completedOrders.innerHTML =
"19";

revenue.innerHTML =
"₹12,540";

activeRiders.innerHTML =
"8";

/* =========================================================
DUMMY ORDERS
========================================================= */

const demoOrders = [

{
orderId:"QP1001",
customerName:"Rahul Sharma",
mobile:"9876543210",
amount:320,
status:"Pending"
},

{
orderId:"QP1002",
customerName:"Amit Kumar",
mobile:"9876500000",
amount:540,
status:"Completed"
},

{
orderId:"QP1003",
customerName:"Priya Singh",
mobile:"9876512345",
amount:220,
status:"Processing"
}

];

/* =========================================================
RENDER ORDERS
========================================================= */

demoOrders.forEach((order)=>{

let badgeClass =
"pending";

/* ========================================= */

if(
order.status === "Completed"
){

badgeClass =
"completed";

}

if(
order.status === "Processing"
){

badgeClass =
"processing";

}

/* ========================================= */

const row = `

<div class="orderRow">

<div>

#${order.orderId}

</div>

<div>

<b>

${order.customerName}

</b>

<br>

${order.mobile}

</div>

<div>

₹${order.amount}

</div>

<div>

<div class="badge ${badgeClass}">

${order.status}

</div>

</div>

</div>

`;

ordersContainer.innerHTML += row;

});

/* =========================================================
LOGOUT
========================================================= */

window.logoutPartner =
()=>{

alert(
"Demo Mode Active"
);

};

/* =========================================================
READY
========================================================= */

console.log(
"Partner Dashboard Demo Mode Active"
);