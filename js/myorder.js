const DELIVERY_CHARGE = 20;
const HANDLING_CHARGE = 3;

/* STORAGE */
function getCart(){
  return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart){
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ADD / REMOVE */
window.addItem = function(name, price){
  let cart = getCart();
  let item = cart.find(i => i.name === name);
  if(item) item.qty++;
  else cart.push({ name, price, qty: 1 });
  saveCart(cart);
  updateNav();
};

window.removeItem = function(name){
  let cart = getCart();
  let item = cart.find(i => i.name === name);
  if(!item) return;
  item.qty--;
  if(item.qty <= 0) cart = cart.filter(i => i.name !== name);
  saveCart(cart);
  updateNav();
};

window.getQty = function(name){
  let i = getCart().find(x => x.name === name);
  return i ? i.qty : 0;
};

/* TOTALS */
function itemsTotal(){
  return getCart().reduce((s,i)=>s+i.price*i.qty,0);
}
function grandTotal(){
  let t = itemsTotal();
  return t === 0 ? 0 : t + DELIVERY_CHARGE + HANDLING_CHARGE;
}

/* NAV */
function updateNav(){
  const el = document.getElementById("navCartAmount");
  if(el) el.innerText = "₹" + grandTotal();
}
document.addEventListener("DOMContentLoaded", updateNav);
