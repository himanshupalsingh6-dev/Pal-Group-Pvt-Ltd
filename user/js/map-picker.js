let map;

let selectedLat = 28.6139;
let selectedLng = 77.2090;

map = L.map('map').setView(
[selectedLat, selectedLng],
14
);

L.tileLayer(

'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

{

maxZoom:19

}

).addTo(map);

updateAddress();

map.on(

'moveend',

async()=>{

const center =
map.getCenter();

selectedLat =
center.lat;

selectedLng =
center.lng;

updateAddress();

}

);

async function updateAddress(){

try{

const response =
await fetch(

`https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLat}&lon=${selectedLng}`

);

const data =
await response.json();

const address =

data.display_name ||
"Location Selected";

document.getElementById(
"selectedAddress"
).innerHTML =
address;

window.selectedAddress =
address;

}catch(error){

console.log(error);

}

}

window.saveLocation =
function(){

localStorage.setItem(
"userLatitude",
selectedLat
);

localStorage.setItem(
"userLongitude",
selectedLng
);

localStorage.setItem(
"userAddress",
window.selectedAddress
);

localStorage.setItem(
"userCity",
window.selectedAddress
);

window.location.href =
"index.html";

};
