const _ = require('lodash');
const moment = require('moment');

const pack = require('../../../package.json');

const didLib = require('../did');
const sodiumExtensions = require('../cryptoSuites/sodiumExtensions');

const {
  createSignedLinkedData,
  verifySignedLinkedData,
  signObjectWithKeypair,
} = require('./signatureMethods');

const { constructDIDPublicKeyID, publicKeyKIDPrefix, verifyDIDSignatureWithResolver } = didLib;

//   eslint-disable-next-line
const { sha3_256 } = require('js-sha3');

const constructPublicKeysProperty = (did, keystore) => {
  const allPublicKeys = _.values(keystore);
  const onlyPublicKeys = _.filter(
    allPublicKeys,
    key => key.meta && key.meta.did && key.meta.did.publicKey,
  );
  return onlyPublicKeys.map(key => ({
    id: constructDIDPublicKeyID(did, key.kid),
    type: key.meta.did.signatureType,
    owner: did,
    revocations: key.meta.did.revocations,
    [key.meta.did.publicKeyType]: key.data.publicKey,
  }));
};

const constructAuthenticationProperty = (did, keystore) => {
  const allPublicKeys = _.values(keystore);
  const onlyAuthentricationKeys = _.filter(
    allPublicKeys,
    key => key.meta && key.meta.did && key.meta.did.authentication,
  );
  return onlyAuthentricationKeys.map(key => ({
    publicKey: constructDIDPublicKeyID(did, key.kid),
    type: key.meta.did.signatureType,
  }));
};

class TransmuteDIDWallet {
  constructor(walletData) {
    this.data = walletData;
    this.didCache = {};
    this.resolver = {
      resolve: did => Promise.resolve(this.didCache[did]),
    };
  }

  async addKey(data, type, meta) {
    let kid;
    const { keystore } = this.data;
    switch (type) {
      case 'symmetric':
      case 'shamir-share':
        kid = sha3_256(data);
        break;
      case 'assymetric':
        kid = sha3_256(data.publicKey);
        break;
      default:
        throw new Error('Unknown key type.');
    }
    keystore[kid] = {
      kid,
      data,
      type,
      meta,
    };
  }

  async encrypt(passphrase) {
    this.data = {
      ...this.data,
      keystore: await sodiumExtensions.encryptJson({
        data: this.data.keystore,
        key: await sodiumExtensions.generateSymmetricKeyFromPasswordAndSalt({
          password: passphrase,
          salt: this.data.salt,
        }),
      }),
    };
  }

  async decrypt(passphrase) {
    this.data = {
      ...this.data,
      keystore: await sodiumExtensions.decryptJson({
        data: this.data.keystore,
        key: await sodiumExtensions.generateSymmetricKeyFromPasswordAndSalt({
          password: passphrase,
          salt: this.data.salt,
        }),
      }),
    };
  }

  async generateDIDRevocationCertificate({ did, proofSet }) {
    return this.createSignedLinkedData({
      data: {
        did,
        message: `This signed json object serves as a revocation certificate for ${did}. See https://docs.transmute.industries/did/revocation for more information.`,
      },
      proofSet,
    });
  }

  async signObject({ obj, kid, password }) {
    const justTheHash = kid.split(`#${publicKeyKIDPrefix}`)[1];

    if (justTheHash === undefined) {
      throw new Error(`kid must be of the format: did#${publicKeyKIDPrefix}...`);
    }

    const keypair = this.data.keystore[justTheHash];

    if (!keypair) {
      throw new Error(justTheHash);
    }
    return signObjectWithKeypair({
      keypair,
      obj,
      kid,
      password,
    });
  }

  async createSignedLinkedData({ data, proofSet, proofChain }) {
    return createSignedLinkedData({
      data,
      proofSet,
      proofChain,
      signObject: this.signObject.bind(this),
    });
  }

  async verifySignedLinkedData({ signedLinkedData }) {
    return verifySignedLinkedData({
      signedLinkedData,
      verifyDIDSignatureWithResolver,
      resolver: this.resolver,
    });
  }

  async toDIDDocument({ did, proofSet, cacheLocal }) {
    if (!proofSet) {
      throw new Error('A proofSet is required.');
    }

    const publicKey = await constructPublicKeysProperty(did, this.data.keystore);
    const authentication = await constructAuthenticationProperty(did, this.data.keystore);

    const doc = {
      '@context': 'https://w3id.org/did/v1',
      id: did,
      publicKey,
      authentication,
    };

    const didDocument = await this.createSignedLinkedData({
      data: doc,
      proofSet,
    });

    if (cacheLocal) {
      this.didCache[didDocument.id] = didDocument;
    }

    return didDocument;
  }
}

const createWallet = async () => new TransmuteDIDWallet({
  version: pack.version,
  salt: await sodiumExtensions.generateSalt(),
  keystore: {},
});

module.exports = {
  TransmuteDIDWallet,
  createWallet,
  constructDIDPublicKeyID,
};
