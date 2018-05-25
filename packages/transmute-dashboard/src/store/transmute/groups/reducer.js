import * as Constants from './constants';

export const initialState = {};

const handlers = {
  [Constants.GROUP_LOADED]: (state, action) => {
    return {
      ...state,
      selectedGroup: action.payload.group
    };
  },
  [Constants.GROUPS_LOADED]: (state, action) => {
    return {
      ...state,
      groups: action.payload.groups
    };
  },
  [Constants.GROUP_MEMBERS_LOADED]: (state, action) => {
    return {
      ...state,
      selectedGroup: {
        ...state.selectedGroup,
        members: action.payload.members
      }
    };
  }
};

export default (state = initialState, action) => {
  return handlers[action.type] ? handlers[action.type](state, action) : state;
};
