import {
  getCardlist,
  getTransTerms,
  postSell,
  getToken,
  getAdDetail,
  getSellDetail,
  ensureBuyOrder,
  addBuyAd,
} from '../services/api';

export default {
  namespace: 'card',

  state: {
    cardList: [],
    terms: [],
    buyDetail: null,
  },

  effects: {
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
    *addCardSell({ payload }, { call, put }) {
      const res = yield call(postSell, payload);
      return res;
    },
    *getToken({ payload }, { call, put }) {
      const res = yield call(getToken, payload);
      return res;
      // yield put({
      //   type: 'GET_TOKEN',
      //   payload: res
      // })
    },
    //获取购买交易详情
    *getAdDetail({ payload }, { call, put }) {
      const res = yield call(getAdDetail, payload);
      yield put({
        type: 'GET_AD_DETAIL',
        payload: res,
      });
    },
    //获取出售交易详情
    *getSellDetail({ payload }, { call, put }) {
      const res = yield call(getSellDetail, payload);
      yield put({
        type: 'GET_SELL_DETAIL',
        payload: res,
      });
    },
    //发送确认订单请求
    *ensureBuyOrder({ payload }, { call, put }) {
      const res = yield call(ensureBuyOrder, payload);
      return res;
    },
    //添加购买广告
    *addBuyAd({ payload }, { call, put }) {
      const res = yield call(addBuyAd, payload);
      return res;
    },
  },

  reducers: {
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
    GET_AD_DETAIL(state, action) {
      return {
        ...state,
        adDetail: action.payload,
      };
    },
    GET_SELL_DETAIL(state, action) {
      return {
        ...state,
        sellDetail: action.payload,
      };
    },
  },

  subscriptions: {},
};
