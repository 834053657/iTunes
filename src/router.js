import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import { IntlProvider } from 'react-intl';
// import zhCN from 'antd/lib/locale-provider/zh_CN';
// import enUS from 'antd/lib/locale-provider/en_US';
import dynamic from 'dva/dynamic';
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

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;

  return (
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

  );
}

export default RouterConfig;
