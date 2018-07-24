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
        money: 0,
        min_count: 0,
        max_count: 0,
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
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log(values.condition);
        // const condition = map(filter(values.condition, item => !Array.isArray(item)), item => {
        //   const {money = null, min_count = null, max_count = null} = item || {};
        //   return {money: +money, min_count: +min_count, max_count: +max_count};
        // });
        // console.log(condition);
        // console.log(this.state.condition);
        this.props.onSubmit({ ...values, condition, password_type: +values.password_type });
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

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('condition');
    // We need at least one passenger
    console.log(keys);
    console.log(k);
    // if (keys.length === 1) {
    //   return;
    // }
    //
    // // can use data-binding to set
    // form.setFieldsValue({
    //   keys: keys.filter(key => key !== k),
    // });
    // if (this.state.formNumber.length === 1) {
    //   return;
    // }
    this.setState({
      formNumber: this.state.formNumber.splice(1, 1),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    // console.log(form);
    // const condition = form.getFieldProps('condition');
    // console.log(condition);
    // console.log(dataItem);
    //const nextCondition = condition.push(dataItem);
    // can use data-binding to set
    // important! notify form to detect changes
    this.postData.push(dataItem);
    console.log(this.postData);

    form.setFieldsValue({
      condition: this.postData,
    });
    const condition = form.getFieldValue('condition');
    console.log(condition);
  };

  addTest = () => {
    const formDataObj = {
      money: 0,
      min_count: 0,
      max_count: 0,
    };
    // formDataObj[uuid] = dataItem;
    // console.log(formDataObj);
    // this.state.formNumber.push(formDataObj);
    // uuid++;
    // this.setState({
    //   formNumber: this.state.formNumber,
    // });
    const condition = this.props.form.getFieldValue('condition[]');
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

    console.log(condition);
    console.log(index);
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
    const { termModalInfo } = this.state;
    const {
      terms = [],
      form: { getFieldDecorator, getFieldValue, resetForm },
      initialValues = {},
    } = this.props;

    const cardList = mapKeys(CONFIG.card_type || [], item => item.type);

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

    getFieldDecorator('condition[]', {
      initialValue: [
        {
          money: 0,
          min_count: 0,
          max_count: 0,
        },
      ],
    });
    const condition = getFieldValue('condition[]');
    console.log(condition);

    const formItems = condition.map((k, index) => {
      return (
        <Row key={index} className={styles.fixed}>
          <Col className={styles.fixedNum}>
            <FormItem required={false}>
              {getFieldDecorator(`condition[${index}].money`, {
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
                  onChange={e => this.changeFixedMoney(e, index)}
                  placeholder="面额"
                  min={1}
                />
              )}
              &nbsp;--
            </FormItem>
          </Col>
          <Col className={styles.fixedMin}>
            <FormItem required={false}>
              {getFieldDecorator(`condition[${index}].min_count`, {
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
                  onChange={e => this.changeFixMin(e, index)}
                  placeholder="最小数量"
                  min={1}
                />
              )}
              &nbsp;--
            </FormItem>
          </Col>
          <Col className={styles.fixedMax}>
            <FormItem required={false}>
              {getFieldDecorator(`condition[${index}].max_count`, {
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
                  onChange={e => this.changeFixMax(e, index)}
                  placeholder="最大数量"
                  min={1}
                />
              )}
              &nbsp;
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={condition.length === 1}
                onClick={() => this.remove(k)}
              />
            </FormItem>
          </Col>
        </Row>
      );
    });

    const conditionItemTwo = (
      <Row>
        <FormItem className={styles.minNum}>
          {getFieldDecorator(`condition.min_money`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: false,
                whitespace: true,
                message: '请输入最小数量',
              },
            ],
          })(<InputNumber placeholder="最小数量" min={1} style={{ width: '100%' }} />)}
        </FormItem>
        <span className={styles.min_max}> &nbsp;&nbsp;--</span>
        <FormItem className={styles.maxNum}>
          {getFieldDecorator(`condition.max_money`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: false,
                whitespace: true,
                message: '请输入最大数量',
              },
            ],
          })(<InputNumber placeholder="最大数量" min={1} style={{ width: '100%' }} />)}
        </FormItem>
      </Row>
    );

    const defaultType = head(filter(CONFIG.cardTypeMap, card => card.valid)) || {};

    return (
      <Form className={styles.form} onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="类型">
          {getFieldDecorator('card_type', {
            initialValue: defaultType.type,
            rules: [
              {
                required: true,
                message: '请选择类型',
              },
            ],
          })(
            <Select style={{ width: 200 }}>
              {map(CONFIG.cardTypeMap, card => {
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
            initialValue: 1,
            rules: [
              {
                required: true,
                message: '请输入单价',
              },
            ],
          })(<InputNumber />)}
        </FormItem>

        {/*倍数*/}
        <FormItem {...formItemLayout} label="倍数">
          {getFieldDecorator('multiple', {
            initialValue: 1,
            rules: [
              {
                required: true,
                message: '请输入倍数',
              },
            ],
          })(<InputNumber />)}
        </FormItem>

        <FormItem {...formItemLayout} label="条件">
          {getFieldDecorator('condition_type', {
            initialValue: 1,
            rules: [
              {
                required: true,
                message: '请选择条件类型',
              },
            ],
          })(
            <Radio.Group onChange={this.changeConditionType}>
              <Radio.Button value={1}>指定面额</Radio.Button>
              <Radio.Button value={2}>面额区间</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>
        {this.state.conditionType === 1 && formItems}
        {this.state.conditionType === 1 && (
          <FormItem {...formItemLayoutBtn}>
            <Button type="dashed" onClick={this.addTest} style={{ width: '60%' }}>
              <Icon type="plus" /> 添加面额
            </Button>
          </FormItem>
        )}

        {this.state.conditionType === 2 && conditionItemTwo}

        <FormItem {...formItemLayout} label="要求">
          {getFieldDecorator('password_type', {
            rules: [
              {
                required: true,
                message: '请输入选择密保卡类型',
              },
            ],
          })(
            <RadioGroup>
              {map(CONFIG.cardPwdType, (text, value) => (
                <Radio key={value} value={value}>
                  {text}
                  {value}
                </Radio>
              ))}
            </RadioGroup>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="发卡期限">
          {getFieldDecorator('deadline', {
            initialValue: CONFIG.deadline ? CONFIG.deadline[0] : null,
            rules: [
              {
                required: true,
                message: '请选择发卡期限',
              },
            ],
          })(
            <Select style={{ width: 200 }}>
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
            initialValue: CONFIG.guarantee_time ? CONFIG.guarantee_time[0] : null,
            rules: [
              {
                required: true,
                message: '请选择保障时间',
              },
            ],
          })(
            <Select style={{ width: 200 }}>
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
            initialValue: initialValues.term_id,
            rules: [],
          })(
            <div>
              <Select style={{ width: 200 }}>
                {map(terms, (item, index) => (
                  <Option key={item.id} value={item.id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
              {/*getFiedzfdsazzldValzzz`ue('term_id') >= 0 && <a onClick={this.handleShowTerm}>查看</a>*/}
            </div>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="同时处理订单数">
          {getFieldDecorator('concurrency_order', {
            initialValue: 0,
            rules: [
              {
                required: true,
                message: '请输入同时处理订单数',
              },
            ],
          })(<InputNumber />)}
        </FormItem>

        <p>{getFieldValue('password_type')}</p>

        <FormItem className={styles.buttonBox}>
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>
          <Button className={styles.submit} type="primary" htmlType="submit">
            发布
          </Button>
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
