import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

/* Firebase */
const firebaseConfig = {
  apiKey: "AIzaSyAWTOu3JBhg3JuZg6snAxhnf_XFhLhLkbc",
  authDomain: "quickpress-web.firebaseapp.com",
  projectId: "quickpress-web"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const partnerTable = document.getElementById("partnerTable");
const deliveryTable = document.getElementById("deliveryTable");

/* Load performance */
async function loadPerformance(){

  const ordersSnap = await getDocs(collection(db,"orders"));
  const partnersSnap = await getDocs(collection(db,"partners"));
  const deliverySnap = await getDocs(collection(db,"delivery"));

  let partnerStats = {};
  let deliveryStats = {};

  /* Prepare base */
  partnersSnap.forEach(p=>{
    partnerStats[p.id] = {
      name: p.data().name || "Partner",
      total:0,
      completed:0,
      earnings:0
    };
  });

  deliverySnap.forEach(d=>{
    deliveryStats[d.id] = {
      name: d.data().name || "Delivery",
      delivered:0,
      earnings:0
    };
  });

  /* Loop orders */
  ordersSnap.forEach(o=>{
    const data = o.data();
    const amount = Number(data.grandTotal) || 0;

    if(data.partnerId && partnerStats[data.partnerId]){
      partnerStats[data.partnerId].total++;
      if(data.status === "Ready" || data.status === "Delivered"){
        partnerStats[data.partnerId].completed++;
        partnerStats[data.partnerId].earnings += amount;
      }
    }

    if(data.deliveryId && deliveryStats[data.deliveryId]){
      if(data.status === "Delivered"){
        deliveryStats[data.deliveryId].delivered++;
        deliveryStats[data.deliveryId].earnings += amount;
      }
    }
  });

  renderPartners(partnerStats);
  renderDelivery(deliveryStats);
}

function renderPartners(stats){
  partnerTable.innerHTML="";
  Object.values(stats).forEach(p=>{
    partnerTable.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>${p.total}</td>
        <td>${p.completed}</td>
        <td>₹${p.earnings}</td>
      </tr>
    `;
  });
}

function renderDelivery(stats){
  deliveryTable.innerHTML="";
  Object.values(stats).forEach(d=>{
    deliveryTable.innerHTML += `
      <tr>
        <td>${d.name}</td>
        <td>${d.delivered}</td>
        <td>₹${d.earnings}</td>
      </tr>
    `;
  });
}

loadPerformance();
