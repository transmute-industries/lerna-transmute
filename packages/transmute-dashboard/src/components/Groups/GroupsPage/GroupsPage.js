import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import { withStyles } from 'material-ui/styles';

import AppBar from '../../AppBar';
import GroupsTable from './GroupsTable';
import CreateGroupCard from './CreateGroupCard';

import { getGroups } from '../../../store/transmute/middleware';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  formControl: {
    minWidth: '600px'
  }
});

class GroupsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: null,
      error: null
    };
  }

  async componentWillMount() {
    if (!this.state.groups) {
      const groups = await getGroups(this.props.auth);
      this.setState({
        groups
      });
    }
  }

  render() {
    return (
      <AppBar>
        <CreateGroupCard />
        <GroupsTable groups={this.state.groups} />
      </AppBar>
    );
  }
}

export default withStyles(styles)(withAuth(GroupsPage));
