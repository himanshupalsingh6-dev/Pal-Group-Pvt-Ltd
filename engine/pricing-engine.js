export function calculatePrice({

basePrice,
cityCharge,
express,
festival

}){

let total =
basePrice + cityCharge;

if(express){

total += 30;

}

if(festival){

total += 20;

}

return total;

}
