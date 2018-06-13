import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import { message, notification } from 'antd';
// import createHistory from 'history/createHashHistory';
// user BrowserHistory
import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';

import 'moment/locale/zh-cn';
import './rollbar';
import './index.less';
import CONFIG from './utils/config';
import { dvaSocket } from './utils/socket';

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
// 1. Initialize
const app = dva({
  history: createHistory(),
});

const options = {
  extraHeaders: {
    UID: '1xxx',
    TOKEN: 'xxx',
    language: 'CN-zh',
  },
};

// 2. Plugins
if (process.env.KG_API_ENV === 'dev' || !process.env.KG_API_ENV) {
  // 暂时写法 只在开发环境打开socket
  app.use(dvaSocket(CONFIG.socket_url, options));
}
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line
