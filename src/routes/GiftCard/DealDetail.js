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
  detail: card.adDetail,
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
  };

  componentWillMount() {
    const { params: { id } } = this.props.match || {};
    this.props.dispatch({
      type: 'card/fetchAdDetail',
      payload: { id },
    });
  }

  renderCondition = detail => {
    const { condition_type, ad_type, money = [], stock = {} } = detail || {};
    let { condition } = detail || {};
    let content = null;

    if (ad_type === 1) {
      // 主动购买
      if (condition_type === 1) {
        // 指定面额
        condition = condition || [];
        content = (
          <ul>
            {condition.map((c, index) => {
              return (
                <li key={`${index}${c.money}`}>
                  <span className={styles.denoTitle}>{c.money}面额：</span>
                  <div className={styles.denoIpt}>
                    <InputNumber
                      min={c.min_count}
                      max={c.max_count}
                      defaultValue={0}
                      onChange={e => this.changeNum(e, c)}
                    />
                    <span className={styles.last}>
                      数量限额<span>{c.min_count}</span>-<span>{c.max_count}</span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        );
      } else {
        // 面额区间
        // condition = condition || {}
        content = (
          <ul>
            <li>面额区间</li>
          </ul>
        );
      }
    } else {
      // 主动出售
      content = (
        <ul>
          {money.map(d => {
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
                <span className={styles.last}>库存({stock[d] || 0})</span>
              </li>
            );
          })}
        </ul>
      );
    }

    return content;
  };

  render() {
    const { detail } = this.props;
    const { owner = {}, card_type, password_type, unit_price, guarantee_time, term } = detail || {};

    return (
      <div className={styles.detailBox}>
        <div className={styles.left}>
          <ul>
            <li className={styles.item}>
              <span className={styles.title}>类型：</span>
              <div className={styles.content}>
                {card_type && CONFIG.cardTypeMap[card_type]
                  ? CONFIG.cardTypeMap[card_type].name
                  : '-'}
              </div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>包含：</span>
              <div className={styles.content}>
                {password_type ? CONFIG.cardPwdType[password_type] : '-'}
              </div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>单价：</span>
              <div className={styles.content}>{unit_price}RMB</div>
            </li>
            <li className={styles.denoList}>{this.renderCondition(detail)}</li>
            <li className={styles.item}>
              <span className={styles.title}>总价：</span>
              <div className={styles.content}>{33}RMB</div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>保障时间：</span>
              <div className={styles.content}>{guarantee_time}分钟</div>
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
              <Avatar size="large" src={owner.avatar} />
            </div>
            <div className={styles.avatarRight}>
              <div className={styles.top}>
                <span className={styles.name}>{owner.nickname}</span>
                <span className={styles.online}>&nbsp;</span>
              </div>
              <div className={styles.infoBottom}>
                <span className={styles.dealTit}>30日成单：</span>
                <span className={styles.dealNum}>{owner.month_volume}</span>
              </div>
            </div>
          </div>
          <div className={styles.term}>
            <h3>交易条款：</h3>
            <p>{term}</p>
          </div>
        </div>
      </div>
    );
  }
}
