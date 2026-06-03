import { db } from "./firebase.js";

import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const services = [
  {
    category:"Ironing",
    subCategory:"Shirt",
    serviceName:"Formal Shirt",
    cityPricing:{Kasganj:15,Noida:20,Delhi:25},
    active:true,
    popular:true,
    isDummy:true,
    batch:"QUICKPRESS_DUMMY_V1"
  },

  {
    category:"Ironing",
    subCategory:"Shirt",
    serviceName:"Casual Shirt",
    cityPricing:{Kasganj:15,Noida:20,Delhi:25},
    active:true,
    popular:true,
    isDummy:true,
    batch:"QUICKPRESS_DUMMY_V1"
  },

  {
    category:"Ironing",
    subCategory:"Pant",
    serviceName:"Formal Pant",
    cityPricing:{Kasganj:20,Noida:25,Delhi:30},
    active:true,
    popular:true,
    isDummy:true,
    batch:"QUICKPRESS_DUMMY_V1"
  },

  {
    category:"Dry Cleaning",
    subCategory:"Shirt",
    serviceName:"Formal Shirt",
    cityPricing:{Kasganj:80,Noida:100,Delhi:120},
    active:true,
    popular:true,
    isDummy:true,
    batch:"QUICKPRESS_DUMMY_V1"
  },

  {
    category:"Dry Cleaning",
    subCategory:"Women Wear",
    serviceName:"Silk Saree",
    cityPricing:{Kasganj:250,Noida:300,Delhi:350},
    active:true,
    popular:true,
    isDummy:true,
    batch:"QUICKPRESS_DUMMY_V1"
  }
];

// Auto-generate additional dummy services
const categories = [
  "Ironing",
  "Dry Cleaning",
  "Wash & Fold",
  "Premium Laundry",
  "Steam Press"
];

const subCategories = [
  "Shirt",
  "Pant",
  "Traditional",
  "Women Wear",
  "Kids Wear",
  "Home Linen"
];

for(let i=1;i<=95;i++){

  services.push({

    category:
      categories[
        i % categories.length
      ],

    subCategory:
      subCategories[
        i % subCategories.length
      ],

    serviceName:
      `Dummy Service ${i}`,

    cityPricing:{
      Kasganj:50+i,
      Noida:70+i,
      Delhi:90+i
    },

    active:true,

    popular:i<15,

    isDummy:true,

    batch:"QUICKPRESS_DUMMY_V1"

  });

}

async function uploadServices(){

  try{

    for(const service of services){

      await addDoc(
        collection(db,"services"),
        service
      );

    }

    console.log(
      `${services.length} services uploaded`
    );

    alert(
      `${services.length} services uploaded successfully`
    );

  }catch(error){

    console.error(error);

    alert(
      "Upload failed"
    );

  }

}

uploadServices();
