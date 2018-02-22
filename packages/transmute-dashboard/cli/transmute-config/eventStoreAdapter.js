const T = require('transmute-framework');

const bs58 = require('bs58');

const axios = require('axios');

let ipfsAdapter = require('transmute-adapter-ipfs');

const { ipfsConfig } = require('./ipfs');

const getEventStoreAdapterAsync = async () => {
  const ipfs = ipfsAdapter.getStorage({
    ...ipfsConfig
  });

  let response = await axios.get(
    `http://${ipfsConfig.host}:${ipfsConfig.port}/api/v0/id`
  );

  if (!response.data.ID) {
    throw new Error('cannot connect to ipfs');
  }

  const eventStoreAdapter = new T.EventStoreAdapter({
    I: {
      keyName: 'multihash',
      adapter: ipfsAdapter,
      db: ipfs,
      readIDFromBytes32: bytes32 => {
        return bs58.encode(new Buffer('1220' + bytes32.slice(2), 'hex'));
      },
      writeIDToBytes32: id => {
        return '0x' + new Buffer(bs58.decode(id).slice(2)).toString('hex');
      }
    }
  });
  return eventStoreAdapter;
};

module.exports = {
  getEventStoreAdapterAsync
};
