import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Button, Icon, Input, Avatar, Badge, Modal, Popconfirm, Form, message} from 'antd';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import CountDown from 'components/CountDown';
import styles from './SendCard.less';
import StepModel from '../../Step';
import {sendCDK} from '../../../../services/api';
import SendCardForm from '../../forms/SendCardForm';

const FormItem = Form.Item;
const msg = defineMessages({
  send_card: {
    id: 'SendCard.send_card',
    defaultMessage: '发送礼品卡',
  },

  sure_message: {
    id: 'SendCard.sure_message',
    defaultMessage: '确认信息',
  },

  order_finish: {
    id: 'SendCard.order_finish',
    defaultMessage: '完成',
  },

  type_order: {
    id: 'SendCard.type_order',
    defaultMessage: '类型：',
  },

  ask_order: {
    id: 'SendCard.ask_order',
    defaultMessage: '要求：',
  },

  safe_time: {
    id: 'SendCard.safe_time',
    defaultMessage: '保障时间：',
  },

  minute: {
    id: 'SendCard.minute',
    defaultMessage: '分钟',
  },
  one_month: {
    id: 'SendCard.one_month',
    defaultMessage: '30日成单：',
  },
  trade_rule: {
    id: 'SendCard.trade_rule',
    defaultMessage: '交易条款：',
  },
  rules_check: {
    id: 'SendCard.rules_check',
    defaultMessage: '查看交易条款',
  },
});
@injectIntl()
@connect(({loading, card}) => ({
  card,
  submitting: loading.effects['card/sendCDK'],
}))
export default class Process extends Component {
  constructor(props) {
    super();
    this.state = {
      detail: props.detail,
      termView: false,
      cards: [],
    };
    this.cardsData = [];
    this.data = {
      order_id: this.state.detail.order.id,
      cards: [],
    };
    this.targetTime = props.detail.order.deadline_at;
  }

  componentWillMount() {
    const {order_detail = {}} = this.state.detail.order;
    order_detail.map((o, index) => {
      return this.cardsData.push({
        money: o.money,
        items: this.makeData(o, index),
        receipt: '',
      });
    });

    const a = this.renderInputs(order_detail);
    this.setState({
      cards: a,
    });
  }

  makeData = (item, index) => {
    const iptArr = [];
    for (let i = 0; i < item.count; i++) {
      iptArr.push({
        password: '',
        picture: '',
      });
    }
    return iptArr;
  };

  renderInput = (item, index) => {
    const iptArr = [];
    for (let i = 0; i < item.count; i++) {
      iptArr.push({
        password: '',
        picture: '',
      });
    }
    return iptArr;
  };

  renderInputs = item => {
    const fatherArr = [];
    item.map((data, index) => {
      const childArr = [];
      fatherArr.push({
        money: data.money,
        recepit: '',
        items: this.renderInput(data, index),
      });
      return fatherArr;
    });
    return fatherArr;
  };

  onSubmit = (values) => {
    this.props.dispatch({
      type: 'card/sendCDK',
      payload: {
        ...values,
        order_id: this.state.detail.order.id,
      },
    });
  }

  render() {
    const {
      user,
      detail,
      submitting,
      setStatus,
    } = this.props;
    const {ad = {}, cards = {}, order = {}} = detail;

    const userInfo = ad.owner;
    const steps = [{title: this.props.intl.formatMessage(msg.send_card)}, {title: this.props.intl.formatMessage(msg.sure_message)}, {title: this.props.intl.formatMessage(msg.order_finish)}];

    return (
      <div className={styles.sendBox}>
        <StepModel steps={steps} current={0} />
        <div className={styles.top}>
          <div className={styles.orderInfo}>
            <div className={styles.price}>
              <span>{this.props.intl.formatMessage(msg.type_order)}</span>
              {/*类型：*/}
              <p>
                {CONFIG.cardTypeMap && order.card_type
                  ? CONFIG.cardTypeMap[ad.card_type].name || '-'
                  : '-'}
              </p>
            </div>
            <div className={styles.price}>
              <span>{this.props.intl.formatMessage(msg.ask_order)}</span>
              <p>{(CONFIG.cardPwdType && CONFIG.cardPwdType[ad.password_type]) || '-'}</p>
            </div>
            <div className={styles.price}>
              <span>{this.props.intl.formatMessage(msg.safe_time)}</span>
              <p>{ad.guarantee_time}</p>{this.props.intl.formatMessage(msg.minute)}
            </div>
          </div>

          <div className={styles.topRight}>
            <div className={styles.ownerInfo}>
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
                    <span className={styles.dealTit}>{this.props.intl.formatMessage(msg.one_month)}</span>
                    <span className={styles.dealNum}>{userInfo.month_volume}</span>
                  </div>
                </div>
              </div>
              <div className={styles.term}>
                <h3>{this.props.intl.formatMessage(msg.trade_rule)}</h3>
                <Button
                  onClick={() => {
                    this.setState({
                      termView: true,
                    });
                  }}
                >
                  {this.props.intl.formatMessage(msg.rules_check)}
                </Button>
                <Modal
                  title={this.props.intl.formatMessage(msg.trade_rule)}
                  // 交易条款
                  visible={this.state.termView}
                  onCancel={() => this.setState({termView: false})}
                  footer={null}
                >
                  <p>{order.term}</p>
                </Modal>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.denomination}>
          <div className={styles.bottom}>
            <Form className={styles.form} onSubmit={this.handleSubmit}>
              <SendCardForm
                defaultValue={this.state.cards}
                pswType={ad.password_type}
                submitSellForm={this.props.submitting}
                onSubmit={this.onSubmit}
                targetTime={this.targetTime}
                amount={order.amount}
                unit_price={ad.unit_price}
                money={order.money}
                order_id={order.id}
              />
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
