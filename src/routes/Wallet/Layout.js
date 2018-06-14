import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Tabs } from 'antd';
import numeral from 'numeral';
import { stringify } from 'qs';
import { routerRedux } from 'dva/router';
import { getQueryString } from '../../utils/utils';
import RechargeForm from './forms/RechargeForm';
import WithdrawForm from './forms/WithdrawForm';

import styles from './Layout.less';
import TransferList from './tabels/TransferList';

const { TabPane } = Tabs;

@connect(({ wallet, user, loading }) => ({
  ...wallet,
  currentUser: user.currentUser,
  transferLoading: loading.effects['wallet/fetchTransfer'],
  rechargSubmitting: loading.effects['wallet/sendRecharge'],
}))
export default class Layout extends Component {
  state = {};
  constructor(props) {
    super(props);
    const { search } = props.location;
    const { activeKey = '1' } = getQueryString(search);
    this.state = {
      activeKey,
    };
  }

  componentDidMount() {}

  handleTabsChange = activeKey => {
    this.setState({
      activeKey,
    });
    this.props.dispatch(
      routerRedux.replace({
        search: stringify({ activeKey }),
      })
    );
  };

  render() {
    const { activeKey } = this.state;
    const { wallet = {} } = this.props.currentUser || {};

    return (
      <Fragment>
        <div className={styles.wallet_page}>
          <Row gutter={24} className={styles.header}>
            <Col span={2} className={styles.icon}>
              <Icon style={{ fontSize: '65px' }} type="wallet" />
            </Col>
            <Col span={12} className={styles.more}>
              <h1>我的钱包</h1>
              <div>
                总资产折合：<span
                  className="text-blue"
                  dangerouslySetInnerHTML={{
                    __html: `${numeral(wallet.amount || 0).format('0,0')}￥`,
                  }}
                />{' '}
                CNY | 冻结：<span
                  className="text-blue"
                  dangerouslySetInnerHTML={{
                    __html: `${numeral(wallet.frozen || 0).format('0,0')}￥`,
                  }}
                />{' '}
                CNY
              </div>
            </Col>
          </Row>

          <div className={styles.content}>
            <Tabs onChange={this.handleTabsChange} type="card" activeKey={activeKey}>
              <TabPane tab="充值" key="1">
                {activeKey === '1' && <RechargeForm {...this.props} />}
              </TabPane>
              <TabPane tab="提现" key="2">
                {activeKey === '2' && <WithdrawForm {...this.props} />}
              </TabPane>
              <TabPane tab="交易记录" key="3">
                {activeKey === '3' && <TransferList {...this.props} />}
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Fragment>
    );
  }
}
