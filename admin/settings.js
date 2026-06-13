/* =========================================================
QUICKPRESS SETTINGS PANEL
FILE: settings.js
PART 1/5
========================================================= */

/* =========================================================
FIREBASE IMPORTS
========================================================= */

import { db } from "../firebase/firebase.js";

import {

collection,
getDocs,
getDoc,
addDoc,
setDoc,
doc,
serverTimestamp

}

from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

/* =========================================================
COLLECTIONS
========================================================= */

const SETTINGS_COLLECTION =
"settings";

const ADMINS_COLLECTION =
"admins";

/* =========================================================
GLOBAL STATE
========================================================= */

let settingsData = {};

let admins = [];

/* =========================================================
HELPERS
========================================================= */

function setText(
id,
value
){

const el =
document.getElementById(id);

if(el){

el.innerText =
value;

}

}

function setValue(
id,
value
){

const el =
document.getElementById(id);

if(el){

el.value =
value || "";

}

}

function setChecked(
id,
value
){

const el =
document.getElementById(id);

if(el){

el.checked =
Boolean(value);

}

}

/* =========================================================
LOAD SETTINGS
========================================================= */

async function loadSettingsData(){

try{

const settingsRef =

doc(
db,
SETTINGS_COLLECTION,
"appConfig"
);

const snapshot =

await getDoc(
settingsRef
);

if(snapshot.exists()){

settingsData =
snapshot.data();

populateSettings();

}

console.log(
"Settings Loaded"
);

}catch(error){

console.error(
"Settings Load Error",
error
);

}

}

/* =========================================================
LOAD ADMINS
========================================================= */

async function loadAdmins(){

try{

const snapshot =

await getDocs(

collection(
db,
ADMINS_COLLECTION
)

);

admins = [];

snapshot.forEach(docSnap=>{

admins.push({

id:docSnap.id,

...docSnap.data()

});

});

console.log(
"Admins Loaded:",
admins.length
);

}catch(error){

console.error(
error
);

}

}

/* =========================================================
POPULATE SETTINGS
========================================================= */

function populateSettings(){

setValue(
"appName",
settingsData.appName
);

setValue(
"supportEmail",
settingsData.supportEmail
);

setValue(
"supportPhone",
settingsData.supportPhone
);

setValue(
"appVersion",
settingsData.appVersion
);

setValue(
"gstPercent",
settingsData.gstPercent
);

setValue(
"platformCommission",
settingsData.platformCommission
);

setValue(
"partnerCommission",
settingsData.partnerCommission
);

setValue(
"driverCommission",
settingsData.driverCommission
);

setValue(
"baseDeliveryCharge",
settingsData.baseDeliveryCharge
);

setValue(
"freeDeliveryThreshold",
settingsData.freeDeliveryThreshold
);

setValue(
"expressDeliveryCharge",
settingsData.expressDeliveryCharge
);

setValue(
"maxDeliveryRadius",
settingsData.maxDeliveryRadius
);

setChecked(
"pushNotifications",
settingsData.pushNotifications
);

setChecked(
"smsNotifications",
settingsData.smsNotifications
);

setChecked(
"emailNotifications",
settingsData.emailNotifications
);

setChecked(
"orderAlerts",
settingsData.orderAlerts
);

}

/* =========================================================
DASHBOARD CARDS
========================================================= */

function updateSettingsAnalytics(){

setText(
"totalAdmins",
admins.length
);

setText(
"backupCount",
settingsData.backupCount || 0
);

setText(
"securityScore",
"100%"
);

setText(
"firebaseStatus",
"Online"
);

}

/* =========================================================
SAVE SETTINGS
========================================================= */

window.saveSettings =
async function(){

try{

const payload = {

appName:

document.getElementById(
"appName"
).value,

supportEmail:

document.getElementById(
"supportEmail"
).value,

supportPhone:

document.getElementById(
"supportPhone"
).value,

appVersion:

document.getElementById(
"appVersion"
).value,

gstPercent:Number(

document.getElementById(
"gstPercent"
).value

),

platformCommission:Number(

document.getElementById(
"platformCommission"
).value

),

partnerCommission:Number(

document.getElementById(
"partnerCommission"
).value

),

driverCommission:Number(

document.getElementById(
"driverCommission"
).value

),

updatedAt:
serverTimestamp()

};

await setDoc(

doc(
db,
SETTINGS_COLLECTION,
"appConfig"
),

payload,

{

merge:true

}

);

alert(
"Settings Saved Successfully"
);

}catch(error){

console.error(
error
);

alert(
"Settings Save Failed"
);

}

};/* =========================================================
RENDER ADMIN TABLE
========================================================= */

