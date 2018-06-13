import { message } from 'antd';
import { routerRedux } from 'dva/router';
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
  postPayMethod,
  deletePayMethod,
  updateAvatar,
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
    *submitForgetPassword({ payload }, { call, put }) {
      const response = yield call(forgetPassword, payload);
      if (response.code === 0) {
        console.log('xxx');
        yield call(routerRedux.push, {
          pathname: '/user/register-result',
          query: {
            account: payload.email,
          },
        });
        // yield put(routerRedux.push(`/user/register-result?account=${payload.email}`));
      } else {
        message.error(response.msg);
      }
    },
    *submitChangePassword({ payload }, { call, put }) {
      const response = yield call(resetPassword, payload);
      if (response.code === 0) {
        yield put({
          type: 'changePasswordHandle',
          payload: response,
        });
      } else {
        message.error(response.msg);
      }
    },
    *submitUpdatePassword({ payload, callback }, { call }) {
      const response = yield call(updatePassword, payload);
      if (response.code === 0) {
        message.success('操作成功!');
        callback && callback(response);
      } else {
        message.error(response.msg);
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
        message.error(response.msg);
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
        message.error(response.msg);
      }
    },
    *submitChangeAvatar({ payload, callback }, { call, put }) {
      const response = yield call(updateAvatar, payload);
      if (response.code === 0) {
        yield put({
          type: 'fetchCurrent',
        });
        // callback && callback();
        yield setTimeout(callback && callback(), 1000);
      } else {
        message.error(response.msg);
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
        message.error(response.msg);
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
        message.error(response.msg);
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
        message.error(response.msg);
      }
    },
    *submitUserPayMethod({ payload, callback }, { call, put }) {
      const response = yield call(postPayMethod, payload);
      if (response.code === 0) {
        yield put({
          type: 'fetchCurrent',
        });
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(response.msg);
      }
    },
    *submitDeleteUserPayMethod({ payload, callback }, { call, put }) {
      console.log('submitDeleteUserPayMethod', payload);
      const response = yield call(deletePayMethod, payload);
      if (response.code === 0) {
        yield put({
          type: 'fetchCurrent',
        });
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(response.msg);
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
    changePasswordHandle(state, { payload }) {
      return {
        ...state,
        changePassword: {
          ...state.changePassword,
          result: payload.code,
        },
      };
    },
  },
};
