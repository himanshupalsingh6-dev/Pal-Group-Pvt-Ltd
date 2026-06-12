/* =========================================================
QUICKPRESS FINANCE PANEL
FILE: finance.js
PART 1/10
========================================================= */

/* =========================================================
FIREBASE IMPORTS
========================================================= */

import { db } from "../firebase/firebase.js";

import {

collection,
getDocs,
getDoc,
doc,
query,
where,
orderBy,
limit,
addDoc,
updateDoc,
deleteDoc,
serverTimestamp

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
GLOBAL STATE
========================================================= */

let orders = [];

let transactions = [];

let settlements = [];

let withdrawals = [];

let refunds = [];

let expenses = [];

let partners = [];

let drivers = [];

let users = [];

let revenueChart = null;

/* =========================================================
COLLECTION REFERENCES
========================================================= */

const ORDERS_COLLECTION =
"orders";

const USERS_COLLECTION =
"users";

const PARTNERS_COLLECTION =
"partners";

const DRIVERS_COLLECTION =
"drivers";

const TRANSACTIONS_COLLECTION =
"transactions";

const SETTLEMENTS_COLLECTION =
"settlements";

const WITHDRAWALS_COLLECTION =
"withdrawRequests";

const REFUNDS_COLLECTION =
"refunds";

const EXPENSES_COLLECTION =
"expenses";

/* =========================================================
HELPERS
========================================================= */

function setText(
id,
value
){

const el =
document.getElementById(id);

if(el){

el.innerText =
value;

}

}

function formatCurrency(
amount = 0
){

return "₹" +

Number(amount || 0)

.toLocaleString(
"en-IN"
);

}

function formatDate(
date
){

if(!date)
return "-";

try{

if(date.seconds){

return new Date(
date.seconds * 1000
)

.toLocaleDateString(
"en-IN"
);

}

return new Date(date)

.toLocaleDateString(
"en-IN"
);

}catch{

return "-";

}

}

/* =========================================================
LOADER
========================================================= */

function showLoader(){

document.body.classList.add(
"loading"
);

}

function hideLoader(){

document.body.classList.remove(
"loading"
);

}

/* =========================================================
LOAD ORDERS
========================================================= */

async function loadOrders(){

try{

const snapshot =

await getDocs(

query(

collection(
db,
ORDERS_COLLECTION
),

orderBy(
"createdAt",
"desc"
)

)

);

orders = [];

snapshot.forEach(docSnap=>{

orders.push({

id:docSnap.id,

...docSnap.data()

});

});

console.log(
"Orders Loaded:",
orders.length
);

}catch(error){

console.error(
"Orders Load Error",
error
);

}

}

/* =========================================================
LOAD USERS
========================================================= */

async function loadUsers(){

try{

const snapshot =

await getDocs(

collection(
db,
USERS_COLLECTION
)

);

users = [];

snapshot.forEach(docSnap=>{

users.push({

id:docSnap.id,

...docSnap.data()

});

});

console.log(
"Users Loaded:",
users.length
);

}catch(error){

console.error(
"Users Load Error",
error
);

}

}

/* =========================================================
LOAD PARTNERS
========================================================= */

async function loadPartners(){

try{

const snapshot =

await getDocs(

collection(
db,
PARTNERS_COLLECTION
)

);

partners = [];

snapshot.forEach(docSnap=>{

partners.push({

id:docSnap.id,

...docSnap.data()

});

});

console.log(
"Partners Loaded:",
partners.length
);

}catch(error){

console.error(
"Partners Load Error",
error
);

}

}

/* =========================================================
LOAD DRIVERS
========================================================= */

async function loadDrivers(){

try{

const snapshot =

await getDocs(

collection(
db,
DRIVERS_COLLECTION
)

);

drivers = [];

snapshot.forEach(docSnap=>{

drivers.push({

id:docSnap.id,

...docSnap.data()

});

});

console.log(
"Drivers Loaded:",
drivers.length
);

}catch(error){

console.error(
"Drivers Load Error",
error
);

}

}/* =========================================================
LOAD TRANSACTIONS
========================================================= */

async function loadTransactions(){

try{

const snapshot = await getDocs(
collection(
db,
TRANSACTIONS_COLLECTION
)
);

transactions = [];

snapshot.forEach(docSnap=>{

transactions.push({

id:docSnap.id,
...docSnap.data()

});

});

console.log(
"Transactions Loaded:",
transactions.length
);

}catch(error){

console.error(
"Transactions Load Error",
error
);

}

}

/* =========================================================
LOAD SETTLEMENTS
========================================================= */

async function loadSettlements(){

try{

const snapshot = await getDocs(
collection(
db,
SETTLEMENTS_COLLECTION
)
);

settlements = [];

snapshot.forEach(docSnap=>{

settlements.push({

id:docSnap.id,
...docSnap.data()

});

});

console.log(
"Settlements Loaded:",
settlements.length
);

}catch(error){

console.error(
"Settlements Load Error",
error
);

}

}

/* =========================================================
LOAD WITHDRAWALS
========================================================= */

async function loadWithdrawals(){

try{

const snapshot = await getDocs(
collection(
db,
WITHDRAWALS_COLLECTION
)
);

withdrawals = [];

snapshot.forEach(docSnap=>{

withdrawals.push({

id:docSnap.id,
...docSnap.data()

});

});

console.log(
"Withdrawals Loaded:",
withdrawals.length
);

}catch(error){

console.error(
"Withdrawals Load Error",
error
);

}

}

/* =========================================================
LOAD REFUNDS
========================================================= */

async function loadRefunds(){

try{

const snapshot = await getDocs(
collection(
db,
REFUNDS_COLLECTION
)
);

refunds = [];

snapshot.forEach(docSnap=>{

refunds.push({

id:docSnap.id,
...docSnap.data()

});

});

console.log(
"Refunds Loaded:",
refunds.length
);

}catch(error){

console.error(
"Refunds Load Error",
error
);

}

}

/* =========================================================
LOAD EXPENSES
========================================================= */

async function loadExpenses(){

try{

const snapshot = await getDocs(
collection(
db,
EXPENSES_COLLECTION
)
);

expenses = [];

snapshot.forEach(docSnap=>{

expenses.push({

id:docSnap.id,
...docSnap.data()

});

});

console.log(
"Expenses Loaded:",
expenses.length
);

}catch(error){

console.error(
"Expenses Load Error",
error
);

}

}

/* =========================================================
CALCULATE DASHBOARD TOTALS
========================================================= */

function calculateFinanceTotals(){

const totalRevenue =

orders.reduce(

(sum,order)=>

sum +

Number(
order.totalAmount ||
order.amount ||
0
),

0

);

const totalRefunds =

refunds.reduce(

(sum,item)=>

sum +

Number(
item.amount || 0
),

0

);

const totalExpenses =

expenses.reduce(

(sum,item)=>

sum +

Number(
item.amount || 0
),

0

);

const totalSettlements =

settlements.reduce(

(sum,item)=>

sum +

Number(
item.amount || 0
),

0

);

const completedOrders =

orders.filter(

order=>

order.status ===
"completed"

).length;

const totalWithdrawals =

withdrawals.length;

const gstCollected =

totalRevenue * 0.18;

const commissionEarned =

totalRevenue * 0.15;

const netProfit =

totalRevenue -

totalRefunds -

totalExpenses -

totalSettlements;

/* =====================================
UPDATE UI
===================================== */

setText(
"totalRevenue",
formatCurrency(
totalRevenue
)
);

setText(
"netProfit",
formatCurrency(
netProfit
)
);

setText(
"pendingSettlementAmount",
formatCurrency(
totalSettlements
)
);

setText(
"commissionEarned",
formatCurrency(
commissionEarned
)
);

setText(
"completedOrders",
completedOrders
);

setText(
"refundAmount",
formatCurrency(
totalRefunds
)
);

setText(
"withdrawRequests",
totalWithdrawals
);

setText(
"gstCollected",
formatCurrency(
gstCollected
)
);

}

/* =========================================================
TODAY / MONTH / YEAR REVENUE
========================================================= */

function updateRevenueCards(){

const today = new Date();

let todayRevenue = 0;
let monthlyRevenue = 0;
let yearlyRevenue = 0;

orders.forEach(order=>{

const amount =

Number(
order.totalAmount ||
order.amount ||
0
);

const orderDate =

order.createdAt?.seconds

? new Date(
order.createdAt.seconds * 1000
)

: new Date(
order.createdAt ||
Date.now()
);

if(

orderDate.toDateString()

===

today.toDateString()

){

todayRevenue += amount;

}

if(

orderDate.getMonth()

===

today.getMonth()

&&

orderDate.getFullYear()

===

today.getFullYear()

){

monthlyRevenue += amount;

}

if(

orderDate.getFullYear()

===

today.getFullYear()

){

yearlyRevenue += amount;

}

});

const avgOrderValue =

orders.length

?

yearlyRevenue /

orders.length

:

0;

setText(
"todayRevenue",
formatCurrency(
todayRevenue
)
);

setText(
"monthlyRevenue",
formatCurrency(
monthlyRevenue
)
);

setText(
"yearlyRevenue",
formatCurrency(
yearlyRevenue
)
);

setText(
"averageOrderValue",
formatCurrency(
avgOrderValue
)
);

}/* =========================================================
REVENUE ANALYTICS CHART
========================================================= */

function generateMonthlyRevenueData(){

const months = [

"Jan",
"Feb",
"Mar",
"Apr",
"May",
"Jun",
"Jul",
"Aug",
"Sep",
"Oct",
"Nov",
"Dec"

];

const monthlyRevenue =
new Array(12).fill(0);

orders.forEach(order=>{

try{

const amount =

Number(

order.totalAmount ||

order.amount ||

0

);

const date =

order.createdAt?.seconds

?

new Date(
order.createdAt.seconds * 1000
)

:

new Date(
order.createdAt ||
Date.now()
);

const month =

date.getMonth();

monthlyRevenue[month] +=
amount;

}catch(error){

console.error(
error
);

}

});

return {

labels:months,

data:monthlyRevenue

};

}

/* =========================================================
REVENUE CHART
========================================================= */

function renderRevenueChart(){

const canvas =

document.getElementById(
"revenueChart"
);

if(!canvas)
return;

const ctx =
canvas.getContext(
"2d"
);

const chartData =

generateMonthlyRevenueData();

if(revenueChart){

revenueChart.destroy();

}

revenueChart =

new Chart(

ctx,

{

type:"line",

data:{

labels:
chartData.labels,

datasets:[

{

label:
"Revenue",

data:
chartData.data,

borderColor:
"#16A34A",

backgroundColor:
"rgba(22,163,74,.15)",

borderWidth:4,

fill:true,

tension:.35

}

]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

display:true

}

},

scales:{

y:{

beginAtZero:true

}

}

}

}

);

}

