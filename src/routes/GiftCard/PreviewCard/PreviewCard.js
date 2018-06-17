import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Icon } from 'antd';
import styles from './PreviewCard.less';
import StepModel from '../Step';

const TabPane = Tabs.TabPane;

@connect(({ card }) => ({
  card,
}))
export default class PreviewCard extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  changeTab = e => {
    if (+e === 1) {
      this.props.setStatus('pageStatus', 14);
    }
  };

  render() {
    const { order, ad, cards } = this.props.detail;
    const steps = [{ title: '打开交易' }, { title: '确认信息' }, { title: '完成' }];
    return (
      <div className={styles.stepBox}>
        <StepModel steps={steps} current={1} />
        <div className={styles.orderInfo}>
          <h5>
            <span>订单：</span>
            <span className={styles.text}>{order.order_no}</span>
          </h5>
          <div className={styles.orderDescribe}>您向Jason购买总面额300的亚马逊美卡亚马逊美卡</div>
          <div className={styles.price}>
            <span>单价：</span>
            <span>{ad.unit_price}</span>RMB
          </div>
          <div>
            <span>总价：</span>
            <span>{order.money}</span>RMB
          </div>
        </div>
        <div className={styles.tabsLine}>
          <Tabs defaultActiveKey="2" onChange={this.changeTab} type="card">
            <TabPane tab="订单详情" key="1">
              Content of Tab Pane 1
            </TabPane>
            <TabPane tab="礼品卡清单" key="2">
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
  return (
    <div className={styles.denominationBox}>
      {cards
        ? Object.keys(cards).map((card, index) => {
            return (
              <div key={index} className={styles.picWithText}>
                <header>
                  <span>{card}</span>
                  面额 （{cards[card].length})
                </header>
                <section className={styles.picBox}>
                  <div className={styles.left}>
                    <ul>
                      {cards[card]
                        ? cards[card].map(item => {
                            return (
                              <li key={item.id}>
                                {item.password ? (
                                  <div className={styles.cardTop}>
                                    <span className={styles.title}>卡密：</span>
                                    <div className={styles.text}>{item.password}</div>
                                  </div>
                                ) : null}
                                {item.picture ? (
                                  <div className={styles.cardBottom}>
                                    <span className={styles.title}>卡图：</span>
                                    <div className={styles.receiveBox}>
                                      <img width="100%" src={item.picture} alt="" />
                                    </div>
                                  </div>
                                ) : null}
                              </li>
                            );
                          })
                        : null}
                    </ul>
                  </div>
                  <div className={styles.receipt}>
                    <div className={styles.left}>
                      <span>收据:</span>
                    </div>
                    <div className={styles.right}>
                      <div className={styles.imgBox}>
                        <img
                          width="85%"
                          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            );
          })
        : null}
    </div>
  );
}
