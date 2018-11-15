const fs = require("fs");
const path = require("path");
const transmuteDID = require("@transmute/transmute-did");

const { ipfsOptions } = require("../src/constants");

const {
  getOrbitDBFromKeypair,
  orbitdbAddressToDID,
  orbitDBDIDToOrbitDBAddress
} = require("./orbitHelpers");

(async () => {
  // console.log("creating orbit db did...", ipfsOptions);
  const wallet = new transmuteDID.wallet.TransmuteDIDWallet(
    JSON.parse(
      fs
        .readFileSync(path.resolve(__dirname, "../wallet/ciphertext.json"))
        .toString()
    )
  );

  const password = "password123";

  await wallet.decrypt(password);

  const openPGPKID = Object.keys(wallet.data.keystore)[0];

  const orbitKID = Object.keys(wallet.data.keystore)[1];

  // here we need to ensure that the did is generated correctly, 
  // so that kid's for signatures will resolve...
  const { object, signature, meta } = await wallet.toDIDDocument(
    openPGPKID,
    "yolo"
  );

  const orbitKeypair = wallet.data.keystore[orbitKID].data;
  const orbitdb = await getOrbitDBFromKeypair(ipfsOptions, orbitKeypair);

  const db = await orbitdb.docs(object.id, {
    write: [
      // Give access to our did wallet private key
      orbitdb.key.getPublic("hex")
    ]
  });

  const address = db.address.toString();
  // console.log("DID Document Store: ", address);

  const orbitDID = orbitdbAddressToDID(address);

  console.log("\nOrbit DID: ", orbitDID);

  const orbitDBAddress = orbitDBDIDToOrbitDBAddress(orbitDID);

  console.log("\nOrbit Address: ", orbitDBAddress);

  // object, signature, meta (instead)
  const hash = await db.put({
    _id: object.id,
    object,
    signature,
    meta
  });

  fs.writeFileSync(
    path.resolve(__dirname, "../src/orbitdb.transmute.openpgp.did.json"),
    JSON.stringify(
      {
        orbitDID,
        doc: {
          _id: object.id,
          object,
          signature,
          meta
        },
        hash
      },
      null,
      2
    )
  );
})();
