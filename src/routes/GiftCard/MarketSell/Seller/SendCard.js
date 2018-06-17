import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Icon, Input, Avatar, Badge } from 'antd';
import styles from './SendCard.less';
import StepModel from '../../Step';
import { sendCDK } from '../../../../services/api';

@connect(({ card }) => ({
  card,
}))
export default class Process extends Component {
  constructor(props) {
    super();
    this.state = {
      detail: props.detail,
      user: props.user,
    };
    this.cardsData = [];
    this.data = {
      order_id: this.state.detail.order.id,
      cards: [],
    };
  }

  componentWillMount() {
    const { order_detail = {} } = this.state.detail.order;
    order_detail.map(o => {
      return this.cardsData.push({
        money: o.money,
        cards: [],
      });
    });
  }

  renderInput = (item, index) => {
    let iptArr = [];
    for (let i = 0; i < item.count; i++) {
      iptArr.push({
        password: '',
        picture: '',
      });
    }
    this.cardsData[index].cards = iptArr;
    return iptArr;
  };

  writePassword = (e, item, index, i) => {
    this.cardsData[index].cards[i].password = e.target.value;
    console.log(this.cardsData);
  };

  sendCDK = () => {
    this.data.cards = this.cardsData;
    console.log(this.data);
    this.props.dispatch({
      type: 'card/sendCDK',
      payload: this.data,
    });
  };

  render() {
    const { user, detail } = this.state;
    const { setStatus } = this.props;
    const { ad = {}, cards = {}, order = {} } = this.state.detail;

    let userInfo = ad.owner;

    const steps = [{ title: '发送礼品卡' }, { title: '确认信息' }, { title: '完成' }];
    return (
      <div className={styles.sendBox}>
        <StepModel steps={steps} current={0} />
        <div className={styles.top}>
          <div className={styles.orderInfo}>
            <div className={styles.price}>
              <span>类型：</span>
              <p>{order.order_type ? CONFIG.card_type[order.order_type - 1].name || '-' : '-'}</p>
            </div>
            <div className={styles.price}>
              <span>要求：</span>
              <p>卡密和图</p>
            </div>
            <div className={styles.price}>
              <span>保障时间：</span>
              <p>20</p>分钟
            </div>
          </div>

          <div className={styles.topRight}>
            <div className={styles.ownerInfo}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>
                  <Avatar size="large" icon="user" />
                </div>
                <div className={styles.avatarRight}>
                  <div className={styles.top}>
                    <Badge offset={[12, 8]} status="default" dot>
                      <span className={styles.name}>owner.nickname</span>
                    </Badge>
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
        </div>
        <div className={styles.bottom}>
          {order.order_detail.map((item, index) => {
            return (
              <div key={index} className={styles.denomination}>
                <header>
                  <span>{item.money}</span>
                  面额 ({item.count})
                  <div>
                    <Button>导入</Button>
                  </div>
                </header>
                <section className={styles.iptSection}>
                  <div className={styles.left}>
                    <span>卡密：</span>
                  </div>
                  <div className={styles.right}>
                    <div className={styles.iptBox}>
                      <div className={styles.input}>
                        {this.renderInput(item, index).map((n, i) => {
                          return (
                            <Input
                              key={i}
                              type="text"
                              onChange={e => this.writePassword(e, item, index, i)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            );
          })}

          <div>
            <div className={styles.amount}>
              <h4>
                <span className={styles.title}>150</span>
                <span>总面额：</span>
              </h4>
              <h4>
                <span className={styles.title}>1RMB</span>
                <span>单价：</span>
              </h4>
              <h4>
                <span className={styles.title}>120000RMB</span>
                <span>总价：</span>
              </h4>
            </div>
            <div className={styles.footer}>
              <div>
                请在&nbsp;
                <Icon type="delete" />
                &nbsp;30分钟内发卡
              </div>
              <Button>取消</Button>
              <Button
                type="primary"
                onClick={() => {
                  this.sendCDK();
                  setStatus('pageStatus', 6);
                }}
              >
                发布
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
