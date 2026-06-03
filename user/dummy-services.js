import { db } from "./firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const cities = [
  "Kasganj",
  "Noida",
  "Delhi",
  "Mumbai",
  "Lucknow",
  "Agra",
  "Bareilly"
];

const services = [];

/* ==========================
CATEGORY MASTER
========================== */

const masterData = {

  "Ironing": {
    "Shirt": [
      "Formal Shirt",
      "Casual Shirt",
      "Linen Shirt",
      "Denim Shirt",
      "Silk Shirt"
    ],

    "Pant": [
      "Formal Pant",
      "Jeans",
      "Trouser",
      "Cargo Pant",
      "Cotton Pant"
    ],

    "Traditional": [
      "Kurta",
      "Kurta Pajama",
      "Sherwani",
      "Dhoti",
      "Nehru Jacket"
    ]
  },

  "Dry Cleaning": {
    "Shirt": [
      "Formal Shirt",
      "Casual Shirt",
      "Linen Shirt",
      "Designer Shirt",
      "Silk Shirt"
    ],

    "Pant": [
      "Formal Pant",
      "Jeans",
      "Trouser",
      "Designer Trouser",
      "Cargo Pant"
    ],

    "Women Wear": [
      "Saree",
      "Silk Saree",
      "Lehenga",
      "Gown",
      "Suit Set"
    ],

    "Blazer": [
      "Single Blazer",
      "Double Blazer",
      "Designer Blazer"
    ]
  },

  "Wash & Fold": {

    "Daily Wear": [
      "T-Shirt",
      "Shirt",
      "Pant",
      "Jeans",
      "Shorts"
    ],

    "Kids Wear": [
      "Kids Shirt",
      "Kids Pant",
      "Kids Dress",
      "Kids Uniform"
    ]
  },

  "Premium Laundry": {

    "Luxury": [
      "Luxury Shirt",
      "Luxury Pant",
      "Luxury Suit",
      "Luxury Saree",
      "Luxury Lehenga"
    ]
  },

  "Steam Press": {

    "Garments": [
      "Steam Shirt",
      "Steam Pant",
      "Steam Kurta",
      "Steam Saree",
      "Steam Blazer"
    ]
  },

  "Curtain Cleaning": {

    "Curtains": [
      "Window Curtain",
      "Door Curtain",
      "Blackout Curtain",
      "Premium Curtain"
    ]
  },

  "Blanket Cleaning": {

    "Home Linen": [
      "Single Blanket",
      "Double Blanket",
      "Quilt",
      "Comforter",
      "Bedsheet"
    ]
  },

  "Shoe Cleaning": {

    "Shoes": [
      "Sports Shoes",
      "Leather Shoes",
      "Sneakers",
      "Formal Shoes"
    ]
  },

  "Bag Cleaning": {

    "Bags": [
      "School Bag",
      "Laptop Bag",
      "Travel Bag",
      "Hand Bag"
    ]
  }

};

/* ==========================
CREATE SERVICES
========================== */

let counter = 1;

Object.keys(masterData).forEach(category=>{

  Object.keys(masterData[category]).forEach(subCategory=>{

    masterData[category][subCategory]

    .forEach(serviceName=>{

      const basePrice =

      Math.floor(
        Math.random()*100
      ) + 20;

      const cityPricing = {};

      cities.forEach((city,index)=>{

        cityPricing[city] =

        basePrice +
        (index * 15);

      });

      services.push({

        serviceCode:
        "QP-" + counter,

        category,

        subCategory,

        serviceName,

        description:
        "QuickPress Premium Laundry Service",

        cityPricing,

        active:true,

        popular:
        counter <= 20,

        image:
        "https://via.placeholder.com/300",

        isDummy:true,

        batch:
        "QUICKPRESS_DUMMY_V1"

      });

      counter++;

    });

  });

});

/* EXTRA DUMMY SERVICES */

for(let i=1;i<=60;i++){

  const cityPricing = {};

  cities.forEach((city,index)=>{

    cityPricing[city] =
    50 + i + (index*10);

  });

  services.push({

    serviceCode:
    "DUMMY-" + i,

    category:"Ironing",

    subCategory:"Shirt",

    serviceName:
    "Dummy Service " + i,

    description:
    "Testing Service",

    cityPricing,

    active:true,

    popular:false,

    image:
    "https://via.placeholder.com/300",

    isDummy:true,

    batch:
    "QUICKPRESS_DUMMY_V1"

  });

}

/* ==========================
UPLOAD
========================== */

async function uploadServices(){

  try{

    for(const service of services){

      await addDoc(

        collection(
          db,
          "services"
        ),

        service

      );

    }

    alert(
      `${services.length} services uploaded successfully`
    );

    console.log(
      `${services.length} services uploaded`
    );

  }

  catch(error){

    console.error(error);

    alert(
      "Upload Failed"
    );

  }

}

uploadServices();
