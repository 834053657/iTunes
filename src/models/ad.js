import { queryMyAdList, queryTermsList } from '../services/api';

export default {
  namespace: 'ad',

  state: {
    myAdData: {
      list: [],
      pagination: {},
    },
    termsData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchMyAdList({ payload }, { call, put }) {
      const res = yield call(queryMyAdList, payload);
      yield put({
        type: 'setMyAdList',
        payload: res,
      });
    },
    *fetchTermsList({ payload }, { call, put }) {
      const res = yield call(queryTermsList, payload);
      yield put({
        type: 'setTermsList',
        payload: res,
      });
    },
  },

  reducers: {
    setMyAdList(state, { payload }) {
      const { data: { items = [], paginator } } = payload || {};
      return {
        ...state,
        myAdData: {
          list: items,
          pagination: { ...paginator, current: paginator.page },
        },
      };
    },
    setTermsList(state, { payload }) {
      const { data: { items = [], paginator } } = payload || {};
      return {
        ...state,
        termsData: {
          list: items,
          pagination: { ...paginator, current: paginator.page },
        },
      };
    },
  },

  subscriptions: {},
};
