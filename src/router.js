import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import { getLocale } from './utils/authority';
import Authorized from './utils/Authorized';
import styles from './index.less';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  const lang = getLocale() || 'zh-CN';
  console.log(lang);
  return (
    <LocaleProvider locale={lang === 'zh-CN' ? zhCN : enUS}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <Route path="/" component={BasicLayout} />
          {/* <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            // authority={['admin', 'user']}
            redirectPath="/user/login"
          />*/}
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
