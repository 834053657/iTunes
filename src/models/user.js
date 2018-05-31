import { message } from 'antd';
import {
  query as queryUsers,
  queryCurrent,
  forgetPassword,
  resetPassword,
  updateEmail,
  updateMobile,
  updatePassword,
  updateG2Validate,
  getG2Secret,
  postAuth,
} from '../services/user';
import { setAuthority } from '../utils/authority';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    forgetPassword: {},
    changePassword: {},
    g2Info: {},
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
      if (response.code === 0) {
        yield put({
          type: 'forgetPasswordHandle',
          payload: response,
        });
      } else {
        message.error(response.errmsg || '操作失败');
      }
    },
    *submitChangePassword({ payload, callback }, { call, put }) {
      const response = yield call(resetPassword, payload);
      if (response.code === 0) {
        message.success('操作成功!');
        callback && callback(response);
      } else {
        message.error(response.errmsg || '操作失败');
      }
    },
    *submitUpdatePassword({ payload }, { call, put }) {
      const response = yield call(updatePassword, payload);
      if (response.code === 0) {
        yield put({
          type: 'forgetPasswordHandle',
          payload: response,
        });
      } else {
        message.error(response.errmsg || '操作失败');
      }
    },
    *submitChangeEmail({ payload, callback }, { call, put }) {
      const response = yield call(updateEmail, payload);
      if (response.code === 0) {
        yield put({
          type: 'fetchCurrent',
        });
        callback && callback();
      } else {
        message.error(response.errmsg || '操作失败');
      }
    },
    *submitChangeMobile({ payload, callback }, { call, put }) {
      const response = yield call(updateMobile, payload);
      if (response.code === 0) {
        yield put({
          type: 'fetchCurrent',
        });
        callback && callback();
      } else {
        message.error(response.errmsg || '操作失败');
      }
    },
    *submitChangeG2Validate({ payload, callback }, { call, put }) {
      const response = yield call(updateG2Validate, payload);
      if (response.code === 0) {
        yield put({
          type: 'fetchCurrent',
        });
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(response.errmsg || '操作失败');
      }
    },
    *fetchG2Info(_, { call, put }) {
      const response = yield call(getG2Secret);
      if (response.code === 0) {
        yield put({
          type: 'saveG2Info',
          payload: response.data,
        });
      } else {
        message.error(response.errmsg || '操作失败');
      }
    },
    *submitUserAuth({ payload, callback }, { call, put }) {
      const response = yield call(postAuth, payload);
      if (response.code === 0) {
        yield put({
          type: 'fetchCurrent',
        });
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(response.errmsg || '操作失败');
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
    saveG2Info(state, { payload }) {
      return {
        ...state,
        g2Info: payload,
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
