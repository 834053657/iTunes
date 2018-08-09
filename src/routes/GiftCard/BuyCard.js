import React, { Component } from 'react';
import { connect } from 'dva/index';
import { filter } from 'lodash';
import { routerRedux } from 'dva/router';
import { FormattedMessage as FM } from 'react-intl';
import {
  Button,
  Menu,
  Dropdown,
  Icon,
  Radio,
  Input,
  Select,
  InputNumber,
  Popconfirm,
  message,
  Popover,
  Spin,
} from 'antd';
import styles from './BuyCard.less';
import BuyForm from './forms/BuyForm1';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ card_ad, card, loading }) => ({
  detail: card_ad.detail,
  terms: card.terms.filter(term => term.status === 3),
  loading: loading.effects['card_ad/fetchInitialValue'] || false,
  submitSellForm: loading.effects['card/addBuyAd'],
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
    const { params: { id, action } } = this.props.match || {};
    const { dispatch } = this.props;
    if (id) {
      dispatch({
        type: 'card_ad/fetchInitialValue',
        payload: { id },
      });
      this.setState({
        action,
      });
    }
    dispatch({
      type: 'card/fetchTerms',
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'card_ad/SAVE_AD_DETAIL',
    });
  }

  handleCancel = () => {
    this.setState({
      editing: false,
      action: 'preview',
    });
  };

  handleEdit = () => {
    this.setState({
      editing: true,
      action: 'edit',
    });
  };

  handleSubmit = values => {
    const { params: { id } } = this.props.match || {};
    if (values.condition_type === 1 && !values.condition.length) {
      return message.error(PROMPT('BuyCard.fill_none')||'未填写指定面额信息');
    }
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
    const { detail, loading, terms } = this.props;
    const { editing, action } = this.state;
    const cardList = filter(CONFIG.card_type, c => c.valid, []);
    const defaultCard = cardList[0] || {};
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
      { title: <FM id="buy.adManage" defaultMessage="广告管理" />, href: '/ad/my' },
      { title: <FM id="buy.giftCard" defaultMessage="礼品卡" />, href: '/card/market' },
      { title: <FM id="buy.createBuy" defaultMessage="创建购买" /> },
    ];
    if (!cardList.length) {
      return false;
    }

    const filteredTerms = terms.filter(term => term.status === 3);

    return (
      <div className={styles.addSale}>
        <PageHeaderLayout breadcrumbList={breadcrumbList}>
          <Spin spinning={loading}>
            {!loading ? (
              <BuyForm
                editing={editing}
                terms={terms}
                cardList={cardList}
                onEdit={this.handleEdit}
                action={action}
                onSubmit={this.handleSubmit}
                onCancel={() => this.props.dispatch(routerRedux.push('/ad/my'))}
                initialValues={id ? detail : defaultValues}
                submitSellForm={this.props.submitSellForm}
              />
            ) : null}
          </Spin>
        </PageHeaderLayout>
      </div>
    );
  }
}
