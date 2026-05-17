/* =========================================================
FILE : admin/js/expenses.js
QUICKPRESS EXPENSE MANAGER
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
query,
orderBy,
onSnapshot,
addDoc,
deleteDoc,
doc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
AUTH CHECK
========================================================= */

const adminLogin =
localStorage.getItem(
"quickpress_admin"
);

if(adminLogin !== "true"){

window.location.href =
"login.html";

}

/* =========================================================
DESKTOP ONLY
========================================================= */

const isMobile =
/Android|iPhone|iPad|iPod/i
.test(
navigator.userAgent
);

if(
window.innerWidth < 1024
||
isMobile
){

document.body.innerHTML = `

<div
style="
height:100vh;
display:flex;
align-items:center;
justify-content:center;
background:#111827;
color:white;
font-family:Inter,sans-serif;
text-align:center;
">

<div>

<div style="
font-size:90px;
margin-bottom:20px;
">

🖥️

</div>

<h1 style="
font-size:42px;
font-weight:900;
margin-bottom:10px;
">

Desktop Only

</h1>

<p style="
font-size:15px;
color:#D1D5DB;
">

QuickPress Admin Panel only works on Desktop

</p>

</div>

</div>

`;

}

/* =========================================================
ELEMENTS
========================================================= */

const expenseContainer =
document.getElementById(
"expenseContainer"
);

const totalExpense =
document.getElementById(
"totalExpense"
);

const officeExpense =
document.getElementById(
"officeExpense"
);

const salaryExpense =
document.getElementById(
"salaryExpense"
);

const marketingExpense =
document.getElementById(
"marketingExpense"
);

/* =========================================================
CHART
========================================================= */

let expenseChart;

/* =========================================================
REALTIME EXPENSES
========================================================= */

onSnapshot(

query(
collection(db,"expenses"),
orderBy("createdAt","desc")
),

(snapshot)=>{

expenseContainer.innerHTML = "";

/* ========================================= */

let total = 0;

let office = 0;

let salary = 0;

let marketing = 0;

let delivery = 0;

/* ========================================= */

snapshot.forEach((docSnap)=>{

const expense = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

const amount =
Number(
expense.amount || 0
);

/* ========================================= */

total += amount;

/* ========================================= */

if(expense.category === "Office"){

office += amount;

}

if(expense.category === "Salary"){

salary += amount;

}

if(expense.category === "Marketing"){

marketing += amount;

}

if(expense.category === "Delivery"){

delivery += amount;

}

/* ========================================= */

renderExpense(expense);

});

/* =========================================
UPDATE STATS
========================================= */

totalExpense.innerHTML =
`₹${total}`;

officeExpense.innerHTML =
`₹${office}`;

salaryExpense.innerHTML =
`₹${salary}`;

marketingExpense.innerHTML =
`₹${marketing}`;

/* =========================================
CHART
========================================= */

renderChart(
office,
salary,
marketing,
delivery
);

}

/* END */

);

/* =========================================================
RENDER EXPENSE
========================================================= */

function renderExpense(expense){

let badgeClass = "office";

/* ========================================= */

if(expense.category === "Salary"){

badgeClass = "salary";

}

if(expense.category === "Delivery"){

badgeClass = "delivery";

}

if(expense.category === "Marketing"){

badgeClass = "marketing";

}

/* ========================================= */

const date =
expense.createdAt?.seconds

?

new Date(
expense.createdAt.seconds * 1000
).toLocaleDateString()

:

"--";

/* ========================================= */

const row = `

<div class="expenseRow">

<!-- NAME -->

<div>

<b>

${expense.name || "--"}

</b>

</div>

<!-- CATEGORY -->

<div>

<div class="badge ${badgeClass}">

${expense.category || "--"}

</div>

</div>

<!-- AMOUNT -->

<div>

₹${expense.amount || 0}

</div>

<!-- DATE -->

<div>

${date}

</div>

<!-- ACTION -->

<div>

<button
class="actionBtn"
onclick="deleteExpense('${expense.id}')">

Delete

</button>

</div>

</div>

`;

expenseContainer.innerHTML += row;

}

/* =========================================================
CHART
========================================================= */

function renderChart(
office,
salary,
marketing,
delivery
){

const ctx =
document.getElementById(
"expenseChart"
);

/* ========================================= */

if(expenseChart){

expenseChart.destroy();

}

/* ========================================= */

expenseChart =
new Chart(ctx,{

type:'doughnut',

data:{

labels:[
'Office',
'Salary',
'Marketing',
'Delivery'
],

datasets:[{

data:[
office,
salary,
marketing,
delivery
],

borderWidth:0

}]

},

options:{

responsive:true,

plugins:{

legend:{
position:'bottom'
}

}

}

});

}

/* =========================================================
ADD EXPENSE
========================================================= */

window.addExpense =
async()=>{

const name =
prompt(
"Expense Name"
);

if(!name){

return;

}

/* ========================================= */

const category =
prompt(
"Category : Office / Salary / Marketing / Delivery"
);

const amount =
prompt(
"Expense Amount"
);

/* ========================================= */

await addDoc(

collection(
db,
"expenses"
),

{

name,
category,
amount:Number(amount),

createdAt:
new Date()

}

);

/* ========================================= */

alert(
"Expense Added"
);

};

/* =========================================================
DELETE EXPENSE
========================================================= */

window.deleteExpense =
async(id)=>{

const confirmDelete =
confirm(
"Delete Expense?"
);

/* ========================================= */

if(!confirmDelete){

return;

}

/* ========================================= */

await deleteDoc(

doc(
db,
"expenses",
id
)

);

/* ========================================= */

alert(
"Expense Deleted"
);

};

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Expense Manager Active"
);
