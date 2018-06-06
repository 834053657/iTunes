import { queryMyAdList } from '../services/api';

export default {
  namespace: 'ad',

  state: {
    myAdData: {
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
  },

  subscriptions: {},
};
