const sidebar =
document.getElementById(
"sidebar"
);

const currentPage =
window.location.pathname
.split("/")
.pop();

/* ===================================================== */

sidebar.innerHTML = `

<div class="sidebar">

<div class="sidebarMenu">

<a
href="index.html"
class="${currentPage === 'index.html' ? 'active' : ''}">

Dashboard

</a>

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
href="users.html"
class="${currentPage === 'users.html' ? 'active' : ''}">

Users

</a>

<a
href="partners.html"
class="${currentPage === 'partners.html' ? 'active' : ''}">

Partners

</a>

<a
href="riders.html"
class="${currentPage === 'riders.html' ? 'active' : ''}">

Riders

</a>

<a
href="delivery.html"
class="${currentPage === 'delivery.html' ? 'active' : ''}">

Delivery

</a>

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
href="expenses.html"
class="${currentPage === 'expenses.html' ? 'active' : ''}">

Expenses

</a>

<a
href="reports.html"
class="${currentPage === 'reports.html' ? 'active' : ''}">

Reports

</a>

<a
href="analytics.html"
class="${currentPage === 'analytics.html' ? 'active' : ''}">

Analytics

</a>

<a
href="offers.html"
class="${currentPage === 'offers.html' ? 'active' : ''}">

Offers

</a>

<a
href="support.html"
class="${currentPage === 'support.html' ? 'active' : ''}">

Support

</a>

<a
href="chat.html"
class="${currentPage === 'chat.html' ? 'active' : ''}">

Live Chat

</a>

<a
href="tracking.html"
class="${currentPage === 'tracking.html' ? 'active' : ''}">

Live Tracking

</a>

<a
href="notifications.html"
class="${currentPage === 'notifications.html' ? 'active' : ''}">

Notifications

</a>

<a
href="invoice.html"
class="${currentPage === 'invoice.html' ? 'active' : ''}">

Invoices

</a>

<a
href="export.html"
class="${currentPage === 'export.html' ? 'active' : ''}">

Export Center

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

<a
href="staff.html"
class="${currentPage === 'staff.html' ? 'active' : ''}">

Staff

</a>

<a
href="help.html"
class="${currentPage === 'help.html' ? 'active' : ''}">

Help Center

</a>

<a
href="settings.html"
class="${currentPage === 'settings.html' ? 'active' : ''}">

Settings

</a>

</div>

</div>

`;
