export async function notifyPartner(

partnerId,
message

){

await addDoc(

collection(
db,
"notifications"
),

{

userId:
partnerId,

message,

read:false,

createdAt:
serverTimestamp()

}

);

}
