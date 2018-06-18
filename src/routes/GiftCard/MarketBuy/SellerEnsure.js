import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Icon, Avatar, Select } from 'antd';
import styles from './OrderDetail.less';
import StepModel from '../Step';

const Option = Select.Option;

@connect(({ card }) => ({
  card,
}))
export default class SellerEnsure extends Component {
  constructor(props) {
    super();
  }

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
                {pageStatus === 11 && CONFIG.card_type
                  ? `${trader.nickname}向您购买总面额${order.money}的${
                      CONFIG.card_type[order.order_type - 1].name
                    }`
                  : `您向${ad.owner.nickname}购买总面额${order.money}的${
                      CONFIG.card_type[order.order_type - 1].name
                    }`}
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
              <h5>
                保障时间剩余 &nbsp;
                <Icon type="clock-circle-o" />
                &nbsp;
                {ad.guarantee_time}分钟
              </h5>
              {pageStatus === 11 ? (
                <div>
                  <Button
                    style={{ borderColor: 'red', backgroundColor: '#fff', color: 'red' }}
                    type="danger"
                  >
                    取消订单
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    type="danger"
                    onClick={() => {
                      this.props.setStatus('pageStatus', 21);
                    }}
                  >
                    申诉
                  </Button>
                  <Button
                    onClick={() => {
                      this.props
                        .dispatch({
                          type: 'card/releaseOrder',
                          payload: { order_id: order.id },
                        })
                        .then(res => {
                          if (res.code === 0) {
                            setStatus('pageStatus', 17);
                          }
                        });
                    }}
                    type="primary"
                  >
                    确认释放
                  </Button>
                </div>
              )}
            </div>

            <div className={styles.chatInfo}>
              <Select
                defaultValue="快捷短语"
                style={{ width: 260 }}
                onSelect={e => this.selectTerm(e)}
              >
                {CONFIG.term
                  ? CONFIG.term.map(t => {
                      return (
                        <Option key={t.id} value={t.id}>
                          {t.content}
                        </Option>
                      );
                    })
                  : null}
              </Select>
              <ul>
                <li>
                  <div className={styles.leftAvatar}>
                    <span className={styles.avaTop}>
                      <Avatar className={styles.avatar} size="large" icon="user" />
                    </span>
                    <span className={styles.avaName}>Jason</span>
                  </div>
                  <div className={styles.chatItem}>
                    <p className={styles.chatText}>
                      您好，请稍等片刻待我确认请稍等片刻待我确认请稍等片刻待我确认
                    </p>
                    <div className={styles.chatTime}>{new Date().toLocaleDateString()}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.stepBottomRight}>
            <div className={styles.largeBtnBox}>
              <Button onClick={() => setStatus('pageStatus', 16)}>查看礼品卡清单</Button>
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
