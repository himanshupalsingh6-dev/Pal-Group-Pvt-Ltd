/* ===================================
QUICKPRESS LOCATION MANAGER
=================================== */

const LOCATION_KEY = "qp_location";

const SERVICEABLE_CITIES = [

"Kasganj",
"Soron",
"Bilram",
"Patiyali",
"Sahawar",
"Ganj Dundwara",
"Etah",
"Aligarh"

];

/* ===================================
OPEN MODAL
=================================== */

window.openLocationModal = function(){

const modal =
document.getElementById(
"locationModal"
);

if(modal){

modal.style.display = "flex";

}

};

/* ===================================
CLOSE MODAL
=================================== */

window.closeLocationModal = function(){

const modal =
document.getElementById(
"locationModal"
);

if(modal){

modal.style.display = "none";

}

};

/* ===================================
HEADER UPDATE
=================================== */

function updateHeader(city){

const text =
document.getElementById(
"locationText"
);

if(text){

text.innerHTML = city;

}

}

/* ===================================
SAVE LOCATION
=================================== */

function saveLocation(data){

localStorage.setItem(

LOCATION_KEY,

JSON.stringify(data)

);

updateHeader(
data.city
);

closeLocationModal();

/* Reload Services */

if(window.refreshServices){

window.refreshServices();

}

}

/* ===================================
MANUAL CITY
=================================== */

window.selectCity = function(city){

saveLocation({

city,
address:city,
serviceable:true,
savedAt:Date.now()

});

};

/* ===================================
GPS DETECT
=================================== */

window.startLocationDetection =
function(){

if(!navigator.geolocation){

alert(
"Location not supported"
);

return;

}

navigator.geolocation.getCurrentPosition(

gpsSuccess,

gpsError,

{

enableHighAccuracy:true,
timeout:10000

}

);

};

async function gpsSuccess(position){

const lat =
position.coords.latitude;

const lng =
position.coords.longitude;

try{

const response =

await fetch(

`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`

);

const data =
await response.json();

const city =

data.address.city ||

data.address.town ||

data.address.county ||

"Kasganj";

if(

!SERVICEABLE_CITIES.includes(
city
)

){

alert(

"QuickPress Coming Soon In " +
city

);

return;

}

saveLocation({

city,
address:data.display_name,
lat,
lng,
serviceable:true,
savedAt:Date.now()

});

}catch(error){

console.log(error);

alert(
"Location Detection Failed"
);

}

}

function gpsError(){

alert(
"Location Permission Denied"
);

}

/* ===================================
CITY FILTER
=================================== */

window.filterServicesByCity =
function(services){

const saved =

JSON.parse(

localStorage.getItem(
LOCATION_KEY
)

|| "null"

);

if(!saved){

return services;

}

return services.filter(service=>{

if(!service.city){

return true;

}

if(

Array.isArray(
service.city
)

){

return service.city.includes(
saved.city
);

}

return service.city ===
saved.city;

});

};

/* ===================================
CITY PRICING
=================================== */

window.getServicePrice =
function(service){

const saved =

JSON.parse(

localStorage.getItem(
LOCATION_KEY
)

|| "null"

);

if(!saved){

return service.price || 0;

}

if(

service.cityPricing &&

service.cityPricing[
saved.city
]

){

return

service.cityPricing[
saved.city
];

}

return service.price || 0;

};

/* ===================================
RESTORE
=================================== */

function restoreLocation(){

const saved =

localStorage.getItem(
LOCATION_KEY
);

if(!saved){

setTimeout(()=>{

openLocationModal();

},600);

return;

}

const data =
JSON.parse(saved);

updateHeader(
data.city
);

}

/* ===================================
SEARCH CITY
=================================== */

document.addEventListener(

"DOMContentLoaded",

()=>{

restoreLocation();

const search =

document.getElementById(
"locationSearch"
);

if(search){

search.addEventListener(

"keyup",

function(){

const value =

this.value
.toLowerCase();

document
.querySelectorAll(
".qpCityItem"
)

.forEach(item=>{

item.style.display =

item.innerText
.toLowerCase()
.includes(value)

? "block"

: "none";

});

}

);

}

});

console.log(
"QuickPress Location Loaded"
);
