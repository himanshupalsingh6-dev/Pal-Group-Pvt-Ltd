/* ==========================================
LOAD COMPONENTS
========================================== */

async function loadComponent(
id,
file
){

const response =
await fetch(file);

const html =
await response.text();

document
.getElementById(id)
.innerHTML = html;

}

/* ==========================================
INITIALIZE
========================================== */

document.addEventListener(

"DOMContentLoaded",

async ()=>{

await loadComponent(
"sidebarContainer",
"./components/sidebar.html"
);

await loadComponent(
"topbarContainer",
"./components/topbar.html"
);

setTimeout(()=>{

const btn =
document.getElementById(
"toggleSidebar"
);

if(btn){

btn.addEventListener(

"click",

()=>{

document

.querySelector(
".sidebar"
)

.classList.toggle(
"active"
);

}

);

}

},500);

}
);
