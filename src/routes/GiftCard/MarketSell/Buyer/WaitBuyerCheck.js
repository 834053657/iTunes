import React, {Component} from 'react';
import {connect} from 'dva';
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
import styles from './WaitBuyerCheck.less';
import StepModel from '../../Step';

const Step = Steps.Step;

@connect(({card}) => ({
  card,
}))
export default class WaitBuyerCheck extends Component {
  constructor(props) {
    super();
    this.state = {
      detail: props.detail,
      user: props.user
    };
  }

  count = (order) => {
    const a = 0;
    order.order_detail.map(o => {
      return a + o.count
    })
    return a
  }

  render() {
    const {user, detail} = this.state
    const {ad = {}, cards = {}, order = {}} = this.state.detail;
    const steps = [
      {title: "查收礼品卡"},
      {title: "确认信息"},
      {title: "完成"}
    ]
    return (
      <div className={styles.receiveCard}>
        <StepModel
          steps={steps}
          current={0}
        />
        <div className={styles.left}>
          <div className={styles.orderInfo}>
            <h5>
              <span>订单：</span>
              <span className={styles.text}>{order.order_no || '-'}</span>
            </h5>
            <div className={styles.orderDescribe}>
              {this.props.orderTitle(ad, cards, order, user)}
              总面额{order.money}的
              {order.order_type ? CONFIG.card_type[order.order_type].name || '-' : '-'}
            </div>
          </div>
          <ul>
            <li className={styles.item}>
              <span className={styles.title}>类型：</span>
              <div className={styles.content}>
                {order.order_type ? CONFIG.card_type[order.order_type].name || '-' : '-'}
              </div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>单价：</span>
              <div className={styles.content}>
                {ad.unit_price}
              </div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>数量：</span>
              <div className={styles.content}>
                {this.count(order)}
              </div>
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
              &nbsp;10分钟确认
            </h4>
            <h4>
              请在&nbsp;
              <Icon type="clock-circle-o" />
              &nbsp;10分钟内确认
            </h4>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                this.props.history.push({pathname: `/card/ad-ensureInfo`});
              }}
            >
              立即查收
            </Button>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <Avatar size="large" icon="user" />
            </div>
            <div className={styles.avatarRight}>
              <div className={styles.top}>
                <span className={styles.online}>&nbsp;</span>
                <span className={styles.name}>ownerInfo.nickname</span>
              </div>
              <div className={styles.infoBottom}>
                <span className={styles.dealTit}>30日成单：</span>
                <span className={styles.dealNum}>ownerInfo.month_volume</span>
              </div>
            </div>
          </div>
          <div className={styles.term}>
            <h3>交易条款：</h3>
            <p>info.term</p>
          </div>
        </div>
      </div>
    );
  }
}
