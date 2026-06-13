/* =========================================================
QUICKPRESS REPORTS PANEL
FILE: reports.js
PART 1/5
========================================================= */

/* =========================================================
FIREBASE IMPORTS
========================================================= */

import { db } from "../js/firebase.js";

import {

collection,
getDocs,
query,
orderBy

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
COLLECTIONS
========================================================= */

const ORDERS_COLLECTION =
"orders";

const USERS_COLLECTION =
"users";

const PARTNERS_COLLECTION =
"partners";

const DRIVERS_COLLECTION =
"drivers";

const FINANCE_COLLECTION =
"finance";

const REPORTS_COLLECTION =
"reports";

/* =========================================================
GLOBAL STATE
========================================================= */

let orders = [];
let customers = [];
let partners = [];
let drivers = [];
let finance = [];

let reportsHistory = [];

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
amount
){

return "₹" +

Number(
amount || 0
)

.toLocaleString(
"en-IN"
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
error
);

}

}

/* =========================================================
LOAD CUSTOMERS
========================================================= */

async function loadCustomers(){

try{

const snapshot =

await getDocs(

collection(
db,
USERS_COLLECTION
)

);

customers = [];

snapshot.forEach(docSnap=>{

customers.push({

id:docSnap.id,

...docSnap.data()

});

});

}catch(error){

console.error(
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

}catch(error){

console.error(
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

}catch(error){

console.error(
error
);

}

}

/* =========================================================
LOAD FINANCE
========================================================= */

async function loadFinance(){

try{

const snapshot =

await getDocs(

collection(
db,
FINANCE_COLLECTION
)

);

finance = [];

snapshot.forEach(docSnap=>{

finance.push({

id:docSnap.id,

...docSnap.data()

});

});

}catch(error){

console.error(
error
);

}

}

/* =========================================================
REPORT ANALYTICS
========================================================= */

function updateReportAnalytics(){

const totalRevenue =

orders.reduce(

(sum,order)=>

sum +

Number(
order.totalAmount || 0
),

0

);

const totalGST =

orders.reduce(

(sum,order)=>

sum +

Number(
order.gstAmount || 0
),

0

);

const totalExpense =

finance.reduce(

(sum,item)=>

sum +

Number(
item.amount || 0
),

0

);

const netProfit =

totalRevenue

-

totalExpense

-

totalGST;

setText(
"totalRevenue",
formatCurrency(
totalRevenue
)
);

setText(
"totalOrders",
orders.length
);

setText(
"totalGST",
formatCurrency(
totalGST
)
);

setText(
"netProfit",
formatCurrency(
netProfit
)
);

}

/* =========================================================
CUSTOMER ANALYTICS
========================================================= */

function updateCustomerAnalytics(){

setText(
"totalCustomers",
customers.length
);

const repeatCustomers =

customers.filter(

customer=>

(customer.orders || 0) > 1

).length;

setText(
"repeatCustomers",
repeatCustomers
);

setText(
"newCustomers",

customers.length -

repeatCustomers

);

const retention =

customers.length

?

(

repeatCustomers

/

customers.length

*

100

).toFixed(1)

: 0;

setText(
"customerRetention",
retention + "%"
);

}/* =========================================================
RENDER SALES REPORT
========================================================= */

function renderSalesReport(){

const tbody =

document.getElementById(
"salesReportBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

orders.forEach(order=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${order.id}</td>

<td>

${order.createdAt?.seconds

?

new Date(
order.createdAt.seconds * 1000
)

.toLocaleDateString()

:

"-"}

</td>

<td>

${order.customerName || "-"}

</td>

<td>

${order.partnerName || "-"}

</td>

<td>

${formatCurrency(
order.totalAmount
)}

</td>

<td>

${formatCurrency(
order.gstAmount
)}

</td>

<td>

${order.status || "-"}

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
GST REPORT
========================================================= */

function renderGSTReport(){

const tbody =

document.getElementById(
"gstReportBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

const monthlyGST = {};

orders.forEach(order=>{

if(!order.createdAt?.seconds)
return;

const month =

new Date(

order.createdAt.seconds * 1000

)

.toLocaleString(
"default",
{
month:"short",
year:"numeric"
}
);

monthlyGST[month] =

(monthlyGST[month] || 0)

+

Number(
order.gstAmount || 0
);

});

Object.entries(monthlyGST)

.forEach(([month,gst])=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${month}</td>

<td>

${formatCurrency(
gst * 5.55
)}

</td>

<td>

18%

</td>

<td>

${formatCurrency(
gst
)}

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
REVENUE BREAKDOWN
========================================================= */

function updateRevenueBreakdown(){

const totalRevenue =

orders.reduce(

(sum,order)=>

sum +

Number(
order.totalAmount || 0
),

0

);

const partnerRevenue =

totalRevenue * 0.65;

const driverRevenue =

totalRevenue * 0.15;

const platformRevenue =

totalRevenue * 0.20;

const serviceRevenue =
totalRevenue;

setText(
"partnerRevenue",
formatCurrency(
partnerRevenue
)
);

setText(
"driverRevenue",
formatCurrency(
driverRevenue
)
);

setText(
"platformRevenue",
formatCurrency(
platformRevenue
)
);

setText(
"serviceRevenue",
formatCurrency(
serviceRevenue
)
);

}

/* =========================================================
ORDER STATUS REPORT
========================================================= */

function updateOrderStatusAnalytics(){

const completed =

orders.filter(

o=>

o.status === "completed"

).length;

const processing =

orders.filter(

o=>

o.status === "processing"

).length;

const picked =

orders.filter(

o=>

o.status === "picked"

||

o.status === "pickedUp"

).length;

const cancelled =

orders.filter(

o=>

o.status === "cancelled"

).length;

setText(
"completedOrders",
completed
);

setText(
"processingOrders",
processing
);

setText(
"pickedOrders",
picked
);

setText(
"cancelledOrders",
cancelled
);

}

/* =========================================================
MONTHLY ANALYTICS
========================================================= */

function updateMonthlyAnalytics(){

const monthlyRevenue =

orders.reduce(

(sum,order)=>

sum +

Number(
order.totalAmount || 0
),

0

);

const monthlyProfit =

monthlyRevenue * 0.20;

setText(
"monthlyRevenue",
formatCurrency(
monthlyRevenue
)
);

setText(
"monthlyProfit",
formatCurrency(
monthlyProfit
)
);

setText(
"monthlyOrders",
orders.length
);

setText(
"growthRate",
"18.5%"
);

}

/* =========================================================
TOP SERVICES REPORT
========================================================= */

function renderTopServices(){

const tbody =

document.getElementById(
"topServicesBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

const services = {};

orders.forEach(order=>{

const service =

order.serviceName

||

"Wash & Fold";

services[service] =

services[service] || {

orders:0,
revenue:0

};

services[service].orders++;

services[service].revenue +=

Number(
order.totalAmount || 0
);

});

Object.entries(services)

.sort(

(a,b)=>

b[1].revenue -

a[1].revenue

)

.slice(0,10)

.forEach(([name,data])=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${name}</td>

<td>${data.orders}</td>

<td>

${formatCurrency(
data.revenue
)}

</td>

<td>

+12%

</td>

`;

tbody.appendChild(
row
);

});

}/* =========================================================
PARTNER REPORT
========================================================= */

function renderPartnerReport(){

const tbody =

document.getElementById(
"partnerReportBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

partners.forEach(partner=>{

const ordersCount =

orders.filter(

o=>

o.partnerId === partner.id

).length;

const revenue =

orders

.filter(

o=>

o.partnerId === partner.id

)

.reduce(

(sum,o)=>

sum +

Number(
o.totalAmount || 0
),

0

);

const commission =

revenue * 0.10;

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>

${partner.businessName ||

partner.name ||

"-"}

</td>

<td>

${ordersCount}

</td>

<td>

${formatCurrency(
revenue
)}

</td>

<td>

${formatCurrency(
commission
)}

</td>

<td>

${partner.rating || 5}

⭐

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
DRIVER REPORT
========================================================= */

function renderDriverReport(){

const tbody =

document.getElementById(
"driverReportBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

drivers.forEach(driver=>{

const deliveries =

orders.filter(

o=>

o.driverId === driver.id

).length;

const earnings =

deliveries * 50;

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>

${driver.name || "-"}

</td>

<td>

${deliveries}

</td>

<td>

${formatCurrency(
earnings
)}

</td>

<td>

${driver.rating || 5}

⭐

</td>

<td>

${driver.status || "active"}

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
PROFIT LOSS REPORT
========================================================= */

function renderProfitLossReport(){

const tbody =

document.getElementById(
"profitLossBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

const monthlyData = {};

orders.forEach(order=>{

if(!order.createdAt?.seconds)
return;

const month =

new Date(

order.createdAt.seconds * 1000

)

.toLocaleString(
"default",
{
month:"short",
year:"numeric"
}
);

if(!monthlyData[month]){

monthlyData[month] = {

revenue:0,
gst:0,
expense:0

};

}

monthlyData[month].revenue +=

Number(
order.totalAmount || 0
);

monthlyData[month].gst +=

Number(
order.gstAmount || 0
);

monthlyData[month].expense +=

Number(
order.totalAmount || 0
) * 0.75;

});

Object.entries(monthlyData)

.forEach(([month,data])=>{

const profit =

data.revenue

-

data.expense

-

data.gst;

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${month}</td>

<td>

${formatCurrency(
data.revenue
)}

</td>

<td>

${formatCurrency(
data.expense
)}

</td>

<td>

${formatCurrency(
data.gst
)}

</td>

<td>

${formatCurrency(
profit
)}

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
TOP PERFORMERS
========================================================= */

function updateTopPerformers(){

let topPartner = "-";
let topDriver = "-";
let topCustomer = "-";
let topService = "-";

if(partners.length){

topPartner =

partners[0]

?.businessName

||

partners[0]

?.name

||

"-";

}

if(drivers.length){

topDriver =

drivers[0]

?.name

||

"-";

}

if(customers.length){

topCustomer =

customers[0]

?.name

||

customers[0]

?.fullName

||

"-";

}

const serviceMap = {};

orders.forEach(order=>{

const service =

order.serviceName

||

"Wash & Fold";

serviceMap[service] =

(serviceMap[service] || 0)

+ 1;

});

let max = 0;

Object.entries(serviceMap)

.forEach(([name,count])=>{

if(count > max){

max = count;

topService = name;

}

});

setText(
"topPartner",
topPartner
);

setText(
"topDriver",
topDriver
);

setText(
"topCustomer",
topCustomer
);

setText(
"topService",
topService
);

}

/* =========================================================
REPORT HISTORY
========================================================= */

function addReportHistory(

reportName,
type

){

reportsHistory.push({

reportName,
type,

generatedAt:
new Date()

.toLocaleString(
"en-IN"
)

});

}/* =========================================================
REVENUE CHART
========================================================= */

let revenueChart;
let ordersChart;

function renderRevenueChart(){

const canvas =

document.getElementById(
"revenueChart"
);

if(!canvas)
return;

const monthlyRevenue = {};

orders.forEach(order=>{

if(!order.createdAt?.seconds)
return;

const month =

new Date(

order.createdAt.seconds * 1000

)

.toLocaleString(
"default",
{
month:"short"
}
);

monthlyRevenue[month] =

(monthlyRevenue[month] || 0)

+

Number(
order.totalAmount || 0
);

});

if(revenueChart){

revenueChart.destroy();

}

revenueChart =

new Chart(

canvas,

{

type:"bar",

data:{

labels:

Object.keys(
monthlyRevenue
),

datasets:[{

label:"Revenue",

data:

Object.values(
monthlyRevenue
)

}]

}

}

);

}

/* =========================================================
ORDERS CHART
========================================================= */

function renderOrdersChart(){

const canvas =

document.getElementById(
"ordersChart"
);

if(!canvas)
return;

const monthlyOrders = {};

orders.forEach(order=>{

if(!order.createdAt?.seconds)
return;

const month =

new Date(

order.createdAt.seconds * 1000

)

.toLocaleString(
"default",
{
month:"short"
}
);

monthlyOrders[month] =

(monthlyOrders[month] || 0)

+ 1;

});

if(ordersChart){

ordersChart.destroy();

}

ordersChart =

new Chart(

canvas,

{

type:"line",

data:{

labels:

Object.keys(
monthlyOrders
),

datasets:[{

label:"Orders",

data:

Object.values(
monthlyOrders
)

}]

}

}

);

}

/* =========================================================
EXPORT CSV
========================================================= */

window.exportCSV =
function(){

let csv =

"Order ID,Customer,Amount,GST,Status\n";

orders.forEach(order=>{

csv +=

`${order.id},
${order.customerName || ""},
${order.totalAmount || 0},
${order.gstAmount || 0},
${order.status || ""}\n`;

});

downloadFile(

csv,

"reports.csv",

"text/csv"

);

};

/* =========================================================
EXPORT EXCEL
========================================================= */

window.exportExcel =
function(){

let content =

"QuickPress Reports Export\n\n";

orders.forEach(order=>{

content +=

`${order.id} | ${order.totalAmount}\n`;

});

downloadFile(

content,

"reports.xls",

"application/vnd.ms-excel"

);

};

/* =========================================================
EXPORT PDF
========================================================= */

window.exportPDF =
function(){

let content =

"QUICKPRESS REPORTS\n\n";

content +=

"Total Orders : " +

orders.length +

"\n";

content +=

"Total Revenue : " +

document.getElementById(
"totalRevenue"
).innerText;

downloadFile(

content,

"reports.pdf",

"application/pdf"

);

};

/* =========================================================
DOWNLOAD FILE
========================================================= */

function downloadFile(

content,
filename,
type

){

const blob =

new Blob(

[content],

{

type

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
REPORT HISTORY TABLE
========================================================= */

function renderReportHistory(){

const tbody =

document.getElementById(
"reportHistoryBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

reportsHistory.forEach(report=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>

${report.reportName}

</td>

<td>

${report.type}

</td>

<td>

Admin

</td>

<td>

${report.generatedAt}

</td>

<td>

<button
class="primaryBtn">

View

</button>

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
GENERATE REPORT
========================================================= */

window.generateReport =
function(){

const type =

document.getElementById(
"reportType"
).value;

addReportHistory(

type + " Report",

type

);

renderReportHistory();

alert(
type + " Report Generated"
);

};

/* =========================================================
SCHEDULED REPORTS
========================================================= */

const scheduledReports = [];

/* =========================================================
DAILY REPORT
========================================================= */

window.scheduleDailyReport =
function(){

scheduledReports.push({

name:"Daily Business Report",

frequency:"Daily",

recipient:"Admin",

status:"Active"

});

renderScheduledReports();

};

/* =========================================================
WEEKLY REPORT
========================================================= */

window.scheduleWeeklyReport =
function(){

scheduledReports.push({

name:"Weekly Business Report",

frequency:"Weekly",

recipient:"Admin",

status:"Active"

});

renderScheduledReports();

};

/* =========================================================
MONTHLY REPORT
========================================================= */

window.scheduleMonthlyReport =
function(){

scheduledReports.push({

name:"Monthly Business Report",

frequency:"Monthly",

recipient:"Admin",

status:"Active"

});

renderScheduledReports();

};

/* =========================================================
RENDER SCHEDULED REPORTS
========================================================= */

function renderScheduledReports(){

const tbody =

document.getElementById(
"scheduledReportsBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

scheduledReports.forEach(item=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>${item.name}</td>

<td>${item.frequency}</td>

<td>${item.recipient}</td>

<td>${item.status}</td>

`;

tbody.appendChild(
row
);

});

}/* =========================================================
LOAD ALL REPORT DATA
========================================================= */

async function loadAllReportsData(){

try{

await Promise.all([

loadOrders(),
loadCustomers(),
loadPartners(),
loadDrivers(),
loadFinance()

]);

console.log(
"Reports Data Loaded"
);

}catch(error){

console.error(
"Reports Load Error",
error
);

}

}

/* =========================================================
REFRESH REPORT DASHBOARD
========================================================= */

function refreshReportsDashboard(){

updateReportAnalytics();

updateCustomerAnalytics();

updateRevenueBreakdown();

updateOrderStatusAnalytics();

updateMonthlyAnalytics();

updateTopPerformers();

renderSalesReport();

renderGSTReport();

renderPartnerReport();

renderDriverReport();

renderProfitLossReport();

renderTopServices();

renderRevenueChart();

renderOrdersChart();

renderReportHistory();

renderScheduledReports();

console.log(
"Reports Dashboard Refreshed"
);

}

/* =========================================================
FILTER REPORTS
========================================================= */

window.filterReports =
function(){

const reportType =

document.getElementById(
"reportType"
)?.value;

const period =

document.getElementById(
"reportPeriod"
)?.value;

console.log(
"Filtering:",
reportType,
period
);

refreshReportsDashboard();

};

/* =========================================================
AUTO REFRESH
========================================================= */

setInterval(

async ()=>{

await loadAllReportsData();

refreshReportsDashboard();

},

300000

);

/* =========================================================
FILTER EVENTS
========================================================= */

document

.getElementById(
"reportType"
)

?.addEventListener(

"change",

filterReports

);

document

.getElementById(
"reportPeriod"
)

?.addEventListener(

"change",

filterReports

);

document

.getElementById(
"fromDate"
)

?.addEventListener(

"change",

filterReports

);

document

.getElementById(
"toDate"
)

?.addEventListener(

"change",

filterReports

);

/* =========================================================
GLOBAL EXPORTS
========================================================= */

window.reportsApp = {

loadOrders,
loadCustomers,
loadPartners,
loadDrivers,
loadFinance,

renderSalesReport,
renderGSTReport,
renderPartnerReport,
renderDriverReport,

renderProfitLossReport,

renderTopServices,

generateReport,

exportCSV,
exportExcel,
exportPDF,

scheduleDailyReport,
scheduleWeeklyReport,
scheduleMonthlyReport,

refreshReportsDashboard

};

/* =========================================================
INITIALIZATION
========================================================= */

document.addEventListener(

"DOMContentLoaded",

async ()=>{

try{

console.log(
"QuickPress Reports Starting..."
);

await loadAllReportsData();

refreshReportsDashboard();

console.log(
"QuickPress Reports Ready 🚀"
);

}catch(error){

console.error(

"Reports Initialization Error",

error

);

}

}

);

/* =========================================================
WINDOW READY
========================================================= */

window.addEventListener(

"load",

()=>{

console.log(
"Reports Module Loaded"
);

}

);

/* =========================================================
END OF FILE
QUICKPRESS REPORTS PANEL
========================================================= */
