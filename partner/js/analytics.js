/* =========================================================
FILE : partner/js/analytics.js
QUICKPRESS ANALYTICS
========================================================= */

import { db }

from "../../firebase.js";

import {

collection,
query,
where,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
PARTNER
========================================================= */

const partner =

JSON.parse(

localStorage.getItem(
"partnerSession"
)

);

/* ========================================================= */

if(!partner){

window.location.href =
"login.html";

}

/* =========================================================
ELEMENTS
========================================================= */

const totalOrders =
document.getElementById(
"totalOrders"
);

const totalRevenue =
document.getElementById(
"totalRevenue"
);

const avgOrder =
document.getElementById(
"avgOrder"
);

const growthRate =
document.getElementById(
"growthRate"
);

const topServicesContainer =
document.getElementById(
"topServicesContainer"
);

/* =========================================================
CHARTS
========================================================= */

const revenueCtx =
document.getElementById(
"revenueChart"
);

const ordersCtx =
document.getElementById(
"ordersChart"
);

/* =========================================================
DATA
========================================================= */

const monthlyRevenue =
[1200,2400,3000,4500,3800,6200];

const monthlyOrders =
[20,35,40,65,55,80];

/* =========================================================
REVENUE CHART
========================================================= */

new Chart(

revenueCtx,

{

type:"line",

data:{

labels:[
"Jan",
"Feb",
"Mar",
"Apr",
"May",
"Jun"
],

datasets:[{

label:"Revenue",

data:monthlyRevenue,

borderWidth:4,

tension:.4

}]

},

options:{

responsive:true

}

}

);

/* =========================================================
ORDERS CHART
========================================================= */

new Chart(

ordersCtx,

{

type:"bar",

data:{

labels:[
"Pending",
"Pickup",
"Processing",
"Delivery",
"Completed"
],

datasets:[{

label:"Orders",

data:[10,15,22,12,40],

borderWidth:2

}]

},

options:{

responsive:true

}

}

);

/* =========================================================
LOAD ORDERS
========================================================= */

const ordersQuery =

query(

collection(db,"orders"),

where(
"partnerId",
"==",
partner.uid
)

);

/* ========================================================= */

onSnapshot(
ordersQuery,
(snapshot)=>{

let orders = 0;

let revenue = 0;

const serviceStats = {};

/* ========================================================= */

snapshot.forEach(docSnap=>{

const order =
docSnap.data();

/* ========================================================= */

orders++;

revenue +=
order.total || 0;

/* ========================================================= */

if(order.items){

order.items.forEach(item=>{

if(!serviceStats[item.name]){

serviceStats[item.name] = {

count:0,
revenue:0

};

}

/* ========================================================= */

serviceStats[item.name].count +=
item.qty || 1;

serviceStats[item.name].revenue +=

(item.price || 0)

*
(item.qty || 1);

});

}

});

/* =========================================================
UPDATE STATS
========================================================= */

totalOrders.innerHTML =
orders;

totalRevenue.innerHTML =
"₹" + revenue;

avgOrder.innerHTML =

"₹" +

Math.floor(
revenue / (orders || 1)
);

growthRate.innerHTML =
"+18%";

/* =========================================================
TOP SERVICES
========================================================= */

topServicesContainer.innerHTML = "";

/* ========================================================= */

Object.entries(serviceStats)

.sort(

(a,b)=>

b[1].revenue -
a[1].revenue

)

.slice(0,5)

.forEach(service=>{

topServicesContainer.innerHTML += `

<div class="serviceItem">

<div class="serviceLeft">

<div class="serviceIcon">

<i class="fa-solid fa-shirt"></i>

</div>

<div class="serviceInfo">

<h4>
${service[0]}
</h4>

<p>
${service[1].count} Orders
</p>

</div>

</div>

<div class="serviceAmount">

₹${service[1].revenue}

</div>

</div>

`;

});

});
