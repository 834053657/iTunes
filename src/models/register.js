import { fakeRegister } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'register',

  state: {
    result: undefined,
  },

  effects: {
    *submit(_, { call, put }) {
      const response = yield call(fakeRegister);
      if (response.code === 0 && response.data) {
        yield put({
          type: 'registerHandle',
          payload: response,
        });
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority(payload.data);
      reloadAuthorized();
      return {
        ...state,
        result: payload.data,
      };
    },
  },
};
