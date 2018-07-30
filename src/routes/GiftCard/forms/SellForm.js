import React, { Component, Fragment } from 'react';
import { routerRedux } from 'dva/router';
import {
  Select,
  Button,
  Icon,
  Input,
  message,
  Form,
  InputNumber,
  Radio,
  Modal,
  Popover,
  Card,
  Row,
  Col,
  Popconfirm,
} from 'antd';
import { map, last, head } from 'lodash';
import styles from './SellForm.less';
import OnlyPassWord from './OnlyPassWord';
import OnlyPicture from './OnlyPicture';
import PicWithPass from './PicWithPass';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
export default class SellForm extends Component {
  constructor(props) {
    super();
    this.state = {
      termModalInfo: false,
      addDenoVisible: false,
      cards: [],
      pswType: 1,
    };
  }

  componentDidMount() {
    const { defaultValue, action } = this.props;
    console.log(action);
    console.log(defaultValue);
  }

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel && this.props.onCancel();
  };

  handleSubmit = e => {
    const { action, defaultValue } = this.props;

    if (!this.state.cards.length) {
      this.setState({ cards: defaultValue.cards });
      this.state.cards = defaultValue.cards;
    }
    if (!this.state.cards || (this.state.cards && !this.state.cards.length)) {
      return message.warning('还未添加卡信息');
    }
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(this.state.cards);
      console.log(values);

      delete values.cards;
      if (!err) {
        this.props.onSubmit({ ...values, cards: this.state.cards });
      }
    });
  };

  handleShowTerm = () => {
    const { form } = this.props;
    const term_id = form.getFieldValue('term_id');
    this.setState({
      termModalInfo: true,
    });
  };

  handleHideTermModal = () => {
    this.setState({
      termModalInfo: false,
    });
  };

  add = () => {};

  //添加面额种类
  addDeno = () => {
    const { form } = this.props;
    const { cards, denoVaule } = this.state;
    const re = /^[1-9]+[0-9]*]*$/;
    if (!re.test(denoVaule) || denoVaule <= 0) {
      return message.warning('请输入正整数格式');
    }
    console.log(cards);
    console.log(denoVaule);
    const i = cards.findIndex(card => card.money === denoVaule);
    console.log(i);
    if (i >= 0) {
      return message.warning('该面额已存在');
    }
    const formDataObj = {
      money: denoVaule,
      receipt: '', // 凭证
      items: [
        {
          password: '', // 卡密
          picture: '', // 图片
        },
      ],
    };
    cards.push(formDataObj);
    this.setState({
      cards,
    });
    this.props.form.setFieldsValue({
      'cards[]': cards,
    });
    this.setState({ addDenoVisible: false });
  };

  //添加面额输入框
  removeIpt = (id, index) => {
    const { form } = this.props;
    const cards = form.getFieldValue('cards[]') || [];
    const newItems = cards[index].items.filter(i => i.id !== id);
    cards[index].items = newItems;
    this.props.form.setFieldsValue({
      'cards[]': cards,
    });
  };

  //添加面额输入框
  addDenoIpt = index => {
    const { form } = this.props;
    const cards = form.getFieldValue('cards[]') || [];
    const lastId = last(cards[index].items, {}).id + 1;
    console.log(lastId);
    cards[index].items.push({
      id: lastId,
      password: '', // 卡密
      picture: '', // 图片
    });
    console.log(cards);
    this.props.form.setFieldsValue({
      'cards[]': cards,
    });
    // this.setState({
    //   date: new Date()
    // })
  };

  changeData = (i, item, index) => {
    const { form } = this.props;

    const { value } = item.password || {};
    const cards = form.getFieldValue('cards[]') || [];
    cards[index].items[i].password = value;
    console.log(cards);
  };

  handleCard = (index, items) => {
    const { form } = this.props;
    const cards = form.getFieldValue('cards[]') || [];
    cards[index].items = items;
    form.setFieldsValue({
      'cards[]': cards,
    });
  };

  changePswType = e => {
    const { form } = this.props;
    this.setState({
      pswType: e.target.value,
      cards: [],
    });
    form.setFieldsValue({
      'cards[]': [],
    });
  };

  addMoney = i => {
    const { cards } = this.state;
    cards[i].items.push({ password: '', picture: '' });
    //this.bindForm('cards[]', cards)
    this.props.form.setFieldsValue({
      'cards[]': cards,
    });
    this.setState({ cards });
  };

  changePsw = (e, index, littleIndex) => {
    const { action, defaultValue } = this.props;
    const cards = action ? defaultValue.cards : this.state.cards;
    cards[index].items[littleIndex].password = e.target.value;
    this.props.form.setFieldsValue({
      'cards[]': cards,
    });
    this.setState({ cards });
  };

  changePic = (e, index, littleIndex) => {
    const { action, defaultValue } = this.props;
    const cards = action ? defaultValue.cards : this.state.cards;

    cards[index].items[littleIndex].picture = e;
    this.props.form.setFieldsValue({
      'cards[]': cards,
    });
    this.setState({ cards });
  };

  changePZ = (e, index) => {
    const { action, defaultValue } = this.props;
    const cards = action ? defaultValue.cards : this.state.cards;
    cards[index].receipt = e;
    this.props.form.setFieldsValue({
      'cards[]': cards,
    });
    this.setState({ cards });
  };

  confirm = (index, littleIndex) => {
    const { cards } = this.state;
    const { form, action, defaultValue } = this.props;
    console.log(defaultValue);
    if (action) {
      //编辑、查看
      const editCards = defaultValue.cards;
      editCards[index].items.splice(littleIndex, 1);
      this.setState({ cards: editCards });
      form.setFieldsValue({
        'cards[]': editCards,
      });
    } else {
      cards[index].items.splice(littleIndex, 1);
      this.setState({ cards });
      form.setFieldsValue({
        'cards[]': cards,
      });
    }
  };

  deleteCard = index => {
    const { cards } = this.state;
    const { form, action, defaultValue } = this.props;
    console.log(defaultValue);
    if (action) {
      //编辑、查看
      const editCards = defaultValue.cards;
      editCards.splice(index, 1);
      this.setState({ cards: editCards });
      form.setFieldsValue({
        'cards[]': editCards,
      });
    } else {
      cards.splice(index, 1);
      this.setState({ cards });
      form.setFieldsValue({
        'cards[]': cards,
      });
    }
  };

  intoData = i => {
    const { cards } = this.state;
    const { form } = this.props;

    ['121', '141', '151', '161', '171', '181'].map(ina => {
      cards[i].items.push({ password: ina, picture: '' });
      return cards;
    });
    this.setState({
      cards,
    });
    this.props.form.setFieldsValue({
      'cards[]': cards,
    });
  };

  bindForm = (a, b) => {
    this.props.form.setFieldsValue({
      a: b,
    });
  };

  render() {
    const { termModalInfo } = this.state;
    const {
      defaultValue,
      action,
      terms = [],
      form: { getFieldDecorator, getFieldValue, resetForm, onFieldsChange },
    } = this.props;
    // if (!defaultValue.ad_no && !edit) {
    //   return null
    // }
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };

    if (action && !defaultValue.cards) {
      return null;
    }
    console.log(defaultValue);

    const addDenoBox = (
      <div>
        <Row>
          <Col style={{ width: 80, float: 'left' }}>面额:</Col>
          <Col style={{ width: 240, float: 'left' }}>
            <InputNumber
              placeholder="请输入面额"
              defaultValue=""
              onChange={e => {
                this.setState({ denoVaule: e });
              }}
              onPressEnter={() => this.addDeno()}
            />
          </Col>
        </Row>

        <div style={{ marginTop: 20, float: 'right' }}>
          <Button
            onClick={() => {
              this.setState({ addDenoVisible: false });
            }}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              this.setState({ addDenoVisible: false });
              this.addDeno();
            }}
            type="primary"
          >
            确定
          </Button>
        </div>
      </div>
    );

    const initialValues = {
      card_type:
        CONFIG.card_type &&
        CONFIG.card_type.filter(c => c.valid)[0] &&
        CONFIG.card_type.filter(c => c.valid)[0].type,
      term_id: 0,
      unit_price: 10,
      guarantee_time: CONFIG.guarantee_time && head(CONFIG.guarantee_time),
      password_type: 1,
      concurrency_order: 0,
      cards: [],
    };

    getFieldDecorator('cards[]', { initialValue: [] });
    const cards = getFieldValue('cards[]') || [];
    return (
      <div>
        <Form className={styles.form} onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="类型">
            {getFieldDecorator('card_type', {
              initialValue: action ? defaultValue.card_type : initialValues.card_type,
              rules: [
                {
                  required: true,
                  message: '请选择类型',
                },
              ],
            })(
              <Select disabled={action && action !== 'edit'} style={{ width: 200 }}>
                {map(CONFIG.card_type, item => {
                  if (item.valid) {
                    return (
                      <Option key={item.type} value={item.type}>
                        {item.name}
                      </Option>
                    );
                  }
                })}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="单价">
            {getFieldDecorator('unit_price', {
              initialValue: action ? defaultValue.unit_price : initialValues.unit_price,
              rules: [
                {
                  required: true,
                  message: '请输入单价',
                },
              ],
            })(<InputNumber precision={2} disabled={action && action !== 'edit'} />)}
          </FormItem>

          <FormItem {...formItemLayout} label="保障时间">
            {getFieldDecorator('guarantee_time', {
              initialValue: action ? defaultValue.guarantee_time : initialValues.guarantee_time,
              rules: [
                {
                  required: true,
                  message: '请选择保障时间',
                },
              ],
            })(
              <Select disabled={action && action !== 'edit'} style={{ width: 200 }}>
                {map(CONFIG.guarantee_time, (item, index) => (
                  <Option key={item} value={item}>
                    {item}分钟
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={
              <span>
                交易条款<i>(可选)</i>
              </span>
            }
          >
            {getFieldDecorator('term_id', {
              initialValue: action ? defaultValue.term_id : initialValues.term_id,
              rules: [
                {
                  required: false,
                  message: '请选择交易条款',
                },
              ],
            })(
              <Select disabled={action && action !== 'edit'} style={{ width: 200 }}>
                <Option value={0}>无</Option>
                {map(terms, (item, index) => {
                  if (item.status === 3) {
                    return (
                      <Option key={item.id} value={+item.id}>
                        {item.title}
                      </Option>
                    );
                  }
                })}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="同时处理订单数">
            {getFieldDecorator('concurrency_order', {
              initialValue: action
                ? defaultValue.concurrency_order
                : initialValues.concurrency_order,
              rules: [
                {
                  required: true,
                  message: '请输入同时处理订单数,0代表不限制',
                },
              ],
            })(<InputNumber disabled={action && action !== 'edit'} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="包含">
            {getFieldDecorator('password_type', {
              initialValue: action ? defaultValue.password_type : initialValues.password_type,
              rules: [
                {
                  required: true,
                  message: '请输入选择密保卡类型',
                },
              ],
            })(
              <RadioGroup disabled={action && action !== 'edit'} onChange={this.changePswType}>
                {map(CONFIG.cardPwdType, (text, value) => (
                  <Radio key={value} value={+value}>
                    {text}
                  </Radio>
                ))}
              </RadioGroup>
            )}
          </FormItem>

          <FormItem {...formItemLayout}>
            <Button
              onClick={() => {
                this.setState({ addDenoVisible: true });
              }}
              type="dashed"
              style={{ width: '60%', marginLeft: '20%' }}
              disabled={action && action !== 'edit'}
            >
              <Icon type="plus" />
              添加面额
            </Button>
            <Modal
              title="添加面额"
              width={400}
              destroyOnClose
              maskClosable={false}
              visible={this.state.addDenoVisible}
              onOk={() => {
                this.addDeno();
              }}
              onCancel={() => {
                this.setState({ addDenoVisible: false });
              }}
            >
              <Row>
                <Col style={{ width: 50, float: 'left', lineHeight: '30px' }}>面额:</Col>
                <Col style={{ width: 150, float: 'left' }}>
                  <InputNumber
                    style={{ width: 150 }}
                    placeholder="请输入面额"
                    onChange={e => {
                      this.setState({ denoVaule: e });
                    }}
                    min={0}
                    onPressEnter={() => this.addDeno()}
                  />
                </Col>
              </Row>
            </Modal>
          </FormItem>

          <OnlyPassWord
            defaultValue={action ? defaultValue.cards : cards}
            addMoney={this.addMoney}
            changePsw={this.changePsw}
            changePic={this.changePic}
            action={action}
            psw={action ? defaultValue.password_type : this.state.pswType}
            form={this.props.form}
            confirm={this.confirm}
            deleteCard={this.deleteCard}
            intoData={this.intoData}
            changePZ={this.changePZ}
          />

          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.handleCancel}>
              返回
            </Button>
            {action && action !== 'edit' ? (
              <Button
                className={styles.submit}
                type="primary"
                onClick={() => {
                  this.props.changeEdit();
                }}
                disabled={defaultValue.status !== 1 && defaultValue.status !== 2}
              >
                编辑
              </Button>
            ) : null}
            {!action || (action && action === 'edit') ? (
              <Popconfirm
                title="确定发布吗？"
                onConfirm={this.handleSubmit}
                okText="是"
                cancelText="否"
              >
                <Button className={styles.submit} type="primary" htmlType="submit">
                  发布
                </Button>
              </Popconfirm>
            ) : null}
          </FormItem>
          {termModalInfo && (
            <Modal
              title={termModalInfo.title}
              visible={termModalInfo}
              onOk={this.handleHideTermModal}
              onCancel={this.handleHideTermModal}
            >
              <p>termModalInfo.content</p>
            </Modal>
          )}
        </Form>
      </div>
    );
  }
}
