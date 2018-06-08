import { message } from 'antd';
import { fakeRegister, postVerify } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'register',

  state: {
    result: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      console.log('register111', payload);
      const response = yield call(fakeRegister, payload);
      if (response.code === 0 && response.data) {
        yield put({
          type: 'registerHandle',
          payload: response,
        });
      } else {
        message.error(response.msg);
      }
    },
    *sendVerify({ payload, callback }, { call }) {
      const response = yield call(postVerify, payload);
      console.log('register', response);
      if (callback) {
        yield call(callback, response);
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
