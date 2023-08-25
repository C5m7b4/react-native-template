import * as actions from '../actions/actionTypes';

const initialState = {
  url: '',
  dn: 'dcr',
  cn: '',
};

const appReducer = (state = initialState, aciton) => {
  switch (actions.type) {
    default:
      return state;
  }
};

export default appReducer;
