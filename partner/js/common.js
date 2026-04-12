export function sidebar(){
return `
<div class="sidebar">
<h2>⚡ QuickPress</h2>

<a href="index.html">📊 Dashboard</a>
<a href="orders.html">📦 Orders</a>
<a href="history.html">📜 History</a>
<a href="help.html">📞 Help</a>
</div>
`;
}

export function topbar(){
return `
<div class="topbar">
<div>👨‍🔧 Partner Panel</div>

<div>
🔔 <span>0</span>

<select>
<option>Online</option>
<option>Offline</option>
</select>
</div>
</div>
`;
}

export function wa(phone){
window.open(`https://wa.me/${phone}`);
}
