import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Icon, Avatar, Select, Badge, Popconfirm } from 'antd';
import CountDown from 'components/CountDown';
import styles from './OrderDetail.less';
import StepModel from '../Step';
import QuickMsg from '../QuickMsg';
import SetInterval from '../SetInterval';

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
    const steps = [{ title: '打开交易' }, { title: '确认信息' }, { title: '完成' }];
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
                <span>订单：</span>
                <span className={styles.text}>{order.order_no || '-'}</span>
              </h5>
              <div className={styles.orderDescribe}>
                {pageStatus === 11 && CONFIG.cardTypeMap
                  ? `${trader.nickname}向您购买总面额${order.money}的${
                      CONFIG.cardTypeMap[order.card_type].name
                    }`
                  : `您向${ad.owner.nickname}购买总面额${order.money}的${
                      CONFIG.cardTypeMap[order.card_type].name
                    }`}
              </div>
              <div className={styles.price}>
                <span>单价：</span>
                <span>{ad.unit_price}</span>RMB
              </div>
              <div>
                <span>总价：</span>
                <span>{order.amount}</span>RMB
              </div>
            </div>
            <div className={styles.guarantee}>
              <h5>
                保障时间剩余 &nbsp;
                <Icon type="clock-circle-o" />
                &nbsp;
                <CountDown formatstr="mm:ss" target={guaranteeTime} />
                分钟
              </h5>
              {pageStatus === 11 ? (
                <div>
                  <Popconfirm title="确认取消订单吗?" onConfirm={this.cancelOrder}>
                    <Button
                      style={{ borderColor: 'red', backgroundColor: '#fff', color: 'red' }}
                      type="danger"
                    >
                      取消订单
                    </Button>
                  </Popconfirm>
                </div>
              ) : (
                <div>
                  <Popconfirm
                    title="确认申诉吗?"
                    onConfirm={() => {
                      this.props.dispatch({
                        type: 'card/appealOrder',
                        payload: { order_id: order.id },
                      });
                    }}
                  >
                    <Button type="danger" loading={this.props.appealBtn}>
                      申诉
                    </Button>
                  </Popconfirm>

                  <Popconfirm
                    title="确认释放吗?"
                    onConfirm={() => {
                      this.props.dispatch({
                        type: 'card/releaseOrder',
                        payload: { order_id: order.id },
                      });
                    }}
                  >
                    <Button type="primary" loading={this.props.releaseOrderBtn}>
                      确认释放
                    </Button>
                  </Popconfirm>
                </div>
              )}
            </div>

            <QuickMsg detail={detail} />
          </div>
          <div className={styles.stepBottomRight}>
            <div className={styles.largeBtnBox}>
              <Button onClick={() => this.previewCard(steps)}>查看礼品卡清单</Button>
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
