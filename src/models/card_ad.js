import { message } from 'antd';
import { addBuyAd, getAdDetail } from '../services/api';

export default {
  namespace: 'card_ad',

  state: {
    detail: undefined,
  },

  effects: {
    *fetchInitialValue({ payload }, { call, put }) {
      const res = yield call(getAdDetail, payload);
      console.log(payload);
      if (res.code === 0) {
        const { condition_type, condition } = res.data || {};
        const detail = { ...res.data };

        if (condition_type === 1) {
          detail.condition1 = condition;
        } else {
          detail.condition2 = condition;
        }

        yield put({
          type: 'SAVE_AD_DETAIL',
          payload: detail,
        });
      }
    },
    //添加购买广告
    *postCardAd({ payload, callback }, { call, put }) {
      const res = yield call(addBuyAd, payload);
      if (res.code === 0) {
        yield callback && callback(res);
      } else {
        message.error(res.msg);
      }
    },
  },

  reducers: {
    SAVE_AD_DETAIL(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
  },

  subscriptions: {},
};
