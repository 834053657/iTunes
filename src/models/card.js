import { getGiftCard } from '../services/api';

export default {
  namespace: 'card',

  state: {
    cardList: [],
  },

  effects: {
    *fetchCardList(payload, { put, call }) {
      const res = yield call(getGiftCard, payload);
      yield put({
        type: 'GET_CARD_LIST',
        payload: res,
      });
    },
  },

  reducers: {
    GET_CARD_LIST(state, action) {
      console.log('reducerssssssssssssssssss');
      console.log(action);
      return {
        ...state,
        cardList: action.payload.data,
      };
    },
  },

  subscriptions: {},
};
