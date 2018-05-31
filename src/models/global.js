import { message } from 'antd';
import { mapKeys } from 'lodash';
import {
  queryNotices,
  queryStatistics,
  queryConfigs,
  queryBanners,
  postVerify,
  postVerifyCaptcha,
} from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    statistics: {},
    banners: [],
  },

  effects: {
    *fetchBanners(_, { call, put }) {
      const response = yield call(queryBanners);

      if (response && response.code === 0) {
        yield put({
          type: 'setBanners',
          payload: response.data,
        });
      }
    },
    *fetchConfigs(_, { call, put }) {
      // 获取服务器字典
      const response = yield call(queryConfigs) || {};
      if (response && response.code === 0) {
        CONFIG = { ...CONFIG, ...response.data };
        CONFIG.countrysMap = mapKeys(response.data.countrys, 'id');
      }
    },
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *fetchStatistics(_, { call, put }) {
      const res = yield call(queryStatistics);
      yield put({
        type: 'saveStatistics',
        payload: res.data,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *sendVerify({ payload, callback }, { call }) {
      const res = yield call(postVerify, payload);
      if (res.code === 0) {
        message.success('发送成功');
        callback && callback();
      } else {
        message.error(res.errmsg || '操作失败');
      }
    },
    *verifyCaptcha({ payload, callback }, { call }) {
      const res = yield call(postVerifyCaptcha, payload);
      if (res.code === 0) {
        callback && callback(res.data);
      } else {
        message.error(res.errmsg || '操作失败');
      }
    },
  },

  reducers: {
    setBanners(state, { payload }) {
      return {
        ...state,
        banners: payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveStatistics(state, { payload }) {
      return {
        ...state,
        statistics: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
