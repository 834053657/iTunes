import { message } from 'antd';
import { stringify } from 'qs';
import { routerRedux } from 'dva/router';
import { getTransfers } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'wallet',

  state: {
    transfer: {
      list: [],
      pagination: {
        pageSize: 10,
      },
    },
  },

  effects: {
    *fetchTransfer({ payload }, { call, put }) {
      const response = yield call(getTransfers, payload);
      if (response.code === 0 && response.data) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      } else {
        message.error(response.msg);
      }
    },
    // *sendVerify({ payload, callback }, { call }) {
    //   const response = yield call(postVerify, payload);
    //   if (callback) {
    //     yield call(callback, response);
    //   }
    // },
  },

  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        transfer: {
          list: payload.results,
          pagination: {
            ...state.transfer.pagination,
            page: payload.pagination.page,
            total: payload.pagination.total,
          },
        },
      };
    },
  },
};
