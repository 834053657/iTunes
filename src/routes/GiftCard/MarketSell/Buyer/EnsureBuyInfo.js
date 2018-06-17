import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Button, Icon, Steps, Avatar, Select } from 'antd';
import styles from '../../MarketBuy/StepTwo.less';
import StepModel from '../../Step';

const Step = Steps.Step;
const Option = Select.Option;

@connect(({ card }) => ({
  card,
}))
export default class EnsureBuyInfo extends Component {
  constructor(props) {
    super();
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { setStatus } = this.props;
    const { ad, cards, order, trader } = this.props.detail;

    const userInfo = ad.owner;

    const steps = [{ title: '查收礼品卡' }, { title: '确认信息' }, { title: '完成' }];
    return (
      <div className={styles.stepTwoBox}>
        <StepModel steps={steps} current={1} />

        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <div className={styles.orderInfo}>
              <h5>
                <span>订单：</span>
                <span className={styles.text}>115216524713875</span>
              </h5>
              <div className={styles.orderDescribe}>
                {`${trader.nickname}向您出售总面额${order.money}的${
                  CONFIG.card_type[order.order_type].name
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
                {'30'}分钟
              </h5>
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
                  setStatus('pageStatus', 3);
                }}
                type="primary"
              >
                确认释放
              </Button>
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