/* =========================================================
REVENUE BREAKDOWN
========================================================= */

function updateRevenueBreakdown(){

const today =
new Date();

let todayRevenue = 0;

let weekRevenue = 0;

let monthRevenue = 0;

let yearRevenue = 0;

orders.forEach(order=>{

const amount =

Number(

order.totalAmount ||

order.amount ||

0

);

const orderDate =

order.createdAt?.seconds

?

new Date(
order.createdAt.seconds * 1000
)

:

new Date(
order.createdAt ||
Date.now()
);

const diffDays =

Math.floor(

(today - orderDate)

/

86400000

);

if(

orderDate.toDateString()

===

today.toDateString()

){

todayRevenue += amount;

}

if(diffDays <= 7){

weekRevenue += amount;

}

if(

orderDate.getMonth()

===

today.getMonth()

&&

orderDate.getFullYear()

===

today.getFullYear()

){

monthRevenue += amount;

}

if(

orderDate.getFullYear()

===

today.getFullYear()

){

yearRevenue += amount;

}

});

setText(

"todayRevenue",

formatCurrency(
todayRevenue
)

);

setText(

"weeklyRevenue",

formatCurrency(
weekRevenue
)

);

setText(

"monthlyRevenue",

formatCurrency(
monthRevenue
)

);

setText(

"yearlyRevenue",

formatCurrency(
yearRevenue
)

);

}

