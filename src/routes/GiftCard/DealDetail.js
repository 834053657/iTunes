import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Badge, Button, message, InputNumber, Avatar, Popover, Icon, Input } from 'antd';
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
      addDenoVisible: false,
      denoValue: '',
      orderData: [],
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
        if (res) {
          this.setState({
            orderId: res.order_id,
          });
          this.props.history.push({
            pathname: `/card/deal-line/${res.order_id}`,
          });
        }
      });
  };

  handlerSell = async () => {
    console.log(this.postData);
    this.props
      .dispatch({
        type: 'card/createSellOrder',
        payload: this.postData,
      })
      .then(res => {
        console.log(res);
        if (res) {
          this.setState({
            orderId: res.order_id,
          });
          this.props.dispatch(routerRedux.push(`/card/deal-line/${res.order_id}`));
        }
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
        money: +d,
        count: e,
      });
    }
  };

  changeFixedNum = (e, c) => {
    const index = this.postData.order_detail.findIndex(t => {
      return t.money === c.money;
    });

    if (index >= 0) {
      this.postData.order_detail[index].count = e;
    } else {
      this.postData.order_detail.push({
        money: +c.money,
        count: e,
      });
    }
  };

  changeRangeDataNum = (e, index) => {
    this.state.orderData[index].count = e;
    this.postData.order_detail = this.state.orderData;
  };

  addDenoInRange = () => {
    const { orderData, denoValue } = this.state;
    orderData.push({
      money: +denoValue,
    });
    this.setState({
      orderData,
    });
  };

  componentDidMount() {
    const { params: { id } } = this.props.match || {};
    this.props.dispatch({
      type: 'card/fetchAdDetail',
      payload: { id },
      callback: res => {
        // if (res.ad_type === 1) {
        //   this.postData.order_type = 2;
        // } else if (res.ad_type === 2) {
        //   this.postData.order_type = 1;
        // }
        if (res.ad_type === 2) {
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
        <ul className={styles.ulrangeDeno}>
          {condition.map((c, index) => {
            return (
              <li key={index}>
                <span className={styles.denoTitle}>{c.money}面额:</span>
                <div className={styles.denoIpt}>
                  <InputNumber
                    min={+c.min_count}
                    max={+c.max_count}
                    defaultValue={0}
                    onChange={e => this.changeFixedNum(e, c)}
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
      const addDenoNode = (
        <div className={styles.addDenoNode}>
          <Input
            onChange={e => {
              this.setState({ denoValue: e.target.value });
            }}
            value={this.state.denoValue}
          />
          <h5>
            可添加面额：{condition.min_money}-{condition.max_money}
          </h5>
          <div>
            <Button onClick={() => this.setState({ addDenoVisible: false })}>取消</Button>
            <Button
              onClick={() => {
                this.addDenoInRange();
                this.setState({ addDenoVisible: false });
              }}
              type="primary"
            >
              确认
            </Button>
          </div>
        </div>
      );
      content = (
        <div className={styles.rangeDeno}>
          <ul className={styles.ulrangeDeno}>
            {this.state.orderData
              ? this.state.orderData.map((c, index) => {
                  return (
                    <li key={index}>
                      <span className={styles.denoTitle}>{c.money}面额:</span>
                      <div className={styles.denoIpt}>
                        <InputNumber
                          //max={c.count}
                          defaultValue={0}
                          onChange={e => this.changeRangeDataNum(e, index)}
                        />
                        <span className={styles.last}>最多可出售xx个</span>
                      </div>
                    </li>
                  );
                })
              : null}
          </ul>
          <ul className={styles.addBtn}>
            <li>
              <Popover
                content={addDenoNode}
                trigger="click"
                visible={this.state.addDenoVisible}
                onVisibleChange={() => {
                  if (!this.state.addDenoVisible) {
                    this.setState({
                      denoValue: '',
                    });
                  }
                  this.setState({ addDenoVisible: !this.state.addDenoVisible });
                }}
              >
                <Button>
                  <Icon type="plus" />
                  添加面额
                </Button>
              </Popover>
            </li>
          </ul>
        </div>
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
              {card_type && CONFIG.card_type[card_type - 1]
                ? CONFIG.card_type[card_type - 1].name
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

          <li className={styles.item}>{this.renderCondition(detail)}</li>
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
                        max={19}
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
    const { owner = {}, ad_type, term } = detail || {};
    return (
      <div className={styles.detailBox}>
        <h1>{ad_type === 1 ? '主动出售视图 ad_type = 1' : '主动购买视图 ad_type = 2'}</h1>
        {ad_type === 1 ? this.renderSellContent(detail) : this.renderBuyerContent(detail)}
        <div className={styles.right}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <Avatar size="large" src={owner.avatar} />
            </div>
            <div className={styles.avatarRight}>
              <div className={styles.top}>
                <Badge offset={[12, 8]} status={owner.online ? 'success' : 'default'} dot>
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
