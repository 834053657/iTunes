import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import { FormattedMessage } from 'react-intl';
import { connect } from 'dva';
import DocumentTitle from 'react-document-title';
import { Icon, Layout, LocaleProvider } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import { getRoutes } from '../utils/utils';
import { getAuthority, setLocale, getLocale } from '../utils/authority';

const { Footer } = Layout;

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = CONFIG.web_name;
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - ${title}`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>{CONFIG.web_name}</span>
                </Link>
              </div>
              <div className={styles.desc}>
                <FormattedMessage id="web_sub_title" defaultMessage="Itunes & 礼品卡 在线交易平台" />
              </div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          <Footer style={{ padding: 0, backgroundColor: '#092136' }}>
            <GlobalFooter
              links={[
                {
                  key: '1',
                  title: <FormattedMessage id="help" defaultMessage="帮助" />,
                  href: '/#/information/help',
                  blankTarget: true,
                },
                {
                  key: '2',
                  title: <FormattedMessage id="privacy" defaultMessage="隐私" />,
                  href: '/#/information/privacy',
                  blankTarget: true,
                },
                {
                  key: '3',
                  title: <FormattedMessage id="terms" defaultMessage="条款" />,
                  href: '/#/information/terms',
                  blankTarget: true,
                },
              ]}
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" />{' '}
                  {<FormattedMessage id="copyright" description="深圳凯歌科技有限公司" />}
                </Fragment>
              }
            />
          </Footer>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
/*export default connect(({ user, global, loading }) => ({

}))(UserLayout);*/
