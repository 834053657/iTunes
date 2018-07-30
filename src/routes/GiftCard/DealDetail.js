import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { sumBy, map, get, findIndex, filter } from 'lodash';
import { Badge, Button, message, Avatar, Popover, Icon, Input, Spin, Form } from 'antd';
import DescriptionList from 'components/DescriptionList';
import InputNumber from 'components/InputNumber';
import PriceForm from './forms/PriceForm';
import styles from './DealDetail.less';

const { Description } = DescriptionList;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

@connect(({ card, loading }) => ({
  card,
  detail: card.adDetail,
  submitting: loading.effects['card/createSellOrder'],
  loading: loading.effects['card/fetchAdDetail'],
}))
@Form.create()
export default class DealDeatil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addDenoVisible: false,
      orderDetail: [],
    };
  }

  componentDidMount() {
    const { params: { id } } = this.props.match || {};
    this.fetch({ id });
  }

  fetch = param => {
    this.props.dispatch({
      type: 'card/fetchAdDetail',
      payload: param,
      callback: data => {
        this.setState({
          orderDetail: data.condition_type === 1 ? data.condition : [],
        });
      },
    });
  };

  calcuBuyTotal = () => {
    if (this.state.orderDetail.length <= 0) {
      return 0;
    }
    const { form: { getFieldValue }, detail = {} } = this.props;
    const total = sumBy(getFieldValue('order_detail'), row => {
      return row.money * row.count * detail.unit_price || 0;
    });

    return total;
  };

  calcuBuyTotal1 = (money = []) => {
    if (money.length <= 0) {
      return 0;
    }
    const { form: { getFieldValue }, detail = {} } = this.props;
    const total = sumBy(getFieldValue('order_detail'), row => {
      return row.money * row.count * detail.unit_price || 0;
    });

    return total;
  };

  calcuMaxCountBuy = (orderData, item) => {
    const accountBalance = get(this.props, 'detail.owner.amount');
    const { money, count } = item || {};
    const userBuySum = sumBy(orderData, row => {
      return row.money * row.count || 0;
    });
    const result = (accountBalance - userBuySum) * 10000 / money / 10000;
    return result < 0 ? 0 : +parseInt(result);
  };

  handleBack = () => {
    this.props.dispatch(routerRedux.goBack());
  };

  hideDenoVisible = () => {
    this.setState({
      addDenoVisible: false,
    });
  };

  showDenoVisible = () => {
    this.setState({
      addDenoVisible: true,
    });
  };

  handleAddDeno = price => {
    const { orderDetail = [] } = this.state;
    if (~findIndex(orderDetail, item => item.money === price)) {
      message.error(`面额${price}已存在`);
      return;
    }

    orderDetail.push({
      money: price,
      count: 0,
    });

    this.setState(
      {
        orderDetail,
      },
      this.hideDenoVisible
    );
  };

  checkCount = (rule, value, callback) => {
    const multiple = get(this.props, 'detail.multiple') || 0;
    if (value && value % multiple !== 0) {
      callback(`数量必须是${multiple}的倍数`);
    } else {
      callback();
    }
  };

  /**
   * ad_type = 1 是主动出售视图
   * ad_type = 2 是主动购买视图
   * @returns {*}
   */
  renderCondition = detail => {
    const { orderDetail, addDenoVisible } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { condition_type, ad_type, money = [], stock = {}, multiple = 0 } = detail || {};
    let { condition } = detail || {};
    const accountBalance = detail.owner.amount;
    let content = null;

    // 主动出售
    if (condition_type === 1) {
      // 指定面额
      condition = condition || [];
      content = (
        <div className={styles.order_detail_box}>
          {condition.map((c, index) => {
            getFieldDecorator(`order_detail[${index}].money`, { initialValue: c.money });
            return (
              <FormItem
                key={index}
                {...formItemLayout}
                label={`${c.money} 面额`}
                extra={`数量限额 ${c.min_count} - ${c.max_count}`}
              >
                {getFieldDecorator(`order_detail[${index}].count`, {
                  validateFirst: true,
                  rules: [
                    // {
                    //   required: true,
                    //   message: '请输入出售数量！',
                    // },
                    {
                      type: 'number',
                      min: c.min_count,
                      max: c.max_count,
                      message: `数量限额为${c.min_count} ~ ${c.max_count}`,
                    },
                    {
                      validator: this.checkCount,
                    },
                  ],
                })(
                  <InputNumber
                    min={0}
                    precision={0}
                    style={{ width: 200 }}
                    placeholder="请输入出售数量"
                  />
                )}
              </FormItem>
            );
          })}
        </div>
      );
    } else {
      // 面额区间
      content = (
        <div className={styles.order_detail_box}>
          {map(orderDetail, (c, index) => {
            getFieldDecorator(`order_detail[${index}].money`, { initialValue: c.money });
            const maxCount = this.calcuMaxCountBuy(
              getFieldValue(`order_detail`),
              getFieldValue(`order_detail[${index}]`)
            );
            return (
              <FormItem
                key={index}
                {...formItemLayout}
                label={`${c.money} 面额`}
                extra={` 最多可再出售${maxCount}个`}
              >
                {getFieldDecorator(`order_detail[${index}].count`, {
                  validateFirst: true,
                  rules: [
                    {
                      validator: this.checkCount,
                    },
                  ],
                })(
                  <InputNumber
                    min={0}
                    precision={0}
                    style={{ width: 200 }}
                    placeholder="请输入出售数量"
                  />
                )}
              </FormItem>
            );
          })}
          <Popover
            overlayStyle={{ zIndex: 1009 }}
            content={
              <PriceForm
                min={condition.min_money}
                max={condition.max_money}
                onCancel={this.hideDenoVisible}
                onSubmit={this.handleAddDeno}
              />
            }
            visible={addDenoVisible}
          >
            <Button onClick={this.showDenoVisible} className={styles.addBtn}>
              <Icon type="plus" />
              添加面额
            </Button>
          </Popover>
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
        <Spin spinning={this.props.loading} delay={1500}>
          <DescriptionList col={1}>
            <Description term="类型">
              {card_type && CONFIG.cardTypeMap && CONFIG.cardTypeMap[card_type]
                ? CONFIG.cardTypeMap[card_type].name
                : '-'}
            </Description>
            <Description term="要求">
              {password_type && CONFIG.cardPwdType ? CONFIG.cardPwdType[password_type] : '-'}
            </Description>
            <Description term="单价">{unit_price} RMB</Description>
            <Description term="倍数">{multiple}</Description>
          </DescriptionList>
          {this.renderCondition(detail)}
          <DescriptionList col={1}>
            <Description term="总价">{this.calcuBuyTotal()} RMB</Description>
            <Description term="发卡期限">{deadline} 分钟</Description>
            <Description term="保障时间">{guarantee_time} 分钟</Description>
          </DescriptionList>

          <FormItem className={styles.bottom}>
            <Button key="back" onClick={this.handleBack}>
              取消
            </Button>
            <Button
              loading={this.props.submitting}
              style={{ marginLeft: 15 }}
              type="primary"
              htmlType="submit"
            >
              确认出售
            </Button>
          </FormItem>
        </Spin>
      </div>
    );
  };
  /**
   * 主动购买视图
   * @param detail
   * @returns {*}
   */
  renderBuyerContent = detail => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { card_type, password_type, unit_price, guarantee_time = 0, money = [], stock = {} } =
      detail || {};

    return (
      <div className={styles.left}>
        <Spin spinning={this.props.loading} delay={1500}>
          <DescriptionList size="large" col={1}>
            <Description term="类型">
              {card_type && CONFIG.cardTypeMap && CONFIG.cardTypeMap[card_type]
                ? CONFIG.cardTypeMap[card_type].name
                : '-'}
            </Description>
            <Description term="包含">
              {password_type && CONFIG.cardPwdType ? CONFIG.cardPwdType[password_type] : '-'}
            </Description>
            <Description term="单价">{unit_price}RMB</Description>
          </DescriptionList>
          <div className={styles.order_detail_box}>
            {money.map((d, index) => {
              getFieldDecorator(`order_detail[${index}].money`, { initialValue: d });
              return (
                <FormItem
                  key={index}
                  {...formItemLayout}
                  label={`${d} 面额`}
                  extra={` 库存${stock[d] || 0}个`}
                >
                  {getFieldDecorator(`order_detail[${index}].count`, {
                    initialValue: 0,
                    validateFirst: true,
                    rules: [
                      {
                        type: 'number',
                        message: '请输入正确的数量',
                      },
                      {
                        type: 'number',
                        min: 0,
                        max: stock[d],
                        message: `库存不足`,
                      },
                    ],
                  })(
                    <InputNumber
                      min={0}
                      precision={0}
                      style={{ width: 200 }}
                      placeholder="请输入购买数量"
                    />
                  )}
                </FormItem>
              );
            })}
          </div>
          <DescriptionList size="large" col={1}>
            <Description term="总价">{this.calcuBuyTotal1(money)} RMB</Description>
            <Description term="保障时间">{guarantee_time} 分钟</Description>
          </DescriptionList>
          <FormItem className={styles.bottom}>
            <Button key="back" onClick={this.handleBack}>
              取消
            </Button>
            <Button
              loading={this.props.submitting}
              style={{ marginLeft: 15 }}
              disabled={this.calcuBuyTotal1(money) <= 0}
              type="primary"
              htmlType="submit"
            >
              确认购买
            </Button>
          </FormItem>
        </Spin>
      </div>
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    const { detail = {}, match: { params } } = this.props;
    console.log(params);
    this.props.form.validateFieldsAndScroll((err, values) => {
      values.order_detail = filter(values.order_detail, item => item.count > 0);
      if (!values.order_detail.length) {
        return message.warning('未填写面额详情');
      }
      if (!err && values.order_detail.length) {
        this.props.dispatch({
          type: 'card/createSellOrder',
          payload: {
            ad_id: +params.id,
            updated_at: detail.updated_at,
            ...values,
          },
          callback: res => {
            if (res.code === 606) {
              this.props.dispatch(routerRedux.push('/card/market'));
            }
            if (res.code === 607) {
              this.fetch({ id: +params.id });
            }
          },
        });
      }
    });
  };

  /**
   * ad_type = 1 是主动出售视图
   * ad_type = 2 是主动购买视图
   * @returns {*}
   */
  render() {
    const { detail } = this.props;
    const { owner = {}, ad_type, term } = detail || {};
    const userInfo = owner;
    if (!detail) {
      return false;
    }
    return (
      <div className={styles.detailBox}>
        <Form hideRequiredMark onSubmit={this.handleSubmit}>
          {ad_type === 1 ? this.renderSellContent(detail) : this.renderBuyerContent(detail)}
        </Form>

        <div className={styles.right}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <Avatar size="large" src={userInfo.avatar} />
            </div>
            <div className={styles.avatarRight}>
              <div className={styles.top}>
                <Badge status={userInfo.online ? 'success' : 'default'} offset={[11, 10]} dot>
                  <span className={styles.name}>{userInfo.nickname}</span>
                </Badge>
              </div>
              <div className={styles.infoBottom}>
                <span className={styles.dealTit}>30日成单：</span>
                <span className={styles.dealNum}>{userInfo.month_volume}</span>
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
