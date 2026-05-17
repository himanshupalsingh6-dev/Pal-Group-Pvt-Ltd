const topbar =
document.getElementById(
"topbar"
);

topbar.innerHTML = `

<div class="topbar">

<div class="logo">

QuickPress

</div>

<div style="
display:flex;
align-items:center;
gap:16px;
">

<div style="
height:44px;
padding:0 18px;
border-radius:14px;
background:#fff;
border:1px solid #E5E7EB;
display:flex;
align-items:center;
font-weight:800;
">

🟢 LIVE

</div>

<div style="
height:48px;
padding:0 14px;
border-radius:14px;
border:1px solid #E5E7EB;
display:flex;
align-items:center;
gap:12px;
background:#fff;
">

<img
src="https://i.pravatar.cc/150?img=12"
style="
width:34px;
height:34px;
border-radius:50%;
"
/>

<b>
Admin
</b>

</div>

</div>

</div>

`;
