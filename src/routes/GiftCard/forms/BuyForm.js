import React, { Component, Fragment } from 'react';
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
  Row,
  Col,
} from 'antd';
import { map, mapKeys, cloneDeep, filter, head } from 'lodash';
import styles from './SellForm.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

const dataItem = {
  money: null,
  min_count: null,
  max_count: null,
};

const uuid = 0;
@Form.create()
export default class BuyForm extends Component {
  state = {
    termModalInfo: false,
    formNumber: [],
    conditionType: 1,
    condition: [
      {
        money: '',
        min_count: '',
        max_count: '',
      },
    ],
  };
  postData = [];
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel && this.props.onCancel();
  };

  handleSubmit = e => {
    const { form } = this.props;
    const { condition } = this.state;
    e.preventDefault();

    const a = form.getFieldValue('condition');

    console.log(a);
    console.log(this.state.condition);
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      delete values.condition;
      if (!err) {
        // console.log(values.condition);
        // const condition = map(filter(values.condition, item => !Array.isArray(item)), item => {
        //   const {money = null, min_count = null, max_count = null} = item || {};
        //   return {money: +money, min_count: +min_count, max_count: +max_count};
        // });
        // console.log(condition);
        // console.log(this.state.condition);
        this.props.onSubmit({
          ...values,
          condition: this.state.condition,
          password_type: +values.password_type,
        });
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

  remove = i => {
    const { form } = this.props;
    const { condition } = this.state;
    condition.splice(i, 1);
    this.setState({
      condition,
    });
    this.state.condition = condition;
    this.props.form.setFieldsValue({
      'condition[]': condition,
    });
    console.log(condition);
  };

  add = () => {
    const { form } = this.props;
    this.postData.push(dataItem);
    form.setFieldsValue({
      condition: this.postData,
    });
    const condition = form.getFieldValue('condition');
  };

  addTest = () => {
    const { action, defaultValue } = this.props;
    const formDataObj = {
      money: 0,
      min_count: 0,
      max_count: 0,
    };
    console.log(action);
    console.log(defaultValue);
    // formDataObj[uuid] = dataItem;
    // console.log(formDataObj);
    // this.state.formNumber.push(formDataObj);
    // uuid++;
    // this.setState({
    //   formNumber: this.state.formNumber,
    // });
    const condition = action
      ? defaultValue.condition
      : this.props.form.getFieldValue('condition[]');
    condition.push(formDataObj);
    console.log(condition);

    this.setState({
      condition,
    });
    this.props.form.setFieldsValue({
      'condition[]': condition,
    });
  };

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  };

  changeConditionType = e => {
    this.setState({
      conditionType: e.target.value,
    });
  };

  changeFixedMoney = (e, index) => {
    const { condition } = this.state;
    condition[index].money = e;
    this.setState({
      condition,
    });
    this.props.form.setFieldsValue({
      'condition[]': condition,
    });
  };

  changeFixMin = (e, index) => {
    console.log(e);
    const { condition } = this.state;
    condition[index].min_count = e;
    this.setState({
      condition,
    });
    this.props.form.setFieldsValue({
      'condition[]': condition,
    });
  };

  changeFixMax = (e, index) => {
    console.log(e);
    const { condition } = this.state;
    condition[index].max_count = e;
    this.setState({
      condition,
    });
    this.props.form.setFieldsValue({
      'condition[]': condition,
    });
  };

  render() {
    const { termModalInfo, condition } = this.state;
    console.log(condition);
    const {
      defaultValue,
      action,
      terms = [],
      form: { getFieldDecorator, getFieldValue, resetForm },
    } = this.props;
    const cardList = mapKeys(CONFIG.card_type || [], item => item.type);
    // if (action && !defaultValue.condition) {
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
    const formItemLayoutDeno = {
      wrapperCol: {
        xs: { span: 14, offset: 0 },
        sm: { span: 14, offset: 4 },
      },
    };
    const formItemLayoutBtn = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    const { condition: deCo = [] } = defaultValue;
    const conditionList = action ? deCo : condition;

    getFieldDecorator('condition[]', { initialValue: conditionList });
    console.log(defaultValue);
    console.log(conditionList);
    console.log(action);
    console.log(deCo);
    console.log(condition);

    const formItems = conditionList.map((k, index) => {
      return (
        <Row key={index} className={styles.fixed}>
          <Col className={styles.fixedNum}>
            <FormItem required={false}>
              {getFieldDecorator(`condition[${index}].money`, {
                initialValue: action ? k.money : '',
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入面额',
                  },
                ],
              })(
                <InputNumber
                  disabled={action && action !== 'edit'}
                  onChange={e => this.changeFixedMoney(e, index)}
                  placeholder="面额"
                />
              )}
              &nbsp;--
            </FormItem>
          </Col>
          <Col className={styles.fixedMin}>
            <FormItem required={false}>
              {getFieldDecorator(`condition[${index}].min_count`, {
                initialValue: action ? k.min_count : '',
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入最小数量',
                  },
                ],
              })(
                <InputNumber
                  disabled={action && action !== 'edit'}
                  onChange={e => this.changeFixMin(e, index)}
                  placeholder="最小数量"
                />
              )}
              &nbsp;--
            </FormItem>
          </Col>
          <Col className={styles.fixedMax}>
            <FormItem required={false}>
              {getFieldDecorator(`condition[${index}].max_count`, {
                initialValue: action ? k.max_count : '',
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入最大数量',
                  },
                ],
              })(
                <InputNumber
                  disabled={action && action !== 'edit'}
                  onChange={e => this.changeFixMax(e, index)}
                  placeholder="最大数量"
                />
              )}
              &nbsp;
              {!action ||
                (action === 'edit' && (
                  <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    disabled={condition.length === 1}
                    onClick={() => this.remove(index)}
                  />
                ))}
            </FormItem>
          </Col>
        </Row>
      );
    });

    const conditionItemTwo = (
      <Row>
        <FormItem className={styles.minNum}>
          {getFieldDecorator('condition.min_money', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                message: '请输入最小数量',
              },
              {
                type: 'number',
                min: 1,
                message: '请输入大于0的数字',
              },
            ],
          })(
            <InputNumber
              disabled={action && action !== 'edit'}
              placeholder="最小数量"
              min={1}
              style={{ width: '100%' }}
            />
          )}
        </FormItem>
        <span className={styles.min_max}> &nbsp;&nbsp;--</span>
        <FormItem className={styles.maxNum}>
          {getFieldDecorator('condition.max_money', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                message: '请输入最大数量',
              },
              {
                type: 'number',
                min: 1,
                message: '请输入大于0的数字',
              },
            ],
          })(
            <InputNumber
              disabled={action && action !== 'edit'}
              placeholder="最大数量"
              min={1}
              style={{ width: '100%' }}
            />
          )}
        </FormItem>
      </Row>
    );

    const defaultType = head(filter(CONFIG.cardTypeMap, card => card.valid)) || {};

    const initialValues = {
      card_type:
        CONFIG.card_type &&
        CONFIG.card_type.filter(c => c.valid)[0] &&
        CONFIG.card_type.filter(c => c.valid)[0].type,
      //card_type: CONFIG.card_type.filter(c => c.valid)[0].type,
      unit_price: 10,
      multiple: 1,
      condition_type: 1,
      condition: {
        min_money: 10,
        max_money: 200,
      },
      password_type: 1,
      deadline: CONFIG.deadline && head(CONFIG.deadline),
      guarantee_time: CONFIG.guarantee_time && head(CONFIG.guarantee_time),
      term_id: 0,
      concurrency_order: 0, //并发订单数，传0代表不限制
    };

    return (
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
              {map(CONFIG.card_type, card => {
                if (card.valid) {
                  return (
                    <Option key={card.type} value={card.type}>
                      {card.name}
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
          })(<InputNumber disabled={action && action !== 'edit'} />)}
        </FormItem>

        {/*倍数*/}
        <FormItem {...formItemLayout} label="倍数">
          {getFieldDecorator('multiple', {
            initialValue: action ? defaultValue.multiple : initialValues.multiple,
            rules: [
              {
                required: true,
                message: '请输入倍数',
              },
            ],
          })(<InputNumber disabled={action && action !== 'edit'} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="条件">
          {getFieldDecorator('condition_type', {
            //initialValue: 1,
            initialValue: action ? defaultValue.condition_type : initialValues.condition_type,
            rules: [
              {
                required: true,
                message: '请选择条件类型',
              },
            ],
          })(
            <Radio.Group disabled={action && action !== 'edit'} onChange={this.changeConditionType}>
              <Radio.Button value={1}>指定面额</Radio.Button>
              <Radio.Button value={2}>面额区间</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        {this.state.conditionType === 1 && formItems}
        {this.state.conditionType === 1 && (
          <FormItem {...formItemLayoutBtn}>
            <Button
              disabled={action && action !== 'edit'}
              type="dashed"
              onClick={this.addTest}
              style={{ width: '60%' }}
            >
              <Icon type="plus" /> 添加面额
            </Button>
          </FormItem>
        )}

        {this.state.conditionType === 2 && conditionItemTwo}

        <FormItem {...formItemLayout} label="要求">
          {getFieldDecorator('password_type', {
            initialValue: action ? defaultValue.password_type : initialValues.password_type,
            rules: [
              {
                required: true,
                message: '请输入选择密保卡类型',
              },
            ],
          })(
            <RadioGroup>
              {map(CONFIG.cardPwdType, (text, value) => (
                <Radio disabled={action && action !== 'edit'} key={value} value={+value}>
                  {text}
                </Radio>
              ))}
            </RadioGroup>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="发卡期限">
          {getFieldDecorator('deadline', {
            // initialValue: CONFIG.deadline ? CONFIG.deadline[0] : null,
            initialValue: action ? defaultValue.deadline : initialValues.deadline,
            rules: [
              {
                required: true,
                message: '请选择发卡期限',
              },
            ],
          })(
            <Select disabled={action && action !== 'edit'} style={{ width: 200 }}>
              {map(CONFIG.deadline, (item, index) => (
                <Option key={item} value={item}>
                  {item}分钟
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="保障时间">
          {getFieldDecorator('guarantee_time', {
            //initialValue: CONFIG.guarantee_time ? CONFIG.guarantee_time[0] : null,
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
              {map(terms, (item, index) => (
                <Option key={item.id} value={+item.id}>
                  {item.title}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="同时处理订单数">
          {getFieldDecorator('concurrency_order', {
            //initialValue: 0,
            initialValue: action ? defaultValue.concurrency_order : initialValues.concurrency_order,
            rules: [
              {
                required: true,
                message: '请输入同时处理订单数',
              },
            ],
          })(<InputNumber disabled={action && action !== 'edit'} />)}
        </FormItem>

        <FormItem className={styles.buttonBox}>
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>
          {action && action !== 'edit' ? (
            <Button
              className={styles.submit}
              type="primary"
              onClick={() => {
                this.props.changeEdit();
              }}
            >
              编辑
            </Button>
          ) : null}
          {!action || (action && action === 'edit') ? (
            <Button className={styles.submit} type="primary" htmlType="submit">
              发布
            </Button>
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
    );
  }
}
