import {
  getBuyCardlist,
  getSellCardlist,
  getTransTerms,
  postSell,
  getToken,
  getBuyDetail,
  ensure,
} from '../services/api';

export default {
  namespace: 'card',

  state: {
    cardList: [],
    terms: [],
    buyDetail: null,
  },

  effects: {
    *fetchBuyCardList(payload, { put, call }) {
      const res = yield call(getBuyCardlist, payload);
      yield put({
        type: 'GET_CARD_LIST',
        payload: res,
      });
    },
    *fetchSellCardList(payload, { put, call }) {
      const res = yield call(getSellCardlist, payload);
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
      yield put({
        type: 'ADD_SELL',
        payload: res,
      });
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
    *getBuyDetail({ payload }, { call, put }) {
      const res = yield call(getBuyDetail, payload);
      yield put({
        type: 'GET_BUY_DETAIL',
        payload: res,
      });
    },
    //发送确认订单请求
    *ensureOrder({ payload }, { call, put }) {
      const res = yield call(ensure, payload);
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
    GET_BUY_DETAIL(state, action) {
      console.log(state);
      console.log(action);
      console.log('reducer');
      return {
        ...state,
        buyDetail: action.payload,
      };
    },
  },

  subscriptions: {},
};
