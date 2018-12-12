import * as actionCreators from './actionCreators';
import * as middleware from './middleware';
const stringify = require('json-stringify-deterministic');

export const register = async ({ primaryKey, recoveryKey, profile }) => {
  try {
    let response = await middleware.register({
      primaryKey,
      recoveryKey,
      profile
    });
    return actionCreators.registerSuccess({
      ...response.data
    });
  } catch (e) {
    if (e.response && e.response.data) {
      return actionCreators.registerError({
        ...e.response.data
      });
    } else {
      return actionCreators.registerError({
        ...e
      });
    }
  }
};

export const recover = async(auth, { primaryKey, recoveryKey }) => {
  try {
    let response = await middleware.recover(auth, {
      primaryKey,
      recoveryKey
    });
    return actionCreators.recoverySuccess({
      ...response.data
    });
  } catch (e) {
    if (e.response && e.response.data) {
      return actionCreators.recoveryError({
        ...e.response.data
      });
    } else {
      return actionCreators.recoveryError({
        ...e
      });
    }
  }
};

export const loginApiCall = (auth, email, password) => {
  return dispatch => {
    return auth
      .signIn({
        username: email,
        password: password
      })
      .then(res => {
        console.log(stringify(res));
        dispatch(actionCreators.loginSuccess(res.sessionToken));
      })
      .catch(err => {
        console.log(err.message + '\n error', err);
        dispatch(actionCreators.loginError(err.message));
      });
  };
};

export const getUser = async (auth) => {
  try {
    let response = await middleware.getUser(auth);
    return actionCreators.getUserSuccess({
      ...response.data
    });
  } catch (e) {
    return actionCreators.getUserError({
      ...e
    });
  }
};

export const setUserProfile = async (auth, info) => {
  try {
    let response = await middleware.setUserProfile(auth, info);
    return actionCreators.setUserProfileSuccess({
      ...response.data
    });
  } catch (e) {
    return actionCreators.setUserProfileError({
      ...e
    });
  }
};

export const setWeb3Account = (web3Account) => {
  return dispatch => {
    dispatch(actionCreators.setWeb3Account(web3Account));
  };
};
