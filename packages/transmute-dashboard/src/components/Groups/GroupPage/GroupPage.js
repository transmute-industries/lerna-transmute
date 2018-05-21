import React, { Component } from 'react';
import _ from 'lodash';
import { withAuth } from '@okta/okta-react';
import { withStyles } from 'material-ui/styles';

import AppBar from '../../AppBar';
import GroupTable from './GroupTable';

import { getGroup, getGroupMembers } from '../../../store/transmute/middleware';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  formControl: {
    minWidth: '600px'
  }
});

class GroupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: null,
      error: null
    };
  }

  async componentWillMount() {
    const group_id = window.location.href
      .split('groups/')[1]
      .split('?')[0];

    if (!this.state.group) {
      let { data } = await getGroup(this.props.auth, group_id);
      let group = data;
      const members = await getGroupMembers(this.props.auth, group_id);
      // TODO: Update API to return the data (and as an array)
      group.members = _.values(members.data);
      this.setState({
        group: group
      });
    }
  }

  render() {
    return (
      <AppBar>
        { this.state.group && <GroupTable group={this.state.group} /> }
      </AppBar>
    );
  }
}

export default withStyles(styles)(withAuth(GroupPage));