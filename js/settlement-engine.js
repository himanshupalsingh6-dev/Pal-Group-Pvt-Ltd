/* =========================================================

 QUICKPRESS AUTO SETTLEMENT ENGINE
 FILE : settlement-engine.js

========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
getDocs,
doc,
getDoc,
setDoc,
updateDoc,
increment

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
   START ENGINE
========================================================= */

async function startSettlementEngine(){

console.log(
"SETTLEMENT ENGINE STARTED"
);

const ordersSnap =
await getDocs(
collection(db,"orders")
);

ordersSnap.forEach(async(orderDoc)=>{

const order = orderDoc.data();

const orderId = orderDoc.id;

/* ===========================================
   ONLY DELIVERED ORDERS
=========================================== */

if(order.status !== "Delivered") return;

/* ===========================================
   ALREADY GENERATED
=========================================== */

if(order.payoutGenerated === true) return;

/* ===========================================
   BASIC VALUES
=========================================== */

const customerPay =
Number(order.total || 0);

const gst =
Number(order.gst || 0);

const handling =
Number(order.handling || 0);

/* ===========================================
   SERVICE AMOUNT
=========================================== */

const serviceAmount =
customerPay - gst - handling;

/* ===========================================
   COMMISSION SPLIT
=========================================== */

const partnerShare =
Math.floor(serviceAmount * 0.60);

const riderShare =
Math.floor(serviceAmount * 0.20);

const adminShare =
Math.floor(serviceAmount * 0.20);

const adminFinal =
adminShare + gst + handling;

/* ===========================================
   INCENTIVES / PENALTIES
=========================================== */

const incentives =
Number(order.incentives || 0);

const penalties =
Number(order.penalties || 0);

/* ===========================================
   FINAL PAYOUT
=========================================== */

const finalPartnerPayout =
partnerShare + incentives - penalties;

const finalRiderPayout =
riderShare;

/* ===========================================
   PARTNER DETAILS
=========================================== */

const partnerId =
order.partnerId || "";

const partnerName =
order.partnerName || "Partner";

const partnerMobile =
order.partnerMobile || "";

/* ===========================================
   RIDER DETAILS
=========================================== */

const riderId =
order.riderId || "";

const riderName =
order.riderName || "Rider";

const riderMobile =
order.riderMobile || "";

/* ===========================================
   SETTLEMENT ID
=========================================== */

const settlementId =
`SET-${orderId}`;

/* ===========================================
   CREATE SETTLEMENT
=========================================== */

await setDoc(

doc(
db,
"settlements",
settlementId
),

{

/* ORDER */

orderId:orderId,

customerPay:customerPay,

serviceAmount:serviceAmount,

gst:gst,

handling:handling,

/* SHARE */

partnerShare:partnerShare,

riderShare:riderShare,

adminShare:adminShare,

adminFinal:adminFinal,

/* FINAL */

incentives:incentives,

penalties:penalties,

finalPartnerPayout:finalPartnerPayout,

finalRiderPayout:finalRiderPayout,

/* PARTNER */

partnerId:partnerId,

partnerName:partnerName,

partnerMobile:partnerMobile,

/* RIDER */

riderId:riderId,

riderName:riderName,

riderMobile:riderMobile,

/* CUSTOMER */

customerName:order.name || "",

mobile:order.mobile || "",

address:order.address || "",

city:order.city || "",

/* ORDER */

totalOrders:1,

totalTrips:1,

rating:5,

paidAmount:0,

status:"Pending",

createdAt:new Date()
.toISOString(),

/* PAYMENT */

paymentMethod:
order.payment || "COD",

items:
order.items || []

}

);

/* ===========================================
   UPDATE ORDER
=========================================== */

await updateDoc(

doc(db,"orders",orderId),

{

payoutGenerated:true,

partnerShare:partnerShare,

riderShare:riderShare,

adminShare:adminShare,

adminFinal:adminFinal,

settlementId:settlementId

}

);

/* ===========================================
   UPDATE PARTNER WALLET
=========================================== */

if(partnerId){

const partnerRef =
doc(
db,
"partner_wallets",
partnerId
);

const partnerSnap =
await getDoc(
partnerRef
);

if(partnerSnap.exists()){

await updateDoc(

partnerRef,

{

totalRevenue:
increment(customerPay),

pendingPayout:
increment(finalPartnerPayout),

walletBalance:
increment(finalPartnerPayout),

totalOrders:
increment(1)

}

);

}else{

await setDoc(

partnerRef,

{

partnerId:partnerId,

partnerName:partnerName,

partnerMobile:partnerMobile,

walletBalance:
finalPartnerPayout,

pendingPayout:
finalPartnerPayout,

paidPayout:0,

totalRevenue:
customerPay,

totalOrders:1,

createdAt:
new Date()
.toISOString()

}

);

}

}

/* ===========================================
   UPDATE RIDER WALLET
=========================================== */

if(riderId){

const riderRef =
doc(
db,
"rider_wallets",
riderId
);

const riderSnap =
await getDoc(
riderRef
);

if(riderSnap.exists()){

await updateDoc(

riderRef,

{

walletBalance:
increment(finalRiderPayout),

pendingPayout:
increment(finalRiderPayout),

totalEarned:
increment(finalRiderPayout),

totalTrips:
increment(1)

}

);

}else{

await setDoc(

riderRef,

{

riderId:riderId,

riderName:riderName,

riderMobile:riderMobile,

walletBalance:
finalRiderPayout,

pendingPayout:
finalRiderPayout,

paidPayout:0,

totalEarned:
finalRiderPayout,

totalTrips:1,

createdAt:
new Date()
.toISOString()

}

);

}

}

/* ===========================================
   ADMIN WALLET
=========================================== */

const adminRef =
doc(
db,
"admin_wallet",
"main"
);

const adminSnap =
await getDoc(
adminRef
);

if(adminSnap.exists()){

await updateDoc(

adminRef,

{

totalRevenue:
increment(customerPay),

adminEarnings:
increment(adminFinal),

gstCollected:
increment(gst),

handlingCollected:
increment(handling),

totalSettlements:
increment(1)

}

);

}else{

await setDoc(

adminRef,

{

totalRevenue:
customerPay,

adminEarnings:
adminFinal,

gstCollected:gst,

handlingCollected:handling,

totalSettlements:1,

createdAt:
new Date()
.toISOString()

}

);

}

/* ===========================================
   SUCCESS LOG
=========================================== */

console.log(

`SETTLEMENT CREATED : ${settlementId}`

);

});

}

/* =========================================================
   RUN ENGINE
========================================================= */

startSettlementEngine();
