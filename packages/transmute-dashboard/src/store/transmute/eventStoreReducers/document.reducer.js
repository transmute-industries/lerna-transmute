const handlers = {
  ['DOCUMENT_CREATED']: (state, action) => {
    return {
      ...state,
      created: {
        ...action.payload
      }
    };
  },
  ['DOCUMENT_SIGNED']: (state, action) => {
    return {
      ...state,
      signatures: {
        ...state.signatures,
        [action.payload.name]: action.payload.signature
      }
    };
  }
};

export const initialState = {};

export default (state = initialState, action) => {
  return handlers[action.type] ? handlers[action.type](state, action) : state;
};
