export async function createSettlement(

partnerId,
amount

){

await addDoc(

collection(
db,
"settlements"
),

{

partnerId,

amount,

status:"pending",

createdAt:
serverTimestamp()

}

);

}
