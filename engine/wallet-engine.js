export async function addWalletBalance(

partnerId,
amount

){

await updateDoc(

doc(
db,
"wallets",
partnerId
),

{

balance:
increment(amount)

}

);

}
