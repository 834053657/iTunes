import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import {
  Table,
  Tabs,
  Button,
  Icon,
  Pagination,
  Input,
  message,
  InputNumber,
  Avatar,
  Popover,
} from 'antd';
import styles from './DealDetail.less';

@connect(({ card }) => ({
  card,
}))
export default class DealDeatil extends Component {
  constructor(props) {
    super();
    this.state = {};

    this.postData = {
      order_type: 1, //1代表购买  2代表出售
      ad_id: 20, //广告ID
      order_detail: [], // 订单详情
    };
    this.ensureOrder = () => {
      this.props
        .dispatch({
          type: 'card/ensureBuyOrder',
          payload: this.postData,
        })
        .then(() => {
          this.postData.order_detail = [];
        });
      this.props.history.push({ pathname: `/card/buy-stepTwo` });
    };
  }

  changeNum = (e, d) => {
    const index = this.postData.order_detail.findIndex(t => {
      return t.money === d;
    });

    if (index >= 0) {
      this.postData.order_detail[index].count = e;
    } else {
      this.postData.order_detail.push({
        money: d,
        count: e,
      });
    }
    console.log(this.postData);
  };

  componentWillMount() {
    const adInfo = this.props.location.query;
    console.log(this.props);
    this.props.dispatch({
      type: 'card/getSellDetail',
      //payload: this.order_id,
    });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { card } = this.props;
    let data;

    function passwordType(n) {
      if (n === 1) return '密码';
      if (n === 2) return '图片';
      if (n === 3) return '密码和图片';
    }

    function getStock(d) {}

    function amountMoney() {
      const a = 0;
      // if (card.buyDetail) {
      //   card.buyDetail.ad_info.cards.map(i => {
      //     return (a += i.count * i.money);
      //   });
      // }
      return a;
    }

    if (card.sellDetail) {
      data = card.sellDetail.data;
      const ownerInfo = data.owner;
      const type = CONFIG.card_type;

      return (
        <div className={styles.detailBox}>
          <div className={styles.left}>
            <ul>
              <li className={styles.item}>
                <span className={styles.title}>类型：</span>
                <div className={styles.content}>{type[data.card_type].name}</div>
              </li>
              <li className={styles.item}>
                <span className={styles.title}>包含：</span>
                <div className={styles.content}>{passwordType(data.password_type)}</div>
              </li>
              <li className={styles.item}>
                <span className={styles.title}>单价：</span>
                <div className={styles.content}>{data.unit_price}RMB</div>
              </li>
              <li className={styles.denoList}>
                <ul>
                  {data.money.map((d, index) => {
                    return (
                      <li key={d}>
                        <span className={styles.denoTitle}>{d}面额：</span>
                        <div className={styles.denoIpt}>
                          <InputNumber
                            min={0}
                            max={18}
                            defaultValue={0}
                            onChange={e => this.changeNum(e, d)}
                          />
                        </div>
                        <span className={styles.last}>库存({getStock(d)})</span>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className={styles.item}>
                <span className={styles.title}>总价：</span>
                <div className={styles.content}>{amountMoney()}RMB</div>
              </li>
              <li className={styles.item}>
                <span className={styles.title}>保障时间：</span>
                <div className={styles.content}>{data.guarantee_time}分钟</div>
              </li>
            </ul>
            <div className={styles.bottom}>
              <Button>取消</Button>
              <Button
                type="primary"
                onClick={() => {
                  this.ensureOrder();
                }}
              >
                确认购买
              </Button>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <Avatar size="large" src={ownerInfo.avatar} />
              </div>
              <div className={styles.avatarRight}>
                <div className={styles.top}>
                  <span className={styles.name}>{ownerInfo.nickname}</span>
                  <span className={styles.online}>&nbsp;</span>
                </div>
                <div className={styles.infoBottom}>
                  <span className={styles.dealTit}>30日成单：</span>
                  <span className={styles.dealNum}>{ownerInfo.month_volume}</span>
                </div>
              </div>
            </div>
            <div className={styles.term}>
              <h3>交易条款：</h3>
              <p>{data.term}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}
