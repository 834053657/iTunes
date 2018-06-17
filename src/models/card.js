import { message } from 'antd';
import {
  getCardlist,
  getTransTerms,
  getToken,
  getAdDetail,
  getSellDetail,
  createSellOrder,
  createBuyOrder,
  addBuyAd,
  getAppealInfo,
  getOrderDetail,
  sendCDK,
  sendQuickMsg,
  releaseOrder,
  ratingOrder,
} from '../services/api';

export default {
  namespace: 'card',

  state: {
    list: {
      items: [],
      pagination: {
        pageSize: 10,
      },
    },
    cardList: [],
    terms: [],
    buyDetail: null,
    appeal: null,
    adDetail: {},
    odDetail: {
      ad: {},
      cards: {},
      order: {},
    },
  },

  effects: {
    *fetchCardList_({ payload }, { put, call }) {
      const res = yield call(getCardlist, payload);
      if (res.code === 0 && res.data) {
        yield put({
          type: 'GET_CARD_LIST_',
          payload: res.data,
        });
      } else {
        message.error(res.msg);
      }
    },
    *fetchCardList({ payload }, { put, call }) {
      console.log(payload);
      const res = yield call(getCardlist, payload);
      yield put({
        type: 'GET_CARD_LIST',
        payload: res,
      });
    },
    *fetchTerms(_, { put, call }) {
      const res = yield call(getTransTerms);
      yield put({
        type: 'GET_TERMS',
        payload: res,
      });
    },
    //发送确认订单请求
    *createBuyOrder({ payload }, { call, put }) {
      const res = yield call(createBuyOrder, payload);
      if (res.code === 0) {
        return res.data;
      } else {
        message.error(res.msg);
      }
    },
    *createSellOrder({ payload }, { call, put }) {
      const res = yield call(createSellOrder, payload);
      if (res.code === 0) {
        return res.data;
      } else {
        message.error(res.msg);
      }
    },
    *getToken({ payload }, { call, put }) {
      const res = yield call(getToken, payload);
      return res;
      // yield put({
      //   type: 'GET_TOKEN',
      //   payload: res
      // })
    },
    //获取订单详情
    *fetchOrderDetail({ payload }, { call, put }) {
      const res = yield call(getOrderDetail, payload);
      if (res.code === 0) {
        yield put({
          type: 'GET_OD_DETAIL',
          payload: res.data,
        });
      } else {
        message.error(res.msg);
      }
    },
    //获取购买交易详情
    *fetchAdDetail({ payload, callback }, { call, put }) {
      const res = yield call(getAdDetail, payload);
      if (res.code === 0) {
        yield put({
          type: 'GET_AD_DETAIL',
          payload: res.data,
        });
        yield callback && callback(res.data);
      } else {
        message.error(res.msg);
      }
    },
    //获取出售交易详情
    *getSellDetail({ payload }, { call, put }) {
      const res = yield call(getSellDetail, payload);
      yield put({
        type: 'GET_SELL_DETAIL',
        payload: res,
      });
    },
    //添加购买广告
    *addBuyAd({ payload }, { call, put }) {
      const res = yield call(addBuyAd, payload);
      return res;
    },
    //添加购买广告
    *getAppealInfo({ payload }, { call, put }) {
      const res = yield call(getAppealInfo, payload);
      yield put({
        type: 'GET_APPEAL_INFO',
        payload: res,
      });
    },
    //发送CDK
    *sendCDK({ payload }, { call, put }) {
      const res = yield call(sendCDK, payload);
      if (res.code === 0) {
        return res.data;
      } else {
        message.error(res.msg);
      }
    },
    //释放订单
    *releaseOrder({ payload }, { call, put }) {
      const res = yield call(releaseOrder, payload);
      if (res.code === 0) {
        return res;
      } else {
        message.error(res.msg);
        return res;
      }
    },
    //释放订单
    *ratingOrder({ payload }, { call, put }) {
      console.log('dsgfdfsgdfgs');
      const res = yield call(ratingOrder, payload);
      if (res.code === 0) {
        return res;
      } else {
        message.error(res.msg);
        return res;
      }
    },
    //发送快捷短语
    *sendQuickMsg({ payload }, { call, put }) {
      const res = yield call(sendQuickMsg, payload);
      if (res.code === 0) {
        return res.data;
      } else {
        message.error(res.msg);
      }
    },
  },

  reducers: {
    GET_CARD_LIST_(state, { payload }) {
      const { pagination: oldPagination } = state.list;
      const { items, paginator: { page, total } } = payload;
      const pagination = {
        ...oldPagination,
        current: page,
        total,
      };

      return {
        ...state,
        list: {
          items,
          pagination,
        },
      };
    },
    GET_CARD_LIST(state, action) {
      return {
        ...state,
        cardList: action.payload.data,
      };
    },
    GET_TERMS(state, action) {
      return {
        ...state,
        terms: action.payload.data,
      };
    },
    ADD_SELL(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    GET_TOKEN(state, action) {
      return {
        ...state,
        token: action.payload,
      };
    },
    GET_OD_DETAIL(state, action) {
      return {
        ...state,
        odDetail: {
          ...action.payload,
        },
      };
    },
    GET_AD_DETAIL(state, action) {
      const newState = {
        ...state,
        adDetail: action.payload,
      };
      return newState;
    },
    GET_SELL_DETAIL(state, action) {
      return {
        ...state,
        sellDetail: action.payload,
      };
    },
    GET_APPEAL_INFO(state, action) {
      return {
        ...state,
        appeal: action.payload,
      };
    },
  },

  subscriptions: {},
};
