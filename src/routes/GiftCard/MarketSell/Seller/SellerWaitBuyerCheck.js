import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Button, Icon, Steps, Avatar, Select } from 'antd';
import styles from '../../MarketBuy/StepTwo.less';
import StepModel from '../../Step';
import QuickMsg from '../../QuickMsg';

const Step = Steps.Step;
const Option = Select.Option;

@connect(({ card }) => ({
  card,
}))
export default class SellerWaitBuyerCheck extends Component {
  constructor(props) {
    super();
    this.state = {};
    console.log(props);
  }

  cancelOrder = () => {
    console.log(this.props);
    this.props
      .dispatch({
        type: 'card/cacelOrder',
        payload: { order_id: this.props.detail.order.id },
      })
      .then(() => {
        this.props.setStatus('pageStatus', 9);
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
    const steps = [{ title: '发送礼品卡' }, { title: '确认信息' }, { title: '完成' }];
    console.log('this.props');
    console.log(this.props.detail);
    const { detail, pageStatus } = this.props;
    const { trader, order, ad } = this.props.detail;
    const userInfo = ad.owner;

    return (
      <div className={styles.stepTwoBox}>
        <StepModel steps={steps} current={1} />
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <div className={styles.orderInfo}>
              <h5>
                <span>订单：</span>
                <span className={styles.text}>{order.order_no || '-'}</span>
              </h5>
              <div className={styles.orderDescribe}>
                {CONFIG.card_type
                  ? `您向${ad.owner.nickname}出售总面额${order.money}的
                  ${CONFIG.card_type[order.order_type - 1].name}`
                  : null}
              </div>
              <div className={styles.price}>
                <span>单价：</span>
                <span>{ad.unit_price}</span>RMB
              </div>
              <div>
                <span>总价：</span>
                <span>{order.money}</span>RMB
              </div>
            </div>

            <div className={styles.guarantee}>
              {pageStatus === 6 ? (
                <h5>
                  保障时间剩余 &nbsp;
                  <Icon type="clock-circle-o" />
                  &nbsp;
                  {ad.guarantee_time}分钟
                </h5>
              ) : (
                <h5>
                  买家查收卡密时间剩余 &nbsp;
                  <Icon type="clock-circle-o" />
                  &nbsp;
                  {'30'}分钟
                </h5>
              )}

              <Button
                onClick={this.cancelOrder}
                style={{ borderColor: 'red', backgroundColor: '#fff', color: 'red' }}
                type="danger"
              >
                取消订单
              </Button>
            </div>

            {/*快捷短语*/}
            <QuickMsg detail={detail} />
          </div>
          <div className={styles.stepBottomRight}>
            <div className={styles.largeBtnBox}>
              <Button
                onClick={() => {
                  this.props.history.push({ pathname: `/card/card-preview` });
                }}
              >
                查看礼品卡清单
              </Button>
            </div>

            <div className={styles.ownerInfo}>
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
        </div>
      </div>
    );
  }
}
