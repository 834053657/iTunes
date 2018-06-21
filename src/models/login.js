import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { accountLogin } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { dvaSocket } from '../utils/socket';

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
      // console.log(response);
      // Login successfully
      if (response.code === 0 && response.data) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            user: response.data,
          },
        });
        reloadAuthorized();
        /* if (process.env.KG_API_ENV === 'dev' || !process.env.KG_API_ENV) {
          // 暂时写法 只在开发环境打开socket
          dvaSocket(CONFIG.socket_url, {uid: 'abcxx'});
        } */
        yield put(routerRedux.push('/'));
      } else if (response.code === 1000) {
        //  需谷歌验证
        yield put({
          type: 'changeLoginStatus',
          payload: {
            g2Visible: true,
            loginInfo: payload,
          },
        });
      } else if (response.code === 1001) {
        //  谷歌验证失败
        message.error(response.msg);
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
        yield put({
          type: 'SOCKET/CLOSE',
        });
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
