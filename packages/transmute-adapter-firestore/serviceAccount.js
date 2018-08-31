let serviceAccount;

try {
  serviceAccount = require("./transmute-id-staging-firebase-adminsdk-uasd0-9ce3fa01fc.json");
  // console.log(JSON.stringify(serviceAccount));
} catch (e) {
  let serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  serviceAccount = JSON.parse(serviceAccountEnv);
}

if (!serviceAccount) {
  throw new Error(
    "No service account available. Set FIREBASE_SERVICE_ACCOUNT or confirm json path."
  );
}

module.exports = serviceAccount;
