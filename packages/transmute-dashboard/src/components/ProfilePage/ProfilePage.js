import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuth } from '@okta/okta-react';

import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

import AppBar from '../AppBar';
import { getUser, setUserProfile } from '../../store/user/middleware';
import * as actions from '../../store/user/actions';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  formControl: {
    minWidth: '600px'
  }
});

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      error: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    let response = await setUserProfile(this.props.auth, this.state.profile);
    if (response.data.error) {
      this.setState({
        error: response.data.error
      });
    } else {
      this.setState({
        error: null,
        profile: response.data.profile
      });
    }
  }

  handleChange = name => event => {
    this.setState({
      profile: { ...this.state.profile, [name]: event.target.value }
    });
  };

  async componentWillMount() {
    if (!this.state.profile) {
      let response = await getUser(this.props.auth);
      let profile = response.data.profile;
      this.setState({
        profile
      });
    }
  }
  
  render() {
    if (!this.state.profile) return null;
    
    const { classes } = this.props;
    const { profile, error } = this.state;

    return (
      <AppBar>
        <h1>Profile</h1>
        <div>

          <Grid item md={12}>
            <FormControl className={classNames(classes.margin, classes.formControl)}>
              <InputLabel>First Name</InputLabel>
              <Input
                className={classNames(classes.textInput)}
                id="first-name"
                type="text"
                value={profile.firstName}
                onChange={this.handleChange('firstName')}
              />
            </FormControl>
          </Grid>

          <Grid item md={12}>
            <FormControl className={classNames(classes.margin, classes.formControl)}>
              <InputLabel>Last Name</InputLabel>
              <Input
                className={classNames(classes.textInput)}
                id="last-name"
                type="text"
                value={profile.lastName}
                onChange={this.handleChange('lastName')}
              />
            </FormControl>
          </Grid>

          <Grid item md={12}>
            <FormControl className={classNames(classes.margin, classes.formControl)}>
              <InputLabel>Email</InputLabel>
              <Input
                className={classNames(classes.textInput)}
                id="email"
                type="email"
                disabled={true}
                value={profile.email}
                onChange={this.handleChange('email')}
              />
            </FormControl>
          </Grid>

          <Grid item md={12}>
            <FormControl className={classNames(classes.margin, classes.formControl)}>
              <InputLabel>ED25519 Public Key</InputLabel>
              <Input
                id="ed-public-key"
                type="text"
                disabled={true}
                multiline={true}
                value={profile.edPubKey}
                onChange={this.handleChange('edPubKey')}
              />
            </FormControl>
          </Grid>

          <Grid item md={12}>
            <FormControl className={classNames(classes.margin, classes.formControl)}>
              <InputLabel>SECP256K1 Public Key</InputLabel>
              <Input
                id="sec-public-key"
                type="text"
                disabled={true}
                multiline={true}
                value={profile.secPubKey}
                onChange={this.handleChange('secPubKey')}
              />
            </FormControl>
          </Grid>

          {error !== null && <Grid item xs={12}>
            <p>
              {error}
            </p>
          </Grid>}

          <Grid item md={12}>
            <Button
              variant="raised"
              color="secondary"
              onClick={this.handleSubmit}
            >
              Save
            </Button>
          </Grid>
        </div>
      </AppBar>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUserProfile: async (auth, profile) => {
      dispatch(actions.setUserProfile(auth, profile));
    },
    getUser: async auth => {
      dispatch(actions.getUser(auth));
    }
  };
};


export default withStyles(styles)(
  connect(null, mapDispatchToProps)(
    withAuth(ProfilePage)
  )
);