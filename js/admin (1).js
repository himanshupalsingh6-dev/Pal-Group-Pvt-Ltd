import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore, collection, getDocs, addDoc,
  updateDoc, doc, onSnapshot, query, orderBy, where
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWTOu3JBhg3JuZg6snAxhnf_XFhLhLkbc",
  authDomain: "quickpress-web.firebaseapp.com",
  projectId: "quickpress-web"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* NAV */
window.showSection = (id) => {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
};

/* SOUND */
const bell = new Audio("sounds/order.mp3");
let soundEnabled = true;

/* ORDERS QUERY */
const ordersQuery = query(collection(db,"orders"), orderBy("createdAt","desc"));

onSnapshot(ordersQuery, () => {
  loadOrders();
  loadDashboard();
});

/* LOAD PARTNERS */
async function getPartnersOptions(){
  const snap = await getDocs(query(collection(db,"partners"), where("approved","==",true)));
  let html = `<option value="">Select Partner</option>`;
  snap.forEach(d => html += `<option value="${d.id}">${d.data().name}</option>`);
  return html;
}

/* LOAD DELIVERY */
async function getDeliveryOptions(){
  const snap = await getDocs(query(collection(db,"delivery"), where("approved","==",true)));
  let html = `<option value="">Select Delivery</option>`;
  snap.forEach(d => html += `<option value="${d.id}">${d.data().name}</option>`);
  return html;
}

/* ASSIGN */
window.assignPartner = async (orderId)=>{
  const pid = document.getElementById("partner_"+orderId).value;
  if(!pid){ alert("Select partner"); return; }

  await updateDoc(doc(db,"orders",orderId), {
    partnerId: pid,
    status: "Assigned"
  });

  alert("Partner assigned");
};

window.assignDelivery = async (orderId)=>{
  const did = document.getElementById("delivery_"+orderId).value;
  if(!did){ alert("Select delivery"); return; }

  await updateDoc(doc(db,"orders",orderId), {
    deliveryId: did,
    status: "Ready"
  });

  alert("Delivery assigned");
};

/* LOAD ORDERS */
async function loadOrders(){
  const box = document.getElementById("ordersList");
  box.innerHTML = "";

  const partnerOptions = await getPartnersOptions();
  const deliveryOptions = await getDeliveryOptions();
  const snap = await getDocs(ordersQuery);

  snap.forEach(d=>{
    const o = d.data();
    let items = "";
    o.items?.forEach(i => items += `${i.name} × ${i.qty}<br>`);

    box.innerHTML += `
      <div class="card">
        <b>Order ID:</b> ${d.id}<br>
        ${items}
        <b>Total:</b> ₹${o.grandTotal || 0}<br>
        <b>Status:</b> ${o.status || "Placed"}<br><br>

        <select id="partner_${d.id}">${partnerOptions}</select>
        <button class="assign" onclick="assignPartner('${d.id}')">Assign Partner</button>

        <select id="delivery_${d.id}">${deliveryOptions}</select>
        <button class="assign" onclick="assignDelivery('${d.id}')">Assign Delivery</button>
      </div>
    `;
  });
}

/* DASHBOARD */
let statusChart, revenueChart;

function initCharts(){
  const statusCtx = document.getElementById("statusCanvas");
  const revenueCtx = document.getElementById("revenueCanvas");

  statusChart = new Chart(statusCtx,{
    type:"pie",
    data:{
      labels:["Placed","Assigned","Ready","Delivered"],
      datasets:[{data:[0,0,0,0],backgroundColor:["#3498db","#f1c40f","#2ecc71","#9b59b6"]}]
    }
  });

  revenueChart = new Chart(revenueCtx,{
    type:"line",
    data:{labels:[],datasets:[{label:"Revenue",data:[],borderColor:"#27ae60",fill:false}]}
  });
}

async function loadDashboard(){
  const snap = await getDocs(collection(db,"orders"));
  let totalOrders = 0, todayOrders = 0, totalRevenue = 0;
  let statusCount = {Placed:0,Assigned:0,Ready:0,Delivered:0};
  let revenueByDay = {};
  const todayStr = new Date().toISOString().slice(0,10);

  snap.forEach(d=>{
    const o = d.data();
    totalOrders++;
    totalRevenue += Number(o.grandTotal)||0;

    if(statusCount[o.status] !== undefined){
      statusCount[o.status]++;
    }

    let dateKey = todayStr;
    if(o.createdAt?.seconds){
      dateKey = new Date(o.createdAt.seconds*1000).toISOString().slice(0,10);
    }
    if(dateKey === todayStr) todayOrders++;
    revenueByDay[dateKey] = (revenueByDay[dateKey]||0) + (Number(o.grandTotal)||0);
  });

  document.getElementById("totalOrders").innerText = totalOrders;
  document.getElementById("todayOrders").innerText = todayOrders;
  document.getElementById("totalRevenue").innerText = totalRevenue;

  statusChart.data.datasets[0].data = [
    statusCount.Placed,
    statusCount.Assigned,
    statusCount.Ready,
    statusCount.Delivered
  ];
  statusChart.update();

  const days = Object.keys(revenueByDay).sort().slice(-7);
  revenueChart.data.labels = days;
  revenueChart.data.datasets[0].data = days.map(d=>revenueByDay[d]);
  revenueChart.update();
}

/* REGISTRATION */
window.registerPartner = async ()=>{
  await addDoc(collection(db,"partners"),{
    name: partnerName.value,
    email: partnerEmail.value,
    password: partnerPassword.value,
    approved: true,
    wallet: 0
  });
  alert("Partner registered");
};

window.registerDelivery = async ()=>{
  await addDoc(collection(db,"delivery"),{
    name: deliveryName.value,
    email: deliveryEmail.value,
    password: deliveryPassword.value,
    approved: true,
    wallet: 0
  });
  alert("Delivery boy registered");
};

/* INIT */
document.addEventListener("DOMContentLoaded", ()=>{
  initCharts();
  loadOrders();
  loadDashboard();
});
const notifySound = new Audio("sounds/notify.mp3");

onSnapshot(
  query(collection(db,"orders"), orderBy("createdAt","desc")),
  (snap)=>{
    snap.docChanges().forEach(change=>{
      if(change.type === "added"){
        notifySound.play();
        showNotification("New Order Received", "A new order has been placed");
      }
    });
  }
);

function showNotification(title, body){
  if(Notification.permission === "granted"){
    new Notification(title, { body });
  }
}
