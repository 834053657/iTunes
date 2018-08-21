import React, { Component } from 'react';
import { connect } from 'dva/index';
import { filter, head } from 'lodash';
import { routerRedux } from 'dva/router';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
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
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SellCard.less';
import SellForm from './forms/SellForm1';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

const msg = defineMessages({
  msg_error: {
    id: 'SellCard.msg_error',
    defaultMessage: '未添加卡信息',
  },
  success: {
    id: 'SellCard.success',
    defaultMessage: '发布成功',
  },
});
@injectIntl()
@connect(({ card_ad, card, loading }) => ({
  card,
  adDetail: card_ad.detail || {},
  terms: card.terms.filter(term => term.status === 3),
  submitSellForm: loading.effects['card/addSellAd'],
  loading: loading.effects['card_ad/fetchInitialValue'] || false,
}))
export default class BuyCard extends Component {
  constructor(props) {
    super();
    this.state = {};
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

  componentDidMount() {
    this.props.dispatch({
      type: 'card_ad/SAVE_AD_DETAIL',
    });
  }

  addAdvertising = v => {
    const value = v;
    if (this.state.action) {
      value.id = this.props.adDetail.id;
    }
    if (!value.cards.length) {
      return message.warning(this.props.intl.formatMessage(msg.msg_error));
    }
    this.props.dispatch({
      type: 'card/addSellAd',
      payload: value,
      callback: res => {
        message.success(this.props.intl.formatMessage(msg.success))
        this.props.history.push({ pathname: '/ad/my' });
      },
    });
  };

  changeEdit = () => {
    const { params: { id, action } } = this.props.match || {};
    this.props.dispatch(routerRedux.push(`/card/edit-sell-card/${id}/${'edit'}`));
    this.setState({
      action: 'edit',
    });
  };

  render() {
    const { params: { id } } = this.props.match || {};

    const { cardType, action } = this.state;
    const items = this.props.card.terms;
    const { adDetail = {}, loading, terms } = this.props;
    const cardList = filter(CONFIG.card_type, c => c.valid, []);
    const defaultCard = cardList[0] || {};

    if (!cardList.length) {
      return false;
    }
    const defaultValues = {
      card_type: defaultCard.type,
      term_id: 0,
      unit_price: 0,
      guarantee_time: CONFIG.guarantee_time && head(CONFIG.guarantee_time),
      password_type: 1,
      concurrency_order: 0,
      cards: [],
    };

    const breadcrumbList = [
      { title: <FM id="sell.adManage" defaultMessage="广告管理" />, href: '/ad/my' },
      { title: <FM id="sell.giftCard" defaultMessage="礼品卡" />, href: '/card/market' },
      { title: <FM id="sell.adSell" defaultMessage="出售广告" /> },
    ];
    const filteredTerms = terms.filter(term => term.status === 3);

    return (
      <div className={styles.addSale}>
        <PageHeaderLayout breadcrumbList={breadcrumbList}>
          <Spin spinning={loading}>
            {!loading && (
              <SellForm
                onEdit={this.changeEdit}
                defaultValue={adDetail}
                initialValues={id ? adDetail : defaultValues}
                editing={!action || action === 'edit'}
                action={action}
                terms={terms}
                cardList={cardList}
                onCancel={() => this.props.dispatch(routerRedux.push('/ad/my'))}
                onSubmit={this.addAdvertising}
                submitSellForm={this.props.submitSellForm}
              />
            )}
          </Spin>
        </PageHeaderLayout>
      </div>
    );
  }
}