function renderAdmins(){

const tbody =

document.getElementById(
"adminTableBody"
);

if(!tbody)
return;

tbody.innerHTML = "";

admins.forEach(admin=>{

const row =
document.createElement(
"tr"
);

row.innerHTML = `

<td>

${admin.name || "-"}

</td>

<td>

${admin.email || "-"}

</td>

<td>

${admin.role || "-"}

</td>

<td>

<span style="
padding:6px 12px;
border-radius:20px;
font-size:12px;
font-weight:700;
background:

${admin.status === "active"

? "#DCFCE7"

: "#FEE2E2"};

color:

${admin.status === "active"

? "#166534"

: "#DC2626"};

">

${admin.status || "inactive"}

</span>

</td>

<td>

<button
class="primaryBtn"
onclick="editAdmin(
'${admin.id}'
)">

Edit

</button>

<button
class="secondaryBtn"
onclick="toggleAdminStatus(
'${admin.id}'
)">

Toggle

</button>

<button
class="secondaryBtn"
onclick="deleteAdmin(
'${admin.id}'
)">

Delete

</button>

</td>

`;

tbody.appendChild(
row
);

});

}

/* =========================================================
ADD ADMIN
========================================================= */

window.addAdmin =
async function(){

try{

const name =

document.getElementById(
"adminName"
).value
.trim();

const email =

document.getElementById(
"adminEmail"
).value
.trim();

const role =

document.getElementById(
"adminRole"
).value;

const status =

document.getElementById(
"adminStatus"
).value;

if(!name || !email){

alert(
"Name & Email Required"
);

return;

}

await addDoc(

collection(
db,
ADMINS_COLLECTION
),

{

name,
email,
role,
status,

createdAt:
serverTimestamp()

}

);

await loadAdmins();

renderAdmins();

updateSettingsAnalytics();

clearAdminForm();

alert(
"Admin Added"
);

}catch(error){

console.error(
error
);

alert(
"Admin Add Failed"
);

}

};

/* =========================================================
CLEAR ADMIN FORM
========================================================= */

function clearAdminForm(){

document.getElementById(
"adminName"
).value = "";

document.getElementById(
"adminEmail"
).value = "";

document.getElementById(
"adminRole"
).value = "superAdmin";

document.getElementById(
"adminStatus"
).value = "active";

}

/* =========================================================
EDIT ADMIN
========================================================= */

window.editAdmin =
function(adminId){

const admin =

admins.find(
a=>a.id === adminId
);

if(!admin)
return;

document.getElementById(
"adminName"
).value =
admin.name || "";

document.getElementById(
"adminEmail"
).value =
admin.email || "";

document.getElementById(
"adminRole"
).value =
admin.role || "superAdmin";

document.getElementById(
"adminStatus"
).value =
admin.status || "active";

window.currentAdminId =
admin.id;

};

/* =========================================================
UPDATE ADMIN
========================================================= */

window.updateAdmin =
async function(){

try{

if(!window.currentAdminId)
return;

await setDoc(

doc(
db,
ADMINS_COLLECTION,
window.currentAdminId
),

{

name:

document.getElementById(
"adminName"
).value,

email:

document.getElementById(
"adminEmail"
).value,

role:

document.getElementById(
"adminRole"
).value,

status:

document.getElementById(
"adminStatus"
).value,

updatedAt:
serverTimestamp()

},

{

merge:true

}

);

await loadAdmins();

renderAdmins();

clearAdminForm();

alert(
"Admin Updated"
);

}catch(error){

console.error(
error
);

}

};

/* =========================================================
TOGGLE ADMIN STATUS
========================================================= */

