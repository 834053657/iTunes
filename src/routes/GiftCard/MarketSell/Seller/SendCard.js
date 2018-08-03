import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Icon, Input, Avatar, Badge, Modal, Popconfirm, Form, message } from 'antd';
import CountDown from 'components/CountDown';
import styles from './SendCard.less';
import StepModel from '../../Step';
import { sendCDK } from '../../../../services/api';
import SendOnlyPicture from './OnlyPic';
import SendPicWithText from './PicWithText';
import OnlyPassWord from '../../forms/OnlyPassWord';
import SendCardForm from '../../forms/SendCardForm';

const FormItem = Form.Item;

@Form.create()
@connect(({ loading, card }) => ({
  card,
  submitting: loading.effects['card/sendCDK'],
}))
export default class Process extends Component {
  constructor(props) {
    super();
    this.state = {
      detail: props.detail,
      user: props.user,
      time: props.detail.ad.deadline,
      termView: false,
      cards: [],
    };
    this.cardsData = [];
    this.data = {
      order_id: this.state.detail.order.id,
      cards: [],
    };
    //this.targetTime = new Date().getTime() + props.detail.order.deadline_at * 1000;
    this.targetTime = props.detail.order.deadline_at;
  }

  componentWillMount() {
    const { order_detail = {} } = this.state.detail.order;
    order_detail.map((o, index) => {
      return this.cardsData.push({
        money: o.money,
        items: this.makeData(o, index),
        receipt: '',
      });
    });

    const a = this.renderInputs(order_detail);
    this.setState({
      cards: a,
    });
  }

  makeData = (item, index) => {
    const iptArr = [];
    for (let i = 0; i < item.count; i++) {
      iptArr.push({
        password: '',
        picture: '',
      });
    }
    return iptArr;
  };

  renderInput = (item, index) => {
    const iptArr = [];
    for (let i = 0; i < item.count; i++) {
      iptArr.push({
        password: '',
        picture: '',
      });
    }
    return iptArr;
  };

  renderInputs = item => {
    const fatherArr = [];
    item.map((data, index) => {
      const childArr = [];
      fatherArr.push({
        money: data.money,
        recepit: '',
        items: this.renderInput(data, index),
      });
      return fatherArr;
    });
    return fatherArr;
  };

  sendCDK = v => {
    this.props.dispatch({
      type: 'card/sendCDK',
      payload: v,
    });
  };

  changePsw = (e, index, littleIndex) => {
    this.cardsData[index].items[littleIndex].password = e.target.value;
    this.props.form.setFieldsValue({
      'cards[]': this.cardsData,
    });
    this.setState({
      cards: this.cardsData,
    });
  };

  changePic = (e, index, littleIndex) => {
    this.cardsData[index].items[littleIndex].picture = e;
    this.props.form.setFieldsValue({
      'cards[]': this.cardsData,
    });
    this.setState({
      cards: this.cardsData,
    });
  };

  changePZ = (e, index) => {
    this.cardsData[index].receipt = e;
    this.props.form.setFieldsValue({
      'cards[]': this.cardsData,
    });

    this.setState({
      cards: this.cardsData,
    });
  };

  addFileData = (info, index, length) => {
    this.cardsData[index].items = info.splice(0, length);
    console.log(this.cardsData);

    this.props.form.setFieldsValue({
      'cards[]': this.cardsData,
    });
    this.setState({
      cards: this.cardsData,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.sendCDK({
          cards: this.cardsData,
          order_id: this.state.detail.order.id,
        });
      }
    });
  };

  render() {
    const {
      user,
      detail,
      submitting,
      setStatus,
      form: { getFieldDecorator, getFieldValue, resetForm, onFieldsChange },
    } = this.props;
    const { ad = {}, cards = {}, order = {} } = detail;

    const userInfo = ad.owner;
    const steps = [{ title: '发送礼品卡' }, { title: '确认信息' }, { title: '完成' }];

    getFieldDecorator('cards[]');
    console.log(this.state.cards);
    return (
      <div className={styles.sendBox}>
        <StepModel steps={steps} current={0} />
        <div className={styles.top}>
          <div className={styles.orderInfo}>
            <div className={styles.price}>
              <span>类型：</span>
              <p>
                {CONFIG.cardTypeMap && order.card_type
                  ? CONFIG.cardTypeMap[ad.card_type].name || '-'
                  : '-'}
              </p>
            </div>
            <div className={styles.price}>
              <span>要求：</span>
              <p>{(CONFIG.cardPwdType && CONFIG.cardPwdType[ad.password_type]) || '-'}</p>
            </div>
            <div className={styles.price}>
              <span>保障时间：</span>
              <p>{ad.guarantee_time}</p>分钟
            </div>
          </div>

          <div className={styles.topRight}>
            <div className={styles.ownerInfo}>
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
                <Button
                  onClick={() => {
                    this.setState({
                      termView: true,
                    });
                  }}
                >
                  查看交易条款
                </Button>
                <Modal
                  title="交易条款"
                  visible={this.state.termView}
                  onCancel={() => this.setState({ termView: false })}
                  footer={null}
                >
                  <p>{order.term}</p>
                </Modal>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.denomination}>
          <div className={styles.bottom}>
            <Form className={styles.form} onSubmit={this.handleSubmit}>
              <OnlyPassWord
                dValue={this.state.cards}
                changePsw={this.changePsw}
                changePic={this.changePic}
                psw={ad.password_type}
                form={this.props.form}
                changePZ={this.changePZ}
                addFileData={this.addFileData}
                sendCard
              />
              {/*
              <SendCardForm
                defaultValue={this.state.cards}
                psw={ad.password_type}
              />
*/}
              <div>
                <div className={styles.amount}>
                  <h4>
                    <span className={styles.title}>{order.money}</span>
                    <span>总面额：</span>
                  </h4>
                  <h4>
                    <span className={styles.title}>{ad.unit_price}RMB</span>
                    <span>单价：</span>
                  </h4>
                  <h4>
                    <span className={styles.title}>{order.amount}RMB</span>
                    <span>总价：</span>
                  </h4>
                </div>
                <div className={styles.footer}>
                  <div>
                    请在&nbsp;
                    <Icon type="clock-circle-o" />
                    &nbsp;
                    <CountDown formatstr="mm:ss" target={this.targetTime} />
                    秒内发卡
                  </div>
                </div>
              </div>
              <FormItem className={styles.buttonBox}>
                <Popconfirm title="您确认要发卡吗?" onConfirm={this.handleSubmit}>
                  <Button htmlType="submit" type="primary" loading={submitting}>
                    发卡
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="您确认要取消订单吗?"
                  onConfirm={() =>
                    this.props.dispatch({
                      type: 'card/cacelOrder',
                      payload: { order_id: order.id },
                    })
                  }
                >
                  <Button>取消订单</Button>
                </Popconfirm>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
