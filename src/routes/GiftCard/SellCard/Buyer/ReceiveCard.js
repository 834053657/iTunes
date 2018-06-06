import React, { Component } from 'react';
import { connect } from 'dva';
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
import styles from './ReceiveCard.less';

const Step = Steps.Step;

@connect(({ card }) => ({
  card,
}))
export default class Process extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className={styles.receiveCard}>
        <Steps current={0}>
          <Step title="查收礼品卡" />
          <Step title="确认信息" />
          <Step title="完成" />
        </Steps>
        <div className={styles.left}>
          <div className={styles.orderInfo}>
            <h5>
              <span>订单：</span>
              <span className={styles.text}>115216524713875</span>
            </h5>
            <div className={styles.orderDescribe}>您向Jason购买总面额300的亚马逊美卡亚马逊美卡</div>
          </div>
          <ul>
            <li className={styles.item}>
              <span className={styles.title}>类型：</span>
              <div className={styles.content}>type[info.card_type].name</div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>单价：</span>
              <div className={styles.content}>info.unit_priceRMB</div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>数量：</span>
              <div className={styles.content}>passwordType(info.password_type)</div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>面额：</span>
              <div className={styles.content}>passwordType(info.password_type)</div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>总价：</span>
              <div className={styles.content}>amountMoney()RMB</div>
            </li>
          </ul>
          <div className={styles.bottom}>
            <h4>
              请在&nbsp;
              <Icon type="clock-circle-o" />
              &nbsp;10分钟内确认
            </h4>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                this.props.history.push({ pathname: `/card/ad-ensureInfo` });
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
                <span className={styles.name}>ownerInfo.nickname</span>
                <span className={styles.online}>&nbsp;</span>
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
