const Web3 = require('web3');
const TransmuteAdapterIPFS = require('@transmute/transmute-adapter-ipfs');
const EventStore = require('../index.js');
const transmuteConfig = require('../../transmute-config');
const abi = require('../../../build/contracts/EventStore.json');
const pack = require('../../../package.json');

const provider = new Web3.providers.HttpProvider(transmuteConfig.web3Config.providerUrl);
const web3 = new Web3(provider);
const adapter = new TransmuteAdapterIPFS(transmuteConfig.ipfsConfig);

describe('transmute-framework', () => {
  describe('constructor', () => {
    it('is safe', async () => {
      let eventStore;
      expect(() => {
        eventStore = new EventStore();
      }).toThrow();
      expect(() => {
        eventStore = new EventStore({});
      }).toThrow();

      eventStore = new EventStore({
        web3,
        abi,
        adapter,
      });
      expect(eventStore).toBeDefined();
    });

    it('sets version', async () => {
      const eventStore = new EventStore({
        web3,
        abi,
        adapter,
      });
      expect(eventStore.version).toBe(pack.version);
    });
  });

  describe('clone', () => {
    it('returns a new EventStore with a new contract instance.', async () => {
      const eventStore = new EventStore({
        web3,
        abi,
        adapter,
      });
      const accounts = await web3.eth.getAccounts();
      const newEventStore = await eventStore.clone(accounts[0]);
      expect(eventStore.eventStoreContract.address)
        .not.toBe(newEventStore.address);
    });
  });

  describe('healthy', () => {
    it('throws when not init', async () => {
      try {
        const eventStore = new EventStore({
          web3,
          abi,
          adapter,
        });
        await eventStore.healthy();
      } catch (e) {
        expect(e);
      }
    });
  });
});
