import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Table,
  Tabs,
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
} from 'antd';
import styles from './SendCard.less';

const Step = Steps.Step;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

@connect(({ card }) => ({
  card,
}))
export default class Process extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className={styles.sendBox}>
        <Steps current={0}>
          <Step title="发送礼品卡" />
          <Step title="确认信息" />
          <Step title="完成" />
        </Steps>
        <div className={styles.top}>
          <div className={styles.orderInfo}>
            <div className={styles.price}>
              <span>类型：</span>
              <p>美国亚马逊卡</p>
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
        <div className={styles.bottom}>
          <div className={styles.denomination}>
            <header>
              <span>item.money</span>
              面额 item.items.length
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
                    <Input type="text" />
                    <Input type="text" />
                    <Input type="text" />
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className={styles.denomination}>
            <header>
              <span>item.money</span>
              面额 item.items.length
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
                    <Input type="text" />
                    <Input type="text" />
                    <Input type="text" />
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className={styles.denomination}>
            <header>
              <span>item.money</span>
              面额 item.items.length
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
                    <Input type="text" />
                    <Input type="text" />
                    <Input type="text" />
                  </div>
                </div>
              </div>
            </section>
          </div>
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
                  this.props.history.push({ pathname: `/card/sell-ensureInfo` });
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
