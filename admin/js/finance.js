import { db }

from "../../firebase.js";

import {

collection,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* ========================================================= */

const transactionsContainer =
document.getElementById(
"transactionsContainer"
);

const cityContainer =
document.getElementById(
"cityContainer"
);

const expenseContainer =
document.getElementById(
"expenseContainer"
);

const alertContainer =
document.getElementById(
"alertContainer"
);

/* =========================================================
SUMMARY
========================================================= */

const totalRevenue =
document.getElementById(
"totalRevenue"
);

const todayEarnings =
document.getElementById(
"todayEarnings"
);

const codCollection =
document.getElementById(
"codCollection"
);

const pendingPayouts =
document.getElementById(
"pendingPayouts"
);

const netProfit =
document.getElementById(
"netProfit"
);

/* =========================================================
ORDERS REALTIME
========================================================= */

onSnapshot(

collection(db,"orders"),

(snapshot)=>{

transactionsContainer.innerHTML = "";

cityContainer.innerHTML = "";

alertContainer.innerHTML = "";

let revenue = 0;
let cod = 0;
let online = 0;
let today = 0;
let pending = 0;

const cityRevenue = {};

/* ========================================================= */

snapshot.forEach(docSnap=>{

const order =
docSnap.data();

/* ========================================================= */

revenue +=
order.total || 0;

/* ========================================================= */

if(order.paymentType === "cod"){

cod += order.total || 0;

}else{

online += order.total || 0;

}

/* ========================================================= */

if(order.status === "pending"){

pending += order.total || 0;

}

/* ========================================================= */

today += order.total || 0;

/* =========================================================
CITY
========================================================= */

if(order.city){

if(!cityRevenue[order.city]){

cityRevenue[order.city] = 0;

}

cityRevenue[order.city] +=
order.total || 0;

}

/* =========================================================
TRANSACTIONS
========================================================= */

transactionsContainer.innerHTML += `

<div class="tableRow">

<div>
${order.orderId || '-'}
</div>

<div>
${order.customerName || '-'}
</div>

<div>
${order.service || 'Laundry'}
</div>

<div>
₹${order.total || 0}
</div>

<div>
${order.paymentType || 'cod'}
</div>

<div>

<div class="status ${order.status === 'completed' ? 'success' : 'pending'}">

${order.status}

</div>

</div>

<div class="actionBtns">

<button class="actionBtn greenBtn">
View
</button>

<button class="actionBtn darkBtn">
Invoice
</button>

</div>

</div>

`;

/* =========================================================
ALERTS
========================================================= */

if(order.status === "pending"){

alertContainer.innerHTML += `

<div class="tableRow">

<div>
COD Pending
</div>

<div>
${order.customerName}
</div>

<div>
₹${order.total}
</div>

<div>

<div class="status pending">
Pending
</div>

</div>

</div>

`;

}

});

/* ========================================================= */

totalRevenue.innerHTML =
"₹" + revenue;

todayEarnings.innerHTML =
"₹" + today;

codCollection.innerHTML =
"₹" + cod;

pendingPayouts.innerHTML =
"₹" + pending;

netProfit.innerHTML =
"₹" + (revenue - pending);

/* =========================================================
CITY RENDER
========================================================= */

Object.entries(cityRevenue)
.forEach(([city,amount])=>{

cityContainer.innerHTML += `

<div class="tableRow">

<div>
${city}
</div>

<div>
₹${amount}
</div>

<div>
Growth +12%
</div>

<div>

<div class="status success">
Profit
</div>

</div>

</div>

`;

});

}
);

/* =========================================================
EXPENSES
========================================================= */

onSnapshot(

collection(db,"expenses"),

(snapshot)=>{

expenseContainer.innerHTML = "";

/* ========================================================= */

snapshot.forEach(docSnap=>{

const expense =
docSnap.data();

/* ========================================================= */

expenseContainer.innerHTML += `

<div class="tableRow">

<div>
${expense.category || '-'}
</div>

<div>
₹${expense.amount || 0}
</div>

<div>
${expense.city || '-'}
</div>

<div>

<div class="status danger">

Expense

</div>

</div>

</div>

`;

});

}
);

/* =========================================================
CHARTS
========================================================= */

function createChart(id,data,type="line"){

new Chart(

document.getElementById(id),

{

type:type,

data:{

labels:[
"Mon",
"Tue",
"Wed",
"Thu",
"Fri",
"Sat",
"Sun"
],

datasets:[{

data:data,

borderWidth:3,

tension:.4

}]

},

options:{

responsive:true,

plugins:{
legend:{
display:false
}
}

}

}

);

}

/* ========================================================= */

createChart(
"revenueMini",
[1000,2000,3000,4500,5000,7000,9000]
);

createChart(
"todayMini",
[500,1000,1500,1800,2500,3000,3500]
);

createChart(
"codMini",
[400,800,1200,1400,1800,2200,2600]
);

createChart(
"payoutMini",
[200,500,800,1000,1200,1400,1800]
);

createChart(
"profitMini",
[1000,1800,2600,3200,4000,5200,6800]
);

createChart(
"revenueChart",
[5000,7000,10000,12000,18000,22000,28000]
);

createChart(
"paymentChart",
[65,35],
"pie"
);
