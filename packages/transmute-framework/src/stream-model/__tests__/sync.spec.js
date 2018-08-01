const { EventStore } = require('../../index');
const transmuteConfig = require('../../transmute-config');
const eventStoreArtifact = require('../../../build/contracts/EventStore.json');

const StreamModel = require('../index');

const mockEvents = require('../../__mock__/events.json');

describe('sync', () => {
  let accounts;
  let eventStore;

  beforeAll(async () => {
    eventStore = new EventStore({
      eventStoreArtifact,
      ...transmuteConfig
    });
    await eventStore.init();
    accounts = await eventStore.getWeb3Accounts();
  });

  // new event store per test
  beforeEach(async () => {
    eventStore = await eventStore.clone(accounts[0]);
  });

  it('handles the empty case', async () => {
    let newEventStore = await eventStore.clone(accounts[0]);
    const filter = event => {
      return true;
    };
    const reducer = (state, event) => {
      return state;
    };
    const streamModel = new StreamModel(newEventStore, filter, reducer);
    await streamModel.sync();
    expect(streamModel.state.lastIndex).toBe(null);
  });

  it('handles new events', async () => {
    let newEventStore = await eventStore.clone(accounts[0]);
    const filter = event => {
      return true;
    };
    const reducer = (state, event) => {
      return {
        ...state,
        eventsProcessed: (state.eventsProcessed | 0) + 1
      };
    };
    const streamModel = new StreamModel(newEventStore, filter, reducer);
    await newEventStore.write(
      accounts[0],
      mockEvents[0].key,
      mockEvents[0].value
    );
    await streamModel.sync();
    expect(streamModel.state.model.eventsProcessed).toBe(1);
  });

  it('handles persisted state', async () => {
    let newEventStore = await eventStore.clone(accounts[0]);
    const filter = event => {
      return true;
    };
    const reducer = (state, event) => {
      let eventHash = newEventStore.web3.sha3(JSON.stringify(event));
      const eventHashes = new Set(state.eventHashes || []);
      eventHashes.add(eventHash);
      return {
        ...state,
        eventHashes: Array.from(eventHashes)
      };
    };
    const streamModel = new StreamModel(newEventStore, filter, reducer);
    await newEventStore.write(
      accounts[0],
      mockEvents[0].key,
      mockEvents[0].value
    );
    await streamModel.sync();
    expect(streamModel.state.lastIndex).toBe(0);

    await newEventStore.write(
      accounts[0],
      mockEvents[1].key,
      mockEvents[1].value
    );

    // console.log(JSON.stringify(streamModel.state, null, 2));

    const streamModel2 = new StreamModel(
      newEventStore,
      filter,
      reducer,
      streamModel.state
    );

    await streamModel2.sync();
    expect(streamModel2.state.lastIndex).toBe(1);
    // console.log(JSON.stringify(streamModel2.state, null, 2));
  });

  it('calling sync repeatedly returns the same state', async () => {
    let newEventStore = await eventStore.clone(accounts[0]);
    const filter = event => {
      return true;
    };
    const reducer = (state, event) => {
      return {
        ...state,
        eventsProcessed: (state.eventsProcessed | 0) + 1
      };
    };
    const streamModel = new StreamModel(newEventStore, filter, reducer);
    await newEventStore.write(
      accounts[0],
      mockEvents[0].key,
      mockEvents[0].value
    );
    await streamModel.sync();
    await streamModel.sync();
    await streamModel.sync();
    await streamModel.sync();
    expect(streamModel.state.model.eventsProcessed).toBe(1)
  });
});
