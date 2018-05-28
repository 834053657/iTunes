import { query as queryUsers, queryCurrent, forgetPassword } from '../services/user';
import { setAuthority } from '../utils/authority';
import { fakeRegister } from '../services/api';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    forgetPassword: {},
    changePassword: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response.code === 0 && response.data) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      }
    },
    *submitForgetPassword(_, { call, put }) {
      const response = yield call(forgetPassword);
      if (response.code === 0 && response.data) {
        yield put({
          type: 'forgetPasswordHandle',
          payload: response,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      setAuthority(action.payload);
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    forgetPasswordHandle(state, { payload }) {
      return {
        ...state,
        forgetPassword: {
          ...state.forgetPassword,
          result: payload.code,
        },
      };
    },
  },
};
