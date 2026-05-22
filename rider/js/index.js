/* =========================================================
RIDER HOME
========================================================= */

const map = L.map("map").setView(
[27.4924,78.6791],
13
);

/* ========================================================= */

L.tileLayer(

"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

{

attribution:"QuickPress"

}

).addTo(map);

/* ========================================================= */

L.marker(
[27.4924,78.6791]
).addTo(map)

.bindPopup(
"Rider Live Location"
)

.openPopup();
