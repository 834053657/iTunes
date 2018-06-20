import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Avatar, Select } from 'antd';
import styles from './OrderDetail.less';
import StepModel from '../Step';

const Option = Select.Option;

@connect(({ card }) => ({
  card,
}))
export default class BuyerEnsure extends Component {
  constructor(props) {
    super();
    this.state = {
      detail: props.detail,
      user: props.user,
    };
  }
  componentDidMount() {
    console.log(this.state.detail);
  }

  render() {
    const { ad, cards, order } = this.props.detail;
    const { user, detail } = this.state;
    const steps = [{ title: '打开交易' }, { title: '确认信息' }, { title: '完成' }];
    const userInfo = ad.owner;
    return (
      <div className={styles.stepTwoBox}>
        <div>BuyerEnsure</div>
        <StepModel steps={steps} current={1} />
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <div className={styles.orderInfo}>
              <h5>
                <span>订单：</span>
                <span className={styles.text}>{order.order_no || '-'}</span>
              </h5>
              <div className={styles.orderDescribe}>
                {this.props.orderTitle(ad, cards, order, user)}
                总面额{order.money}的
                {order.order_type ? CONFIG.card_type[order.order_type - 1].name || '-' : '-'}
              </div>
              <div className={styles.price}>
                <span>单价：</span>
                <span>1</span>RMB
              </div>
              <div>
                <span>总价：</span>
                <span>100</span>RMB
              </div>
            </div>

            <div className={styles.guarantee}>
              <h5>
                保障时间剩余 &nbsp;
                <Icon type="clock-circle-o" />
                &nbsp;
                {ad.guarantee_time}分钟
              </h5>

              <Button
                type="danger"
                onClick={() => {
                  this.props.dispatch({
                    type: 'card/appealOrder',
                    payload: { order_id: order.id },
                  });
                }}
              >
                申诉
              </Button>
              <Button type="primary">确认释放</Button>
            </div>

            <div className={styles.chatInfo}>
              <Select defaultValue="lucy" style={{ width: 120 }}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
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
              <Button>查看礼品卡清单</Button>
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