window.toggleAdminStatus =
async function(adminId){

try{

const admin =

admins.find(
a=>a.id === adminId
);

if(!admin)
return;

const newStatus =

admin.status === "active"

?

"inactive"

:

"active";

await setDoc(

doc(
db,
ADMINS_COLLECTION,
adminId
),

{

status:newStatus,

updatedAt:
serverTimestamp()

},

{

merge:true

}

);

await loadAdmins();

renderAdmins();

}catch(error){

console.error(
error
);

}

};

/* =========================================================
DELETE ADMIN
========================================================= */

window.deleteAdmin =
async function(adminId){

try{

const confirmDelete =

confirm(
"Delete Admin?"
);

if(!confirmDelete)
return;

await setDoc(

doc(
db,
ADMINS_COLLECTION,
adminId
),

{

status:"deleted",

deletedAt:
serverTimestamp()

},

{

merge:true

}

);

await loadAdmins();

renderAdmins();

updateSettingsAnalytics();

alert(
"Admin Removed"
);

}catch(error){

console.error(
error
);

}

};/* =========================================================
SAVE ROLE PERMISSIONS
========================================================= */

async function saveRolePermissions(){

try{

const permissions = {

orders:

document.getElementById(
"permissionOrders"
).checked,

finance:

document.getElementById(
"permissionFinance"
).checked,

customers:

document.getElementById(
"permissionCustomers"
).checked,

drivers:

document.getElementById(
"permissionDrivers"
).checked,

partners:

document.getElementById(
"permissionPartners"
).checked,

settings:

document.getElementById(
"permissionSettings"
).checked

};

await setDoc(

doc(
db,
SETTINGS_COLLECTION,
"permissions"
),

permissions,

{

merge:true

}

);

console.log(
"Permissions Saved"
);

}catch(error){

console.error(
error
);

}

}

/* =========================================================
SAVE SECURITY SETTINGS
========================================================= */

async function saveSecuritySettings(){

try{

await setDoc(

doc(
db,
SETTINGS_COLLECTION,
"security"
),

{

twoFactorAuth:

document.getElementById(
"twoFactorAuth"
).checked,

adminProtection:

document.getElementById(
"adminProtection"
).checked,

ipRestriction:

document.getElementById(
"ipRestriction"
).checked,

sessionTimeout:Number(

document.getElementById(
"sessionTimeout"
).value || 60

),

maxLoginAttempts:Number(

document.getElementById(
"maxLoginAttempts"
).value || 5

),

updatedAt:
serverTimestamp()

},

{

merge:true

}

);

console.log(
"Security Saved"
);

}catch(error){

console.error(
error
);

}

}

/* =========================================================
SAVE NOTIFICATION SETTINGS
========================================================= */

async function saveNotificationSettings(){

try{

await setDoc(

doc(
db,
SETTINGS_COLLECTION,
"notifications"
),

{

pushNotifications:

document.getElementById(
"pushNotifications"
).checked,

smsNotifications:

document.getElementById(
"smsNotifications"
).checked,

emailNotifications:

document.getElementById(
"emailNotifications"
).checked,

orderAlerts:

document.getElementById(
"orderAlerts"
).checked,

updatedAt:
serverTimestamp()

},

{

merge:true

}

);

}catch(error){

console.error(
error
);

}

}

/* =========================================================
SAVE DELIVERY SETTINGS
========================================================= */

async function saveDeliverySettings(){

try{

await setDoc(

doc(
db,
SETTINGS_COLLECTION,
"delivery"
),

{

baseDeliveryCharge:Number(

document.getElementById(
"baseDeliveryCharge"
).value || 0

),

freeDeliveryThreshold:Number(

document.getElementById(
"freeDeliveryThreshold"
).value || 0

),

expressDeliveryCharge:Number(

document.getElementById(
"expressDeliveryCharge"
).value || 0

),

maxDeliveryRadius:Number(

document.getElementById(
"maxDeliveryRadius"
).value || 0

),

updatedAt:
serverTimestamp()

},

{

merge:true

}

);

}catch(error){

console.error(
error
);

}

}

/* =========================================================
SAVE BUSINESS SETTINGS
========================================================= */

