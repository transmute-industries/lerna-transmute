import React from 'react';

import { Route, Switch } from 'react-router-dom';

import {
  Security,
  SecureRoute,
  ImplicitCallback,
  Auth
} from '@okta/okta-react';

import { history } from '../../store';
import config from '../../okta_config';

import Home from '../Home';
import Demo from '../Demo';
import MetaMask from '../MetaMask';
import Register from '../Auth/Register';
import ProfilePage from '../Profile';
import RecoveryPage from '../Profile/RecoveryPage';
import DirectoryPage from '../DirectoryPage';
import DirectoryProfilePage from '../DirectoryPage/DirectoryProfilePage';
import MessagesPage from '../Messages';
import GroupsPage from '../Groups/GroupsPage';
import GroupPage from '../Groups/GroupPage';
import EventStoreFactoryPage from '../EventStoreFactoryPage';
import EventStorePage from '../EventStorePage';
import StreamModelPage from '../StreamModelPage';

import { ToastContainer } from 'react-toastify';

const auth = new Auth({
  issuer: config.issuer,
  client_id: config.client_id,
  redirect_uri: config.redirect_uri,
  history
});

class Routes extends React.Component {
  render() {
    return (
      <Security auth={auth}>
        <ToastContainer />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/demo" component={Demo} />
          <Route path="/metamask" component={MetaMask} />
          <Route
            path="/eventstorefactory/:address"
            exact
            component={EventStoreFactoryPage}
          />
          <Route
            path="/eventstore/:address/model"
            component={StreamModelPage}
          />
          <Route path="/eventstore/:address" exact component={EventStorePage} />
          
          <Route path="/register" exact render={() => <Register />} />
          <Route path="/implicit/callback" component={ImplicitCallback} />
          <SecureRoute
            path="/profile/recover"
            exact
            render={() => <RecoveryPage />}
          />
          <SecureRoute path="/profile" exact render={() => <ProfilePage />} />
          <SecureRoute
            path="/directory"
            exact
            render={() => <DirectoryPage />}
          />
          <SecureRoute
            path="/directory/:id"
            exact
            render={() => <DirectoryProfilePage />}
          />

          <SecureRoute path="/groups" exact render={() => <GroupsPage />} />
          <SecureRoute path="/groups/:id" exact render={() => <GroupPage />} />
          <SecureRoute path="/messages" exact render={() => <MessagesPage />} />
        </Switch>
      </Security>
    );
  }
}

export default Routes;
