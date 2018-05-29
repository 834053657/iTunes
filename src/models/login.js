import { routerRedux } from 'dva/router';
import { accountLogin } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    g2Visible: undefined,
    loginInfo: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);

      // Login successfully
      if (response.code === 0 && response.data) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            user: response.data,
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      } else if (response.code === 1) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            g2Visible: true,
            loginInfo: payload,
          },
        });
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'error',
          },
        });
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {},
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log(payload);
      setAuthority(payload.user);
      return {
        ...state,
        loginInfo: payload.loginInfo,
        g2Visible: payload.g2Visible,
        status: payload.status,
      };
    },
  },
};