async function saveBusinessSettings(){

try{

await setDoc(

doc(
db,
SETTINGS_COLLECTION,
"business"
),

{

companyName:

document.getElementById(
"companyName"
).value,

businessEmail:

document.getElementById(
"businessEmail"
).value,

gstNumber:

document.getElementById(
"gstNumber"
).value,

businessAddress:

document.getElementById(
"businessAddress"
).value,

updatedAt:
serverTimestamp()

},

{

merge:true

}

);

}catch(error){

console.error(
error
);

}

}

/* =========================================================
SAVE MAINTENANCE SETTINGS
========================================================= */

async function saveMaintenanceSettings(){

try{

await setDoc(

doc(
db,
SETTINGS_COLLECTION,
"maintenance"
),

{

maintenanceMode:

document.getElementById(
"maintenanceMode"
).checked,

allowRegistration:

document.getElementById(
"allowRegistration"
).checked,

allowPartners:

document.getElementById(
"allowPartners"
).checked,

allowDrivers:

document.getElementById(
"allowDrivers"
).checked,

updatedAt:
serverTimestamp()

},

{

merge:true

}

);

}catch(error){

console.error(
error
);

}

}

/* =========================================================
SAVE ALL SETTINGS
========================================================= */

const originalSaveSettings =
window.saveSettings;

window.saveSettings =
async function(){

await originalSaveSettings();

await saveRolePermissions();

await saveSecuritySettings();

await saveNotificationSettings();

await saveDeliverySettings();

await saveBusinessSettings();

await saveMaintenanceSettings();

alert(
"All Settings Saved Successfully"
);

};/* =========================================================
BACKUP COLLECTION
========================================================= */

const BACKUP_COLLECTION =
"backups";

/* =========================================================
CREATE BACKUP
========================================================= */

window.createBackup =
async function(){

try{

const backupData = {

settings:settingsData,

admins:admins,

createdAt:
serverTimestamp(),

createdBy:
"Super Admin"

};

await addDoc(

collection(
db,
BACKUP_COLLECTION
),

backupData

);

settingsData.backupCount =

(settingsData.backupCount || 0)

+ 1;

updateSettingsAnalytics();

alert(
"Backup Created Successfully"
);

}catch(error){

console.error(
error
);

alert(
"Backup Failed"
);

}

};

/* =========================================================
DOWNLOAD BACKUP
========================================================= */

window.downloadBackup =
function(){

try{

const backup = {

settings:settingsData,

admins:admins,

exportedAt:
new Date()

};

const blob =

new Blob(

[

JSON.stringify(
backup,
null,
2
)

],

{

type:"application/json"

}

);

const url =

URL.createObjectURL(
blob
);

const a =
document.createElement(
"a"
);

a.href = url;

a.download =
"quickpress-backup.json";

a.click();

URL.revokeObjectURL(
url
);

}catch(error){

console.error(
error
);

}

};

/* =========================================================
RESTORE BACKUP
========================================================= */

window.restoreBackup =
function(){

alert(
"Backup Restore Module Ready"
);

/*

Future:

Upload JSON

Restore Settings

Restore Admins

Restore Finance Config

Restore Permissions

*/

};

/* =========================================================
BACKUP HISTORY
========================================================= */

window.viewBackupHistory =
function(){

alert(
"Backup History Panel Coming Soon"
);

};

/* =========================================================
RESET DEFAULTS
========================================================= */

window.resetDefaults =
function(){

const confirmReset =

confirm(

"Reset All Settings To Default?"

);

if(!confirmReset)
return;

setValue(
"appName",
"QuickPress"
);

setValue(
"gstPercent",
18
);

setValue(
"platformCommission",
15
);

setValue(
"partnerCommission",
10
);

setValue(
"driverCommission",
5
);

setValue(
"baseDeliveryCharge",
49
);

setValue(
"freeDeliveryThreshold",
499
);

setValue(
"expressDeliveryCharge",
99
);

setValue(
"maxDeliveryRadius",
20
);

setChecked(
"pushNotifications",
true
);

setChecked(
"smsNotifications",
true
);

setChecked(
"emailNotifications",
true
);

setChecked(
"orderAlerts",
true
);

alert(
"Defaults Restored"
);

};

