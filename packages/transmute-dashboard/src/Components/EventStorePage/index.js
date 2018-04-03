import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import Button from 'material-ui/Button';

import EventsTable from '../EventsTable';
import RecordEventDialog from '../RecordEventDialog';

let eventStoreArtifact = require('../../contracts/EventStore.json');
let transmuteConfig = require('../../transmute-config');

const {
  EventStore
} = require('transmute-eventstore/dist/transmute-eventstore.cjs');

class EventStorePage extends Component {
  state = {
    accounts: null,
    eventStore: null,
    events: []
  };

  loadAllEvents = async () => {
    const maybeAddress = window.location.pathname.split('/')[2];
    const accessToken = (await this.props.auth.getAccessToken()) || '';
    transmuteConfig.ipfsConfig.authorization = 'Bearer ' + accessToken;

    const eventStore = new EventStore({
      eventStoreArtifact,
      ...transmuteConfig
    });
    eventStore.eventStoreContractInstance = await eventStore.eventStoreContract.at(
      maybeAddress
    );

    let totalCount = (await eventStore.eventStoreContractInstance.count.call()).toNumber();

    const accounts = await eventStore.getWeb3Accounts();

    let events = [];
    if (totalCount) {
      events = await eventStore.getSlice(0, totalCount - 1);

      events = events.map(event => {
        return {
          ...event,
          id: event.index
        };
      });
    }

    this.setState({
      accounts,
      eventStore,
      events
    });
  };

  async componentWillMount() {
    await this.loadAllEvents();
  }

  onSaveEvent = async someEvent => {
    let parsedEvent = JSON.parse(someEvent);
    let { eventStore, accounts } = this.state;
    let result = await eventStore.write(
      accounts[0],
      parsedEvent.key,
      parsedEvent.value
    );
    await this.loadAllEvents();
  };

  render() {
    return (
      <div>
        <RecordEventDialog
          defaultEvent={this.props.defaultEvent}
          onSave={this.onSaveEvent}
        />
        <EventsTable events={this.state.events} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    defaultEvent: {
      index: '1',
      key: {
        type: 'patient',
        id: '0'
      },
      value: {
        type: 'USER_REGISTERED',
        username: 'bob@example.com'
      }
    }
  };
}

export default withAuth(
  connect(mapStateToProps, null)(EventStorePage)
);
