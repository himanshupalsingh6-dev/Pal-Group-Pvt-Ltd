/* =========================================
   QUICKPRESS PARTNER PANEL JS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializePartnerStatus();
    initializeOrderTimer();
    initializeNotifications();

});

/* =========================================
PARTNER ONLINE/OFFLINE TOGGLE
========================================= */

function initializePartnerStatus(){

    const toggle = document.getElementById("partnerToggle");
    const statusText = document.getElementById("statusText");
    const statusDot = document.querySelector(".status-dot");

    if(!toggle) return;

    toggle.addEventListener("change", () => {

        if(toggle.checked){

            statusText.innerText = "Online";

            statusDot.style.background = "#16A34A";

            showToast(
                "🟢 Partner Online - New Orders Enabled"
            );

            updatePartnerStatus("online");

        }else{

            statusText.innerText = "Offline";

            statusDot.style.background = "#EF4444";

            showToast(
                "🔴 Partner Offline - Orders Disabled"
            );

            updatePartnerStatus("offline");

        }

    });

}

/* =========================================
ADMIN PANEL STATUS SYNC
========================================= */

function updatePartnerStatus(status){

    const partnerData = {

        partnerId: "QP_PARTNER_001",

        status: status,

        updatedAt: new Date().toISOString()

    };

    console.log(
        "Status Synced To Admin Panel",
        partnerData
    );

    /*
    FIREBASE EXAMPLE

    update(
      ref(db,"partners/QP_PARTNER_001"),
      {
        status:status,
        updatedAt:Date.now()
      }
    );

    */

}

/* =========================================
NEW ORDER TIMER
========================================= */

function initializeOrderTimer(){

    const timerElement =
        document.querySelector(".timer");

    if(!timerElement) return;

    let time = 30;

    const interval = setInterval(() => {

        let minutes =
            String(
                Math.floor(time / 60)
            ).padStart(2,"0");

        let seconds =
            String(
                time % 60
            ).padStart(2,"0");

        timerElement.innerHTML =
            `${minutes}:${seconds}`;

        time--;

        if(time < 0){

            clearInterval(interval);

            timerElement.innerHTML =
                "Expired";

            autoRejectOrder();

        }

    },1000);

}

/* =========================================
AUTO REJECT ORDER
========================================= */

function autoRejectOrder(){

    showToast(
      "⏰ Order Auto Rejected"
    );

    console.log(
      "Order Rejected Due To Timeout"
    );

}

/* =========================================
ACCEPT ORDER
========================================= */

const acceptBtn =
document.querySelector(".accept-btn");

if(acceptBtn){

acceptBtn.addEventListener("click",()=>{

    showToast(
      "✅ Order Accepted Successfully"
    );

    console.log(
      "Order Accepted"
    );

});

}

/* =========================================
REJECT ORDER
========================================= */

const rejectBtn =
document.querySelector(".reject-btn");

if(rejectBtn){

rejectBtn.addEventListener("click",()=>{

    showToast(
      "❌ Order Rejected"
    );

    console.log(
      "Order Rejected"
    );

});

}

/* =========================================
NOTIFICATIONS
========================================= */

function initializeNotifications(){

    console.log(
      "Notification Service Started"
    );

}

/* =========================================
TOAST MESSAGE
========================================= */

function showToast(message){

    const toast =
    document.createElement("div");

    toast.classList.add(
      "quickpress-toast"
    );

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add(
          "show"
        );

    },100);

    setTimeout(()=>{

        toast.remove();

    },3000);

}

/* =========================================
LOAD DASHBOARD DATA
========================================= */

function loadDashboardData(){

    const dashboardData = {

        todayOrders:25,

        pendingOrders:8,

        completedOrders:17,

        cancelledOrders:2,

        todayRevenue:12450,

        weeklyRevenue:78900

    };

    console.log(
      dashboardData
    );

}

/* =========================================
LIVE REVENUE UPDATE
========================================= */

function updateRevenue(){

    console.log(
      "Revenue Updated"
    );

}

/* =========================================
NEW ORDER POPUP
========================================= */

function showNewOrderPopup(order){

    console.log(
      "New Order Received",
      order
    );

}

/* =========================================
SOCKET CONNECTION READY
========================================= */

function initializeRealtime(){

    console.log(
      "Realtime Connection Ready"
    );

}

/* =========================================
FIREBASE READY FUNCTIONS
========================================= */

async function saveOrderStatus(
orderId,
status
){

console.log(
orderId,
status
);

}

async function savePartnerLocation(
lat,
lng
){

console.log(
lat,
lng
);

}

/* =========================================
PARTNER ACTIVITY LOG
========================================= */

function createActivityLog(action){

    const log = {

        action,

        time:new Date(),

        partner:"QP_PARTNER_001"

    };

    console.log(log);

}

/* =========================================
WINDOW ONLINE/OFFLINE
========================================= */

window.addEventListener("online",()=>{

    showToast(
      "🌐 Internet Connected"
    );

});

window.addEventListener("offline",()=>{

    showToast(
      "⚠️ Internet Disconnected"
    );

});

/* =========================================
END OF FILE
========================================= */
