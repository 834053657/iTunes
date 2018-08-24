import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import { IntlProvider } from 'react-intl';
// import zhCN from 'antd/lib/locale-provider/zh_CN';
// import enUS from 'antd/lib/locale-provider/en_US';
import dynamic from 'dva/dynamic';
import Exception from 'components/Exception';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import cintl from './utils/intl';
import styles from './index.less';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
const appLocale = cintl.getAppLocale();
const { intl  } = new IntlProvider(appLocale, {}).getChildContext();

global.INTL = (obj, values) => {
  // defineMessages(id, defaultMessage);
  return intl.formatMessage(obj, values);
};


dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  componentDidCatch(error, info) {
    const isPro = location.host === 'www.paean.net';
    if(isPro || true) {
      const fundebug=require("fundebug-javascript");
      this.setState({ hasError: true });
      // 将component中的报错发送到Fundebug
      fundebug.notifyError(error, {
        metaData: {
          info
        }
      });
    }

  }

  render() {
    if (this.state.hasError) {
      return <Exception type="500" style={{ minHeight: 500, height: '80%' }} />
      // 也可以在出错的component处展示出错信息
      // return <h1>出错了!</h1>;
    }
    return this.props.children;
  }
}

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;

  return (
    <ErrorBoundary>
      <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
        <LocaleProvider locale={appLocale.antd}>
          <ConnectedRouter history={history} >
            <Switch>
              <Route path="/user" component={UserLayout} />
              <Route path="/" component={BasicLayout} />
            </Switch>
          </ConnectedRouter>
        </LocaleProvider>
      </IntlProvider>
    </ErrorBoundary>
  );
}

export default RouterConfig;
