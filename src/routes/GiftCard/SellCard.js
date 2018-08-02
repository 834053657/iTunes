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
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import OnlyPicture from './SellOnlyPicture';
import PicWithText from './SellPicWithText';
import styles from './SellCard.less';
import SellForm from './forms/SellForm';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

@connect(({ card, loading }) => ({
  card,
  adDetail: card.adDetail || {},
  submitSellForm: loading.effects['card/addSellAd'],
}))
export default class BuyCard extends Component {
  constructor(props) {
    super();
    const cardList = filter(CONFIG.card_type, c => c.valid, []);
    this.state = {
      cards: [],
      addDenoVisible: false,
      passwordType: 1,
      unit_price: 0,
      totalMoney: 0,
      cardType: cardList,
      defaultCard: cardList[0] || {},
    };
    this.cards = [];
    this.items = [];
    this.data = {
      password_type: 1,
      card_type: cardList[0] && cardList[0].type,
      guarantee_time: CONFIG.guarantee_time ? CONFIG.guarantee_time[0] : '',
      concurrency_order: 0,
      unit_price: 1,
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

  componentDidMount() {}

  changePasswordType = e => {
    this.data.password_type = e.target.value;
    this.setState({
      passwordType: e.target.value,
      cards: [],
    });
  };

  selectCardType = e => {
    this.data.card_type = +e;
  };

  selectGuaTime = e => {
    this.setState({
      defaultGuaTime: +e,
    });
    this.data.guarantee_time = +e;
  };

  selectTermTitle = e => {
    if (e !== 'noTerm') {
      this.data.term_id = +e;
    }
  };

  unitPriceChange = e => {
    this.data.unit_price = e;
    this.setState({
      unit_price: parseInt(e),
    });
  };

  ordersAmountChange = e => {
    this.data.concurrency_order = e;
  };

  //添加面额种类
  addDeno = () => {
    if (isNaN(this.state.denoVaule)) {
      return message.warning(<FM id="sell.correct" defaultMessage="请输入正确格式" />);
    }
    const a = this.state.cards;
    const item = {
      money: this.state.denoVaule,
      items: [],
    };
    a.push(item);
    this.state.cards = a;
    this.setState({
      cards: a,
    });
    this.setVisible('addDenoVisible', false);
  };

  //添加密码框
  addCDKBox = m => {
    const b = {
      password: '',
      picture: '',
    };
    const index = this.state.cards.findIndex(item => {
      return item.money === m;
    });
    if (index >= 0) {
      const c = this.state.cards;
      c[index].items.push(b);
      this.setState({
        cards: c,
      });
    }
    this.calcuMoney();
  };

  //删除密码框
  delCDKBox = (m, i) => {
    const index = this.state.cards.findIndex(item => {
      return item.money === m;
    });
    if (index >= 0) {
      const c = this.state.cards;
      c[index].items.splice(i, 1);
      this.setState({
        cards: c,
      });
    }
    this.calcuMoney();
  };

  //只有图片函数类
  onlyPic = (info, item, index) => {
    const c = this.state.cards;
    c[index].items.push({
      picture: info,
    });
    this.setState({
      cards: c,
    });
  };

  changeAppealPic = (info, prefix, index) => {
    const c = this.state.cards;
    c[index].items = [];
    info.fileList.map(file => {
      if (!file.response) {
        return false;
      }
      c[index].items.push({
        picture: `${prefix}${file.response.hash}`,
      });
      return null;
    });

    this.setState({
      cards: c,
    });
    this.calcuMoney();
  };

  remove = (info, index, item) => {
    const c = this.state.cards;
  };

  //卡密数据获取
  denoIptValueChange = (e, i, index) => {
    const a = this.state.cards;
    a[index].items[i].password = e.target.value;
    this.setState({
      cards: a,
    });
  };

  //卡图获取
  getUrl = (url, index, i) => {
    const a = this.state.cards;
    a[index].items[i].picture = url;
    this.setState({
      cards: a,
    });
  };
  //凭证获取
  getReceipt = (url, index) => {
    const a = this.state.cards;
    a[index].receipt = url;
    this.setState({
      cards: a,
    });
  };

  addAdvertising = v => {
    const value = v;
    if (this.state.action) {
      value.id = this.props.adDetail.id;
    }
    this.props.dispatch({
      type: 'card/addSellAd',
      payload: value,
      callback: res => {
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

  calcuMoney = () => {
    let a = 0;
    this.state.cards.map(card => {
      a += card.money * card.items.length;
      return null;
    });
    this.setState({
      totalMoney: a,
    });
    console.log(a);
  };

  setVisible = (type, visible) => {
    this.setState({
      [type]: visible,
    });
  };

  render() {
    if (!CONFIG.card_type) {
      return false;
    }

    const { cardType, action } = this.state;
    const items = this.props.card.terms;
    const { adDetail = {} } = this.props;
    const addDenoBox = (
      <div className={styles.denoBox}>
        <span className={styles.left}>面额:</span>
        <div className={styles.right}>
          <Input
            placeholder={<FM id="sell.amountInp" defaultMessage="请输入面额" />}
            defaultValue=""
            onChange={e => {
              this.setVisible('denoVaule', e.target.value);
            }}
            onPressEnter={() => this.addDeno()}
          />
        </div>
        <div className={styles.btnBox}>
          <Button
            onClick={() => {
              this.setVisible('addDenoVisible', false);
            }}
          >
            {<FM id="sell.delete" defaultMessage="取消" />}
          </Button>
          <Button
            onClick={() => {
              this.addDeno();
            }}
            type="primary"
          >
            {<FM id="sell.confirm" defaultMessage="确定" />}
          </Button>
        </div>
      </div>
    );

    const actionTitle = () => {
      console.log(action);
      switch (action) {
        case 'edit':
          return <FM id="sell.edit" defaultMessage="编辑" />;
        case 'preview':
          return <FM id="sell.check" defaultMessage="查看" />;
        case undefined:
          return <FM id="sell.createSell" defaultMessage="创建出售" />;
      }
    };

    const breadcrumbList = [
      { title: <FM id="sell.adManage" defaultMessage="广告管理" />, href: '/ad/my' },
      { title: <FM id="sell.giftCard" defaultMessage="礼品卡" />, href: '/card/market' },
      { title: <FM id="sell.adSell" defaultMessage="出售广告" /> },
    ];

    const { terms } = this.props.card || {};

    return (
      <div className={styles.addSale}>
        <PageHeaderLayout breadcrumbList={breadcrumbList}>
          <SellForm
            changeEdit={this.changeEdit}
            defaultValue={adDetail}
            action={action}
            terms={terms}
            onCancel={() => this.props.dispatch(routerRedux.push('/ad/my'))}
            onSubmit={this.addAdvertising}
            submitSellForm={this.props.submitSellForm}
          />
        </PageHeaderLayout>
      </div>
    );
  }
}
