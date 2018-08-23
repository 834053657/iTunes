import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import { message, notification } from 'antd';
import createHistory from 'history/createHashHistory';
import { reducer as formReducer } from 'redux-form';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';

// import 'moment/locale/zh-cn';
import './rollbar';
import './index.less';
import CONFIG from './utils/config';
import { dvaSocket } from './utils/socket';
import promptMsgs from './locales/messages-prompt';

message.config({
  duration: 2,
  top: '35%',
});

notification.config({
  placement: 'bottomRight',
  bottom: 50,
  duration: 2,
});

global.CONFIG = CONFIG;
global.PROMPT = promptMsgs;

const undo = reducer => (state, action) => {
  const newState = reducer(state, action);
  // 执行退出以后将所有state还原
  if (action.type === 'login/logout/@@end') {
    const initialState = {};
    const { _models: models } = app;
    models.forEach((model) => {
      const { namespace} = model;

      if (!namespace || namespace === '@@dva') {
        return;
      }
      // eslint-disable-next-line
      const modelObj = require(`./models/${namespace}`);

      if (modelObj) {
        initialState[namespace] = modelObj.state;
      }
    });

    return { ...newState, ...initialState };
  } else {
    return newState;
  }
};

// 1. Initialize
const app = dva({
  history: createHistory(),
  onReducer: undo,
  extraReducers: {
    form: formReducer,
  },
});

// 参考文档 https://socket.io/docs/client-api/#with-extraheaders
const options = {
  autoConnect: false,
};



// 2. Plugins
// if (process.env.KG_API_ENV === 'dev' || !process.env.KG_API_ENV) {
// 暂时写法 只在开发环境打开socket
app.use(dvaSocket(CONFIG.socket_url, options));
// }
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
app._store.dispatch({ type: 'global/fetchConfigs'});// eslint-disable-line

export default app._store; // eslint-disable-line
