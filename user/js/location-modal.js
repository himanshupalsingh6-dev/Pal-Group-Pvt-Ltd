window.openLocationModal = function(){

document
.getElementById(
"locationModal"
)
.style.display = "flex";

};

window.closeLocationModal = function(){

document
.getElementById(
"locationModal"
)
.style.display = "none";

};

window.selectCity = function(city){

localStorage.setItem(
"userCity",
city
);

const locationText =

document.getElementById(
"locationText"
);

if(locationText){

locationText.innerHTML = city;

}

closeLocationModal();

};

window.addEventListener(

"load",

()=>{

const city =

localStorage.getItem(
"userCity"
);

if(city){

const locationText =

document.getElementById(
"locationText"
);

if(locationText){

locationText.innerHTML = city;

}

}else{

setTimeout(()=>{

openLocationModal();

},800);

}

}

);

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
".qpLocationItem"
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
