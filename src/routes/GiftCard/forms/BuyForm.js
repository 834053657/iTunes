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
  Popconfirm,
} from 'antd';
import { map, mapKeys, cloneDeep, filter, head, mapValues } from 'lodash';
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
    conditionFix: [
      {
        money: '',
        min_count: '',
        max_count: '',
      },
    ],
    conditionRange: { min_money: '', max_money: '' },
    conditionType: 1,
  };
  postData = [];
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel && this.props.onCancel();
  };

  handleSubmit = e => {
    const { form, defaultValue } = this.props;
    const { condition, conditionType, conditionFix, conditionRange } = this.state;
    e.preventDefault();

    //const a = form.getFieldValue('condition');
    const requireArr = [
      'card_type',
      'unit_price',
      'multiple',
      'condition_type',
      'password_type',
      'deadline',
      'guarantee_time',
      'term_id',
      'concurrency_order',
      'condition',
    ];
    let a = null;
    if (conditionType === 1 || defaultValue.condition_type === 1) {
      a = conditionFix;
    }
    if (conditionType === 2 || defaultValue.condition_type === 2) {
      a = conditionRange;
    }

    this.props.form.validateFieldsAndScroll(requireArr, (err, values) => {
      if (Array.isArray(values.condition)) {
        values.condition.map(c => {
          c.money = +c.money;
          c.min_count = +c.min_count;
          c.max_count = +c.max_count;
          return c;
        });
      } else {
        values.condition.min_money = +values.condition.min_money;
        values.condition.max_money = +values.condition.max_money;
      }

      if (!err) {
        this.props.onSubmit({
          ...values,
          //condition: [{money: '1', min_count: '5', max_count: '33'}],
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
    const { conditionFix } = this.state;
    const { action, defaultValue } = this.props;

    const data = action ? defaultValue.condition : conditionFix;
    data.splice(i, 1);
    this.setState({
      conditionFix: data,
    });
    this.conditionFix = data;
    console.log(data);
    form.setFieldsValue({
      'conditionFix[]': data,
    });
    const a = form.getFieldValue('conditionFix[]');
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
    const { conditionFix } = this.state;

    const formDataObj = {
      money: '',
      min_count: '',
      max_count: '',
    };
    const data = action ? defaultValue.condition : conditionFix;
    data.push(formDataObj);

    this.setState({
      conditionFix: data,
    });
    this.props.form.setFieldsValue({
      'conditionFix[]': data,
    });
  };

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  };

  changeConditionType = e => {
    const { condition } = this.state;
    this.setState({
      conditionType: e.target.value,
    });
  };

  changeFixedMoney = (e, index) => {
    const { action, defaultValue } = this.props;
    const { conditionFix } = this.state;
    const data = action ? defaultValue.condition : conditionFix;
    data[index].money = e;

    this.setState({
      conditionFix: data,
    });
    this.props.form.setFieldsValue({
      'conditionFix[]': data,
    });
  };

  changeFixMin = (e, index) => {
    const { action, defaultValue } = this.props;
    const { conditionFix } = this.state;
    const data = action ? defaultValue.condition : conditionFix;

    data[index].min_count = +e;
    this.setState({
      conditionFix: data,
    });
    this.props.form.setFieldsValue({
      'conditionFix[]': data,
    });
  };

  checkFormCount = (rule, value, callback, index) => {
    const { conditionFix } = this.state;
    if (conditionFix[index].max_count && value > conditionFix[index].max_count) callback('error');
    if (conditionFix[index].min_count && value < conditionFix[index].min_count) callback('error');
    callback();
  };

  checkFormRange = (rule, value, callback) => {
    const { conditionRange } = this.state;
    if (conditionRange.max_money && value > conditionRange.max_money) callback('error');
    if (conditionRange.min_money && value < conditionRange.min_money) callback('error');
    callback();
  };

  changeFixMax = (e, index) => {
    const { action, defaultValue } = this.props;
    const { conditionFix } = this.state;
    const data = action ? defaultValue.condition : conditionFix;

    data[index].max_count = +e;
    this.setState({
      conditionFix: data,
    });
    this.props.form.setFieldsValue({
      'conditionFix[]': data,
    });
  };

  rangeMax = (e, index) => {
    const { action, defaultValue } = this.props;
    const { conditionRange } = this.state;
    const data = action ? defaultValue.condition : conditionRange;

    data.max_money = e;
    this.setState({
      conditionRange: data,
    });
    this.props.form.setFieldsValue({
      'conditionRange{}': data,
    });
  };

  rangeMin = (e, index) => {
    const { action, defaultValue } = this.props;
    const { conditionRange } = this.state;
    const data = action ? defaultValue.condition : conditionRange;
    data.min_money = e;
    this.setState({
      conditionRange: data,
    });
    this.props.form.setFieldsValue({
      'conditionRange{}': data,
    });
  };

  render() {
    const { termModalInfo, conditionFix, conditionRange, conditionType } = this.state;
    const {
      defaultValue,
      action,
      terms = [],
      form: { getFieldDecorator, getFieldValue, resetForm },
    } = this.props;
    console.log(defaultValue);
    const { condition: deCo = [] } = defaultValue;

    const initialValues = {
      card_type:
        CONFIG.card_type &&
        CONFIG.card_type.filter(c => c.valid)[0] &&
        CONFIG.card_type.filter(c => c.valid)[0].type,
      unit_price: 10,
      multiple: 1,
      condition_type: 1,
      condition: [],
      password_type: 1,
      deadline: CONFIG.deadline && head(CONFIG.deadline),
      guarantee_time: CONFIG.guarantee_time && head(CONFIG.guarantee_time),
      term_id: 0,
      concurrency_order: 0, //并发订单数，传0代表不限制
    };

    const conditionTypeList = initialValues.condition_type === 1 ? conditionFix : conditionRange;
    const conditionList = action ? deCo : conditionTypeList;
    const cardList = mapKeys(CONFIG.card_type || [], item => item.type);

    getFieldDecorator('conditionFix[]', { initialValue: conditionList });
    getFieldDecorator('conditionRange{}', { initialValue: conditionList });

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
    console.log(action);
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
          })(<InputNumber precision={2} disabled={action && action !== 'edit'} />)}
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
              {
                pattern: /^[1-9]\d*$/,
                message: '请输入正整数',
              },
            ],
          })(<InputNumber disabled={action && action !== 'edit'} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="条件">
          {getFieldDecorator('condition_type', {
            initialValue: action ? defaultValue.condition_type : initialValues.condition_type,
            rules: [
              {
                required: true,
                message: '请选择条件类型',
              },
            ],
          })(
            <Radio.Group onChange={this.changeConditionType} disabled={action}>
              <Radio.Button value={1}>指定面额</Radio.Button>
              <Radio.Button value={2}>面额区间</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        {//(defaultValue.condition_type === 1 || this.state.conditionType === 1 || initialValues.condition_type === 1) && this.state.conditionType !== 2 ?
        (!action || (action && defaultValue.condition_type === 1)) && this.state.conditionType !== 2
          ? conditionList.map((k, index) => {
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
                            message: '请输入面额',
                          },
                          {
                            pattern: /^[1-9]\d*$/,
                            message: '请输入正整数',
                          },
                        ],
                      })(
                        <InputNumber
                          key={index}
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
                        validateTrigger: ['onBlur'],
                        rules: [
                          {
                            required: true,
                            message: '请输入最小数量',
                          },
                          {
                            pattern: /^[0-9]\d*$/,
                            message: '请输入正整数',
                          },
                          {
                            validator: (rule, value, callback) =>
                              this.checkFormCount(rule, value, callback, index),
                            message: conditionFix[index]
                              ? `最小数量应小于${conditionFix[index].max_count}`
                              : '',
                          },
                        ],
                      })(
                        <InputNumber
                          key={index}
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
                        validateTrigger: ['onBlur'],
                        rules: [
                          {
                            required: true,
                            message: '请输入最大数量',
                          },
                          {
                            pattern: /^[0-9]\d*$/,
                            message: '请输入正整数',
                          },
                          {
                            validator: (rule, value, callback) =>
                              this.checkFormCount(rule, value, callback, index),
                            message: conditionFix[index]
                              ? `最大数量应大于${conditionFix[index].min_count}`
                              : '',
                          },
                        ],
                      })(
                        <InputNumber
                          key={index}
                          disabled={action && action !== 'edit'}
                          onChange={e => this.changeFixMax(e, index)}
                          placeholder="最大数量"
                        />
                      )}
                      &nbsp;
                      {(!action || action === 'edit') && (
                        <Popconfirm
                          title="确定删除吗？"
                          onConfirm={() => this.remove(index)}
                          okText="是"
                          cancelText="否"
                        >
                          <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={conditionList.length === 1}
                          />
                        </Popconfirm>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              );
            })
          : null}

        {(!action || (action && defaultValue.condition_type === 1)) &&
          this.state.conditionType !== 2 && (
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

        {(defaultValue.condition_type === 2 && action) ||
        (!action && this.state.conditionType === 2) ? (
          <Row>
            <FormItem className={styles.minNum}>
              {getFieldDecorator('condition.min_money', {
                initialValue: action
                  ? defaultValue.condition.min_money
                  : initialValues.condition.min_money,
                validateTrigger: ['onBlur'],
                rules: [
                  {
                    required: true,
                    message: '请输入最小面额',
                  },
                  {
                    pattern: /^[0-9]\d*$/,
                    message: '请输入正整数',
                  },
                  {
                    validator: (rule, value, callback) =>
                      this.checkFormRange(rule, value, callback),
                    message: `最小面额应小于${conditionRange.max_money}`,
                  },
                ],
              })(
                <InputNumber
                  disabled={action && action !== 'edit'}
                  placeholder="最小面额"
                  onChange={this.rangeMin}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
            <span className={styles.min_max}> &nbsp;&nbsp;--</span>
            <FormItem className={styles.maxNum}>
              {getFieldDecorator('condition.max_money', {
                initialValue: action
                  ? defaultValue.condition.max_money
                  : initialValues.condition.min_money,

                validateTrigger: ['onBlur'],
                rules: [
                  {
                    required: true,
                    message: '请输入最大面额',
                  },
                  {
                    pattern: /^[0-9]\d*$/,
                    message: '请输入正整数',
                  },
                  {
                    validator: (rule, value, callback) =>
                      this.checkFormRange(rule, value, callback),
                    message: `最大面额应大于${conditionRange.min_money}`,
                  },
                ],
              })(
                <InputNumber
                  disabled={action && action !== 'edit'}
                  placeholder="最大面额"
                  onChange={this.rangeMax}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Row>
        ) : null}

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
            <RadioGroup disabled={action}>
              {map(CONFIG.cardPwdType, (text, value) => (
                <Radio key={value} value={+value}>
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
            //initialValue: 0,
            initialValue: action ? defaultValue.concurrency_order : initialValues.concurrency_order,
            rules: [
              {
                required: false,
                message: '请输入同时处理订单数',
              },
              {
                pattern: /^[0-9]\d*$/,
                message: '请输入整数，0代表不限制',
              },
            ],
          })(<InputNumber disabled={action && action !== 'edit'} />)}
        </FormItem>

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
    );
  }
}
