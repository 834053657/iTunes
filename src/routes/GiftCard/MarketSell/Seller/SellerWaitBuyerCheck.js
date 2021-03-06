import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Button, Icon, Steps, Avatar, Select, Badge, Popconfirm } from 'antd';
import { FormattedMessage as FM } from 'react-intl';

import CountDown from 'components/CountDown';
import styles from '../../MarketBuy/StepTwo.less';
import StepModel from '../../Step';
import QuickMsg from '../../QuickMsg';
import { formatMoney } from '../../../../utils/utils';

const Step = Steps.Step;
const Option = Select.Option;

@connect(({ loading, card }) => ({
  card,
  cancel: loading.effects['card/cacelOrder'],
}))
export default class SellerWaitBuyerCheck extends Component {
  constructor(props) {
    super();
    this.state = {};
    // this.guaranteeTime = new Date().getTime() + props.detail.order.guarantee_at * 1000;
    // this.deadlineTime = new Date().getTime() + props.detail.order.deadline_at * 1000;
  }

  cancelOrder = () => {
    this.props.dispatch({
      type: 'card/cacelOrder',
      payload: { order_id: this.props.detail.order.id },
    });
  };

  previewCard = steps => {
    this.props.dispatch({
      type: 'card/changePageStatus',
      payload: { page: 16, header: steps },
      //payload: 16,
    });
  };

  componentWillMount() {}

  componentDidMount() {
    // this.props.dispatch({
    //   type: 'enter_chat_room',
    //   payload: {
    //     order_id: 123,
    //   },
    // });
  }

  componentWillUnmount() {
    // this.props.dispatch({
    //   type: 'leave_chat_room',
    //   payload: {
    //     order_id: 123,
    //     room_id: 'xxx',
    //   },
    // });
  }

  selectTerm = e => {
    this.props.dispatch({
      type: 'card/sendQuickMsg',
      payload: {
        order_id: 'orderId',
        quick_message_id: e,
      },
    });
  };

  render() {
    const steps = [{ title: <FM id="waitBuyerCheck.send_card" defaultMessage="发送礼品卡" /> }, { title: <FM id="waitBuyerCheck.confirm_msg" defaultMessage="确认信息" /> }, { title:  <FM id="waitBuyerCheck.send_card_finish" defaultMessage="完成" />}];
    const { detail } = this.props;
    const { trader = {}, order = {}, ad = {} } = this.props.detail;
    const { status } = order;
    const userInfo = ad.owner;
    const guaranteeTime = order.guarantee_at; //new Date().getTime() + order.guarantee_at * 1000;
    const deadlineTime = order.deadline_at; // new Date().getTime() + order.deadline_at * 1000;
    const checkTime = order.check_at; //new Date().getTime() + order.check_at * 1000;

    return (
      <div className={styles.stepTwoBox}>
        <StepModel steps={steps} current={1} />
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <div className={styles.orderInfo}>
              <h5>
                <span>{PROMPT('order_all')}</span>
                <span className={styles.text}>{order.order_no || '-'}</span>
              </h5>
              <div className={styles.orderDescribe}>
                {CONFIG.cardTypeMap
                  ? <FM id="waitBuyerCheck.toSell_card" defaultMessage="您向{name}出售总面额{money}的{card}" values={{name:ad.owner.nickname,money:order.money,card:CONFIG.cardTypeMap[order.card_type].name}} />
                  // `您向${ad.owner.nickname}出售总面额${order.money}的${CONFIG.cardTypeMap[order.card_type].name}`
                  : null}
              </div>
              <div className={styles.price}>
                <span><FM id="waitBuyerCheck.unit_price" defaultMessage="单价：" /></span>
                <span>{ad.unit_price}</span>RMB
              </div>
              <div>
                <span><FM id="waitBuyerCheck.amount_all" defaultMessage="总价：" /></span>
                <span>{formatMoney(order.amount)}</span>RMB
              </div>
            </div>

            <div className={styles.guarantee}>
              {status === 3 ? (
                <h5>
                  <FM id="waitBuyerCheck.safe_time_remain" defaultMessage="保障时间剩余 {icon} {time}分钟"  values={{icon:<Icon type="clock-circle-o" />,time:<CountDown formatstr="mm:ss" target={guaranteeTime} />}} />
                  {/*保障时间剩余 &nbsp;<Icon type="clock-circle-o" />&nbsp;<CountDown formatstr="mm:ss" target={guaranteeTime} />分钟*/}
                </h5>
              ) : (
                <h5>
                  <FM id="waitBuyerCheck.check_card_buyer" defaultMessage="买家查收卡密时间剩余 {icon} {time}秒" values={{icon:<Icon type="clock-circle-o" />,time:<CountDown formatstr="mm:ss" target={checkTime} />}} />
                  {/*买家查收卡密时间剩余 &nbsp;<Icon type="clock-circle-o" />&nbsp;<CountDown formatstr="mm:ss" target={checkTime} />秒*/}
                </h5>
              )}

              <Popconfirm title={<FM id="waitBuyerCheck.cancel_order_sure" defaultMessage="您确认要取消订单吗?" />} onConfirm={this.cancelOrder}>
                <Button
                  style={{ borderColor: 'red', backgroundColor: '#fff', color: 'red' }}
                  type="danger"
                  loading={this.props.cancel}
                >
                  <FM id="waitBuyerCheck.cancel_order_btn" defaultMessage="取消订单" />
                </Button>
              </Popconfirm>
            </div>

            {/*快捷短语*/}
            {status === 3 ? <QuickMsg detail={detail} /> : null}
          </div>
          <div className={styles.stepBottomRight}>
            <div className={styles.largeBtnBox}>
              <Button onClick={() => this.previewCard(steps)}><FM id="waitBuyerCheck.check_giftCard_list" defaultMessage="查看礼品卡清单" /></Button>
            </div>

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
                    <span className={styles.dealTit}><FM id="waitBuyerCheck.order_one_month" defaultMessage="30日成单：" /></span>
                    <span className={styles.dealNum}>{userInfo.month_volume}</span>
                  </div>
                </div>
              </div>
              <div className={styles.term}>
                <h3><FM id="waitBuyerCheck.seal_rules" defaultMessage="交易条款：" /></h3>
                <p>{order.term}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
