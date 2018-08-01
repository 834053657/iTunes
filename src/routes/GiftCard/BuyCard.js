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
} from 'antd';
import styles from './BuyCard.less';
import BuyForm from './forms/BuyForm';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

const cardList = filter(CONFIG.card_type, c => c.valid, []);

@connect(({ card }) => ({
  card,
  adDetail: card.adDetail || {},
}))
export default class SaleCard extends Component {
  constructor(props) {
    super();
    this.state = {
      condition: [],
      condition_type: 1,
      passwordType: 1,
      cardType: cardList,
      defaultCard: cardList[0] || {},
    };
    this.items = [];

    this.data = {
      condition: [],
      deadline: CONFIG.deadline ? CONFIG.deadline[0] : null,
      guarantee_time: CONFIG.guarantee_time ? CONFIG.guarantee_time[0] : null,
      card_type: cardList[0] && cardList[0].type,
      condition_type: 1,
      password_type: 1,
      unit_price: 1,
      multiple: 1,
      concurrency_order: 0,
    };

    this.setVisible = (type, visible) => {
      this.setState({
        [type]: visible,
      });
    };

    this.changePasswordType = e => {
      this.data.password_type = e.target.value;
      this.setState({
        passwordType: e.target.value,
      });
    };

    this.selectCardType = e => {
      this.data.card_type = +e;
    };

    this.selectGuaTime = e => {
      this.setState({
        defaultGuaTime: +e,
      });
      this.data.guarantee_time = +e;
    };

    this.selectDeadline = e => {
      this.setState({
        deadline: +e,
      });
      this.data.deadline = +e;
    };

    this.selectTermTitle = e => {
      if (e !== 'noTerm') {
        this.data.term_id = +e;
      }
    };

    //单价修改
    this.unitPriceChange = e => {
      this.data.unit_price = e;
    };

    //删除面额种类
    this.delDeno = (t, i) => {
      const a = this.state.condition;
      a.splice(i, 1);
      this.setState({
        condition: a,
      });
    };

    this.changeMoney = (e, index) => {
      const re = /^[1-9]+[0-9]*]*$/;
      if (re.test(e)) {
        const a = this.state.condition;
        a[index].money = parseInt(e);
        this.setState({
          condition: a,
        });
        this.data.condition = a;
      } else {
        message.warning(<FM id="buy.numberType" defaultMessage="请输入数字格式" />);
      }
    };

