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

/* Charts */
let statusChart, revenueChart;
let allOrders = [];

/* Load orders */
async function loadOrders(){
  const snap = await getDocs(collection(db,"orders"));
  allOrders = [];
  snap.forEach(d=>{
    allOrders.push({ id:d.id, ...d.data() });
  });
  buildCharts(allOrders);
}
loadOrders();

/* Build charts */
function buildCharts(orders){
  let statusCount = {
    Placed:0, Assigned:0, Accepted:0,
    Ready:0, Picked:0, Delivered:0
  };
  let revenueByDate = {};

  orders.forEach(o=>{
    if(statusCount[o.status] !== undefined){
      statusCount[o.status]++;
    }

    if(o.createdAt?.seconds){
      const date = new Date(o.createdAt.seconds*1000)
        .toISOString().slice(0,10);
      revenueByDate[date] =
        (revenueByDate[date]||0) + (Number(o.grandTotal)||0);
    }
  });

  /* Status Pie */
  if(statusChart) statusChart.destroy();
  statusChart = new Chart(
    document.getElementById("statusChart"),
    {
      type:"pie",
      data:{
        labels:Object.keys(statusCount),
        datasets:[{
          data:Object.values(statusCount),
          backgroundColor:[
            "#3498db","#9b59b6","#f1c40f",
            "#e67e22","#1abc9c","#2ecc71"
          ]
        }]
      }
    }
  );

  /* Revenue Line */
  const days = Object.keys(revenueByDate).sort();
  if(revenueChart) revenueChart.destroy();
  revenueChart = new Chart(
    document.getElementById("revenueChart"),
    {
      type:"line",
      data:{
        labels:days,
        datasets:[{
          label:"Revenue",
          data:days.map(d=>revenueByDate[d]),
          borderColor:"#ff9800",
          fill:false,
          tension:0.3
        }]
      },
      options:{
        scales:{ y:{ beginAtZero:true } }
      }
    }
  );
}

/* Apply date filter */
window.applyFilter = ()=>{
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;

  const filtered = allOrders.filter(o=>{
    if(!o.createdAt?.seconds) return false;
    const d = new Date(o.createdAt.seconds*1000)
      .toISOString().slice(0,10);
    if(from && d < from) return false;
    if(to && d > to) return false;
    return true;
  });

  buildCharts(filtered);
};

/* Export CSV */
window.exportCSV = ()=>{
  let csv = "OrderID,Total,Status,Date\n";
  allOrders.forEach(o=>{
    const date = o.createdAt?.seconds
      ? new Date(o.createdAt.seconds*1000).toLocaleDateString()
      : "";
    csv += `${o.id},${o.grandTotal||0},${o.status},${date}\n`;
  });

  const blob = new Blob([csv],{type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quickpress_report.csv";
  a.click();
  URL.revokeObjectURL(url);
};
