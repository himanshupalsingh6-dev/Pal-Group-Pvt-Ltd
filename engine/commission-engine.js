export function calculateCommission(amount){

const platform =
amount * 0.20;

const partner =
amount - platform;

return {

platform,

partner

};

}