/* =========================================================
REVENUE SOURCE BREAKDOWN
========================================================= */

function updateRevenueSources(){

let laundryRevenue = 0;

let drycleanRevenue = 0;

let ironingRevenue = 0;

let expressRevenue = 0;

orders.forEach(order=>{

const amount =

Number(

order.totalAmount ||

order.amount ||

0

);

const service =

String(

order.service ||

""

).toLowerCase();

if(

service.includes(
"laundry"
)

){

laundryRevenue += amount;

}

else if(

service.includes(
"dry"
)

){

drycleanRevenue += amount;

}

else if(

service.includes(
"iron"
)

){

ironingRevenue += amount;

}

else{

expressRevenue += amount;

}

});

setText(

"laundryRevenue",

formatCurrency(
laundryRevenue
)

);

setText(

"drycleanRevenue",

formatCurrency(
drycleanRevenue
)

);

setText(

"ironingRevenue",

formatCurrency(
ironingRevenue
)

);

setText(

"expressRevenue",

formatCurrency(
expressRevenue
)

);

}

/* =========================================================
TOP REVENUE CITY
========================================================= */

function updateTopCityRevenue(){

const cityMap = {};

orders.forEach(order=>{

const city =

order.city ||

"Unknown";

const amount =

Number(

order.totalAmount ||

order.amount ||

0

);

cityMap[city] =

(cityMap[city] || 0)

+

amount;

});

let topCity = "-";

let topRevenue = 0;

Object.entries(cityMap)

.forEach(

([city,revenue])=>{

if(revenue > topRevenue){

topRevenue = revenue;

topCity = city;

}

}

);

setText(
"topRevenueCity",
topCity
);

setText(
"topRevenueCityAmount",
formatCurrency(
topRevenue
)
);

}

/* =========================================================
REFRESH ANALYTICS
========================================================= */

function refreshRevenueAnalytics(){

updateRevenueCards();

updateRevenueBreakdown();

updateRevenueSources();

updateTopCityRevenue();

renderRevenueChart();

console.log(
"Revenue Analytics Updated"
);

}/* =========================================================
PARTNER SETTLEMENTS
========================================================= */

function calculatePartnerSettlements(){

const partnerMap = {};

orders.forEach(order=>{

const partnerId =
order.partnerId;

if(!partnerId)
return;

const amount =

Number(

order.totalAmount ||

order.amount ||

0

);

if(!partnerMap[partnerId]){

partnerMap[partnerId] = {

partnerId,

orders:0,

revenue:0,

commission:0,

payable:0

};

}

partnerMap[partnerId].orders++;

partnerMap[partnerId].revenue += amount;

});

Object.values(partnerMap)

.forEach(item=>{

item.commission =

item.revenue * 0.15;

item.payable =

item.revenue -

item.commission;

});

return Object.values(
partnerMap
);

}

/* =========================================================
SETTLEMENT ANALYTICS
========================================================= */

function updateSettlementAnalytics(){

const settlementsData =

calculatePartnerSettlements();

let pendingAmount = 0;

let paidAmount = 0;

settlementsData.forEach(item=>{

pendingAmount +=

item.payable;

});

settlements.forEach(item=>{

paidAmount +=

Number(
item.amount || 0
);

});

setText(

"pendingPartnerAmount",

formatCurrency(
pendingAmount
)

);

setText(

"paidPartnerAmount",

formatCurrency(
paidAmount
)

);

setText(

"pendingPartners",

settlementsData.length

);

setText(

"totalPartners",

partners.length

);

}

/* =========================================================
SETTLEMENT TABLE
========================================================= */

