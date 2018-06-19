import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';

import {
  Table,
  Tabs,
  Button,
  Icon,
  Pagination,
  Input,
  message,
  InputNumber,
  Steps,
  Avatar,
} from 'antd';
import styles from './BuyerCheckCard.less';
import StepModel from '../../Step';

const Step = Steps.Step;

export default class WaitBuyerCheck extends Component {
  constructor(props) {
    super();
    this.state = {
      detail: props.detail,
      user: props.user,
    };
  }

  count = order => {
    const a = 0;
    order.order_detail.map(o => {
      return a + o.count;
    });
    return a;
  };

  handlePostCheck = () => {
    const { params: { id } } = this.props.match || {};
    this.props.dispatch({
      type: 'card/submitCheck',
      payload: {
        id,
      },
    });
  };

  componentWillMount() {}

  render() {
    const { user, detail } = this.state;
    const { setStatus, pageStatus } = this.props;
    const { ad, cards, order, trader } = this.state.detail;
    const steps = [{ title: '查收礼品卡' }, { title: '确认信息' }, { title: '完成' }];

    const userInfo = ad.owner;

    return (
      <div className={styles.receiveCard}>
        WaitBuyerCheck
        <StepModel steps={steps} current={0} />
        <div className={styles.left}>
          <div className={styles.orderInfo}>
            <h5>
              <span>订单：</span>
              <span className={styles.text}>{order.order_no || '-'}</span>
            </h5>
            <div className={styles.orderDescribe}>
              {`${trader.nickname}向您出售总面额${order.money}的${
                CONFIG.card_type[order.order_type - 1].name
              }`}
            </div>
          </div>
          <ul>
            <li className={styles.item}>
              <span className={styles.title}>类型：</span>
              <div className={styles.content}>
                {order.order_type ? CONFIG.card_type[order.order_type - 1].name || '-' : '-'}
              </div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>单价：</span>
              <div className={styles.content}>{ad.unit_price}</div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>数量：</span>
              <div className={styles.content}>{this.count(order)}</div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>总面额：</span>
              <div className={styles.content}>{order.money}</div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>总价：</span>
              <div className={styles.content}>{order.amount}RMB</div>
            </li>
          </ul>
          <div className={styles.bottom}>
            <h4>
              对方剩余&nbsp;
              <Icon type="clock-circle-o" />
              &nbsp;10分钟发卡
            </h4>
            <Button type="primary" size="large" onClick={this.handlePostCheck}>
              立即查收
            </Button>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <Avatar size="large" src={userInfo.avatar} />
            </div>
            <div className={styles.avatarRight}>
              <div className={styles.top}>
                <span className={styles.name}>{userInfo.nickname}</span>
                <span className={styles.online}>&nbsp;</span>
              </div>
              <div className={styles.infoBottom}>
                <span className={styles.dealTit}>30日成单：</span>
                <span className={styles.dealNum}>{userInfo.month_volume}</span>
              </div>
            </div>
          </div>
          <div className={styles.term}>
            <h3>交易条款：</h3>
            <p>{order.term}</p>
          </div>
        </div>
      </div>
    );
  }
}
