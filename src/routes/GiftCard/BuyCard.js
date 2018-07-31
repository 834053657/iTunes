import React, { Component } from 'react';
import { connect } from 'dva/index';
import { filter } from 'lodash';
import { routerRedux } from 'dva/router';
import { Spin } from 'antd';
import styles from './BuyCard.less';
import BuyForm from './forms/BuyForm1';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ card_ad, card, loading }) => ({
  detail: card_ad.detail,
  terms: card.terms,
  loading: loading.effects['card_ad/fetchInitialValue'] || false,
}))
export default class SaleCard extends Component {
  constructor(props) {
    super(props);
    const { params: { action } } = this.props.match || {};
    this.state = {
      editing: action !== 'preview',
    };
  }

  componentWillMount() {
    const { params: { id } } = this.props.match || {};
    const { dispatch } = this.props;
    dispatch({
      type: 'card/fetchTerms',
    });

    if (id) {
      dispatch({
        type: 'card_ad/fetchInitialValue',
        payload: { id },
      });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'card_ad/SAVE_AD_DETAIL',
    });
  }

  handleCancel = () => {
    this.setState({
      editing: false,
    });
  };

  handleEdit = () => {
    this.setState({
      editing: true,
    });
  };

  handleSubmit = values => {
    const { params: { id } } = this.props.match || {};

    this.props.dispatch({
      type: 'card/addBuyAd',
      payload: {
        ...values,
        id,
      },
      callback: res => {
        this.props.history.push({ pathname: '/ad/my' });
      },
    });
  };

  render() {
    const { params: { id } } = this.props.match || {};
    const { detail, loading } = this.props;
    const { editing } = this.state;
    const cardList = filter(CONFIG.card_type, c => c.valid, []);
    const defaultCard = cardList[0] || {};
    const { terms } = this.props.card || {};
    const defaultValues = {
      condition_type: 1,
      card_type: defaultCard.type,
      password_type: 1,
      guarantee_time: CONFIG.guarantee_time[0],
      deadline: CONFIG.deadline[0],
      condition1: [{}],
      condition2: {},
      term_id: 0,
    };
    const breadcrumbList = [
      { title: '广告管理', href: '/ad/my' },
      { title: '礼品卡', href: '/card/market' },
      { title: '创建购买' },
    ];

    console.log(this.props);

    return (
      <div className={styles.addSale}>
        <PageHeaderLayout breadcrumbList={breadcrumbList}>
          <Spin spinning={loading}>
            {!loading ? (
              <BuyForm
                editing={editing}
                terms={terms}
                onEdit={this.handleEdit}
                onSubmit={this.handleSubmit}
                onCancel={this.handleCancel}
                initialValues={id ? detail : defaultValues}
                cardList={cardList}
              />
            ) : null}
          </Spin>
        </PageHeaderLayout>
      </div>
    );
  }
}