function renderSettlementTable(){

const tbody =

document.getElementById(
"partnerSettlementBody"
);

if(!tbody)
return;

const data =

calculatePartnerSettlements();

tbody.innerHTML = "";

data.forEach(item=>{

const partner =

partners.find(

p=>p.id ===
item.partnerId

);

const row = document.createElement(
"tr"
);

row.innerHTML = `

<td>

${partner?.businessName ||

partner?.name ||

"Partner"}

</td>

<td>

${item.orders}

</td>

<td>

${formatCurrency(
item.revenue
)}

</td>

<td>

${formatCurrency(
item.commission
)}

</td>

<td>

${formatCurrency(
item.payable
)}

</td>

<td>

<span class="statusPending">

Pending

</span>

</td>

<td>

<button
class="confirmBtn"
onclick="openPayPartnerModal(
'${item.partnerId}',
'${partner?.businessName || ""}',
${item.payable}
)">

Pay

</button>

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
SETTLEMENT HISTORY
========================================================= */

function renderSettlementHistory(){

const tbody =

document.getElementById(
"settlementHistoryBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

settlements.forEach(item=>{

const row =

document.createElement(
"tr"
);

row.innerHTML = `

<td>

${item.id}

</td>

<td>

${item.partnerName || "-"}

</td>

<td>

${formatCurrency(
item.amount
)}

</td>

<td>

${formatDate(
item.createdAt
)}

</td>

<td>

${item.method || "-"}

</td>

<td>

<span class="statusPaid">

Paid

</span>

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
PAY MODAL
========================================================= */

window.openPayPartnerModal =

function(

partnerId,
partnerName,
amount

){

document.getElementById(
"payPartnerId"
).value = partnerId;

document.getElementById(
"payPartnerName"
).value = partnerName;

document.getElementById(
"payPartnerAmount"
).value =

formatCurrency(
amount
);

document.getElementById(
"payPartnerModal"
)

.classList.add(
"active"
);

};

window.closePayPartnerModal =

function(){

document.getElementById(
"payPartnerModal"
)

.classList.remove(
"active"
);

};

/* =========================================================
MARK PARTNER PAID
========================================================= */

window.confirmPartnerPayment =

async function(){

try{

const partnerId =

document.getElementById(
"payPartnerId"
).value;

const partnerName =

document.getElementById(
"payPartnerName"
).value;

const amount =

Number(

document.getElementById(
"payPartnerAmount"
)

.value

.replace("₹","")

.replaceAll(",","")

);

const method =

document.getElementById(
"partnerPaymentMethod"
).value;

await addDoc(

collection(
db,
SETTLEMENTS_COLLECTION
),

{

partnerId,
partnerName,
amount,
method,

status:"paid",

createdAt:
serverTimestamp()

}

);

closePayPartnerModal();

await loadSettlements();

renderSettlementHistory();

updateSettlementAnalytics();

alert(
"Settlement Paid Successfully"
);

}catch(error){

console.error(
error
);

alert(
"Payment Failed"
);

}

};

/* =========================================================
REFRESH SETTLEMENTS
========================================================= */

function refreshSettlements(){

updateSettlementAnalytics();

renderSettlementTable();

renderSettlementHistory();

}/* =========================================================
DRIVER PAYOUT SYSTEM
========================================================= */

let driverPayouts = [];

/* =========================================================
CALCULATE DRIVER PAYOUTS
========================================================= */

function calculateDriverPayouts(){

const driverMap = {};

orders.forEach(order=>{

const driverId =

order.driverId;

if(!driverId)
return;

const deliveryFee =

Number(

order.deliveryFee ||

50

);

if(!driverMap[driverId]){

driverMap[driverId] = {

driverId,

deliveries:0,

earnings:0,

bonus:0,

penalty:0,

netPayable:0

};

}

driverMap[driverId]
.deliveries++;

driverMap[driverId]
.earnings += deliveryFee;

});

/* Bonus Logic */

Object.values(driverMap)

.forEach(item=>{

if(

item.deliveries >= 100

){

item.bonus = 1000;

}

else if(

item.deliveries >= 50

){

item.bonus = 500;

}

item.netPayable =

item.earnings +

item.bonus -

item.penalty;

});

driverPayouts =

Object.values(
driverMap
);

return driverPayouts;

}

/* =========================================================
DRIVER ANALYTICS
========================================================= */

function updateDriverAnalytics(){

const payouts =

calculateDriverPayouts();

let pendingAmount = 0;

let totalBonus = 0;

let totalPenalty = 0;

let totalNet = 0;

let totalDeliveries = 0;

payouts.forEach(item=>{

pendingAmount +=
item.netPayable;

totalBonus +=
item.bonus;

totalPenalty +=
item.penalty;

totalNet +=
item.netPayable;

totalDeliveries +=
item.deliveries;

});

setText(
"pendingDriverAmount",
formatCurrency(
pendingAmount
)
);

setText(
"paidDriverAmount",
formatCurrency(
0
)
);

setText(
"pendingDrivers",
payouts.length
);

setText(
"totalDrivers",
drivers.length
);

setText(
"completedDeliveries",
totalDeliveries
);

setText(
"driverBonuses",
formatCurrency(
totalBonus
)
);

setText(
"driverPenalties",
formatCurrency(
totalPenalty
)
);

setText(
"driverNetPayout",
formatCurrency(
totalNet
)
);

}

/* =========================================================
RENDER DRIVER TABLE
========================================================= */

function renderDriverPayoutTable(){

const tbody =

document.getElementById(
"driverPayoutBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

const payouts =

calculateDriverPayouts();

payouts.forEach(item=>{

const driver =

drivers.find(

d=>d.id ===
item.driverId

);

const row =

document.createElement(
"tr"
);

row.innerHTML = `

<td>

${driver?.name || "Driver"}

</td>

<td>

${item.deliveries}

</td>

<td>

${formatCurrency(
item.earnings
)}

</td>

<td>

${formatCurrency(
item.bonus
)}

</td>

<td>

${formatCurrency(
item.penalty
)}

</td>

<td>

${formatCurrency(
item.netPayable
)}

</td>

<td>

<span class="driverPending">

Pending

</span>

</td>

<td>

<button
class="confirmBtn"
onclick="openDriverPaymentModal(
'${item.driverId}',
'${driver?.name || ""}',
${item.netPayable}
)">

Pay

</button>

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
PAYMENT MODAL
========================================================= */

window.openDriverPaymentModal =

function(

driverId,
driverName,
amount

){

document.getElementById(
"driverPaymentId"
).value = driverId;

document.getElementById(
"driverPaymentName"
).value = driverName;

document.getElementById(
"driverPaymentAmount"
).value =

formatCurrency(
amount
);

document.getElementById(
"driverPaymentModal"
)

.classList.add(
"active"
);

};

window.closeDriverPaymentModal =

function(){

document.getElementById(
"driverPaymentModal"
)

.classList.remove(
"active"
);

};

/* =========================================================
MARK DRIVER PAID
========================================================= */

window.confirmDriverPayment =

async function(){

try{

const driverId =

document.getElementById(
"driverPaymentId"
).value;

const driverName =

document.getElementById(
"driverPaymentName"
).value;

const amount =

Number(

document.getElementById(
"driverPaymentAmount"
)

.value

.replace("₹","")

.replaceAll(",","")

);

const method =

document.getElementById(
"driverPaymentMethod"
).value;

await addDoc(

collection(
db,
"driverPayouts"
),

{

driverId,
driverName,
amount,
method,

status:"paid",

createdAt:
serverTimestamp()

}

);

closeDriverPaymentModal();

renderDriverPaymentHistory();

alert(
"Driver Payment Completed"
);

}catch(error){

console.error(
error
);

alert(
"Payment Failed"
);

}

};

/* =========================================================
PAYMENT HISTORY
========================================================= */

async function renderDriverPaymentHistory(){

const tbody =

document.getElementById(
"driverHistoryBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

const snapshot =

await getDocs(

collection(
db,
"driverPayouts"
)

);

snapshot.forEach(docSnap=>{

const data =
docSnap.data();

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${docSnap.id}</td>

<td>${data.driverName || "-"}</td>

<td>${formatCurrency(data.amount)}</td>

<td>${formatDate(data.createdAt)}</td>

<td>${data.method || "-"}</td>

<td>

<span class="driverPaid">

Paid

</span>

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
REFRESH DRIVER PAYOUTS
========================================================= */

function refreshDriverPayouts(){

updateDriverAnalytics();

renderDriverPayoutTable();

renderDriverPaymentHistory();

console.log(
"Driver Payouts Updated"
);

}/* =========================================================
WITHDRAW REQUEST ANALYTICS
========================================================= */

function updateWithdrawAnalytics(){

let pendingAmount = 0;
let approvedAmount = 0;
let rejectedCount = 0;

withdrawals.forEach(item=>{

const amount = Number(
item.amount || 0
);

if(item.status === "pending"){

pendingAmount += amount;

}

else if(
item.status === "approved"
){

approvedAmount += amount;

}

else if(
item.status === "rejected"
){

rejectedCount++;

}

});

setText(
"pendingWithdrawAmount",
formatCurrency(
pendingAmount
)
);

setText(
"approvedWithdrawAmount",
formatCurrency(
approvedAmount
)
);

setText(
"rejectedWithdrawCount",
rejectedCount
);

setText(
"totalWithdrawRequests",
withdrawals.length
);

}

/* =========================================================
RENDER WITHDRAW REQUESTS
========================================================= */

function renderWithdrawRequests(){

const tbody =

document.getElementById(
"withdrawRequestBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

withdrawals.forEach(item=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${item.id}</td>

<td>
${item.userName || "-"}
</td>

<td>
${item.userType || "-"}
</td>

<td>
${formatCurrency(item.amount)}
</td>

<td>
${item.bankName || item.upiId || "-"}
</td>

<td>
${formatDate(item.createdAt)}
</td>

<td>

<span class="${
item.status === "approved"
? "withdrawApproved"
: item.status === "rejected"
? "withdrawRejected"
: "withdrawPending"
}">

${item.status || "pending"}

</span>

</td>

<td>

${
item.status === "pending"

?

`

<button
class="confirmBtn"
onclick="openWithdrawModal(
'${item.id}',
'${item.userName || ""}',
${item.amount || 0}
)">

Approve

</button>

<button
class="deleteBtn"
onclick="rejectWithdrawal(
'${item.id}'
)">

Reject

</button>

`

:

"-"

}

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
WITHDRAW HISTORY
========================================================= */

function renderWithdrawHistory(){

const tbody =

document.getElementById(
"withdrawHistoryBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

withdrawals

.filter(item=>

item.status === "approved"

||

item.status === "rejected"

)

.forEach(item=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${item.id}</td>

<td>${item.userName || "-"}</td>

<td>${formatCurrency(item.amount)}</td>

<td>${formatDate(item.createdAt)}</td>

<td>${item.paymentMethod || "-"}</td>

<td>${item.status}</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
APPROVAL MODAL
========================================================= */

window.openWithdrawModal =

function(
id,
userName,
amount
){

document.getElementById(
"withdrawRequestId"
).value = id;

document.getElementById(
"withdrawUserName"
).value = userName;

document.getElementById(
"withdrawAmount"
).value = formatCurrency(
amount
);

document.getElementById(
"withdrawApprovalModal"
)

.classList.add(
"active"
);

};

window.closeWithdrawModal =

function(){

document.getElementById(
"withdrawApprovalModal"
)

.classList.remove(
"active"
);

};

/* =========================================================
APPROVE WITHDRAWAL
========================================================= */

window.approveWithdrawal =

async function(){

try{

const id =

document.getElementById(
"withdrawRequestId"
).value;

const reference =

document.getElementById(
"paymentReference"
).value;

await updateDoc(

doc(
db,
WITHDRAWALS_COLLECTION,
id
),

{

status:"approved",

paymentReference:
reference,

approvedAt:
serverTimestamp()

}

);

closeWithdrawModal();

await loadWithdrawals();

refreshWithdrawSection();

alert(
"Withdrawal Approved"
);

}catch(error){

console.error(
error
);

alert(
"Approval Failed"
);

}

};

/* =========================================================
REJECT WITHDRAWAL
========================================================= */

window.rejectWithdrawal =

async function(id){

try{

await updateDoc(

doc(
db,
WITHDRAWALS_COLLECTION,
id
),

{

status:"rejected",

rejectedAt:
serverTimestamp()

}

);

await loadWithdrawals();

refreshWithdrawSection();

alert(
"Withdrawal Rejected"
);

}catch(error){

console.error(
error
);

alert(
"Reject Failed"
);

}

};

/* =========================================================
WALLET TRANSACTIONS
========================================================= */

async function renderWalletTransactions(){

const tbody =

document.getElementById(
"walletTransactionsBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

const snapshot =

await getDocs(

collection(
db,
"walletTransactions"
)

);

snapshot.forEach(docSnap=>{

const data =
docSnap.data();

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${docSnap.id}</td>

<td>${data.userName || "-"}</td>

<td>${data.type || "-"}</td>

<td>${formatCurrency(data.amount)}</td>

<td>${formatCurrency(data.balance)}</td>

<td>${formatDate(data.createdAt)}</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
REFRESH WITHDRAW SECTION
========================================================= */

function refreshWithdrawSection(){

updateWithdrawAnalytics();

renderWithdrawRequests();

renderWithdrawHistory();

renderWalletTransactions();

console.log(
"Withdraw Section Updated"
);

}/* =========================================================
REFUND ANALYTICS
========================================================= */

function updateRefundAnalytics(){

let pendingAmount = 0;
let approvedAmount = 0;
let rejectedAmount = 0;

refunds.forEach(refund=>{

const amount =
Number(
refund.amount || 0
);

if(refund.status === "pending"){

pendingAmount += amount;

}

else if(
refund.status === "approved"
){

approvedAmount += amount;

}

else if(
refund.status === "rejected"
){

rejectedAmount += amount;

}

});

setText(
"pendingRefundAmount",
formatCurrency(
pendingAmount
)
);

setText(
"approvedRefundAmount",
formatCurrency(
approvedAmount
)
);

setText(
"rejectedRefundAmount",
formatCurrency(
rejectedAmount
)
);

setText(
"totalRefundRequests",
refunds.length
);

}

/* =========================================================
REFUND TABLE
========================================================= */

function renderRefundRequests(){

const tbody =

document.getElementById(
"refundRequestBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

refunds.forEach(refund=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${refund.id}</td>

<td>${refund.orderId || "-"}</td>

<td>${refund.customerName || "-"}</td>

<td>${formatCurrency(refund.amount)}</td>

<td>${refund.reason || "-"}</td>

<td>${formatDate(refund.createdAt)}</td>

<td>

<span class="${
refund.status === "approved"
? "refundApproved"
: refund.status === "rejected"
? "refundRejected"
: "refundPending"
}">

${refund.status || "pending"}

</span>

</td>

<td>

${
refund.status === "pending"

?

`

<button
class="confirmBtn"
onclick="openRefundModal(
'${refund.id}',
'${refund.customerName || ""}',
${refund.amount || 0}
)">

Approve

</button>

<button
class="deleteBtn"
onclick="openRejectRefundModal(
'${refund.id}'
)">

Reject

</button>

`

:

"-"

}

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
REFUND HISTORY
========================================================= */

function renderRefundHistory(){

const tbody =

document.getElementById(
"refundHistoryBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

refunds

.filter(item=>

item.status === "approved"

||

item.status === "rejected"

)

.forEach(item=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${item.id}</td>

<td>${item.orderId || "-"}</td>

<td>${item.customerName || "-"}</td>

<td>${formatCurrency(item.amount)}</td>

<td>${formatDate(item.createdAt)}</td>

<td>${item.status}</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
APPROVE REFUND MODAL
========================================================= */

window.openRefundModal =

function(
refundId,
customer,
amount
){

document.getElementById(
"refundRequestId"
).value = refundId;

document.getElementById(
"refundCustomer"
).value = customer;

document.getElementById(
"refundAmount"
).value = formatCurrency(
amount
);

document.getElementById(
"refundApprovalModal"
)

.classList.add(
"active"
);

};

window.closeRefundModal =

function(){

document.getElementById(
"refundApprovalModal"
)

.classList.remove(
"active"
);

};

/* =========================================================
APPROVE REFUND
========================================================= */

window.approveRefund =

async function(){

try{

const refundId =

document.getElementById(
"refundRequestId"
).value;

const refundMethod =

document.getElementById(
"refundMethod"
).value;

await updateDoc(

doc(
db,
REFUNDS_COLLECTION,
refundId
),

{

status:"approved",

refundMethod,

approvedAt:
serverTimestamp()

}

);

/* Wallet Credit Entry */

if(
refundMethod === "Wallet"
){

await addDoc(

collection(
db,
"walletTransactions"
),

{

type:"Refund",

amount:Number(

document
.getElementById(
"refundAmount"
)

.value

.replace("₹","")
.replaceAll(",","")

),

createdAt:
serverTimestamp()

}

);

}

closeRefundModal();

await loadRefunds();

refreshRefundSection();

alert(
"Refund Approved"
);

}catch(error){

console.error(
error
);

alert(
"Refund Failed"
);

}

};

/* =========================================================
REJECT REFUND MODAL
========================================================= */

window.openRejectRefundModal =

function(refundId){

document.getElementById(
"rejectRefundId"
).value = refundId;

document.getElementById(
"rejectRefundModal"
)

.classList.add(
"active"
);

};

window.closeRejectRefundModal =

function(){

document.getElementById(
"rejectRefundModal"
)

.classList.remove(
"active"
);

};

/* =========================================================
REJECT REFUND
========================================================= */

window.rejectRefund =

async function(){

try{

const refundId =

document.getElementById(
"rejectRefundId"
).value;

const reason =

document.getElementById(
"refundRejectReason"
).value;

await updateDoc(

doc(
db,
REFUNDS_COLLECTION,
refundId
),

{

status:"rejected",

rejectionReason:
reason,

rejectedAt:
serverTimestamp()

}

);

closeRejectRefundModal();

await loadRefunds();

refreshRefundSection();

alert(
"Refund Rejected"
);

}catch(error){

console.error(
error
);

alert(
"Refund Rejection Failed"
);

}

};

/* =========================================================
REFRESH REFUNDS
========================================================= */

function refreshRefundSection(){

updateRefundAnalytics();

renderRefundRequests();

renderRefundHistory();

console.log(
"Refund Section Updated"
);

}/* =========================================================
EXPENSE ANALYTICS
========================================================= */

function updateExpenseAnalytics(){

let totalExpenses = 0;

let marketing = 0;
let operations = 0;
let technology = 0;

expenses.forEach(expense=>{

const amount =

Number(
expense.amount || 0
);

totalExpenses += amount;

switch(
expense.category
){

case "Marketing":

marketing += amount;
break;

case "Operations":

operations += amount;
break;

case "Technology":

technology += amount;
break;

}

});

setText(
"totalExpenses",
formatCurrency(
totalExpenses
)
);

setText(
"marketingExpense",
formatCurrency(
marketing
)
);

setText(
"operationsExpense",
formatCurrency(
operations
)
);

setText(
"technologyExpense",
formatCurrency(
technology
)
);

}

/* =========================================================
RENDER EXPENSE TABLE
========================================================= */

function renderExpenses(){

const tbody =

document.getElementById(
"expenseTableBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

expenses.forEach(expense=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${expense.id}</td>

<td>${expense.category}</td>

<td>${expense.description || "-"}</td>

<td>${formatCurrency(expense.amount)}</td>

<td>${formatDate(expense.createdAt)}</td>

<td>${expense.createdBy || "Admin"}</td>

<td>

<button
class="deleteBtn"
onclick="deleteExpense(
'${expense.id}'
)">

Delete

</button>

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
ADD EXPENSE MODAL
========================================================= */

window.openExpenseModal =

function(){

document.getElementById(
"expenseModal"
)

.classList.add(
"active"
);

};

window.closeExpenseModal =

function(){

document.getElementById(
"expenseModal"
)

.classList.remove(
"active"
);

};

/* =========================================================
SAVE EXPENSE
========================================================= */

window.saveExpense =

async function(){

try{

const category =

document.getElementById(
"expenseCategory"
).value;

const description =

document.getElementById(
"expenseDescription"
).value;

const amount =

Number(

document.getElementById(
"expenseAmount"
).value

);

if(!amount){

alert(
"Amount Required"
);

return;

}

await addDoc(

collection(
db,
EXPENSES_COLLECTION
),

{

category,
description,
amount,

createdBy:"Admin",

createdAt:
serverTimestamp()

}

);

closeExpenseModal();

await loadExpenses();

refreshExpenseSection();

alert(
"Expense Added"
);

}catch(error){

console.error(
error
);

alert(
"Expense Save Failed"
);

}

};

/* =========================================================
DELETE EXPENSE
========================================================= */

window.deleteExpense =

async function(id){

try{

if(

!confirm(
"Delete Expense?"
)

){

return;

}

await deleteDoc(

doc(
db,
EXPENSES_COLLECTION,
id
)

);

await loadExpenses();

refreshExpenseSection();

}catch(error){

console.error(
error
);

}

};

/* =========================================================
GST CALCULATION
========================================================= */

function updateGSTReport(){

const revenue =

orders.reduce(

(sum,order)=>

sum +

Number(

order.totalAmount ||

order.amount ||

0

),

0

);

const gstTotal =

revenue * 0.18;

const cgst =

gstTotal / 2;

const sgst =

gstTotal / 2;

const igst =

0;

setText(
"gstCollectedTotal",
formatCurrency(
gstTotal
)
);

setText(
"cgstAmount",
formatCurrency(
cgst
)
);

setText(
"sgstAmount",
formatCurrency(
sgst
)
);

setText(
"igstAmount",
formatCurrency(
igst
)
);

}

/* =========================================================
PROFIT & LOSS
========================================================= */

function updateProfitLoss(){

const revenue =

orders.reduce(

(sum,order)=>

sum +

Number(

order.totalAmount ||

order.amount ||

0

),

0

);

const settlementCost =

settlements.reduce(

(sum,item)=>

sum +

Number(
item.amount || 0
),

0

);

const refundCost =

refunds.reduce(

(sum,item)=>

sum +

Number(
item.amount || 0
),

0

);

const expenseCost =

expenses.reduce(

(sum,item)=>

sum +

Number(
item.amount || 0
),

0

);

const driverCost =

driverPayouts.reduce(

(sum,item)=>

sum +

Number(
item.netPayable || 0
),

0

);

const netProfit =

revenue -

settlementCost -

refundCost -

expenseCost -

driverCost;

setText(
"plRevenue",
formatCurrency(
revenue
)
);

setText(
"plSettlements",
formatCurrency(
settlementCost
)
);

setText(
"plDriverPayouts",
formatCurrency(
driverCost
)
);

setText(
"plRefunds",
formatCurrency(
refundCost
)
);

setText(
"plExpenses",
formatCurrency(
expenseCost
)
);

setText(
"plNetProfit",
formatCurrency(
netProfit
)
);

}

/* =========================================================
REFRESH EXPENSE SECTION
========================================================= */

function refreshExpenseSection(){

updateExpenseAnalytics();

renderExpenses();

updateGSTReport();

updateProfitLoss();

console.log(
"Expense Section Updated"
);

}/* =========================================================
TRANSACTION LEDGER
========================================================= */

function renderTransactionLedger(){

const tbody =

document.getElementById(
"ledgerTableBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

const ledger = [];

/* Revenue */

orders.forEach(order=>{

ledger.push({

id:order.id,

date:order.createdAt,

type:"Revenue",

user:
order.customerName || "-",

amount:
Number(
order.totalAmount ||
order.amount ||
0
),

status:
order.status || "completed"

});

});

/* Settlements */

settlements.forEach(item=>{

ledger.push({

id:item.id,

date:item.createdAt,

type:"Settlement",

user:
item.partnerName || "-",

amount:
Number(
item.amount || 0
),

status:
item.status || "paid"

});

});

/* Refunds */

refunds.forEach(item=>{

ledger.push({

id:item.id,

date:item.createdAt,

type:"Refund",

user:
item.customerName || "-",

amount:
Number(
item.amount || 0
),

status:
item.status || "-"

});

});

/* Expenses */

expenses.forEach(item=>{

ledger.push({

id:item.id,

date:item.createdAt,

type:"Expense",

user:
item.createdBy || "-",

amount:
Number(
item.amount || 0
),

status:"completed"

});

});

/* Sort */

ledger.sort(

(a,b)=>{

const aDate =

a.date?.seconds

?

a.date.seconds

:

0;

const bDate =

b.date?.seconds

?

b.date.seconds

:

0;

return bDate - aDate;

}

);

ledger.forEach(item=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${item.id}</td>

<td>${formatDate(item.date)}</td>

<td>${item.type}</td>

<td>${item.user}</td>

<td>${formatCurrency(item.amount)}</td>

<td>${item.status}</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
LEDGER SEARCH
========================================================= */

function initLedgerSearch(){

const searchInput =

document.getElementById(
"ledgerSearch"
);

if(!searchInput)
return;

searchInput.addEventListener(

"input",

e=>{

const value =

e.target.value
.toLowerCase();

document

.querySelectorAll(
"#ledgerTableBody tr"
)

.forEach(row=>{

row.style.display =

row.innerText

.toLowerCase()

.includes(value)

?

""

:

"none";

});

}

);

}

/* =========================================================
EXPORT CSV
========================================================= */

function exportCSV(

rows,
filename

){

let csv = "";

rows.forEach(row=>{

csv +=

row.join(",")

+

"\n";

});

const blob =

new Blob(

[csv],

{

type:
"text/csv"

}

);

const url =

URL.createObjectURL(
blob
);

const a =
document.createElement(
"a"
);

a.href = url;

a.download =
filename;

a.click();

URL.revokeObjectURL(
url
);

}

/* =========================================================
EXPORT REVENUE
========================================================= */

window.exportRevenueCSV =

function(){

const rows = [

[
"Order ID",
"Customer",
"Amount"
]

];

orders.forEach(order=>{

rows.push([

order.id,

order.customerName || "",

order.totalAmount || 0

]);

});

exportCSV(

rows,

"revenue-report.csv"

);

};

/* =========================================================
EXPORT EXPENSES
========================================================= */

window.exportExpensesCSV =

function(){

const rows = [

[
"Expense ID",
"Category",
"Amount"
]

];

expenses.forEach(item=>{

rows.push([

item.id,

item.category,

item.amount

]);

});

exportCSV(

rows,

"expense-report.csv"

);

};

/* =========================================================
SAVE FINANCE SETTINGS
========================================================= */

window.saveFinanceSettings =

async function(){

try{

const settings = {

partnerCommission:

Number(

document.getElementById(
"partnerCommission"
)?.value || 15

),

driverCommission:

Number(

document.getElementById(
"driverCommission"
)?.value || 20

),

gstPercent:

Number(

document.getElementById(
"gstPercent"
)?.value || 18

),

platformFee:

Number(

document.getElementById(
"platformFee"
)?.value || 5

),

updatedAt:
serverTimestamp()

};

await addDoc(

collection(
db,
"financeSettings"
),

settings

);

alert(
"Finance Settings Saved"
);

}catch(error){

console.error(
error
);

alert(
"Settings Save Failed"
);

}

};

/* =========================================================
REFRESH LEDGER
========================================================= */

function refreshLedger(){

renderTransactionLedger();

initLedgerSearch();

console.log(
"Ledger Updated"
);

}/* =========================================================
LOAD ALL FINANCE DATA
========================================================= */

async function loadFinanceData(){

try{

showLoader();

await Promise.all([

loadOrders(),
loadUsers(),
loadPartners(),
loadDrivers(),
loadTransactions(),
loadSettlements(),
loadWithdrawals(),
loadRefunds(),
loadExpenses()

]);

hideLoader();

console.log(
"Finance Data Loaded Successfully"
);

}catch(error){

hideLoader();

console.error(
"Finance Load Error",
error
);

}

}

/* =========================================================
REFRESH COMPLETE DASHBOARD
========================================================= */

async function refreshFinanceDashboard(){

try{

calculateFinanceTotals();

refreshRevenueAnalytics();

refreshSettlements();

refreshDriverPayouts();

refreshWithdrawSection();

refreshRefundSection();

refreshExpenseSection();

refreshLedger();

console.log(
"Finance Dashboard Refreshed"
);

}catch(error){

console.error(
"Refresh Error",
error
);

}

}

/* =========================================================
AUTO REFRESH
========================================================= */

setInterval(

async ()=>{

await loadFinanceData();

await refreshFinanceDashboard();

},

300000

);

/* =========================================================
FILTER EVENTS
========================================================= */

document

.getElementById(
"financeTypeFilter"
)

?.addEventListener(

"change",

()=>{

refreshLedger();

}

);

document

.getElementById(
"fromDate"
)

?.addEventListener(

"change",

()=>{

refreshLedger();

}

);

document

.getElementById(
"toDate"
)

?.addEventListener(

"change",

()=>{

refreshLedger();

}

);

/* =========================================================
EXPORT BUTTON EVENTS
========================================================= */

document

.querySelectorAll(
".exportBtn"
)

.forEach(btn=>{

btn.addEventListener(

"click",

()=>{

console.log(
"Export Triggered"
);

}

);

});

/* =========================================================
FINANCE SETTINGS BUTTON
========================================================= */

document

.querySelector(
".confirmBtn"
)

?.addEventListener(

"click",

()=>{

const btnText =

document
.querySelector(
".confirmBtn"
)

?.innerText;

if(

btnText ===

"Save Settings"

){

saveFinanceSettings();

}

}

);

/* =========================================================
GLOBAL EXPORTS
========================================================= */

window.financeApp = {

loadFinanceData,

refreshFinanceDashboard,

loadOrders,
loadUsers,
loadPartners,
loadDrivers,

loadTransactions,
loadSettlements,
loadWithdrawals,
loadRefunds,
loadExpenses,

calculateFinanceTotals,

refreshRevenueAnalytics,

refreshSettlements,

refreshDriverPayouts,

refreshWithdrawSection,

refreshRefundSection,

refreshExpenseSection,

refreshLedger,

saveFinanceSettings,

exportRevenueCSV,

exportExpensesCSV

};

/* =========================================================
INITIALIZATION
========================================================= */

document.addEventListener(

"DOMContentLoaded",

async ()=>{

try{

console.log(
"QuickPress Finance Panel Starting..."
);

await loadFinanceData();

await refreshFinanceDashboard();

console.log(
"QuickPress Finance Panel Ready 🚀"
);

}catch(error){

console.error(

"Finance Initialization Error",

error

);

}

}

);

/* =========================================================
END OF FILE
QUICKPRESS FINANCE PANEL
========================================================= */
