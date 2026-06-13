export async function createOrder(orderData){

const orderId =
"QP" + Date.now();

await addDoc(

collection(db,"orders"),

{
orderId,
...orderData,

status:"pending",

createdAt:
serverTimestamp()

}

);

}
