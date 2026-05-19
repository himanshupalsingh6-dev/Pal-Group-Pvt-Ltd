// =====================================================
// QUICKPRESS FULL WORKING INDEX.JS
// =====================================================

// =====================================================
// FIREBASE IMPORT
// =====================================================

import {

  db,
  auth,
  storage

} from "./firebase.js";

import {

  collection,
  getDocs

} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// =====================================================
// DOM ELEMENTS
// =====================================================

const productGrid =
document.querySelector(".productGrid");

const cartItems =
document.getElementById("cartItems");

const cartTotal =
document.getElementById("cartTotal");

const cartCount =
document.getElementById("cartCount");

const popupCart =
document.getElementById("popupCart");

const walletBtn =
document.getElementById("walletBtn");

const closeCart =
document.getElementById("closeCart");

const locationText =
document.getElementById("locationText");

const searchInput =
document.querySelector(".searchBar input");

// =====================================================
// CART DATA
// =====================================================

let cart = [];

// =====================================================
// GET LIVE LOCATION
// =====================================================

function getLiveLocation() {

  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const lat =
        position.coords.latitude;

        const lon =
        position.coords.longitude;

        try {

          const response =
          await fetch(

            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`

          );

          const data =
          await response.json();

          const city =

            data.address.city ||

            data.address.town ||

            data.address.village ||

            "QuickPress User";

          locationText.innerHTML =
          `📍 ${city}`;

        }

        catch (error) {

          locationText.innerHTML =
          "📍 Uttar Pradesh";

        }

      },

      () => {

        locationText.innerHTML =
        "📍 Uttar Pradesh";

      }

    );

  }

}

getLiveLocation();

// =====================================================
// LOAD SERVICES FROM FIREBASE
// =====================================================

async function loadServices() {

  productGrid.innerHTML =

  `
  
  <h2 class="loadingText">
  Loading Services...
  </h2>
  
  `;

  try {

    const querySnapshot =

    await getDocs(

      collection(db, "services")

    );

    productGrid.innerHTML = "";

    querySnapshot.forEach((doc) => {

      const product = doc.data();

      const card =
      document.createElement("div");

      card.classList.add("productCard");

      card.innerHTML =

      `

      <div class="productImageWrap">

        <img
        src="${product.image}"
        class="productImage"
        />

        <div class="productBadge">
        Express
        </div>

      </div>

      <div class="productInfo">

        <h3>
        ${product.name}
        </h3>

        <p>
        ${product.description}
        </p>

        <div class="priceRow">

          <h2>
          ₹${product.price}
          </h2>

          <button class="addBtn">
          Add
          </button>

        </div>

      </div>

      `;

      const addBtn =
      card.querySelector(".addBtn");

      addBtn.addEventListener(

        "click",

        () => {

          addToCart(product);

          buttonAnimation(addBtn);

        }

      );

      productGrid.appendChild(card);

    });

  }

  catch (error) {

    console.log(error);

    productGrid.innerHTML =

    `
    
    <h2 style="color:white">
    Failed To Load Services
    </h2>
    
    `;

  }

}

loadServices();

// =====================================================
// ADD TO CART
// =====================================================

function addToCart(product) {

  const existingItem =

  cart.find(

    (item) => item.name === product.name

  );

  if (existingItem) {

    existingItem.qty += 1;

  }

  else {

    cart.push({

      ...product,

      qty: 1

    });

  }

  updateCart();

  showToast(`${product.name} Added`);

}

// =====================================================
// UPDATE CART
// =====================================================

function updateCart() {

  cartItems.innerHTML = "";

  let total = 0;

  let count = 0;

  cart.forEach((item, index) => {

    total += item.price * item.qty;

    count += item.qty;

    const cartCard =
    document.createElement("div");

    cartCard.classList.add("cartItem");

    cartCard.innerHTML =

    `

    <img
    src="${item.image}"
    class="cartImage"
    />

    <div class="cartInfo">

      <h4>
      ${item.name}
      </h4>

      <p>
      ₹${item.price}
      </p>

      <div class="qtyRow">

        <button class="minusBtn">
        -
        </button>

        <span>
        ${item.qty}
        </span>

        <button class="plusBtn">
        +
        </button>

      </div>

    </div>

    `;

    const plusBtn =
    cartCard.querySelector(".plusBtn");

    const minusBtn =
    cartCard.querySelector(".minusBtn");

    plusBtn.addEventListener(

      "click",

      () => {

        item.qty++;

        updateCart();

      }

    );

    minusBtn.addEventListener(

      "click",

      () => {

        item.qty--;

        if (item.qty <= 0) {

          cart.splice(index, 1);

        }

        updateCart();

      }

    );

    cartItems.appendChild(cartCard);

  });

  cartTotal.innerHTML =
  `₹${total}`;

  cartCount.innerHTML =
  count;

  localStorage.setItem(

    "quickpress_cart",

    JSON.stringify(cart)

  );

}

// =====================================================
// LOAD SAVED CART
// =====================================================

function loadSavedCart() {

  const savedCart =

  localStorage.getItem(

    "quickpress_cart"

  );

  if (savedCart) {

    cart = JSON.parse(savedCart);

    updateCart();

  }

}

loadSavedCart();

// =====================================================
// OPEN CART
// =====================================================

walletBtn.addEventListener(

  "click",

  () => {

    popupCart.classList.add("showCart");

  }

);

// =====================================================
// CLOSE CART
// =====================================================

closeCart.addEventListener(

  "click",

  () => {

    popupCart.classList.remove("showCart");

  }

);

// =====================================================
// CATEGORY ACTIVE
// =====================================================

const categories =
document.querySelectorAll(".categoryCard");

categories.forEach((category) => {

  category.addEventListener(

    "click",

    () => {

      categories.forEach((item) => {

        item.classList.remove(

          "activeCategory"

        );

      });

      category.classList.add(

        "activeCategory"

      );

    }

  );

});

// =====================================================
// SEARCH FILTER
// =====================================================

searchInput.addEventListener(

  "input",

  () => {

    const value =

    searchInput.value.toLowerCase();

    const cards =

    document.querySelectorAll(".productCard");

    cards.forEach((card) => {

      const title =

      card.querySelector("h3")

      .innerText

      .toLowerCase();

      if (title.includes(value)) {

        card.style.display = "block";

      }

      else {

        card.style.display = "none";

      }

    });

  }

);

// =====================================================
// BUTTON ANIMATION
// =====================================================

function buttonAnimation(button) {

  button.innerHTML = "Added";

  button.style.background =
  "#00c853";

  button.style.transform =
  "scale(0.95)";

  setTimeout(() => {

    button.innerHTML = "Add";

    button.style.transform =
    "scale(1)";

  }, 1000);

}

// =====================================================
// TOAST MESSAGE
// =====================================================

function showToast(message) {

  const toast =
  document.createElement("div");

  toast.classList.add("toast");

  toast.innerHTML =

  `
  
  <i class="fa-solid fa-circle-check"></i>
  ${message}
  
  `;

  document.body.appendChild(toast);

  setTimeout(() => {

    toast.classList.add("showToast");

  }, 100);

  setTimeout(() => {

    toast.classList.remove("showToast");

    setTimeout(() => {

      toast.remove();

    }, 500);

  }, 2500);

}

// =====================================================
// NAVBAR ACTIVE
// =====================================================

const navItems =
document.querySelectorAll(".navItem");

navItems.forEach((item) => {

  item.addEventListener(

    "click",

    () => {

      navItems.forEach((nav) => {

        nav.classList.remove("activeNav");

      });

      item.classList.add("activeNav");

    }

  );

});

// =====================================================
// PAGE LINKS
// =====================================================

document.querySelector(".homeNav")
.addEventListener("click", () => {

  window.location.href =
  "index.html";

});

document.querySelector(".ordersNav")
.addEventListener("click", () => {

  window.location.href =
  "orders.html";

});

document.querySelector(".servicesNav")
.addEventListener("click", () => {

  window.location.href =
  "services.html";

});

document.querySelector(".walletNav")
.addEventListener("click", () => {

  window.location.href =
  "wallet.html";

});

document.querySelector(".profileNav")
.addEventListener("click", () => {

  window.location.href =
  "profile.html";

});

// =====================================================
// BOOK PICKUP BUTTON
// =====================================================

document.querySelector(".bookBtn")
.addEventListener("click", () => {

  popupCart.classList.add("showCart");

});

// =====================================================
// PARTNER BUTTON
// =====================================================

document.querySelector(".partnerBtn")
.addEventListener("click", () => {

  showToast("Partners Page Coming Soon");

});

// =====================================================
// CHECKOUT
// =====================================================

document.querySelector(".checkoutBtn")
.addEventListener("click", () => {

  if (cart.length === 0) {

    showToast("Cart Empty");

    return;

  }

  showToast("Opening Checkout");

  setTimeout(() => {

    window.location.href =
    "checkout.html";

  }, 1200);

});

// =====================================================
// AUTO REVIEW SLIDER
// =====================================================

const reviewTrack =
document.querySelector(".reviewTrack");

let scrollAmount = 0;

setInterval(() => {

  scrollAmount += 320;

  if (

    scrollAmount >

    reviewTrack.scrollWidth - 350

  ) {

    scrollAmount = 0;

  }

  reviewTrack.scrollTo({

    left: scrollAmount,

    behavior: "smooth"

  });

}, 3000);

// =====================================================
// MIC BUTTON
// =====================================================

document.querySelector(".micBtn")
.addEventListener("click", () => {

  showToast("Voice Search Soon");

});

// =====================================================
// PROFILE BUTTON
// =====================================================

document.querySelector(".profileBtn")
.addEventListener("click", () => {

  window.location.href =
  "profile.html";

});

// =====================================================
// PAGE ANIMATION
// =====================================================

window.addEventListener("load", () => {

  document.body.style.opacity = "1";

});

// =====================================================
// CONSOLE
// =====================================================

console.log("QuickPress Ready 🚀");
