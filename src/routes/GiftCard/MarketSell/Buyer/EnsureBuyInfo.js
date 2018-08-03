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

@connect(({ card, loading }) => ({
  card,
  releaseOrderBtn: loading.effects['card/releaseOrder'],
  appealBtn: loading.effects['card/appealOrder'],
}))
export default class EnsureBuyInfo extends Component {
  constructor(props) {
    super();
    this.state = {
      term: <FM id="EnsureBuyInfo.quick_Message" defaultMessage="快捷短语" />,
    };
  }

  previewCard = steps => {
    this.props.dispatch({
      type: 'card/changePageStatus',
      payload: { page: 16, header: steps },
    });
  };

  selectTerm = e => {
    if (!CONFIG.term) {
      return false;
    }
    this.setState({
      term: CONFIG.term[CONFIG.term.findIndex(t => t.id === e)].content || '-',
    });
    this.props.dispatch({
      type: 'card/sendQuickMsg',
      payload: {
        order_id: 'orderId',
        quick_message_id: e,
      },
    });
  };

  render() {
    const { detail, setStatus } = this.props;
    const { ad, cards, order, trader } = this.props.detail;

    const userInfo = trader;

    const steps = [{ title: <FM id="EnsureBuyInfo.gift_card_check" defaultMessage="查收礼品卡" /> }, { title: <FM id="EnsureBuyInfo.message_require" defaultMessage="确认信息" /> }, { title: <FM id="EnsureBuyInfo.buy_ready" defaultMessage="完成" /> }];
    return (
      <div className={styles.stepTwoBox}>
        <StepModel steps={steps} current={1} />
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <div className={styles.orderInfo}>
              <h5>
                <span><FM id="EnsureBuyInfo.gift_card_indent" defaultMessage="订单：" /></span>
                <span className={styles.text}>{order.order_no || '-'}</span>
              </h5>
              <div className={styles.orderDescribe}>
                {<FM id="EnsureBuyInfo.order_Describe_sell" defaultMessage="{name}向您出售总面额{money}的{card}" values={{name:trader.nickname,money:order.money,card:CONFIG.cardTypeMap[order.card_type].name}} />}
              </div>
              <div className={styles.price}>
                <span><FM id="EnsureBuyInfo.unit_price" defaultMessage="单价：" /></span>
                <span>{formatMoney(ad.unit_price)}</span>RMB
              </div>
              <div>
                <span><FM id="EnsureBuyInfo.amount_all" defaultMessage="总价：" /></span>
                <span>{formatMoney(order.amount)}</span>RMB
              </div>
            </div>

            <div className={styles.guarantee}>
              <h5>
                <FM id="EnsureBuyInfo.safe_time_residue" defaultMessage="保障时间剩余" /> &nbsp;
                <Icon type="clock-circle-o" />
                &nbsp;
                <CountDown formatstr="mm:ss" target={order.guarantee_at} />秒
              </h5>

              <Popconfirm
                title={<FM id="EnsureBuyInfo.user_sure_toComplain" defaultMessage="确认申诉吗?" />}
                onConfirm={() => {
                  this.props.dispatch({
                    type: 'card/appealOrder',
                    payload: { order_id: order.id },
                  });
                }}
              >
                <Button type="danger" loading={this.props.appealBtn}>
                  <FM id="EnsureBuyInfo.user_sure_toComplain_btn" defaultMessage="申诉" />
                </Button>
              </Popconfirm>

              <Popconfirm
                title={<FM id="EnsureBuyInfo.require_release_sure_user" defaultMessage="确认释放吗?" />}
                onConfirm={() => {
                  this.props.dispatch({
                    type: 'card/releaseOrder',
                    payload: { order_id: order.id },
                  });
                }}
              >
                <Button type="primary" loading={this.props.releaseOrderBtn}>
                  <FM id="EnsureBuyInfo.require_release_btn" defaultMessage="确认释放" />
                </Button>
              </Popconfirm>
            </div>

            {/*快捷短语*/}
            <QuickMsg detail={detail} />
          </div>
          <div className={styles.stepBottomRight}>
            <div className={styles.largeBtnBox}>
              <Button onClick={() => this.previewCard(steps)}><FM id="EnsureBuyInfo.check_giftCard_list" defaultMessage="查看礼品卡清单" /></Button>
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
                    <span className={styles.dealTit}><FM id="EnsureBuyInfo.one_month" defaultMessage="30日成单：" /></span>
                    <span className={styles.dealNum}>{userInfo.month_volume}</span>
                  </div>
                </div>
              </div>
              <div className={styles.term}>
                <h3><FM id="EnsureBuyInfo.sell_rules_user" defaultMessage="交易条款：" /></h3>
                <p>{order.term}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
