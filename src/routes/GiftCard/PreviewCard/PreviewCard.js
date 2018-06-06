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
} from 'antd';
import styles from './PreviewCard.less';

const TabPane = Tabs.TabPane;
const Step = Steps.Step;

@connect(({ card }) => ({
  card,
}))
export default class Process extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  changeTab = e => {
    if (+e === 1) {
      this.props.history.push({ pathname: `/card/sell-ensureInfo` });
    }
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className={styles.stepBox}>
        <Steps current={1}>
          <Step title="打开交易" />
          <Step title="确认信息" />
          <Step
            onClick={() => {
              this.props.history.push({ pathname: `/card/sell-dealFinish` });
            }}
            title="完成"
          />
        </Steps>
        <div className={styles.orderInfo}>
          <h5>
            <span>订单：</span>
            <span className={styles.text}>115216524713875</span>
          </h5>
          <div className={styles.orderDescribe}>您向Jason购买总面额300的亚马逊美卡亚马逊美卡</div>
          <div className={styles.price}>
            <span>单价：</span>
            <span>1</span>RMB
          </div>
          <div>
            <span>总价：</span>
            <span>100</span>RMB
          </div>
        </div>
        <div className={styles.tabsLine}>
          <Tabs defaultActiveKey="2" onChange={this.changeTab} type="card">
            <TabPane tab="订单详情" key="1">
              Content of Tab Pane 1
            </TabPane>
            <TabPane tab="礼品卡清单" key="2">
              {' '}
              <CardInfoList />{' '}
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

function CardInfoList() {
  return (
    <div>
      <PicWithText />
    </div>
  );
}

function OnlyText() {
  return (
    <div className={styles.denomination}>
      <header>
        <span>item.money</span>
        面额 （item.items.length）
      </header>
      <section>
        <div className={styles.left}>
          <span>卡密：</span>
        </div>
        <div className={styles.right}>
          <div className={styles.iptBox}>
            <div className={styles.input}>ddqwdqwdwqdqwhdk1hkdhkd1221</div>
          </div>
          <div className={styles.iptBox}>
            <div className={styles.input}>ddqwdqwdwqdqwhdk1hkdhkd1221</div>
          </div>
          <div className={styles.iptBox}>
            <div className={styles.input}>ddqwdqwdwqdqwhdk1hkdhkd1221</div>
          </div>
          <div className={styles.iptBox}>
            <div className={styles.input}>ddqwdqwdwqdqwhdk1hkdhkd1221</div>
          </div>
          <div className={styles.iptBox}>
            <div className={styles.input}>ddqwdqwdwqdqwhdk1hkdhkd1221</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function OnlyPic() {
  return (
    <div>
      <div className={styles.denomination}>
        <header>
          <span>item.money</span>
          面额 （item.items.length）
        </header>
        <section className={styles.onlyPic}>
          <div className={styles.left}>
            <span>卡图：</span>
          </div>
          <div className={styles.center}>
            <div>
              <div className={styles.imgBox}>
                <img
                  width="85%"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  alt=""
                />
                <Icon className={styles.iconDel} type="minus-circle-o" />
              </div>
              <div className={styles.imgBox}>
                <img
                  width="85%"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  alt=""
                />
              </div>
            </div>
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
                <Icon className={styles.iconDel} type="minus-circle-o" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function PicWithText() {
  return (
    <div className={styles.picWithText}>
      <header>
        <span>item.money</span>
        面额 （item.items.length）
      </header>
      <section className={styles.picBox}>
        <div className={styles.left}>
          <ul>
            <li>
              <div className={styles.cardTop}>
                <span className={styles.title}>卡密：</span>
                <div className={styles.text}>ddqwdqwdwqdqwhdk1hkdhkd1221</div>
              </div>
              <div className={styles.cardBottom}>
                <span className={styles.title}>卡图：</span>
                <div className={styles.receiveBox}>
                  <img
                    width="100%"
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    alt=""
                  />
                </div>
              </div>
            </li>
            <li>
              <div className={styles.cardTop}>
                <span className={styles.title}>卡密：</span>
                <div className={styles.text}>ddqwdqwdwqdqwhdk1hkdhkd1221</div>
              </div>
              <div className={styles.cardBottom}>
                <span className={styles.title}>卡图：</span>
                <div className={styles.receiveBox}>
                  <img
                    width="100%"
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    alt=""
                  />
                </div>
              </div>
            </li>
            <li>
              <div className={styles.cardTop}>
                <span className={styles.title}>卡密：</span>
                <div className={styles.text}>ddqwdqwdwqdqwhdk1hkdhkd1221</div>
              </div>
              <div className={styles.cardBottom}>
                <span className={styles.title}>卡图：</span>
                <div className={styles.receiveBox}>
                  <img
                    width="100%"
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    alt=""
                  />
                </div>
              </div>
            </li>
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
}
