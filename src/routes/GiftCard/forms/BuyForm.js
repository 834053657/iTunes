import React, { Component, Fragment } from 'react';
import { Select, Button, Icon, Input, message, Form, InputNumber, Radio, Modal } from 'antd';
import { map } from 'lodash';
import styles from './SellForm.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

let dataItem = {
  money: null,
  min_count: null,
  max_count: null,
};

@Form.create()
export default class BuyForm extends Component {
  state = {
    termModalInfo: false,
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel && this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(err, values);
      // if (!err) {
      //   this.props.onSubmit(values);
      // }
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
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    console.log(form);
    const condition = form.getFieldProps('condition');
    console.log(condition);
    console.log(dataItem);
    const nextCondition = condition.push(dataItem);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      condition: nextCondition,
    });
  };

  render() {
    const { termModalInfo } = this.state;
    const {
      terms = [],
      form: { getFieldDecorator, getFieldValue, resetForm },
      initialValues = {},
    } = this.props;
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
        xs: { span: 4, offset: 0 },
        sm: { span: 5, offset: 4 },
      },
    };

    const formItemLayoutBtn = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    getFieldDecorator('condition', { initialValue: [] });
    const condition = getFieldValue('condition');
    console.log(condition);

    const formItems =
      condition.length &&
      condition.map((k, index) => {
        return (
          <FormItem {...formItemLayoutDeno} required={false} key={k}>
            {getFieldDecorator(`condition[${k}].money`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入面额',
                },
              ],
            })(<Input placeholder="面额" style={{ width: '60%', marginRight: 8 }} />)}
            ---
            {getFieldDecorator(`condition[${k}].min_count`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入最小数量',
                },
              ],
            })(<Input placeholder="最小数量" style={{ width: '60%', marginRight: 8 }} />)}
            ---
            {getFieldDecorator(`condition[${k}].max_count`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入最大数量',
                },
              ],
            })(<Input placeholder="最大数量" style={{ width: '60%', marginRight: 8 }} />)}
            {condition.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={condition.length === 1}
                onClick={() => this.remove(k)}
              />
            ) : null}
          </FormItem>
        );
      });

    return (
      <Form className={styles.form} onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="类型">
          {getFieldDecorator('card_type', {
            initialValue: initialValues.card_type,
            rules: [
              {
                required: true,
                message: '请选择类型',
              },
            ],
          })(
            <Select style={{ width: 200 }}>
              {map(CONFIG.card_type, item => (
                <Option key={item.type} value={item.type}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="单价">
          {getFieldDecorator('unit_price', {
            initialValue: initialValues.unit_price,
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
            initialValue: initialValues.multiple,
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
            initialValue: initialValues.condition_type,
            rules: [
              {
                required: true,
                message: '请选择条件类型',
              },
            ],
          })(
            <Radio.Group>
              <Radio.Button value={1}>指定面额</Radio.Button>
              <Radio.Button value={2}>交易限额</Radio.Button>
            </Radio.Group>
          )}
        </FormItem>

        {formItems}
        <FormItem {...formItemLayoutBtn}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> Add field
          </Button>
        </FormItem>
        <FormItem {...formItemLayoutDeno}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </FormItem>

        <p>{getFieldValue('condition_type')}</p>

        <FormItem {...formItemLayout} label="要求">
          {getFieldDecorator('password_type', {
            initialValue: initialValues.password_type,
            rules: [
              {
                required: true,
                message: '请输入选择密保卡类型',
              },
            ],
          })(
            <RadioGroup>
              {map(CONFIG.cardPwdType, (text, value) => <Radio value={value}>{text}</Radio>)}
            </RadioGroup>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="发卡期限">
          {getFieldDecorator('deadline', {
            initialValue: initialValues.deadline,
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
            initialValue: initialValues.guarantee_time,
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
            initialValue: initialValues.concurrency_order,
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
