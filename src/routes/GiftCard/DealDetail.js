import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import {sumBy, map, get, findIndex, filter} from 'lodash';
import {Badge, Button, message, Avatar, Popover, Icon, Input, Spin, Form, Popconfirm} from 'antd';
import DescriptionList from 'components/DescriptionList';
import InputNumber from 'components/InputNumber';
import PriceForm from './forms/PriceForm';
import styles from './DealDetail.less';
import {formatMoney} from '../../utils/utils';

const {Description} = DescriptionList;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    sm: {span: 6},
  },
  wrapperCol: {
    sm: {span: 18},
  },
};
const msg = defineMessages({
  num_amount_limit_sell: {
    id: 'dealDetail.num_amount_limit_sell',
    defaultMessage: '请输入出售数量',
  },
  buy_amount_money_stock: {
    id: 'dealDetail.buy_amount_money_stock',
    defaultMessage: '库存{Stock}个',
  },
  num_amount_buy_input: {
    id: 'dealDetail.num_amount_buy_input',
    defaultMessage: '请输入购买数量',
  },
  num_amount_sell_input: {
    id: 'dealDetail.num_amount_sell_input',
    defaultMessage: '请输入购买数量',
  },
  sell_sure_sell: {
    id: 'dealDetail.sell_sure_sell',
    defaultMessage: '确认出售',
  },
  buy_sure_btn: {
    id: 'dealDetail.buy_sure_btn',
    defaultMessage: '确认购买',
  },
  buy_amount_details: {
    id: 'dealDetail.buy_amount_details',
    defaultMessage: '未填写面额详情',
  },
  sure_to_buy: {
    id: 'dealDetail.sure_to_buy',
    defaultMessage: '确认要购买吗？',
  },
  sure_to_sell: {
    id: 'dealDetail.sure_to_sell',
    defaultMessage: '确认要出售吗？',
  },
  sell_yes: {
    id: 'dealDetail.sell_yes',
    defaultMessage: '是',
  },
  sell_no:{
    id: 'dealDetail.sell_no',
    defaultMessage: '否',
  }
});
@injectIntl()
@connect(({card, loading}) => ({
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
      totalMoney: 0,
    };
  }

  componentDidMount() {
    const {params: {id}} = this.props.match || {};
    this.fetch({id});
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'card/GET_AD_DETAIL',
    });
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
    const {form: {getFieldValue}, detail = {}} = this.props;
    const total = sumBy(getFieldValue('order_detail'), row => {
      return row.money * row.count * detail.unit_price || 0;
    });

    return total
  };

  calcuBuyTotal1 = (money = []) => {
    if (money.length <= 0) {
      return 0;
    }
    const {form: {getFieldValue}, detail = {}} = this.props;
    const total = sumBy(getFieldValue('order_detail'), row => {
      return row.money * row.count * detail.unit_price || 0;
    });
    return total
  };

  calcuMaxCountBuy = (orderData, item) => {
    const accountBalance = get(this.props, 'detail.owner.amount');
    const unit_price = get(this.props, 'detail.unit_price') || 0;
    const {money, count} = item || {};
    const userBuySum = sumBy(orderData, row => {
      return row.money * row.count * unit_price || 0;
    });
    const result = (accountBalance - userBuySum) * 10000 / money / unit_price / 10000;

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
    const {orderDetail = []} = this.state;
    if (~findIndex(orderDetail, item => item.money === price)) {
      message.error(PROMPT('dealDetail.num_amount_price', {price}));
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
      callback(
        <FM
          id="dealDetail.num_multiple"
          defaultMessage="数量必须是{multiple}的倍数"
          values={{multiple}}
        />
      );
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
    const {orderDetail, addDenoVisible} = this.state;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {condition_type, ad_type, money = [], stock = {}, multiple = 0} = detail || {};
    let {condition} = detail || {};
    const accountBalance = detail.owner.amount;
    let content = null;

    // 主动出售
    if (condition_type === 1) {
      // 指定面额
      condition = condition || [];
      content = (
        <div className={styles.order_detail_box}>
          {condition.map((c, index) => {
            const moneys = c.money;
            const min_con = c.min_count;
            const max_con = c.max_count;
            getFieldDecorator(`order_detail[${index}].money`, {initialValue: c.money});
            return (
              <FormItem
                key={index}
                {...formItemLayout}
                label={
                  <FM
                    id="dealDetail.num_amount"
                    defaultMessage="{moneys} 面额"
                    values={{moneys}}
                  />
                }
                extra={
                  <FM
                    id="dealDetail.num_amount_limit"
                    defaultMessage="数量限额 {min_con} - {max_con}"
                    values={{min_con, max_con}}
                  />
                }
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
                      message: (
                        <FM
                          id="dealDetail.num_amount_limit_section"
                          defaultMessage="数量限额为 {min_con} - {max_con}"
                          values={{min_con, max_con}}
                        />
                      ),
                    },
                    {
                      validator: this.checkCount,
                    },
                  ],
                })(
                  <InputNumber
                    min={0}
                    precision={0}
                    style={{width: 200}}
                    placeholder={this.props.intl.formatMessage(msg.num_amount_limit_sell)}
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
            const Money = c.money;
            getFieldDecorator(`order_detail[${index}].money`, {initialValue: c.money});
            const maxCount = this.calcuMaxCountBuy(
              getFieldValue(`order_detail`),
              getFieldValue(`order_detail[${index}]`)
            );
            return (
              <FormItem
                key={index}
                {...formItemLayout}
                label={
                  <FM
                    id="dealDetail.num_amount_money"
                    defaultMessage="{Money} 面额"
                    values={{Money}}
                  />
                }
                extra={
                  <FM
                    id="dealDetail.num_amount_maxCount"
                    defaultMessage="最多可再出售{maxCount}个"
                    values={{maxCount}}
                  />
                }
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
                    style={{width: 200}}
                    placeholder={this.props.intl.formatMessage(msg.num_amount_sell_input)}
                  />
                )}
              </FormItem>
            );
          })}
          <Popover
            overlayStyle={{zIndex: 1009}}
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
              <FM id="dealDetail.num_add_amount" defaultMessage="添加面额" />
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
    const {card_type, password_type, unit_price, deadline = 0, multiple = 0, guarantee_time} =
    detail || {};
    const {totalMonty} = this.state
    return (
      <div className={styles.left}>
        <Spin spinning={this.props.loading} delay={1500}>
          <DescriptionList col={1}>
            <Description term={<FM id="dealDetail.sell_type" defaultMessage="类型" />}>
              {card_type && CONFIG.cardTypeMap && CONFIG.cardTypeMap[card_type]
                ? CONFIG.cardTypeMap[card_type].name
                : '-'}
            </Description>
            <Description term={<FM id="dealDetail.sell_require" defaultMessage="要求" />}>
              {password_type && CONFIG.cardPwdType ? CONFIG.cardPwdType[password_type] : '-'}
            </Description>
            <Description term={<FM id="dealDetail.sell_unit_price" defaultMessage="单价" />}>
              {unit_price} RMB
            </Description>
            <Description term={<FM id="dealDetail.sell_num_multiple" defaultMessage="倍数" />}>
              {multiple}
            </Description>
          </DescriptionList>
          {this.renderCondition(detail)}
          <DescriptionList col={1}>
            <Description term={<FM id="dealDetail.sell_all_price" defaultMessage="总价" />}>
              {formatMoney(this.calcuBuyTotal())} RMB
            </Description>
            <Description term={<FM id="dealDetail.sell_deadLine" defaultMessage="发卡期限" />}>
              {deadline} <FM id="dealDetail._minute" defaultMessage="分钟" />
            </Description>
            <Description term={<FM id="dealDetail.sell_safe_time" defaultMessage="保障时间" />}>
              {guarantee_time} <FM id="dealDetail._minute_1" defaultMessage="分钟" />
            </Description>
          </DescriptionList>

          <FormItem className={styles.bottom}>
            <Button key="back" onClick={this.handleBack}>
              <FM id="dealDetail.sell_toDelete" defaultMessage="取消" />
            </Button>

            <Popconfirm
              title={this.props.intl.formatMessage(msg.sure_to_sell)}
              onConfirm={this.handleSubmit}
              okText={this.props.intl.formatMessage(msg.sell_yes)}
              cancelText={this.props.intl.formatMessage(msg.sell_no)}
            >
              <Button
                loading={this.props.submitting}
                style={{marginLeft: 15}}
                type="primary"
                htmlType="submit"
              >
                {/*<FM id="dealDetail.sell_sure_sell" defaultMessage="确认出售" />*/}
                {this.props.intl.formatMessage(msg.sell_sure_sell)}

              </Button>
            </Popconfirm>


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
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {card_type, password_type, unit_price, guarantee_time = 0, money = [], stock = {}} =
    detail || {};
    const {totalMoney} = this.state

    return (
      <div className={styles.left}>
        <Spin spinning={this.props.loading} delay={1500}>
          <DescriptionList size="large" col={1}>
            <Description term={<FM id="dealDetail.buy_type" defaultMessage="类型" />}>
              {card_type && CONFIG.cardTypeMap && CONFIG.cardTypeMap[card_type]
                ? CONFIG.cardTypeMap[card_type].name
                : '-'}
            </Description>
            <Description term={<FM id="dealDetail.buy_contain" defaultMessage="包含" />}>
              {password_type && CONFIG.cardPwdType ? CONFIG.cardPwdType[password_type] : '-'}
            </Description>
            <Description term={<FM id="dealDetail.buy_unit_price" defaultMessage="单价" />}>
              {unit_price}RMB
            </Description>
          </DescriptionList>
          <div className={styles.order_detail_box}>
            {money.map((d, index) => {
              const Stock = stock[d] || 0;
              getFieldDecorator(`order_detail[${index}].money`, {initialValue: d});
              return (
                <FormItem
                  key={index}
                  {...formItemLayout}
                  label={
                    <FM
                      id="dealDetail.buy_amount_money_d"
                      defaultMessage="{d} 面额"
                      values={{d}}
                    />
                  }
                  extra={this.props.intl.formatMessage(msg.buy_amount_money_stock ,{Stock})}
                  // extra={<FM id="dealDetail.buy_amount_money_stock" defaultMessage="库存{Stock}个"  values={{Stock}} />}
                >
                  {getFieldDecorator(`order_detail[${index}].count`, {
                    initialValue: 0,
                    validateFirst: true,
                    rules: [
                      {
                        type: 'number',
                        message: (
                          <FM id="dealDetail.buy_amount_right" defaultMessage="请输入正确的数量" />
                        ),
                      },
                      {
                        type: 'number',
                        min: 0,
                        max: stock[d],
                        message: <FM id="dealDetail.buy_stock_num" defaultMessage="库存不足" />,
                      },
                    ],
                  })(
                    <InputNumber
                      min={0}
                      precision={0}
                      style={{width: 200}}
                      placeholder={this.props.intl.formatMessage(msg.num_amount_buy_input)}
                    />
                  )}
                </FormItem>
              );
            })}
          </div>
          <DescriptionList size="large" col={1}>
            <Description term={<FM id="dealDetail.buy_all_moneys" defaultMessage="总价" />}>
              {formatMoney(this.calcuBuyTotal1(money))} RMB
            </Description>
            <Description term={<FM id="dealDetail.buy_safe_time" defaultMessage="保障时间" />}>
              {guarantee_time} <FM id="dealDetail.buy_time_minute" defaultMessage="分钟" />
            </Description>
          </DescriptionList>
          <FormItem className={styles.bottom}>
            <Button key="back" onClick={this.handleBack}>
              <FM id="dealDetail.buy_delete_btn" defaultMessage="取消" />
            </Button>
            <Popconfirm
              title={this.props.intl.formatMessage(msg.sure_to_buy)}
              onConfirm={this.handleSubmit}
              okText={this.props.intl.formatMessage(msg.sell_yes)}
              cancelText={this.props.intl.formatMessage(msg.sell_no)}
            >
              <Button
                loading={this.props.submitting}
                style={{marginLeft: 15}}
                disabled={this.calcuBuyTotal1(money) <= 0}
                type="primary"
                htmlType="submit"
              >
                {/*<FM id="dealDetail.buy_sure_btn" defaultMessage="确认购买" />*/}
                {this.props.intl.formatMessage(msg.buy_sure_btn)}
              </Button>
            </Popconfirm>
          </FormItem>
        </Spin>
      </div>
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    const {detail = {}, match: {params}} = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      values.order_detail = filter(values.order_detail, item => item.count > 0);
      if (!values.order_detail.length) {
        return message.warning(
          this.props.intl.formatMessage(msg.buy_amount_details)
        );
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
              this.fetch({id: +params.id});
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
    console.log(this.props)
    const {detail} = this.props;
    const {owner = {}, ad_type, term} = detail || {};
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
                <span className={styles.dealTit}>
                  <FM id="dealDetail.buy_bargain_one" defaultMessage="30日成单：" />
                </span>
                <span className={styles.dealNum}>{userInfo.month_volume}</span>
              </div>
            </div>
          </div>
          <div className={styles.term}>
            <h3>
              <FM id="dealDetail.buy_sell_clause" defaultMessage="交易条款：" />
            </h3>
            <p>{term}</p>
          </div>
        </div>
      </div>
    );
  }
}
