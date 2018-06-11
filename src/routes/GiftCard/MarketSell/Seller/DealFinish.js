import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Table,
  Button,
  Icon,
  Pagination,
  Input,
  message,
  InputNumber,
  Steps,
  Avatar,
  Select,
  Upload,
  Modal,
  Rate,
} from 'antd';
import styles from './DealFinish.less';
import StepModel from '../../Step';

const Step = Steps.Step;
const Option = Select.Option;
const { TextArea } = Input;

@connect(({ card }) => ({
  card,
}))
export default class Process extends Component {
  constructor(props) {
    super();
    this.state = {
      star: null,
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const steps = [
      {title: "发送礼品卡"},
      {title: "确认信息"},
      {title: "完成"}
    ]
    return (
      <div className={styles.buyFinish}>
        <StepModel
          steps={steps}
          current={2}
        />

        <div className={styles.finishBox}>
          <div className={styles.left}>
            <div className={styles.orderInfo}>
              <h5>
                <span>订单：</span>
                <span>115216524713875</span>
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
            <div className={styles.term}>
              <h3>交易条款：</h3>
              <p>info.term</p>
            </div>
          </div>

          <div className={styles.right}>
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
              <div className={styles.evaluate}>
                <h4>你好，评价一下我的服务吧~</h4>
                <div className={styles.rate}>
                  <Rate
                    allowHalf
                    onChange={e => {
                      this.setState({
                        star: e,
                      });
                    }}
                  />
                  <span className={styles.starNumber}>{this.state.star}</span>
                </div>
              </div>
              <div className={styles.editor}>
                <TextArea rows={4} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
