import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

/* 🔥 Firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyAWTOu3JBhg3JuZg6snAxhnf_XFhLhLkbc",
  authDomain: "quickpress-web.firebaseapp.com",
  projectId: "quickpress-web"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* Elements */
const totalOrdersEl = document.getElementById("totalOrders");
const totalRevenueEl = document.getElementById("totalRevenue");
const todayOrdersEl = document.getElementById("todayOrders");
const todayRevenueEl = document.getElementById("todayRevenue");
const totalCustomersEl = document.getElementById("totalCustomers");
const totalPartnersEl = document.getElementById("totalPartners");
const totalDeliveryEl = document.getElementById("totalDelivery");

/* Main loader */
async function loadDashboard(){

  const ordersSnap = await getDocs(collection(db,"orders"));
  const usersSnap = await getDocs(collection(db,"users"));
  const partnersSnap = await getDocs(collection(db,"partners"));
  const deliverySnap = await getDocs(collection(db,"delivery"));

  let totalOrders = 0;
  let totalRevenue = 0;
  let todayOrders = 0;
  let todayRevenue = 0;

  const today = new Date().toISOString().slice(0,10);

  ordersSnap.forEach(doc=>{
    const o = doc.data();
    totalOrders++;

    const amount = Number(o.grandTotal) || 0;
    totalRevenue += amount;

    if(o.createdAt?.seconds){
      const date = new Date(o.createdAt.seconds*1000)
                    .toISOString().slice(0,10);
      if(date === today){
        todayOrders++;
        todayRevenue += amount;
      }
    }
  });

  /* Update UI */
  totalOrdersEl.innerText = totalOrders;
  totalRevenueEl.innerText = totalRevenue;
  todayOrdersEl.innerText = todayOrders;
  todayRevenueEl.innerText = todayRevenue;
  totalCustomersEl.innerText = usersSnap.size;
  totalPartnersEl.innerText = partnersSnap.size;
  totalDeliveryEl.innerText = deliverySnap.size;
}

loadDashboard();
