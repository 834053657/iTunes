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

  componentDidMount() {
    this.handleFetchTransfer();
  }

  handleFetchTransfer = params => {
    const { activeKey } = this.state;

    if (activeKey === '3') {
      this.props.dispatch({
        type: 'wallet/fetchTransfer',
        payload: params,
      });
    }
  };

  handleTabsChange = activeKey => {
    this.handleFetchTransfer();
    this.props.dispatch(
      routerRedux.replace({
        search: stringify({ activeKey }),
      })
    );
    this.setState({
      activeKey,
    });
  };

  render() {
    const { activeKey } = this.state;
    const { wallet = {} } = this.props.currentUser || {};
    const { transfer = {}, transferLoading } = this.props;

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
                  dangerouslySetInnerHTML={{
                    __html: `${numeral(wallet.amount || 0).format('0,0')}￥`,
                  }}
                />{' '}
                CNY | 冻结：<span
                  dangerouslySetInnerHTML={{
                    __html: `${numeral(wallet.frozen || 0).format('0,0')}￥`,
                  }}
                />
              </div>
            </Col>
          </Row>

          <div className={styles.content}>
            <Tabs onChange={this.handleTabsChange} type="card" activeKey={activeKey}>
              <TabPane tab="充值" key="1">
                {activeKey === '1' && <RechargeForm />}
              </TabPane>
              <TabPane tab="提现" key="2">
                {activeKey === '2' && <WithdrawForm />}
              </TabPane>
              <TabPane tab="交易记录" key="3">
                {activeKey === '3' && (
                  <TransferList
                    data={transfer}
                    loading={transferLoading}
                    onChange={this.handleFetchTransfer}
                  />
                )}
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Fragment>
    );
  }
}
