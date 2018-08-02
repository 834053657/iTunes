import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Icon, Avatar, Select, Badge, Popconfirm } from 'antd';
import { FormattedMessage as FM } from 'react-intl';

import CountDown from 'components/CountDown';
import styles from './OrderDetail.less';
import StepModel from '../Step';
import QuickMsg from '../QuickMsg';
import SetInterval from '../SetInterval';
import { formatMoney } from '../../../utils/utils';

const Option = Select.Option;

@connect(({ card, loading }) => ({
  card,
  releaseOrderBtn: loading.effects['card/releaseOrder'],
  appealBtn: loading.effects['card/appealOrder'],
}))
export default class SellerEnsure extends Component {
  constructor(props) {
    super();
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
    });
  };

  render() {
    const { ad = {}, cards = {}, order = {}, trader } = this.props.detail;
    const { user, detail, pageStatus, setStatus } = this.props;
    const steps = [{ title: <FM id="sellEnsure.open_deal" defaultMessage="打开交易" /> }, { title: <FM id="sellEnsure.ensure_msg" defaultMessage="确认信息" /> }, { title: <FM id="sellEnsure.order_finish" defaultMessage="完成" /> }];
    let userInfo = null;
    if (pageStatus === 11) {
      userInfo = trader;
    } else if (pageStatus === 14) {
      userInfo = ad.owner;
    }
    const guaranteeTime = order.guarantee_at;
    return (
      <div className={styles.stepTwoBox}>
        <StepModel steps={steps} current={1} />
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <div className={styles.orderInfo}>
              <h5>
                <span><FM id="sellEnsure.order_" defaultMessage="订单：" /></span>
                <span className={styles.text}>{order.order_no || '-'}</span>
              </h5>
              <div className={styles.orderDescribe}>
                {pageStatus === 11 && CONFIG.cardTypeMap
                  ? <FM id="sellEnsure.buyer_buy" defaultMessage="{name}向您购买总面额{money}的{card}" values={{name:trader.nickname,money:order.money,card:CONFIG.cardTypeMap[order.card_type].name}} />
                  // `${trader.nickname}向您购买总面额${order.money}的${CONFIG.cardTypeMap[order.card_type].name}`
                  :<FM id="sellEnsure.user_buy" defaultMessage="您向{name}购买总面额{money}的{card}" values={{name:trader.nickname,money:order.money,card:CONFIG.cardTypeMap[order.card_type].name}} />
                  // `您向${ad.owner.nickname}购买总面额${order.money}的${CONFIG.cardTypeMap[order.card_type].name}`
                  }
              </div>
              <div className={styles.price}>
                <span><FM id="sellEnsure.unit_price" defaultMessage="单价：" /></span>
                <span>{formatMoney(ad.unit_price)}</span>RMB
              </div>
              <div>
                <span><FM id="sellEnsure.amount_allMoney" defaultMessage="总价：" /></span>
                <span>{formatMoney(order.amount)}</span>RMB
              </div>
            </div>
            <div className={styles.guarantee}>
              <h5>
                <FM id="sellEnsure.safe_time_remain" defaultMessage="保障时间剩余 {icon} {time}分钟" values={{icon:<Icon type="clock-circle-o" />,time:<CountDown formatstr="mm:ss" target={guaranteeTime} />}} />
                {/*保障时间剩余 &nbsp;<Icon type="clock-circle-o" />&nbsp;<CountDown formatstr="mm:ss" target={guaranteeTime} />分钟*/}
              </h5>
              {pageStatus === 11 ? (
                <div>
                  <Popconfirm title={<FM id="sellEnsure.cancel_order_sure" defaultMessage="确认取消订单吗?" />} onConfirm={this.cancelOrder}>
                    <Button
                      style={{ borderColor: 'red', backgroundColor: '#fff', color: 'red' }}
                      type="danger"
                    >
                      <FM id="sellEnsure.cancel_order_btn" defaultMessage="取消订单" />
                    </Button>
                  </Popconfirm>
                </div>
              ) : (
                <div>
                  <Popconfirm
                    title={<FM id="sellEnsure.sure_to_state" defaultMessage="确认申诉吗?" />}
                    onConfirm={() => {
                      this.props.dispatch({
                        type: 'card/appealOrder',
                        payload: { order_id: order.id },
                      });
                    }}
                  >
                    <Button type="danger" loading={this.props.appealBtn}>
                      <FM id="sellEnsure.sure_to_state_btn" defaultMessage="申诉" />
                    </Button>
                  </Popconfirm>

                  <Popconfirm
                    title={<FM id="sellEnsure.sure_sell_release" defaultMessage="确认释放吗?" />}
                    onConfirm={() => {
                      this.props.dispatch({
                        type: 'card/releaseOrder',
                        payload: { order_id: order.id },
                      });
                    }}
                  >
                    <Button type="primary" loading={this.props.releaseOrderBtn}>
                      <FM id="sellEnsure.sure_sell_release_btn" defaultMessage="确认释放" />
                    </Button>
                  </Popconfirm>
                </div>
              )}
            </div>

            <QuickMsg detail={detail} />
          </div>
          <div className={styles.stepBottomRight}>
            <div className={styles.largeBtnBox}>
              <Button onClick={() => this.previewCard(steps)}><FM id="sellEnsure.check_giftCard_order" defaultMessage="查看礼品卡清单" /></Button>
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
                    <span className={styles.dealTit}><FM id="sellEnsure.one_month_order" defaultMessage="30日成单：" /></span>
                    <span className={styles.dealNum}>{userInfo.month_volume}</span>
                  </div>
                </div>
              </div>

              <div className={styles.term}>
                <h3><FM id="sellEnsure.deal_rulers" defaultMessage="交易条款：" /></h3>
                <p>{order.term}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
