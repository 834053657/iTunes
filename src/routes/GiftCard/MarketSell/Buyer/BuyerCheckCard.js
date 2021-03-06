import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { FormattedMessage as FM } from 'react-intl';

import CountDown from 'components/CountDown';
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
  Badge,
} from 'antd';
import styles from './BuyerCheckCard.less';
import StepModel from '../../Step';
import { formatMoney } from '../../../../utils/utils';

const Step = Steps.Step;

export default class BuyerCheckCard extends Component {
  constructor(props) {
    super();
  }

  count = order => {
    let a = 0;
    order.order_detail.map(o => {
      a += o.count;
      return a;
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
    const { user, detail } = this.props;
    const { setStatus, pageStatus } = this.props;
    const { ad, cards, order, trader } = detail;
    const steps = [{ title: <FM id="buyerCheckCard.check_card" defaultMessage="查收礼品卡" /> }, { title: <FM id="buyerCheckCard.ensure_msg" defaultMessage="确认信息" /> }, { title: <FM id="buyerCheckCard.check_card_finish" defaultMessage="完成" /> }];
    const orderDetail = order.order_detail || [];
    const userInfo = trader;
    //const deadline = new Date().getTime() + order.deadline_at * 1000;
    const deadline = order.deadline_at;
    //const checkAt = new Date().getTime() + order.check_at * 1000;
    const checkAt = order.check_at;
    return (
      <div className={styles.receiveCard}>
        <StepModel steps={steps} current={0} />
        <div className={styles.left}>
          <div className={styles.orderInfo}>
            <h5>
              <span>{PROMPT('order_all')}</span>
              <span className={styles.text}>{order.order_no || '-'}</span>
            </h5>
            <div className={styles.orderDescribe}>
              <FM id="buyerCheckCard.seller_amount" defaultMessage="{name}向您出售总面额{money}的{card}" values={{name:trader.nickname,money:order.money,card:CONFIG.cardTypeMap[order.card_type].name}} />
              {/*{`${trader.nickname}向您出售总面额${order.money}的${CONFIG.cardTypeMap[order.card_type].name}`}*/}
            </div>
          </div>
          <ul>
            <li className={styles.item}>
              <span className={styles.title}><FM id="buyerCheckCard.card_type" defaultMessage="类型：" /></span>
              <div className={styles.content}>
                {order.card_type ? CONFIG.cardTypeMap[order.card_type].name || '-' : '-'}
              </div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}><FM id="sellEnsure.unit_price" defaultMessage="单价：" /></span>
              <div className={styles.content}>{formatMoney(ad.unit_price)}</div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}><FM id="sellEnsure.amount_num" defaultMessage="数量：" /></span>
              <div className={styles.content}>{this.count(order)}</div>
            </li>
            {/*<li className={styles.item}>
              <span className={styles.title}>总面额：</span>
              <div className={styles.content}>{order.money}</div>
            </li>
            */}
            {orderDetail.map(d => {
              return (
                <li key={d.money} className={styles.item}>
                  <span className={styles.title}>{d.money}<FM id="sellEnsure.amount_money" defaultMessage="面额：" /></span>
                  <div className={styles.content}>{d.count}</div>
                </li>
              );
            })}
            <li className={styles.item}>
              <span className={styles.title}><FM id="sellEnsure.total_price" defaultMessage="总价：" /></span>
              <div className={styles.content}>{formatMoney(order.amount)}RMB</div>
            </li>
          </ul>
          <div className={styles.bottom}>
            {order.status === 1 ? (
              <h4>
                <FM id="sellEnsure.send_card_remain" defaultMessage="对方剩余 {icon} {card}秒发卡" values={{icon:<Icon type="clock-circle-o" />,card:<CountDown formatstr="mm:ss" target={deadline} />}} />
                {/*对方剩余&nbsp;<Icon type="clock-circle-o" />&nbsp;<CountDown formatstr="mm:ss" target={deadline} />秒发卡*/}
              </h4>
            ) : (
              <div>
                <h4>
                  <FM id="sellEnsure.check_time_remain" defaultMessage="查收时间剩余 {icon} {time}秒" values={{icon:<Icon type="clock-circle-o" />,time:<CountDown formatstr="mm:ss" target={checkAt} />}} />
                  {/*查收时间剩余&nbsp;<Icon type="clock-circle-o" />&nbsp;<CountDown formatstr="mm:ss" target={checkAt} />秒*/}
                </h4>
                <Button type="primary" size="large" onClick={this.handlePostCheck}>
                  <FM id="sellEnsure.check_inTime" defaultMessage="立即查收" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <Avatar size="large" src={userInfo.avatar} />
            </div>
            <div className={styles.avatarRight}>
              <div className={styles.top}>
                <Badge status={userInfo.online ? 'success' : 'default'} offset={[11, 10]} dot>
                  <span className={styles.name}>{userInfo.nickname}</span>
                </Badge>
              </div>
              <div className={styles.infoBottom}>
                <span className={styles.dealTit}><FM id="sellEnsure.one_mouth_order" defaultMessage="30日成单：" /></span>
                <span className={styles.dealNum}>{userInfo.month_volume}</span>
              </div>
            </div>
          </div>
          <div className={styles.term}>
            <h3><FM id="sellEnsure.order_rules" defaultMessage="交易条款：" /></h3>
            <p>{order.term}</p>
          </div>
        </div>
      </div>
    );
  }
}
