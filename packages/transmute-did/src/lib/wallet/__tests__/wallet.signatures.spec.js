const fs = require('fs');
const path = require('path');
const didWallet = require('../index');

const fullWalletPath = path.resolve(__dirname, '__fixtures__/wallet.plaintext.full.json');

const openpgpDIDDocPath = path.resolve(__dirname, '__fixtures__/openpgp.did.document.json');

const openPGPSignaturePath = path.resolve(__dirname, '__fixtures__/wallet.signature.json');

const walletOpenPGPSignaturePath = path.resolve(
  __dirname,
  '__fixtures__/wallet.did.openpgp.signature.json',
);

const walletLibSodiumSignaturePath = path.resolve(
  __dirname,
  '__fixtures__/wallet.did.sodium.signature.json',
);
const walletEllipticSignaturePath = path.resolve(
  __dirname,
  '__fixtures__/wallet.did.orbitdb.signature.json',
);

const openPGPKID = '2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178';
const libsodiumKID = 'c541a06014170f7e85383f13e95f2bf45da28473daa241fc2f21b16461efdec2';
const orbitDBKID = '5c51560bcef78d176b726a00b27ad3ef533ae39ef3d0f514392c79988c40d220';

const passphrase = 'yolo';

describe('did-wallet', () => {
  let wallet;
  let doc;
  let signature;
  beforeAll(async () => {
    wallet = new didWallet.TransmuteDIDWallet(
      JSON.parse(fs.readFileSync(fullWalletPath).toString()),
    );
    const result = await wallet.toDIDDocument(openPGPKID, passphrase);
    //   eslint-disable-next-line
    doc = result.doc;
    //   eslint-disable-next-line
    signature = result.signature;
  });
  describe('toDIDDocument', () => {
    it('supports exporting a did document for an openpgp keypair', async () => {
      // todo: call validation on document....
      expect(doc).toBeDefined();
      // todo: verify document signature
      expect(signature).toBeDefined();

      fs.writeFileSync(openpgpDIDDocPath, JSON.stringify(doc, null, 2));
      fs.writeFileSync(`${openpgpDIDDocPath}.signature`, signature);
    });

    it('supports signing object by kid', async () => {
      // https://www.w3.org/TR/verifiable-claims-data-model/
      //   eslint-disable-next-line
      const claim = {
        //   eslint-disable-next-line
        subject: doc.id,
        claims: {
          isTruckDriver: true,
          isInvestor: true,
          isDoctor: false,
        },
      };
      //   eslint-disable-next-line
      const { object, signature, meta } = await wallet.signObject({
        obj: claim,
        kid: libsodiumKID,
      });

      expect(object).toBeDefined();
      expect(signature).toBeDefined();
      expect(meta).toBeDefined();

      fs.writeFileSync(
        `${openPGPSignaturePath}`,
        JSON.stringify({ object, signature, meta }, null, 2),
      );
    });

    // ensure that the signature will be traceable to a did
    it('supports signing object by openpgp kid as did owner', async () => {
      // https://www.w3.org/TR/verifiable-claims-data-model/
      //   eslint-disable-next-line
      const claim = {
        //   eslint-disable-next-line
        subject: doc.id,
        claims: {
          isTruckDriver: true,
          isInvestor: true,
          isDoctor: false,
        },
      };
      //   eslint-disable-next-line
      const { object, signature, meta } = await wallet.signObject({
        obj: claim,
        kid: openPGPKID,
        passphrase: passphrase,
        asDIDByKID: openPGPKID,
        asDIDByKIDPassphrase: passphrase,
      });

      expect(object).toBeDefined();
      expect(signature).toBeDefined();
      expect(meta).toBeDefined();

      fs.writeFileSync(
        `${walletOpenPGPSignaturePath}`,
        JSON.stringify({ object, signature, meta }, null, 2),
      );
    });

    // ensure that the signature will be traceable to a did
    it('supports signing object by libsodium kid as did owner', async () => {
      // https://www.w3.org/TR/verifiable-claims-data-model/
      //   eslint-disable-next-line
      const claim = {
        //   eslint-disable-next-line
        subject: doc.id,
        claims: {
          isTruckDriver: true,
          isInvestor: true,
          isDoctor: false,
        },
      };
      //   eslint-disable-next-line
      const { object, signature, meta } = await wallet.signObject({
        obj: claim,
        kid: libsodiumKID,
        asDIDByKID: openPGPKID,
        asDIDByKIDPassphrase: passphrase,
      });

      expect(object).toBeDefined();
      expect(signature).toBeDefined();
      expect(meta).toBeDefined();

      fs.writeFileSync(
        `${walletLibSodiumSignaturePath}`,
        JSON.stringify({ object, signature, meta }, null, 2),
      );
    });

    it('supports signing object by orbit db kid as did owner', async () => {
      // https://www.w3.org/TR/verifiable-claims-data-model/
      //   eslint-disable-next-line
      const claim = {
        //   eslint-disable-next-line
        subject: doc.id,
        claims: {
          isTruckDriver: true,
          isInvestor: true,
          isDoctor: false,
        },
      };
      //   eslint-disable-next-line
      const { object, signature, meta } = await wallet.signObject({
        obj: claim,
        kid: orbitDBKID,
        asDIDByKID: openPGPKID,
        asDIDByKIDPassphrase: passphrase,
      });

      expect(object).toBeDefined();
      expect(signature).toBeDefined();
      expect(meta).toBeDefined();

      fs.writeFileSync(
        `${walletEllipticSignaturePath}`,
        JSON.stringify({ object, signature, meta }, null, 2),
      );
    });
  });
});
