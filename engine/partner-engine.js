export async function assignPartner(order){

const partners =

await getDocs(

query(

collection(db,"partners"),

where("city","==",order.city),

where("status","==","active")

)

);

let selectedPartner = null;
let minOrders = Infinity;

partners.forEach(doc=>{

const data = doc.data();

if(data.activeOrders < minOrders){

selectedPartner = {
id:doc.id,
...data
};

minOrders =
data.activeOrders;

}

});

return selectedPartner;

}
