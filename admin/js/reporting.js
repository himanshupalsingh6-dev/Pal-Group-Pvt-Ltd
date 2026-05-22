import { db }

from "../../firebase.js";

import {

collection,
onSnapshot

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
ELEMENTS
========================================================= */

const salesValue =
document.getElementById(
"salesValue"
);

const deliveredValue =
document.getElementById(
"deliveredValue"
);

const aovValue =
document.getElementById(
"aovValue"
);

const rejectValue =
document.getElementById(
"rejectValue"
);

const complaintValue =
document.getElementById(
"complaintValue"
);

/* =========================================================
REALTIME REPORTS
========================================================= */

onSnapshot(

collection(db,"orders"),

(snapshot)=>{

let totalSales = 0;
let delivered = 0;
let rejected = 0;

/* ========================================================= */

snapshot.forEach(docSnap=>{

const order =
docSnap.data();

/* ========================================================= */

totalSales +=
order.total || 0;

/* ========================================================= */

if(order.status === "completed"){

delivered++;

}

/* ========================================================= */

if(order.status === "cancelled"){

rejected++;

}

});

/* ========================================================= */

const totalOrders =
snapshot.size;

/* ========================================================= */

const rejectPercent =

totalOrders
?
((rejected / totalOrders) * 100)
.toFixed(1)
:
0;

/* ========================================================= */

const aov =

totalOrders
?
(totalSales / totalOrders)
.toFixed(0)
:
0;

/* ========================================================= */

salesValue.innerHTML =
"₹" + totalSales;

deliveredValue.innerHTML =
delivered;

aovValue.innerHTML =
"₹" + aov;

rejectValue.innerHTML =
rejectPercent + "%";

}
);

/* =========================================================
COMPLAINTS
========================================================= */

onSnapshot(

collection(db,"complaints"),

(snapshot)=>{

complaintValue.innerHTML =
snapshot.size;

}
);

/* =========================================================
CHART FUNCTION
========================================================= */

function createChart(id,data){

new Chart(

document.getElementById(id),

{

type:"line",

data:{

labels:[
"Week 1",
"Week 2",
"Week 3",
"Week 4",
"Week 5",
"Week 6",
"Week 7"
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

/* =========================================================
MINI CHARTS
========================================================= */

createChart(
"salesMini",
[10,20,15,30,28,40,50]
);

createChart(
"ordersMini",
[5,8,10,15,20,24,30]
);

createChart(
"aovMini",
[100,200,180,300,280,400,500]
);

createChart(
"ratingMini",
[4,4.2,4.4,4.5,4.6,4.7,4.8]
);

createChart(
"rejectMini",
[5,4,3,2,2,1,1]
);

createChart(
"delayMini",
[4,4,3,3,2,2,1]
);

createChart(
"poorMini",
[3,3,2,2,1,1,1]
);

createChart(
"complaintMini",
[10,8,7,6,5,4,2]
);

/* =========================================================
BIG CHARTS
========================================================= */

createChart(
"salesChart",
[1200,1500,1800,2000,2500,3000,3500]
);

createChart(
"adsChart",
[20,30,25,40,50,60,70]
);

createChart(
"impressionChart",
[1000,1200,1400,1800,2200,2500,3000]
);

createChart(
"ctrChart",
[2,3,4,5,6,5,7]
);
