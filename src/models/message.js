import { queryInfoList } from '../services/api';

export default {
  namespace: 'message',

  state: {
    infoData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchInfoList({ payload }, { call, put }) {
      const res = yield call(queryInfoList, payload);
      yield put({
        type: 'setInfoList',
        payload: res,
      });
    },
  },

  reducers: {
    setInfoList(state, { payload }) {
      const { data: { items, paginator } } = payload || {};
      return {
        ...state,
        infoData: {
          list: items,
          pagination: { ...paginator, current: paginator.page },
        },
      };
    },
  },

  subscriptions: {},
};
