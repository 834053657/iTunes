import { queryInfoList, queryInfoDtl } from '../services/api';

export default {
  namespace: 'message',

  state: {
    infoData: {
      list: [],
      pagination: {},
    },
    infoDetail: {},
  },

  effects: {
    *fetchInfoList({ payload }, { call, put }) {
      const res = yield call(queryInfoList, payload);
      yield put({
        type: 'setInfoList',
        payload: res,
      });
    },
    *fetchInfoDetail({ payload }, { call, put }) {
      const res = yield call(queryInfoDtl, payload);
      yield put({
        type: 'setInfoDetail',
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
    setInfoDetail(state, { payload }) {
      return {
        ...state,
        infoDetail: payload.data,
      };
    },
  },

  subscriptions: {},
};
