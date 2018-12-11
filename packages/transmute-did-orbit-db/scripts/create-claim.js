const fs = require("fs");
const path = require("path");
const {TransmuteDIDWallet} = require("@transmute/transmute-did");

const {
  createOrbitDIDFromWallet,
  createOrbitDIDClaimFromWallet,
  orbitDIDClaimResolver
} = require("./utils/orbitHelpers");

(async () => {
  try {
    // console.log("creating orbit db did...", ipfsOptions);
    const wallet = new TransmuteDIDWallet(
      JSON.parse(
        fs
          .readFileSync(path.resolve(__dirname, "../wallet/ciphertext.json"))
          .toString()
      )
    );

    if (!process.argv[2]) {
      throw new Error("You must supply a password for your openpgp key.");
    }

    const password = process.argv[2];

    await wallet.decrypt(password);

    const { did_document } = await createOrbitDIDFromWallet(wallet, password);

    // todo: parse from command line arg
    const claim = {
      //   eslint-disable-next-line
      subject: did_document.id,
      claims: {
        isTruckDriver: true,
        isInvestor: true,
        isDoctor: false
      }
    };

    const openPGPKID = Object.keys(wallet.data.keystore)[0];

    const { claimID } = await createOrbitDIDClaimFromWallet({
      did: did_document.id,
      kid: openPGPKID,
      claim,
      wallet,
      password
    });

    console.log("\n🔗 Created, Uploaded, Resolved and Verified Claim");

    const resolvedClaim = await orbitDIDClaimResolver(claimID)

    fs.writeFileSync(
      path.resolve(__dirname, "../src/data/did_claim.json"),
      JSON.stringify(
        {
          claimID,
          resolvedClaim
        },
        null,
        2
      )
    );
  } catch (e) {
    console.error(e);
  }
})();
