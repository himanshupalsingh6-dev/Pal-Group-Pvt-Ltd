export async function assignDriver(city){

const drivers =

await getDocs(

query(

collection(db,"drivers"),

where("city","==",city),

where("online","==",true)

)

);

let selected = null;

drivers.forEach(doc=>{

const driver = doc.data();

if(!selected){

selected = {
id:doc.id,
...driver
};

}

});

return selected;

}
