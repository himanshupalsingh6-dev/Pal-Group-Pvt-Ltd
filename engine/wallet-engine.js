export async function creditPartnerWallet(

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
increment(amount),

pending:
increment(amount)

}

);

}
