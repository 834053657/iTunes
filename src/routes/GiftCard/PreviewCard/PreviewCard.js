import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { FormattedMessage as FM } from 'react-intl';

import { Tabs, Icon } from 'antd';
import styles from './PreviewCard.less';
import StepModel from '../Step';
import { formatMoney } from '../../../utils/utils';

const TabPane = Tabs.TabPane;

@connect(({ card }) => ({
  card,
}))
export default class PreviewCard extends Component {
  constructor(props) {
    super();
    this.state = {
      detail: props.detail,
    };
  }

  changeTab = val => {
    const { odDetail } = this.props.card || {};
    const { olderPageStatus } = odDetail || {};
    if (val === '1') {
      this.props.dispatch({
        type: 'card/changePageStatus',
        payload: { page: olderPageStatus },
      });
    }
    this.props.dispatch({
      type: 'card/fetchOrderDetail',
      payload: { id: +this.props.orderId },
    });
  };

  status = status => {
    if (status === 5) {
      return 2;
    } else {
      return 1;
    }
  };

  componentWillMount() {
    console.log('componentWillMount in preview');
  }

  render() {
    const { order, ad, cards, pageStatus, trader, olderPageStatus, steps } = this.state.detail;
    const { status } = order;
    console.log(olderPageStatus);
    console.log(pageStatus);

    // let steps;
    // if (pageStatus === 12 || pageStatus === 17) {
    //   steps = [{ title: '打开交易' }, { title: '确认信息' }, { title: '完成' }];
    // } else if (pageStatus === 13) {
    //   //13 卖家已取消       卖家视图
    //   steps = [{ title: '打开交易' }, { title: '您已取消' }];
    // } else if (pageStatus === 15) {
    //   //13 卖家已取消       买家视图
    //   steps = [{ title: '打开交易' }, { title: '卖家已取消' }];
    // } else if (pageStatus === 8) {
    //   steps = [{ title: '发送礼品卡' }, { title: '确认信息' }, { title: '完成' }];
    // } else if (pageStatus === 9) {
    //   steps = [{ title: '发送礼品卡' }, { title: '您已取消' }];
    // } else if (pageStatus === 3) {
    //   steps = [{ title: '查收礼品卡' }, { title: '确认信息' }, { title: '完成' }];
    // } else if (pageStatus === 4) {
    //   steps = [{ title: '查收礼品卡' }, { title: '卖家已取消' }];
    // }
    return (
      <div className={styles.stepBox}>
        <StepModel steps={steps} current={this.status(status)} />
        <div className={styles.orderInfo}>
          <h5>
            <span><FM id="previewCard.order_title" defaultMessage="订单：" /></span>
            <span className={styles.text}>{order.order_no}</span>
          </h5>
          <div className={styles.orderDescribe}>
            {pageStatus === 12 || pageStatus === 13
              ? <FM id="previewCard.someone_toBuy" defaultMessage="{name}向您购买总面额{money}的{card}" values={{name:trader.nickname,money:order.money,card:CONFIG.cardTypeMap[order.card_type].name}} />
              : null}
            {pageStatus === 15 || pageStatus === 17
              ? <FM id="previewCard.toSomeone_Buy" defaultMessage="您向{name}购买总面额{money}的{card}" values={{name:ad.owner.nickname,money:order.money,card:CONFIG.cardTypeMap[order.card_type].name}} />  //您向${ad.owner.nickname}购买总面额${order.money}的${CONFIG.cardTypeMap[order.card_type].name}
              : null}
            {pageStatus === 3 || pageStatus === 4
              ? <FM id="previewCard.someone_toSell" defaultMessage="{name}向您出售总面额{money}的{card}" values={{name:trader.nickname,money:order.money,card:CONFIG.cardTypeMap[order.card_type].name}} />  //${trader.nickname}向您出售总面额${order.money}的${CONFIG.cardTypeMap[order.card_type].name}
              : null}
            {pageStatus === 8 || pageStatus === 9
              ? <FM id="previewCard.toSomeone_sell" defaultMessage="您向{name}出售总面额{money}的{card}" values={{name:ad.owner.nickname,money:order.money,card:CONFIG.cardTypeMap[order.card_type].name}} />  //`您向${ad.owner.nickname}出售总面额${order.money}的${CONFIG.cardTypeMap[order.card_type].name}`
              : null}
          </div>
          <div className={styles.price}>
            <span><FM id="previewCard.unit_price" defaultMessage="单价：" /></span>
            <span>{formatMoney(ad.unit_price)}</span>RMB
          </div>
          <div>
            <span><FM id="previewCard.order_amount" defaultMessage="总价：" /></span>
            <span>{formatMoney(order.amount)}</span>RMB
          </div>
        </div>
        <div className={styles.tabsLine}>
          <Tabs defaultActiveKey="2" onChange={this.changeTab} type="card">
            <TabPane tab={<FM id="previewCard.order_details" defaultMessage="订单详情" />} key="1" />
            <TabPane tab={<FM id="previewCard.card_order_title" defaultMessage="礼品卡清单" />} key="2">
              <Checklist cards={cards} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

function Checklist(props) {
  const { cards } = props;
  console.log(cards);
  return (
    <div className={styles.denominationBox}>
      {cards &&
        cards.map((card, index) => {
          return (
            <div key={index} className={styles.picWithText}>
              <header>
                <span>{card.money}</span>
                <FM id="previewCard.amount_list" defaultMessage="面额" /> ({card.items.length})
              </header>
              <section className={styles.picBox}>
                <div className={styles.left}>
                  <ul>
                    {card.items &&
                      card.items.map(item => {
                        return (
                          <li key={item.id}>
                            {item.password ? (
                              <div className={styles.cardTop}>
                                <span className={styles.title}><FM id="previewCard.card_passWord_" defaultMessage="卡密：" /></span>
                                <div className={styles.text}>{item.password}</div>
                              </div>
                            ) : null}
                            {item.picture ? (
                              <div className={styles.cardBottom}>
                                <span className={styles.title}><FM id="previewCard.card_img_" defaultMessage="卡图：" /></span>
                                <div className={styles.receiveBox}>
                                  <img width="100%" src={item.picture} alt="" />
                                </div>
                              </div>
                            ) : null}
                          </li>
                        );
                      })}
                  </ul>
                </div>
                {card.receipt ? (
                  <div className={styles.receipt}>
                    <div className={styles.left}>
                      <span><FM id="previewCard.order_receipt" defaultMessage="收据:" /></span>
                    </div>
                    <div className={styles.right}>
                      <div className={styles.imgBox}>
                        <img width="85%" src={card.receipt} alt="" />
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>
            </div>
          );
        })}
    </div>
  );
}
