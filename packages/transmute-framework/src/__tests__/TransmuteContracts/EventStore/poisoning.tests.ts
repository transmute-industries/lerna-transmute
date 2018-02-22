import { getDefaultRelic } from '../../../__mocks__/getRelic'

import { W3 } from 'soltsice'
import {
  Relic,
  Utils,
  IFSA,
  EventTransformer,
  InternalEventTypes,
  EventStoreFactory,
  EventStore
} from '../../../transmute-framework'

import MarshalledEvents from '../../../__mocks__/MarshalledEvents'

const WRITE_EVENT_GAS_COST = 4000000

/**
 * EventStore spec
 */
describe('EventStore', () => {
  let relic: Relic
  let accounts: string[]
  let factory: EventStoreFactory
  let receipt: any
  let events: IFSA[]

  beforeAll(async () => {
    relic = await getDefaultRelic()
    accounts = await relic.getAccounts()
  })

  const getEventStore = async () => {
    let whitelist = accounts.slice(0, 3)
    factory = await EventStoreFactory.New(
      W3.TX.txParamsDefaultDeploy(accounts[0]),
      {
        _multisig: accounts[0]
      }
    )
    // create a new eventStore
    receipt = await factory.createEventStore(
      whitelist,
      W3.TX.txParamsDefaultDeploy(accounts[1])
    )
    events = EventTransformer.getFSAsFromReceipt(receipt)
    let factoryEvents = EventTransformer.filterEventsByMeta(
      events,
      'msgSender',
      accounts[1]
    )
    return EventStore.At(factoryEvents[0].payload.value)
  }

  describe('eventStore poisoning is not possible', async () => {
    it('the eventStore owner cannot write INTERNAL_EVENT_TYPES via the external writeEvent method', async () => {
      let eventStore = await getEventStore()

      let internalEventTypes: string[] = ((await eventStore.getInternalEventTypes()) as any).map(
        Utils.toAscii
      )

      expect(internalEventTypes).toEqual(InternalEventTypes.STORE)

      internalEventTypes.forEach(async internalEventType => {
        try {
          let event = MarshalledEvents[0]
          let receipt = await eventStore.writeEvent(
            internalEventType,
            event.keyType,
            event.valueType,
            event.key,
            event.value,
            W3.TX.txParamsDefaultDeploy(accounts[0], WRITE_EVENT_GAS_COST)
          )
        } catch (e) {
          expect(e.message).toBe(
            'VM Exception while processing transaction: revert'
          )
        }
      })
    })
  })
})
