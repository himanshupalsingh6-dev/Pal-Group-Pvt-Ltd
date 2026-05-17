/* =========================================================
FILE : admin/js/offers.js
QUICKPRESS OFFERS PANEL
========================================================= */

import { db }

from

"/Pal-Group-Pvt-Ltd/firebase.js";

import {

collection,
onSnapshot,
addDoc

}

from

"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
ELEMENTS
========================================================= */

const offerGrid =
document.getElementById(
"offerGrid"
);

/* =========================================================
REALTIME OFFERS
========================================================= */

onSnapshot(

collection(db,"offers"),

(snapshot)=>{

offerGrid.innerHTML = "";

/* ========================================= */

snapshot.forEach((docSnap)=>{

const offer = {

id:docSnap.id,
...docSnap.data()

};

/* ========================================= */

const card = `

<div class="offerCard">

<h2>

${offer.title || "Offer"}

</h2>

<p>

${offer.description || ""}

</p>

<div class="coupon">

${offer.coupon || "SAVE50"}

</div>

<button
class="offerBtn">

${offer.discount || "50% OFF"}

</button>

</div>

`;

offerGrid.innerHTML += card;

});

}

/* END */

);

/* =========================================================
ADD OFFER
========================================================= */

window.addOffer =
async()=>{

const title =
prompt(
"Offer Title"
);

if(!title){

return;

}

const description =
prompt(
"Offer Description"
);

const coupon =
prompt(
"Coupon Code"
);

const discount =
prompt(
"Discount"
);

/* ========================================= */

await addDoc(

collection(db,"offers"),

{

title,
description,
coupon,
discount,

createdAt:
new Date()

}

);

/* ========================================= */

alert(
"Offer Created Successfully"
);

};
