/* ===================================
QUICKPRESS LOCATION MANAGER
=================================== */

const LOCATION_KEY =
"qp_location";

const SERVICEABLE_CITIES = [

"Kasganj",
"Soron",
"Bilram",
"Patiyali",
"Sahawar",
"Ganj Dundwara"

];const UP_CITIES = [

"Agra",
"Aligarh",
"Prayagraj",
"Lucknow",
"Kanpur",
"Varanasi",
"Meerut",
"Ghaziabad",
"Noida",
"Mathura",
"Etah",
"Kasganj",
"Soron",
"Bilram",
"Patiyali",
"Sahawar",
"Ganj Dundwara",
"Bareilly",
"Moradabad",
"Gorakhpur",
"Jhansi",
"Firozabad",
"Mainpuri",
"Etawah",
"Unnao"

];window.openLocationModal =
function(){

const modal =

document.getElementById(
"locationModal"
);

if(modal){

modal.style.display =
"flex";

}

};window.closeLocationModal =
function(){

const modal =

document.getElementById(
"locationModal"
);

if(modal){

modal.style.display =
"none";

}

};window.updateLocationHeader =
function(city){

const locationText =

document.getElementById(
"locationText"
);

if(locationText){

locationText.innerHTML =
city;

}

};window.saveLocationData =
function(data){

localStorage.setItem(

LOCATION_KEY,

JSON.stringify(data)

);

updateLocationHeader(
data.city
);

closeLocationModal();

};window.selectCity =
function(city){

saveLocationData({

city,

address:city,

serviceable:true,

savedAt:Date.now()

});

};window.startLocationDetection =
function(){

if(!navigator.geolocation){

alert(
"Location not supported"
);

return;

}

navigator.geolocation.getCurrentPosition(

detectSuccess,

detectError,

{

enableHighAccuracy:true,

timeout:10000

}

);

};async function detectSuccess(
position
){

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

saveLocationData({

city,

address:
data.display_name,

lat,

lng,

serviceable:true,

savedAt:
Date.now()

});

}catch(error){

console.log(error);

alert(
"Location Detection Failed"
);

}

}function detectError(){

alert(
"Location Permission Denied"
);

}

document.addEventListener(

"DOMContentLoaded",

()=>{

const saved =

localStorage.getItem(
LOCATION_KEY
);

if(saved){

const data =

JSON.parse(saved);

updateLocationHeader(
data.city
);

}else{

setTimeout(()=>{

openLocationModal();

},800);

}

});