/* =========================================================
FIREBASE STATUS
========================================================= */

function updateFirebaseStatus(){

setText(
"firebaseStatus",
"Online"
);

setValue(
"firebaseDatabaseStatus",
"Connected"
);

setValue(
"firebaseAuthStatus",
"Active"
);

setValue(
"firebaseStorageStatus",
"Connected"
);

}

/* =========================================================
SYSTEM INFO
========================================================= */

function updateSystemInformation(){

const today =

new Date()

.toLocaleString(
"en-IN"
);

setValue(
"lastUpdated",
today
);

setValue(
"systemVersion",
"1.0.0"
);

}

/* =========================================================
PROJECT INFO
========================================================= */

function updateProjectInfo(){

try{

setValue(
"firebaseProjectId",
"quickpress-production"
);

}catch(error){

console.error(
error
);

}

}

/* =========================================================
SYSTEM HEALTH
========================================================= */

function updateSystemHealth(){

let score = 100;

if(!settingsData.appName)
score -= 5;

if(admins.length === 0)
score -= 10;

setText(
"securityScore",
score + "%"
);

}

/* =========================================================
REFRESH SETTINGS DASHBOARD
========================================================= */

function refreshSettingsDashboard(){

updateSettingsAnalytics();

updateFirebaseStatus();

updateSystemInformation();

updateProjectInfo();

updateSystemHealth();

renderAdmins();

console.log(
"Settings Dashboard Refreshed"
);

}/* =========================================================
LOAD ALL SETTINGS DATA
========================================================= */

async function loadAllSettingsData(){

try{

await Promise.all([

loadSettingsData(),
loadAdmins()

]);

console.log(
"Settings Data Loaded"
);

}catch(error){

console.error(
"Settings Load Error",
error
);

}

}

/* =========================================================
RELOAD SETTINGS
========================================================= */

window.loadSettings =
async function(){

try{

await loadAllSettingsData();

refreshSettingsDashboard();

alert(
"Settings Reloaded"
);

}catch(error){

console.error(
error
);

}

};

/* =========================================================
AUTO SAVE INDICATOR
========================================================= */

function initializeAutoSave(){

const fields =

document.querySelectorAll(

"input,select,textarea"

);

fields.forEach(field=>{

field.addEventListener(

"change",

()=>{

console.log(
"Setting Changed:",
field.id
);

}

);

});

}

/* =========================================================
AUTO REFRESH
========================================================= */

setInterval(

async ()=>{

await loadAllSettingsData();

refreshSettingsDashboard();

},

300000

);

/* =========================================================
KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(

"keydown",

e=>{

if(

e.ctrlKey

&&

e.key === "s"

){

e.preventDefault();

saveSettings();

}

}

);

/* =========================================================
SET DEFAULT VALUES
========================================================= */

function initializeDefaults(){

if(

!document.getElementById(
"appVersion"
).value

){

setValue(
"appVersion",
"1.0.0"
);

}

if(

!document.getElementById(
"gstPercent"
).value

){

setValue(
"gstPercent",
18
);

}

}

/* =========================================================
GLOBAL EXPORTS
========================================================= */

window.settingsApp = {

loadSettingsData,
loadAdmins,

saveSettings,
loadSettings,

addAdmin,
editAdmin,
updateAdmin,
deleteAdmin,

createBackup,
downloadBackup,
restoreBackup,
viewBackupHistory,

resetDefaults,

refreshSettingsDashboard

};

/* =========================================================
FINAL INITIALIZATION
========================================================= */

document.addEventListener(

"DOMContentLoaded",

async ()=>{

try{

console.log(
"QuickPress Settings Starting..."
);

await loadAllSettingsData();

initializeDefaults();

initializeAutoSave();

refreshSettingsDashboard();

console.log(
"QuickPress Settings Ready 🚀"
);

}catch(error){

console.error(

"Settings Initialization Error",

error

);

}

}

);

/* =========================================================
WINDOW READY
========================================================= */

window.addEventListener(

"load",

()=>{

console.log(
"Settings Module Loaded"
);

}

);

/* =========================================================
END OF FILE
QUICKPRESS SETTINGS PANEL
========================================================= */
