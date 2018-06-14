import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Avatar, Select } from 'antd';
import styles from './DealLine.less';
import StepModel from './Step';
import BuyerEnsure from './MarketBuy/BuyerEnsure';
import SellerEnsure from './MarketBuy/SellerEnsure';
import SendCard from './MarketSell/Seller/SendCard';
import WaitBuyerCheck from './MarketSell/Buyer/WaitBuyerCheck';

const Option = Select.Option;

@connect(({ card, user }) => ({
  user: user.currentUser.user,
  detail: card.odDetail,
}))
export default class OrderDetail extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  componentDidMount() {
    console.log('DealLine');
    const { params: { id } } = this.props.match || {};
    this.props.dispatch({
      type: 'card/fetchOrderDetail',
      payload: id,
    });
  }

  orderTitle = (ad, cards, order, user) => {
    if (order.order_type === 1) {
      if (user.id === ad.owner.id) {
        return '您向XX出售';
      } else {
        return 'XX向您出售';
      }
    } else if (user.id === ad.owner.id) {
        return 'XX向您购买';
      } else {
        return '您向XX购买';
      }
  };

  //判断订单
  orderType = () => {
    const { detail } = this.props;
    //console.log('detail.order.order_type');
    //console.log(detail.order.order_type);
    if (detail.order.order_type === 1) {
      //主动购买
      return 2;
    } else {
      //主动出售
      return 1;
    }
  };
  //判断买家和卖家
  Identify = () => {
    const { detail } = this.props;
    const { user } = this.props;
    if (!Object.keys(detail.ad).length) {
      return false;
    }
    if (detail.order.order_type === 1) {
      if (user.id === detail.ad.owner.id) {
        return '卖家';
      } else {
        return '买家';
      }
    } else if (user.id === detail.ad.owner.id) {
        return '卖家';
      } else {
        return '买家';
      }
  };

  render() {
    const { ad = {}, cards = {}, order = {} } = this.props.detail || {};
    const { detail } = this.props;
    const { user } = this.props;
    const steps = [{ title: '打开交易' }, { title: '确认信息' }, { title: '完成' }];
    if (!Object.keys(ad).length) {
      return false;
    }
    console.log('sdfhjksadfuasd');
    console.log(this.orderType());
    console.log(this.Identify());

    return (
      <div className={styles.dealLine}>
        {//我要购买列表 买家视角 订单状态：确认信息
        this.orderType() === 2 && this.Identify() === '买家' ? (
          <BuyerEnsure detail={detail} user={user} orderTitle={this.orderTitle} />
        ) : null}
        {//我要购买列表 卖家视角 订单状态：确认信息
        this.orderType() === 2 && this.Identify() === '卖家' ? (
          <SellerEnsure detail={detail} user={user} orderTitle={this.orderTitle} />
        ) : null}
        {//我要出售列表 卖家视角 订单状态：输入cdk
        this.orderType() === 1 && this.Identify() === '买家' ? (
          <SendCard detail={detail} user={user} orderTitle={this.orderTitle} />
        ) : null}
        {//我要出售列表 买家视角 订单状态：等待买家查收
        this.orderType() === 1 && this.Identify() === '卖家' ? (
          <WaitBuyerCheck detail={detail} user={user} orderTitle={this.orderTitle} />
        ) : null}
      </div>
    );
  }
}
