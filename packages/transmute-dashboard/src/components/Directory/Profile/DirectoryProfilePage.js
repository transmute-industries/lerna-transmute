import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuth } from '@okta/okta-react';
import { withStyles } from 'material-ui/styles';

import AppBar from '../../AppBar';

import { getDirectoryProfile } from '../../../store/transmute/middleware';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  formControl: {
    minWidth: '600px'
  }
});

class DirectoryProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      error: null
    };
  }

  async componentWillMount() {
    const profile_id = window.location.href
      .split('directory/')[1]
      .split('?')[0];

    if (!this.state.profile) {
      const profile = await getDirectoryProfile(this.props.auth, profile_id);
      this.setState({
        profile
      });
    }
  }

  render() {
    // const { classes } = this.props;
    const { profile, error } = this.state;
    return (
      <AppBar>
        <h1>Profile</h1>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </AppBar>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // setUserProfile: async (auth, profile) => {
    //   dispatch(actions.setUserProfile(auth, profile));
    // },
    // getUser: async auth => {
    //   dispatch(actions.getUser(auth));
    // }
  };
};

export default withStyles(styles)(
  connect(null, mapDispatchToProps)(withAuth(DirectoryProfilePage))
);
