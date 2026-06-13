export async function releaseSettlement(

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

status:"paid",

paidAt:
serverTimestamp()

}

);

}
