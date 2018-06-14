import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Badge, Button, message, InputNumber, Avatar } from 'antd';
import { postSellOrder } from '../../services/api';
import styles from './DealDetail.less';

@connect(({ card }) => ({
  detail: card.adDetail,
}))
export default class DealDeatil extends Component {
  constructor(props) {
    super();
    this.state = {
      orderId: null,
    };
    this.postData = {
      // order_type: props.card.adDetail.ad_type, //1代表购买  2代表出售
      ad_id: props.match.params.id, //广告ID
      order_detail: [], // 订单详情
    };
  }

  ensureOrder = () => {
    this.props
      .dispatch({
        type: 'card/createBuyOrder',
        payload: this.postData,
      })
      .then(res => {
        this.setState({
          orderId: res.order_id,
        });
      })
      .then(() => {
        this.props.history.push({
          pathname: `/card/deal-line/${this.state.orderId}`,
        });
      });
  };

  handlerBuy = () => {
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

  handlerSell = async () => {
    this.props
      .dispatch({
        type: 'card/createBuyOrder',
        payload: this.postData,
      })
      .then(res => {
        this.setState({
          orderId: res.order_id,
        });
      })
      .then(() => {
        this.props.history.push({
          pathname: `/card/deal-line/${this.state.orderId}`,
        });
      });
  };

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

  componentDidMount() {
    const { params: { id } } = this.props.match || {};
    this.props.dispatch({
      type: 'card/fetchAdDetail',
      payload: { id },
      callback: res => {
        console.log(res.ad_type);
        console.log('res');
        if (res.ad_type === 1) {
          this.postData.order_type = 2;
        } else if (res.ad_type === 2) {
          this.postData.order_type = 1;
        }
      },
    });
  }

  /**
   * ad_type = 1 是主动出售视图
   * ad_type = 2 是主动购买视图
   * @returns {*}
   */
  renderCondition = detail => {
    const { condition_type, ad_type, money = [], stock = {} } = detail || {};
    let { condition } = detail || {};
    let content = null;
    // 主动出售
    if (condition_type === 1) {
      // 指定面额
      condition = condition || [];
      content = (
        <ul>
          {condition.map((c, index) => {
            return (
              <li key={`${index}${c.money}`}>
                <span className={styles.denoTitle}>{c.money}面额:</span>
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

    return content;
  };

  /**
   * 主动出售视图
   * @param detail
   * @returns {*}
   */
  renderSellContent = detail => {
    const { card_type, password_type, unit_price, deadline = 0, multiple = 0, guarantee_time } =
      detail || {};

    return (
      <div className={styles.left}>
        <ul>
          <li className={styles.item}>
            <span className={styles.title}>类型:</span>
            <div className={styles.content}>
              {card_type && CONFIG.cardTypeMap[card_type]
                ? CONFIG.cardTypeMap[card_type].name
                : '-'}
            </div>
          </li>

          <li className={styles.item}>
            <span className={styles.title}>要求:</span>
            <div className={styles.content}>
              {password_type ? CONFIG.cardPwdType[password_type] : '-'}
            </div>
          </li>

          <li className={styles.item}>
            <span className={styles.title}>单价:</span>
            <div className={styles.content}>{unit_price}RMB</div>
          </li>

          <li className={styles.item}>
            <span className={styles.title}>倍数:</span>
            <div className={styles.content}>{multiple}</div>
          </li>

          <li className={styles.denoList}>{this.renderCondition(detail)}</li>
          <li className={styles.item}>
            <span className={styles.title}>总价:</span>
            <div className={styles.content}>{33}RMB</div>
          </li>
          <li className={styles.item}>
            <span className={styles.title}>发卡期限:</span>
            <div className={styles.content}>{deadline}分钟</div>
          </li>
          <li className={styles.item}>
            <span className={styles.title}>保障时间:</span>
            <div className={styles.content}>{guarantee_time}分钟</div>
          </li>
        </ul>
        <div className={styles.bottom}>
          <Button>取消</Button>
          <Button type="primary" onClick={this.handlerSell}>
            确认出售
          </Button>
        </div>
      </div>
    );
  };
  /**
   * 主动购买视图
   * @param detail
   * @returns {*}
   */
  renderBuyerContent = detail => {
    const { card_type, password_type, unit_price, guarantee_time = 0, money = [], stock = {} } =
      detail || {};

    return (
      <div className={styles.left}>
        <ul>
          <li className={styles.item}>
            <span className={styles.title}>类型:</span>
            <div className={styles.content}>
              {card_type && CONFIG.cardTypeMap[card_type]
                ? CONFIG.cardTypeMap[card_type].name
                : '-'}
            </div>
          </li>
          <li className={styles.item}>
            <span className={styles.title}>包含:</span>
            <div className={styles.content}>
              {password_type ? CONFIG.cardPwdType[password_type] : '-'}
            </div>
          </li>
          <li className={styles.item}>
            <span className={styles.title}>单价:</span>
            <div className={styles.content}>{unit_price}RMB</div>
          </li>
          <li className={styles.denoList}>
            <ul>
              {money.map(d => {
                return (
                  <li key={d}>
                    <span className={styles.denoTitle}>{d}面额:</span>
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
          </li>

          <li className={styles.item}>
            <span className={styles.title}>总价:</span>
            <div className={styles.content}>{33}RMB</div>
          </li>

          <li className={styles.item}>
            <span className={styles.title}>保障时间:</span>
            <div className={styles.content}>{guarantee_time}分钟</div>
          </li>
        </ul>
        <div className={styles.bottom}>
          <Button>取消</Button>
          <Button type="primary" onClick={this.ensureOrder}>
            确认购买
          </Button>
        </div>
      </div>
    );
  };

  /**
   * ad_type = 1 是主动出售视图
   * ad_type = 2 是主动购买视图
   * @returns {*}
   */
  render() {
    const { detail } = this.props;
    console.log(detail);
    const { owner = {}, ad_type, term } = detail || {};

    return (
      <div className={styles.detailBox}>
        <h1>{ad_type === 1 ? '主动出售视图 ad_type = 1' : '主动购买视图 ad_type = 2'}</h1>
        {ad_type === 2 ? this.renderBuyerContent(detail) : this.renderSellContent(detail)}
        <div className={styles.right}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <Avatar size="large" src={owner.avatar} />
            </div>
            <div className={styles.avatarRight}>
              <div className={styles.top}>
                <Badge status="success" dot>
                  <span className={styles.name}>{owner.nickname}</span>
                </Badge>
                {/*<span className={styles.online}>&nbsp;</span>*/}
              </div>
              <div className={styles.infoBottom}>
                <span className={styles.dealTit}>30日成单:</span>
                <span className={styles.dealNum}>{owner.month_volume}</span>
              </div>
            </div>
          </div>
          <div className={styles.term}>
            <h3>交易条款:</h3>
            <p>{term}</p>
          </div>
        </div>
      </div>
    );
  }
}
