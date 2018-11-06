const misc = require('../index');
const openpgpExtensions = require('../../openpgpExtensions');
const msg = require('../../msg');

const key = '606be053abf0ca332dd76cb76fc8dee21e0874e0a55877d1c0e91382b286ee4c';

const shares = [
  '80157b05ca9edcc16c089ebb36c5ab9b63a84f495e716b23e04ff993ab0813fdfcb6743ab939ce638a6a2e82fd35c33caf8',
  '802b468204d5795c89c8f4d84917a768971dfbd9e09278ab0254a03879f3cb54019f1a96a7cc6f51828253f8b92b5abf664',
  '803e3d87ce4ba59de5c06a637fd20cf3f4a3b22ebbd9ac84412984dd198d242413088e2b50fff4b575f473eb7c35b1ed2d0',
  '8041d841a92d4773a2139b8ce06eb88c8f9b629765b25db38e2bc5fa67fbb30b597a98b863027084a62932f995083a98375',
  '8054a34463b39bb2ce1b0537d6ab1317ec252b603ef9899ccd56e11f07855c7b4bed0c059431eb60515f12ea5016d1ca7c1',
];

describe('misc', () => {
  describe('shatterKey', () => {
    it('should breakup a key in shares', async () => {
      expect.assertions(1);
      const shares = await misc.shatterKey({
        key,
        shareNumber: 5,
        shareThreshold: 3,
      });
      expect(shares.length).toBe(5);
    });
  });

  describe('recoverKey', () => {
    it('should recover a key from shares', async () => {
      expect.assertions(1);
      const recoveredKey = await misc.recoverKey({
        shares: shares.splice(0, 3),
      });
      expect(recoveredKey).toBe(key);
    });

    it('should fail to recover a key from incorrect number of shares', async () => {
      expect.assertions(1);
      const recoveredKey = await misc.recoverKey({
        shares: shares.splice(0, 2),
      });
      expect(recoveredKey !== key).toBe(true);
    });
  });

  describe('publicKeysToDIDDocument', () => {
    let didDocument;
    let primaryPublicKey;

    beforeAll(async () => {
      const pgpKeypair = await openpgpExtensions.cryptoHelpers.generateArmoredKeypair({
        name: 'bob',
        passphrase: 'yolo',
      });
      const libSodiumSigningKeypair = await msg.generateCryptoSignKeypair();
      const libSodiumEncryptionKeypair = await msg.generateCryptoBoxKeypair();
      primaryPublicKey = libSodiumSigningKeypair.publicKey;
      const didDocumentArgs = {
        primaryPublicKey,
        pgpPublicKey: pgpKeypair.publicKey,
        libSodiumPublicSigningKey: libSodiumSigningKeypair.publicKey,
        libSodiumPublicEncryptionKey: libSodiumEncryptionKeypair.publicKey,
      };

      didDocument = await misc.publicKeysToDIDDocument(didDocumentArgs);
    });

    it('should generate a DID Document from public keys', async () => {
      expect.assertions(1);
      expect(didDocument).toBeDefined();
    });

    // For reference: https://w3c-ccg.github.io/did-spec/#did-documents
    describe('W3C v1 compliance', () => {
      const isValidDID = (did) => {
        const didRegex = /^did:tst:.+/;
        return didRegex.test(did);
      };

      describe('DID context', () => {
        it('should be equal to the w3id URL', () => {
          const didContext = didDocument['@context'];
          expect(didContext).toBe('https://w3id.org/did/v1');
        });
      });

      describe('DID subject', () => {
        let didSubject;

        beforeAll(async () => {
          didSubject = didDocument.id;
        });

        it('should be a valid did scheme', () => {
          expect(isValidDID(didSubject)).toBeTruthy();
        });

        it('should be equal to the DID used to register the DID document', async () => {
          const registeredDid = misc.publicKeyToTransmuteDID({
            publicKey: primaryPublicKey,
          });
          expect(didSubject).toBe(registeredDid);
        });
      });

      describe('Public Keys', () => {
        // The following two arrays of valid keys are based on this registry
        // https://w3c-ccg.github.io/ld-cryptosuite-registry/#the-registry

        // W3C's specs are vague on what constitutes a valid property value
        // an issue has been raised https://github.com/w3c-ccg/did-spec/issues/105
        const validValues = ['publicKeyBase58', 'publicKeyPem', 'publicKeyHex'];

        const validTypes = [
          'Ed25519VerificationKey2018',
          'RsaVerificationKey2018',
          // This format looks invalid. See
          // https://github.com/w3c-ccg/ld-cryptosuite-registry/issues/8
          // https://github.com/w3c-ccg/ld-cryptosuite-registry/pull/7
          'EdDsaSAPublicKeySecp256k1',
          // This last one is not in the registry but is used by Uport and Bitcoin
          // https://github.com/uport-project/ethr-did
          'Secp256k1VerificationKey2018',
        ];

        let publicKeys;

        beforeAll(async () => {
          publicKeys = didDocument.publicKey;
        });

        it('should be an array of public keys', () => {
          expect(Array.isArray(publicKeys)).toBeTruthy();
        });

        describe('Each public key', () => {
          it('should have an owner', () => {
            publicKeys.forEach((publicKey) => {
              const { owner } = publicKey;
              expect(owner).toBeDefined();
              expect(isValidDID(owner)).toBeTruthy();
            });
          });

          it('should have a valid id', () => {
            publicKeys.forEach((publicKey) => {
              const { id } = publicKey;
              expect(id).toBeDefined();
              expect(isValidDID(id)).toBeTruthy();
            });
          });

          it('should contain a valid type', () => {
            publicKeys.forEach((publicKey) => {
              const { type } = publicKey;
              expect(type).toBeDefined();
              expect(validTypes).toContain(type);
            });
          });

          it('should contain only one valid value', () => {
            publicKeys.forEach((publicKey) => {
              const valueProperties = Object.keys(publicKey).filter(key => validValues.includes(key));
              expect(valueProperties.length).toBe(1);
            });
          });
        });
      });

      describe('Authentication', () => {
        let authentications;

        beforeAll(async () => {
          authentications = didDocument.authentication;
        });

        it('should be an array of proof mechanisms', () => {
          expect(Array.isArray(authentications)).toBeTruthy();
        });

        describe('Each proof mechanism', () => {
          it('should include a type property', () => {
            authentications.forEach((proofMechanism) => {
              const { type } = proofMechanism;
              expect(type).toBeDefined();
            });
          });
        });
      });
      // Optionnally, the DID document can include other fields
      // https://w3c-ccg.github.io/did-spec/#authorization-and-delegation
      // https://w3c-ccg.github.io/did-spec/#service-endpoints
      // https://w3c-ccg.github.io/did-spec/#created-optional
      // https://w3c-ccg.github.io/did-spec/#updated-optional
      // https://w3c-ccg.github.io/did-spec/#proof-optional
    });
  });

  describe('keypairsToTransmuteCiphertextDIDWallet', () => {
    it('should generate a DID Wallet from keys', async () => {
      expect.assertions(2);
      const pgpKeypair = await openpgpExtensions.cryptoHelpers.generateArmoredKeypair({
        name: 'bob',
        passphrase: 'yolo',
      });
      const libSodiumSigningKeypair = await msg.generateCryptoSignKeypair();
      const libSodiumEncryptionKeypair = await msg.generateCryptoBoxKeypair();

      const cipherTextWallet = await misc.keypairsToTransmuteCiphertextDIDWallet({
        primaryKeypair: libSodiumSigningKeypair,
        pgpKeypair,
        libSodiumSigningKeypair,
        libSodiumEncryptionKeypair,
        password: 'yolo',
      });

      expect(cipherTextWallet.salt).toBeDefined();
      expect(cipherTextWallet.wallet).toBeDefined();
    });
  });
});