    this.changeMinCount = (e, index) => {
      const re = /^[1-9]+[0-9]*]*$/;
      if (re.test(e)) {
        const a = this.state.condition;
        a[index].min_count = parseInt(e);
        this.setState({
          condition: a,
        });
        this.data.condition = a;
      } else {
        message.warning(<FM id="buy.numberType_1" defaultMessage="请输入数字格式" />);
      }
    };

    this.minBlur = (e, index) => {
      const a = this.state.condition;
      if (
        a[index].min_count !== '' &&
        a[index].max_count !== '' &&
        a[index].min_count > a[index].max_count
      ) {
        message.warning(<FM id="buy.maxNum" defaultMessage="不得超过最大数量" />);
        return false;
      }
    };

    this.maxBlur = (e, index) => {
      const a = this.state.condition;
      const re = /^[1-9]+[0-9]*]*$/;
      if (
        a[index].min_count !== '' &&
        a[index].max_count !== '' &&
        a[index].min_count > a[index].max_count
      ) {
        message.warning(<FM id="buy.minNum" defaultMessage="不得低于最小数量" />);
      }
    };

    this.changeMaxCount = (e, index) => {
      const re = /^[1-9]+[0-9]*]*$/;
      if (re.test(e)) {
        const a = this.state.condition;
        a[index].max_count = parseInt(e);
        this.setState({
          condition: a,
        });
        this.data.condition = a;
      } else {
        message.warning(<FM id="buy.numberType_2" defaultMessage="请输入数字格式" />);
      }
    };

    this.addAdvertising = () => {
      this.props.dispatch({
        type: 'card/addCardSell',
        payload: this.data,
      });
    };

    this.multChange = e => {
      this.data.multiple = e;
    };

    this.ordersAmountChange = e => {
      this.data.concurrency_order = e;
    };

    this.selCondition = e => {
      this.setState({
        condition_type: +e,
        condition: +e === 1 ? [] : {},
      });
      this.data.condition = +e === 1 ? [] : {};
      this.data.condition_type = +e;
    };

    this.changeMinMoney = e => {
      const re = /^[1-9]+[0-9]*]*$/;
      if (re.test(e)) {
        this.data.condition.min_money = +e;
      } else {
        message.warning(<FM id="buy.numberType_3" defaultMessage="请输入数字格式" />);
      }
    };

    this.changeRangeMin = e => {
      this.setState({
        rangeMinCount: e,
      });
      this.data.condition.min_money = +e;
    };

    this.changeRangeMax = e => {
      this.setState({
        rangeMaxCount: e,
      });
      this.data.condition.max_money = +e;
    };

    this.changeMaxMoney = e => {
      const re = /^[1-9]+[0-9]*]*$/;
      if (re.test(e)) {
        this.setState({
          rangeMaxCount: e,
        });
        this.data.condition.max_money = +e;
      } else {
        message.warning(<FM id="buy.numberType_4" defaultMessage="请输入数字格式" />);
      }
    };

    this.addFormBuyAd = v => {
      const value = v;
      console.log(v);
      if (this.state.action) {
        value.id = this.props.adDetail.id;
      }
      this.props.dispatch({
        type: 'card/addBuyAd',
        payload: value,
        callback: res => {
          this.props.history.push({ pathname: '/ad/my' });
        },
      });
    };

    this.addBuyAd = () => {
      if (Array.isArray(this.data.condition)) {
        if (this.data.condition.length === 0) {
          message.warning(<FM id="buy.amountMsg" defaultMessage="面额信息不完整" />);
          return false;
        }
      } else if (
        !Array.isArray(this.data.condition) &&
        (!this.data.condition.min_money || !this.data.condition.max_money)
      ) {
        message.warning(<FM id="buy.amountMsg_1" defaultMessage="面额信息不完整" />);
        return false;
      }
      this.props
        .dispatch({
          type: 'card/addBuyAd',
          payload: this.data,
        })
        .then(res => {
          if (res.code === 0) {
            this.data = {};
            this.props.history.push({ pathname: '/ad/my' });
          } else {
            message.error(
              <FM id="buy.sendFalse" defaultMessage="发送失败，失败原因：" /> + res.msg
            );
          }
        });
    };
  }

  componentWillMount() {
    const { params: { id, action } } = this.props.match || {};
    const { location = {}, dispatch } = this.props;
    const { query } = location;
    if (id) {
      dispatch({
        type: 'card/fetchAdDetail',
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

  changeEdit = () => {
    const { params: { id, action } } = this.props.match || {};
    this.props.dispatch(routerRedux.push(`/card/edit-buy-card/${id}/${'edit'}`));
    this.setState({
      action: 'edit',
    });
  };

  //添加面额种类
  addDeno = () => {
    // if (isNaN(this.state.denoVaule)) {
    //   return message.warning('请输入正确格式')
    // }
    const { condition } = this.state;
    const con = {
      money: '',
      min_count: '',
      max_count: '',
    };
    condition.push({
      money: '',
      min_count: '',
      max_count: '',
    });
    this.setState({
      condition,
    });
  };

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { condition_type, condition, defaultCard = {}, cardType = [], action } = this.state;
    const items = this.props.card.terms;
    const { adDetail = {} } = this.props;
    console.log(adDetail);
    const breadcrumbList = [
      { title: <FM id="buy.adManage" defaultMessage="广告管理" />, href: '/ad/my' },
      { title: <FM id="buy.giftCard" defaultMessage="礼品卡" />, href: '/card/market' },
      { title: <FM id="buy.createBuy" defaultMessage="创建购买" /> },
    ];
    const { terms } = this.props.card || {};
    console.log(adDetail);
    return (
      <div className={styles.addSale}>
        <PageHeaderLayout breadcrumbList={breadcrumbList}>
          <BuyForm
            changeEdit={this.changeEdit}
            defaultValue={adDetail}
            action={action}
            terms={terms}
            onSubmit={this.addFormBuyAd}
            onCancel={() => this.props.dispatch(routerRedux.push('/ad/my'))}
          />
        </PageHeaderLayout>
      </div>
    );
  }
}
