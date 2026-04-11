import { loadDashboard } from "./dashboard.js";
import { loadOrders } from "./orders.js";
import { loadUsers } from "./users.js";

window.showTab = function(tab){

document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));

document.querySelectorAll(".tab").forEach(t=>{
  if(t.innerText.toLowerCase().includes(tab)){
    t.classList.add("active");
  }
});

if(tab==="dashboard") loadDashboard();
if(tab==="orders") loadOrders();
if(tab==="users") loadUsers();
};

loadDashboard();
