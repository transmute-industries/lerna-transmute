const ethereumExtensions = require('../index');

const MNEUMONIC = 'foam increase tongue purity lady deposit obtain excuse vintage hazard cancel unable';

const KEYPAIR = {
  publicKey:
    'a3a757304f5ca97101385a630a5334d2594016cf408645c592ad265c084a197d1b79d9b10dd918ae565f16db67535e26a7c687285ce38d713c45aa930cea3931',
  privateKey: 'dc3c988f747197e3b967933b52bf30f4e4a04821fdae726c00877180325cf770',
};

const KEYPAIR2 = {
  publicKey:
    '53a2ca1f749f039b3f791e44249035d0fa9c59299f038d34854987c801ca9fb7e79aba2f89b6e860c129624870cae650dcb8160f3bf483ff0b70c0856a4e4a99',
  privateKey: '286cef7c99a2ea1aca0dac8a3e8813da333516c83f226d1c3bae4bf6e6df8af2',
};

const ADDRESS = '0x0Ff5c616a5bEDA3353616E2aA36c136803fBd165';

describe('ethereumExtensions', () => {
  describe('generateBIP39Mnemonic', () => {
    it('should generate a mnemonic', async () => {
      expect.assertions(1);
      const mnemonic = await ethereumExtensions.generateBIP39Mnemonic();
      expect(mnemonic).toBeDefined();
    });
  });

  describe('mnemonicToKeypair', () => {
    it('should get a keypair from mnemonic and path', async () => {
      expect.assertions(2);
      const hdPath = "m/44'/60'/0'/0/0";
      const keypair = await ethereumExtensions.mnemonicToKeypair(MNEUMONIC, hdPath);
      expect(keypair.publicKey).toBe(KEYPAIR.publicKey);
      expect(keypair.privateKey).toBe(KEYPAIR.privateKey);
    });

    it('should get a keypair from mnemonic and different path', async () => {
      expect.assertions(2);
      const hdPath = "m/44'/60'/0'/0/1";
      const keypair = await ethereumExtensions.mnemonicToKeypair(MNEUMONIC, hdPath);
      expect(keypair.publicKey).toBe(KEYPAIR2.publicKey);
      expect(keypair.privateKey).toBe(KEYPAIR2.privateKey);
    });
  });

  describe('publicKeyToAddress', () => {
    it('should get an ethereum address from a public key', async () => {
      expect.assertions(1);
      const address = await ethereumExtensions.publicKeyToAddress(KEYPAIR.publicKey);
      expect(address).toBe(ADDRESS);
    });
  });

  describe('sign / verify', () => {
    const message = 'test message';
    const wrongMessage = 'wrong message';
    let signature;
    let ethereumKeyPair;

    beforeAll(async () => {
      const mnemonic = ethereumExtensions.generateBIP39Mnemonic();
      ethereumKeyPair = await ethereumExtensions.mnemonicToKeypair(mnemonic, "m/44'/60'/0'/0/0");
    });

    describe('sign', () => {
      it('should return a signature', async () => {
        signature = await ethereumExtensions.sign(message, ethereumKeyPair.privateKey);
        expect(signature).toBeDefined();
        expect(signature.r).toBeDefined();
        expect(signature.s).toBeDefined();
        expect(signature.v).toBeDefined();
      });
    });

    describe('verify', () => {
      it('should verify the signature', async () => {
        const verified = await ethereumExtensions.verify(signature, message, ethereumKeyPair.publicKey);
        expect(verified).toBeTruthy();
      });

      it('should not verify if the signature is wrong', async () => {
        const wrongSignature = await ethereumExtensions.sign(wrongMessage, ethereumKeyPair.privateKey);
        const verified = await ethereumExtensions.verify(wrongSignature, message, ethereumKeyPair.publicKey);
        expect(verified).not.toBeTruthy();
      });

      it('should not verify if the message is wrong', async () => {
        const verified = await ethereumExtensions.verify(signature, wrongMessage, ethereumKeyPair.publicKey);
        expect(verified).not.toBeTruthy();
      });
    });
  });
});
