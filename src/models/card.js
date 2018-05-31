import { getGiftCard, getTransTerms, postSell } from '../services/api';

export default {
  namespace: 'card',

  state: {
    cardList: [],
    terms: [],
  },

  effects: {
    *fetchCardList(payload, { put, call }) {
      const res = yield call(getGiftCard, payload);
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
  },

  subscriptions: {},
};
