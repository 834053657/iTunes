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
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import OnlyPicture from './SellOnlyPicture';
import PicWithText from './SellPicWithText';
import SellForm from './forms/SellForm';
import styles from './SellCard.less';

const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

@connect(({ card }) => ({
  card,
}))
export default class BuyCard extends Component {
  constructor(props) {
    super();
    this.state = {
      cards: [],
      addDenoVisible: false,
      defaultCardTypeName: '',
    };
    this.cards = [];
    this.items = [];
    this.data = {};

    //upload
    this.getToken = () => {
      return this.props.dispatch({
        type: 'card/getToken',
        payload: { bucket: 'image' },
      });
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
        cards: [],
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
      console.log(e);
      this.setState({
        defaultGuaTime: e,
      });
      this.data.guarantee_time = e;
    };

    this.selectTermTitle = e => {
      this.setState({
        defaultTermTitle: e.title,
      });
      this.data.term_id = e.id;
    };

    this.unitPriceChange = e => {
      this.data.unit_price = e;
    };

    this.ordersAmountChange = e => {
      this.data.concurrency_order = e;
    };

    //添加面额种类
    this.addDeno = () => {
      if (isNaN(this.state.denoVaule)) {
        return message.warning('请输入正确格式');
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
      console.log(this.state.cards);
      this.setVisible('addDenoVisible', false);
    };

    //添加密码框
    this.addCDKBox = m => {
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
    };
    //删除密码框
    this.delCDKBox = (m, i) => {
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
    };

    //卡密数据获取
    this.denoIptValueChange = (e, i, index) => {
      const a = this.state.cards;
      a[index].items[i].password = e.target.value;
      this.setState({
        cards: a,
      });
    };

    this.addAdvertising = () => {
      this.data.cards = this.state.cards;
      this.props
        .dispatch({
          type: 'card/addSellAd',
          payload: this.data,
        })
        .then(res => {
          console.log('res');
          console.log(res);
          this.data = {};
          this.props.history.push({ pathname: '/ad/my' });
        })
        .catch(err => {
          console.log('发送失败，失败原因：' + err);
        });
    };

    //SellPicWithText Component Function
    this.handlePreview = file => {
      console.log('file');
      console.log(file);
    };
    this.changeFileData = ({ fileList }, index) => {
      console.log('fileList');
      console.log({ fileList });
      console.log(index);
      console.log(this.state.cards);
    };
    this.handleCancel = () => {};
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'card/fetchTerms',
      payload: {
        status: 3,
        page_size: 10000,
      },
    });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const cardTypeMenu = (
      <Menu>
        {CONFIG.card_type.map(t => {
          return (
            <Menu.Item key={t.type} onClick={() => this.selectCardType(t)}>
              {t.name}
            </Menu.Item>
          );
        })}
      </Menu>
    );

    const guaranteeTimeMenu = (
      <Menu>
        {CONFIG.guarantee_time.map(t => {
          return (
            <Menu.Item key={t} onClick={() => this.selectGuaTime(t)}>
              {t}
            </Menu.Item>
          );
        })}
      </Menu>
    );

    const termsMenu = (
      <Menu>
        {this.props.card.terms.items
          ? this.props.card.terms.items.map(t => {
              return (
                <Menu.Item key={t.id} onClick={() => this.selectTermTitle(t)}>
                  {t.title}
                </Menu.Item>
              );
            })
          : null}
      </Menu>
    );

    const addDenoBox = (
      <div className={styles.denoBox}>
        <span className={styles.left}>面额:</span>
        <div className={styles.right}>
          <Input
            placeholder="请输入面额"
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
            取消
          </Button>
          <Button
            onClick={() => {
              this.addDeno();
            }}
            type="primary"
          >
            确定
          </Button>
        </div>
      </div>
    );

    const breadcrumbList = [
      { title: '广告管理', href: '/ad/my' },
      { title: '礼品卡', href: '/card/market' },
      { title: '创建出售' },
    ];

    const { terms } = this.props.card || {};

