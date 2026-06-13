import {
doc,
updateDoc,
serverTimestamp
}
from
"https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

export async function updateDriverLocation(

orderId,
lat,
lng

){

await updateDoc(

doc(
db,
"tracking",
orderId
),

{

lat,
lng,

updatedAt:
serverTimestamp()

}

);

}
