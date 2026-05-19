/* =====================================================
QUICKPRESS APP JS
===================================================== */

/* =====================================================
LIVE LOCATION
===================================================== */

const locationText = document.getElementById("locationText");

function success(position){

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    )
    .then(res => res.json())
    .then(data => {

        const place =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state ||
            "Kasganj";

        locationText.innerHTML = `📍 ${place}`;

    })
    .catch(() => {

        locationText.innerHTML =
        "📍 Kasganj";

    });

}

function error(){

    locationText.innerHTML =
    "📍 Kasganj";

}

if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition(
        success,
        error
    );

}else{

    locationText.innerHTML =
    "📍 Kasganj";

}

/* =====================================================
PROFILE BUTTON
===================================================== */

const profileBtn =
document.querySelector(".profileBtn");

profileBtn.addEventListener("click",()=>{

    window.location.href =
    "profile.html";

});

/* =====================================================
WALLET BUTTON
===================================================== */

const walletBtn =
document.querySelector(".walletBtn");

walletBtn.addEventListener("click",()=>{

    alert("Quick Wallet Opening...");

});

/* =====================================================
SEARCH BAR
===================================================== */

const searchInput =
document.querySelector(".searchBar input");

searchInput.addEventListener("focus",()=>{

    document.querySelector(".searchBar")
    .style.boxShadow =
    "0 10px 25px rgba(0,0,0,0.12)";

});

searchInput.addEventListener("blur",()=>{

    document.querySelector(".searchBar")
    .style.boxShadow =
    "0 8px 20px rgba(0,0,0,0.08)";

});

/* =====================================================
ADD TO CART
===================================================== */

const addButtons =
document.querySelectorAll(".addBtn");

addButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        button.innerHTML = "Added ✓";

        button.style.background =
        "#111827";

        button.style.color =
        "#fff";

        button.disabled = true;

        showToast(
        "Item added successfully"
        );

    });

});

/* =====================================================
TOAST
===================================================== */

function showToast(message){

    const toast =
    document.createElement("div");

    toast.innerHTML = message;

    toast.style.position = "fixed";
    toast.style.bottom = "95px";
    toast.style.left = "50%";
    toast.style.transform =
    "translateX(-50%)";

    toast.style.background =
    "#111827";

    toast.style.color = "#fff";

    toast.style.padding =
    "14px 22px";

    toast.style.borderRadius =
    "16px";

    toast.style.fontWeight =
    "700";

    toast.style.zIndex = "99999";

    toast.style.boxShadow =
    "0 8px 20px rgba(0,0,0,0.18)";

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },2500);

}

/* =====================================================
CATEGORY ACTIVE
===================================================== */

const categoryCards =
document.querySelectorAll(".categoryCard");

categoryCards.forEach(card=>{

    card.addEventListener("click",()=>{

        categoryCards.forEach(c=>{

            c.style.transform =
            "scale(1)";

        });

        card.style.transform =
        "scale(1.06)";

    });

});

/* =====================================================
BOTTOM NAV
===================================================== */

const navItems =
document.querySelectorAll(".navItem");

navItems.forEach(item=>{

    item.addEventListener("click",()=>{

        navItems.forEach(nav=>{

            nav.classList.remove(
            "activeNav"
            );

        });

        item.classList.add(
        "activeNav"
        );

    });

});

/* =====================================================
AUTO REVIEW SLIDER
===================================================== */

const reviewTrack =
document.querySelector(".reviewTrack");

let scrollAmount = 0;

setInterval(()=>{

    if(reviewTrack){

        scrollAmount += 300;

        if(
            scrollAmount >=
            reviewTrack.scrollWidth -
            reviewTrack.clientWidth
        ){

            scrollAmount = 0;

        }

        reviewTrack.scrollTo({

            left: scrollAmount,
            behavior: "smooth"

        });

    }

},3000);

/* =====================================================
BOOK PICKUP BUTTON
===================================================== */

const bookBtn =
document.querySelector(".bookBtn");

bookBtn.addEventListener("click",()=>{

    showToast(
    "Pickup booked successfully 🚀"
    );

});

/* =====================================================
PARTNER BUTTON
===================================================== */

const partnerBtn =
document.querySelector(".partnerBtn");

partnerBtn.addEventListener("click",()=>{

    showToast(
    "Opening Partners..."
    );

});

/* =====================================================
PAGE LOAD ANIMATION
===================================================== */

window.addEventListener("load",()=>{

    document.body.style.opacity = "1";

});
