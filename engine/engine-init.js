import { createOrder } from "./order-engine.js";
import { assignPartner } from "./partner-engine.js";
import { assignDriver } from "./driver-engine.js";

export async function processOrder(order){

const partner =

await assignPartner(order);

order.partnerId =
partner.id;

const driver =

await assignDriver(
order.city
);

order.driverId =
driver.id;

await createOrder(order);

}
