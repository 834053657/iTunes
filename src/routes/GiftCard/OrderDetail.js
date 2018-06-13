import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Avatar, Select } from 'antd';
import styles from './OrderDetail.less';
import StepModel from './Step';

const Option = Select.Option;

@connect(({ card }) => ({
  card,
}))
export default class OrderDetail extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const steps = [{ title: '打开交易' }, { title: '确认信息' }, { title: '完成' }];
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
                您向Jason购买总面额300的亚马逊美卡亚马逊美卡
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
                {'30'}分钟
              </h5>

              <Button
                type="danger"
                onClick={() => {
                  this.props.history.push({ pathname: `/card/buy-appeal` });
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
                  <Avatar size="large" icon="user" />
                </div>
                <div className={styles.avatarRight}>
                  <div className={styles.top}>
                    <span className={styles.name}>nickname</span>
                    <span className={styles.online}>&nbsp;</span>
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
      </div>
    );
  }
}
