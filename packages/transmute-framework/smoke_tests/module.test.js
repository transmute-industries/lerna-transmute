const TransmuteEventStore = require('../src/event-store');
const transmuteConfig = require('../src/transmute-config');
const eventStoreArtifact = require('../build/contracts/EventStore.json');

const eventStore = new TransmuteEventStore({
  eventStoreArtifact,
  ...transmuteConfig
});

console.log('EventStore version: ', eventStore.version);

(async () => {
  await eventStore.init();
  const info = await eventStore.healthy();
  console.log('EventStore Health: ');
  console.log(JSON.stringify(info, null, 2));
  process.exit(0);
})();
