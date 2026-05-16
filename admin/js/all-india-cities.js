/* =========================================================
FILE : admin/js/all-india-cities.js
QUICKPRESS ALL INDIA STATES + CITIES
========================================================= */

export const indiaLocations = {

"Uttar Pradesh":[

"Agra",
"Aligarh",
"Allahabad",
"Amroha",
"Ayodhya",
"Azamgarh",
"Baghpat",
"Bahraich",
"Ballia",
"Banda",
"Barabanki",
"Bareilly",
"Basti",
"Badaun",
"Bulandshahr",
"Chandauli",
"Deoria",
"Etah",
"Etawah",
"Farrukhabad",
"Fatehpur",
"Firozabad",
"Ghaziabad",
"Ghazipur",
"Gonda",
"Gorakhpur",
"Hamirpur",
"Hardoi",
"Hathras",
"Jhansi",
"Jaunpur",
"Kanpur",
"Kasganj",
"Kaushambi",
"Kushinagar",
"Lakhimpur",
"Lucknow",
"Mathura",
"Meerut",
"Mirzapur",
"Moradabad",
"Muzaffarnagar",
"Noida",
"Greater Noida",
"Prayagraj",
"Raebareli",
"Rampur",
"Saharanpur",
"Shahjahanpur",
"Sitapur",
"Sonbhadra",
"Sultanpur",
"Unnao",
"Varanasi"

],

"Delhi":[

"Central Delhi",
"East Delhi",
"North Delhi",
"South Delhi",
"West Delhi",
"Dwarka",
"Janakpuri",
"Karol Bagh",
"Laxmi Nagar",
"Pitampura",
"Rohini",
"Saket"

],

"Maharashtra":[

"Mumbai",
"Pune",
"Nagpur",
"Nashik",
"Thane",
"Aurangabad",
"Kolhapur",
"Solapur",
"Amravati",
"Akola",
"Jalgaon",
"Satara",
"Ratnagiri"

],

"Rajasthan":[

"Jaipur",
"Jodhpur",
"Udaipur",
"Ajmer",
"Kota",
"Bikaner",
"Alwar",
"Bharatpur",
"Sikar",
"Chittorgarh"

],

"Haryana":[

"Gurugram",
"Faridabad",
"Panipat",
"Karnal",
"Hisar",
"Rohtak",
"Sonipat",
"Ambala",
"Kurukshetra",
"Yamunanagar"

],

"Punjab":[

"Amritsar",
"Ludhiana",
"Jalandhar",
"Patiala",
"Bathinda",
"Mohali",
"Hoshiarpur",
"Pathankot"

],

"Bihar":[

"Patna",
"Gaya",
"Muzaffarpur",
"Bhagalpur",
"Darbhanga",
"Purnia",
"Begusarai",
"Ara",
"Buxar",
"Samastipur"

],

"Madhya Pradesh":[

"Bhopal",
"Indore",
"Gwalior",
"Jabalpur",
"Ujjain",
"Sagar",
"Satna",
"Rewa",
"Ratlam",
"Chhindwara"

],

"Gujarat":[

"Ahmedabad",
"Surat",
"Vadodara",
"Rajkot",
"Bhavnagar",
"Jamnagar",
"Gandhinagar",
"Junagadh",
"Anand",
"Navsari"

],

"West Bengal":[

"Kolkata",
"Howrah",
"Durgapur",
"Siliguri",
"Asansol",
"Kharagpur",
"Malda",
"Darjeeling"

],

"Uttarakhand":[

"Dehradun",
"Haridwar",
"Roorkee",
"Haldwani",
"Rudrapur",
"Nainital",
"Kashipur"

],

"Jharkhand":[

"Ranchi",
"Jamshedpur",
"Dhanbad",
"Bokaro",
"Deoghar",
"Hazaribagh",
"Giridih"

],

"Chandigarh":[

"Chandigarh"

],

"Himachal Pradesh":[

"Shimla",
"Manali",
"Solan",
"Dharamshala",
"Mandi",
"Kullu"

],

"Jammu & Kashmir":[

"Srinagar",
"Jammu",
"Anantnag",
"Baramulla",
"Kathua"

],

"Karnataka":[

"Bangalore",
"Mysore",
"Hubli",
"Mangalore",
"Belgaum",
"Davanagere",
"Shimoga"

],

"Tamil Nadu":[

"Chennai",
"Coimbatore",
"Madurai",
"Salem",
"Trichy",
"Tirunelveli",
"Vellore"

],

"Telangana":[

"Hyderabad",
"Warangal",
"Karimnagar",
"Nizamabad",
"Khammam"

],

"Andhra Pradesh":[

"Vijayawada",
"Visakhapatnam",
"Guntur",
"Nellore",
"Kurnool"

],

"Kerala":[

"Kochi",
"Thiruvananthapuram",
"Kozhikode",
"Thrissur",
"Kannur"

],

"Odisha":[

"Bhubaneswar",
"Cuttack",
"Rourkela",
"Sambalpur",
"Puri"

],

"Assam":[

"Guwahati",
"Silchar",
"Dibrugarh",
"Jorhat",
"Tezpur"

]

};

/* =========================================================
GET ALL STATES
========================================================= */

export function getAllStates(){

return Object.keys(
indiaLocations
);

}

/* =========================================================
GET CITIES BY STATE
========================================================= */

export function getCitiesByState(state){

return indiaLocations[state] || [];

}

/* =========================================================
GET ALL CITIES
========================================================= */

export function getAllCities(){

let cities = [];

Object.values(indiaLocations)
.forEach((cityArray)=>{

cities = [
...cities,
...cityArray
];

});

return cities;

}

/* =========================================================
SEARCH CITY
========================================================= */

export function searchCity(keyword){

const allCities =
getAllCities();

return allCities.filter((city)=>

city
.toLowerCase()
.includes(
keyword.toLowerCase()
)

);

}

/* =========================================================
CHECK CITY EXIST
========================================================= */

export function cityExists(cityName){

const allCities =
getAllCities();

return allCities.includes(cityName);

}