    return (
      <div className={styles.addSale}>
        <PageHeaderLayout breadcrumbList={breadcrumbList}>
          {/*<SellForm terms={terms} />*/}
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
              <InputNumber onChange={e => this.unitPriceChange(e)} />
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

            <li>
              <span className={styles.tableLeft}>包含：</span>
              <RadioGroup
                onChange={e => this.changePasswordType(e)}
                value={this.state.passwordType}
              >
                <Radio value={1}>有卡密</Radio>
                <Radio value={2}>有图</Radio>
                <Radio value={3}>有图有卡密</Radio>
              </RadioGroup>
            </li>
            <li>
              <span className={styles.tableLeft}>&nbsp;</span>
              <Popover
                key={this.state.date}
                placement="topRight"
                content={addDenoBox}
                title="添加面额"
                trigger="click"
                visible={this.state.addDenoVisible}
                onVisibleChange={() => {
                  this.setVisible('addDenoVisible', !this.state.addDenoVisible);
                }}
              >
                <Button
                  style={{ width: '260px', borderStyle: 'dashed' }}
                  onClick={() => {
                    this.setState({
                      date: new Date(),
                    });
                  }}
                >
                  + 添加面额
                </Button>
              </Popover>
            </li>
          </ul>
          {this.state.passwordType === 1
            ? this.state.cards.map((item, index) => {
                return (
                  <div key={index + 'cards'} className={styles.denomination}>
                    <header>
                      <span>{item.money}</span>
                      面额 （{item.items.length}）
                      <div>
                        <Button>导入</Button>
                        <Button>删除</Button>
                      </div>
                    </header>
                    <section>
                      <div className={styles.left}>
                        <span>卡密：</span>
                      </div>
                      <div className={styles.right}>
                        {item.items.map((card, i) => {
                          return (
                            <div key={index + 'item'} className={styles.iptBox}>
                              <div className={styles.input}>
                                <Input
                                  type="text"
                                  value={this.state.cards[index].items[i].password}
                                  onChange={e => {
                                    this.denoIptValueChange(e, i, index);
                                  }}
                                />
                              </div>
                              <div className={styles.icon}>
                                <Icon
                                  onClick={() => {
                                    this.delCDKBox(item.money, i);
                                  }}
                                  type="delete"
                                />
                              </div>
                            </div>
                          );
                        })}

                        <div className={styles.addBtn}>
                          <Button
                            style={{ width: '580px', borderStyle: 'dashed' }}
                            onClick={() => {
                              this.addCDKBox(item.money);
                            }}
                          >
                            + 添加卡密
                          </Button>
                        </div>
                      </div>
                    </section>
                  </div>
                );
              })
            : null}

          {this.state.passwordType === 2
            ? this.state.cards.map((item, index) => {
                return (
                  <OnlyPicture
                    key={index}
                    item={item}
                    styles={styles}
                    index={index}
                    getToken={() => this.getToken()}
                  />
                );
              })
            : null}

          {this.state.passwordType === 3
            ? this.state.cards.map((item, index) => {
                return (
                  <PicWithText
                    key={index}
                    item={item}
                    styles={styles}
                    index={index}
                    handlePreview={this.handlePreview}
                    changeFileData={({ fileList }) => this.changeFileData({ fileList }, index)}
                    addCDKBox={this.addCDKBox}
                    delCDKBox={this.delCDKBox}
                    changePTPass={this.denoIptValueChange}
                  />
                );
              })
            : null}

          {this.state.cards.length ? (
            <div>
              <div className={styles.amount}>
                <h4>
                  <span>总面额：</span>
                  <span>150</span>
                </h4>
                <h5>
                  <span>总价：</span>
                  <span>120RMB</span>
                </h5>
              </div>
            </div>
          ) : null}
          <div className={styles.footer}>
            <Button>取消</Button>
            <Button
              type="primary"
              onClick={() => {
                this.addAdvertising();
              }}
            >
              发布
            </Button>
          </div>
        </PageHeaderLayout>
      </div>
    );
  }
}
