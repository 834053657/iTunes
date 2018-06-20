import React, { Component } from 'react';
import { connect } from 'dva/index';
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

const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

@connect(({ card }) => ({
  card,
}))
export default class SaleCard extends Component {
  constructor(props) {
    super();
    this.state = {
      condition: [],
      deadline: '',
      defaultCardTypeName: '',
      condition_type: 1,
    };
    this.items = [];
    this.data = {
      condition: [],
    };

    this.setVisible = (type, visible) => {
      this.setState({
        [type]: visible,
      });
    };

    this.changePasswordType = e => {
      this.data.password_type = e.target.value;
      console.log(e.target.value);
      this.setState({
        passwordType: e.target.value,
      });
    };

    this.selectCardType = e => {
      console.log(e);
      this.setState({
        defaultCardTypeName: e.name,
      });
      this.data.card_type = e.type;
    };

    this.selectGuaTime = e => {
      this.setState({
        defaultGuaTime: e,
      });
      this.data.guarantee_time = e;
    };

    this.selectDeadline = e => {
      this.setState({
        deadline: e,
      });
      this.data.deadline = e;
    };

    this.selectTermTitle = e => {
      this.setState({
        defaultTermTitle: e.title,
      });
      this.data.term_id = e.id;
      console.log('term id');
      console.log(e);
    };

    //单价修改
    this.unitPriceChange = e => {
      console.log(e);
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
      const a = this.state.condition;
      a[index].money = e;
      this.setState({
        condition: a,
      });
      this.data.condition = a;
    };

    this.changeMinCount = (e, index) => {
      const a = this.state.condition;
      a[index].min_count = e;
      this.setState({
        condition: a,
      });
      this.data.condition = a;
    };

    this.changeMaxCount = (e, index) => {
      const a = this.state.condition;
      a[index].max_count = e;
      this.setState({
        condition: a,
      });
      this.data.condition = a;
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
        condition_type: e,
        condition: +e === 1 ? [] : {},
      });
      this.data.condition = +e === 1 ? [] : {};
      this.data.condition_type = e;
    };

    this.changeMinMoney = e => {
      console.log(this.data);
      this.data.condition.min_money = e.target.value;
    };
    this.changeMaxMoney = e => {
      this.data.condition.max_money = e.target.value;
    };

    this.addBuyAd = () => {
      console.log(this.data);
      this.props
        .dispatch({
          type: 'card/addBuyAd',
          payload: this.data,
        })
        .then(r => {
          console.log(r);
          this.data = {};
          this.props.history.push({ pathname: '/ad/my' });
        })
        .catch(err => {
          console.log('发送失败，错误原因' + err);
        });
    };
  }

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

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'card/fetchTerms',
    });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { condition_type, condition } = this.state;

    const cardTypeMenu = CONFIG.card_type ? (
      <Menu>
        {CONFIG.card_type.map(t => {
          return (
            <Menu.Item key={t.type} onClick={() => this.selectCardType(t)}>
              {t.name}
            </Menu.Item>
          );
        })}
      </Menu>
    ) : null;

    const deadlineMenu = CONFIG.deadline ? (
      <Menu>
        {CONFIG.deadline.map(t => {
          return (
            <Menu.Item key={t} onClick={() => this.selectDeadline(t)}>
              {t}
            </Menu.Item>
          );
        })}
      </Menu>
    ) : null;

    const guaranteeTimeMenu = CONFIG.guarantee_time ? (
      <Menu>
        {CONFIG.guarantee_time.map(t => {
          return (
            <Menu.Item key={t} onClick={() => this.selectGuaTime(t)}>
              {t}
            </Menu.Item>
          );
        })}
      </Menu>
    ) : null;

    const { items } = this.props.card.terms;
    const termsMenu = (
      <Menu>
        {items ? (
          items.filter(i => i.status === 3) ? (
            items.filter(i => i.status === 3).map(t => {
              return (
                <Menu.Item key={t.id} onClick={() => this.selectTermTitle(t)}>
                  {t.title}
                </Menu.Item>
              );
            })
          ) : (
            <Menu.Item>请等待条款审核</Menu.Item>
          )
        ) : (
          <Menu.Item>请在我的订单里新建条款</Menu.Item>
        )}
      </Menu>
    );

    return (
      <div className={styles.addSale}>
        <header>
          <span>广告管理 /</span>
          <span>礼品卡 /</span>
          <span className={styles.sale}>创建购买</span>
        </header>

        <ul className={styles.submitTable}>
          <li>
            <span className={styles.tableLeft}>类型：</span>
            <Dropdown overlay={cardTypeMenu} trigger={['click']}>
              <Button>
                {this.state.defaultCardTypeName ? this.state.defaultCardTypeName : '选择'}
                <Icon type="down" />
              </Button>
            </Dropdown>
          </li>

          <li>
            <span className={styles.tableLeft}>单价：</span>
            <InputNumber min={1} onChange={e => this.unitPriceChange(e)} /> RMB
          </li>

          <li>
            <span className={styles.tableLeft}>倍数：</span>
            <InputNumber min={1} onChange={e => this.multChange(e)} />
          </li>

          {/*------------条件-----------*/}
          <li>
            <span className={styles.tableLeft}>条件：</span>
            <Radio.Group onChange={e => this.selCondition(e.target.value)}>
              <Radio.Button value="1">指定面额</Radio.Button>
              <Radio.Button value="2">交易限额</Radio.Button>
            </Radio.Group>
          </li>
          {condition_type && condition.length && +condition_type === 1 ? (
            <li>
              <span className={styles.tableLeft}>&nbsp;</span>
              {
                <ul className={styles.conditionFixed}>
                  {condition && condition.length
                    ? condition.map((c, index) => {
                        return (
                          <li key={index}>
                            <Input
                              className={styles.contIpt}
                              placeholder="面额"
                              value={c.money}
                              onChange={e => {
                                this.changeMoney(e.target.value, index);
                              }}
                            />
                            &nbsp;--&nbsp;
                            <Input
                              className={styles.contIpt}
                              placeholder="最小数量"
                              value={c.min_count}
                              onChange={e => {
                                this.changeMinCount(e.target.value, index);
                              }}
                            />
                            &nbsp;--&nbsp;
                            <Input
                              className={styles.contIpt}
                              placeholder="最大数量"
                              value={c.max_count}
                              onChange={e => {
                                this.changeMaxCount(e.target.value, index);
                              }}
                            />
                            <Icon
                              className={styles.delIcon}
                              type="minus-circle-o"
                              onClick={() => {
                                this.delDeno(c, index);
                              }}
                            />
                          </li>
                        );
                      })
                    : null}
                </ul>
              }
            </li>
          ) : null}
          {+condition_type === 2 ? (
            <li>
              <span className={styles.tableLeft}>&nbsp;</span>
              <div>
                <Input
                  className={styles.conIpt}
                  type="text"
                  onChange={e => this.changeMinMoney(e)}
                />
                &nbsp;&nbsp;---&nbsp;&nbsp;
                <Input
                  className={styles.conIpt}
                  type="text"
                  onChange={e => this.changeMaxMoney(e)}
                />
              </div>
            </li>
          ) : null}
          {+condition_type === 1 ? (
            <li>
              <span className={styles.tableLeft}>&nbsp;</span>
              <Button style={{ width: '260px', borderStyle: 'dashed' }} onClick={this.addDeno}>
                + 添加面额
              </Button>
            </li>
          ) : null}

          <li>
            <span className={styles.tableLeft}>要求：</span>
            <RadioGroup onChange={e => this.changePasswordType(e)} value={this.state.passwordType}>
              <Radio value={1}>有卡密</Radio>
              <Radio value={2}>有图</Radio>
              <Radio value={3}>有图有卡密</Radio>
            </RadioGroup>
          </li>

          <li>
            <span className={styles.tableLeft}>发卡期限：</span>
            <Dropdown overlay={deadlineMenu} trigger={['click']}>
              <Button>
                {this.state.deadline ? this.state.deadline : '选择'}
                <Icon type="down" />
              </Button>
            </Dropdown>
          </li>

          <li>
            <span className={styles.tableLeft}>保障时间：</span>
            <Dropdown overlay={guaranteeTimeMenu} trigger={['click']}>
              <Button>
                {this.state.defaultGuaTime ? this.state.defaultGuaTime : '选择'}
                <Icon type="down" />
              </Button>
            </Dropdown>
          </li>

          <li>
            <span className={styles.tableLeft}>
              交易条款
              <i>(可选)</i>
              ：
            </span>
            <Dropdown overlay={termsMenu} trigger={['click']}>
              <Button>
                {this.state.defaultTermTitle ? this.state.defaultTermTitle : '选择'}
                <Icon type="down" />
              </Button>
            </Dropdown>
          </li>
          <li>
            <span className={styles.tableLeft}>同时处理订单数：</span>
            <InputNumber onChange={e => this.ordersAmountChange(e)} />
          </li>
        </ul>
        <div className={styles.footerBox}>
          <Button>取消</Button>
          <Button
            type="primary"
            onClick={() => {
              this.addBuyAd();
            }}
          >
            发布
          </Button>
        </div>
      </div>
    );
  }
}
