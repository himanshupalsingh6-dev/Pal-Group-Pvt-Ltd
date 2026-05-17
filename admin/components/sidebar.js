/* =========================================================
FILE : admin/components/sidebar.js
QUICKPRESS ENTERPRISE SIDEBAR
========================================================= */

const sidebar =
document.getElementById(
"sidebar"
);

const currentPage =
window.location.pathname
.split("/")
.pop();

/* =========================================================
SIDEBAR HTML
========================================================= */

sidebar.innerHTML = `

<div class="sidebar">

<!-- =====================================================
LOGO
===================================================== -->

<div class="sidebarLogo">

<h2>
QuickPress
</h2>

</div>

<!-- =====================================================
MENU
===================================================== -->

<div class="sidebarMenu">

<!-- DASHBOARD -->

<a
href="index.html"
class="${currentPage === 'index.html' ? 'active' : ''}">

Dashboard

</a>

<!-- OPERATIONS -->

<a
href="orders.html"
class="${currentPage === 'orders.html' ? 'active' : ''}">

Orders

</a>

<a
href="services.html"
class="${currentPage === 'services.html' ? 'active' : ''}">

Services

</a>

<a
href="delivery.html"
class="${currentPage === 'delivery.html' ? 'active' : ''}">

Delivery

</a>

<a
href="tracking.html"
class="${currentPage === 'tracking.html' ? 'active' : ''}">

Live Tracking

</a>

<!-- USERS -->

<a
href="users.html"
class="${currentPage === 'users.html' ? 'active' : ''}">

Users

</a>

<a
href="crm.html"
class="${currentPage === 'crm.html' ? 'active' : ''}">

CRM System

</a>

<a
href="complaints.html"
class="${currentPage === 'complaints.html' ? 'active' : ''}">

Complaints

</a>


<!-- PARTNERS -->

<a
href="partners.html"
class="${currentPage === 'partners.html' ? 'active' : ''}">

Partners

</a>

<a
href="franchise.html"
class="${currentPage === 'franchise.html' ? 'active' : ''}">

Franchise

</a>

<!-- RIDERS -->

<a
href="riders.html"
class="${currentPage === 'riders.html' ? 'active' : ''}">

Riders

</a>

<a
href="ai-assignment.html"
class="${currentPage === 'ai-assignment.html' ? 'active' : ''}">

AI Assignment

</a>

<!-- PAYMENTS -->

<a
href="payments.html"
class="${currentPage === 'payments.html' ? 'active' : ''}">

Payments

</a>

<a
href="wallets.html"
class="${currentPage === 'wallets.html' ? 'active' : ''}">

Wallets

</a>

<a
href="settlements.html"
class="${currentPage === 'settlements.html' ? 'active' : ''}">

Settlements

</a>

<a
href="subscriptions.html"
class="${currentPage === 'subscriptions.html' ? 'active' : ''}">

Subscriptions

</a>

<!-- ANALYTICS -->

<a
href="analytics.html"
class="${currentPage === 'analytics.html' ? 'active' : ''}">

Analytics

</a>

<a
href="heatmap.html"
class="${currentPage === 'heatmap.html' ? 'active' : ''}">

Heatmap

</a>

<a
href="reports.html"
class="${currentPage === 'reports.html' ? 'active' : ''}">

Reports

</a>

<a
href="expenses.html"
class="${currentPage === 'expenses.html' ? 'active' : ''}">

Expenses

</a>

<!-- MARKETING -->

<a
href="offers.html"
class="${currentPage === 'offers.html' ? 'active' : ''}">

Offers

</a>

<a
href="pushnotifications.html"
class="${currentPage === 'pushnotifications.html' ? 'active' : ''}">

Push Notifications

</a>

<!-- GST -->

<a
href="gst-invoice.html"
class="${currentPage === 'gst-invoice.html' ? 'active' : ''}">

GST Invoice

</a>

<a
href="invoice.html"
class="${currentPage === 'invoice.html' ? 'active' : ''}">

Invoices

</a>

<!-- ADMIN -->

<a
href="superadmin.html"
class="${currentPage === 'superadmin.html' ? 'active' : ''}">

Super Admin

</a>

<a
href="roles.html"
class="${currentPage === 'roles.html' ? 'active' : ''}">

Admin Roles

</a>

<a
href="attendance.html"
class="${currentPage === 'attendance.html' ? 'active' : ''}">

Attendance

</a>

<a
href="auditlogs.html"
class="${currentPage === 'auditlogs.html' ? 'active' : ''}">

Audit Logs

</a>

<!-- SYSTEM -->

<a
href="notifications.html"
class="${currentPage === 'notifications.html' ? 'active' : ''}">

Notifications

</a>

<a
href="export.html"
class="${currentPage === 'export.html' ? 'active' : ''}">

Export Center

</a>

<a
href="support.html"
class="${currentPage === 'support.html' ? 'active' : ''}">

Support

</a>


<a
href="settings.html"
class="${currentPage === 'settings.html' ? 'active' : ''}">

Settings

</a>

</div>

</div>

`;

/* =========================================================
READY
========================================================= */

console.log(
"QuickPress Sidebar Active"
);
